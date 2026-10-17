const pool = require('../db/pool');

// GET /api/route-changes
const getRouteChanges = async (req, res) => {
  try {
    const { status } = req.query;
    const { role, id: userId } = req.user;

    let query = `
      SELECT rc.*,
        d.name as driver_name,
        b.bus_number,
        r1.route_name as current_route_name,
        r2.route_name as requested_route_name,
        u.name as reviewed_by_name
      FROM route_change_requests rc
      JOIN drivers d ON rc.driver_id = d.id
      JOIN buses b ON rc.bus_id = b.id
      LEFT JOIN routes r1 ON rc.current_route_id = r1.id
      LEFT JOIN routes r2 ON rc.requested_route_id = r2.id
      LEFT JOIN users u ON rc.reviewed_by = u.id
    `;
    const params = [];

    if (role === 'DRIVER') {
      const driverResult = await pool.query('SELECT id FROM drivers WHERE user_id = $1', [userId]);
      if (driverResult.rows.length === 0) return res.json([]);
      query += ` WHERE rc.driver_id = $1`;
      params.push(driverResult.rows[0].id);
      if (status) { query += ` AND rc.status = $2`; params.push(status); }
    } else {
      if (status) { query += ` WHERE rc.status = $1`; params.push(status); }
    }

    query += ` ORDER BY rc.requested_at DESC`;
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// POST /api/route-changes
const createRouteChange = async (req, res) => {
  try {
    const { bus_id, requested_route_id, reason } = req.body;
    const driverResult = await pool.query('SELECT id FROM drivers WHERE user_id = $1', [req.user.id]);
    if (driverResult.rows.length === 0) return res.status(400).json({ error: 'Driver profile not found' });

    const busResult = await pool.query('SELECT route_id FROM buses WHERE id = $1', [bus_id]);
    if (busResult.rows.length === 0) return res.status(404).json({ error: 'Bus not found' });

    const result = await pool.query(
      `INSERT INTO route_change_requests (driver_id, bus_id, current_route_id, requested_route_id, reason)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [driverResult.rows[0].id, bus_id, busResult.rows[0].route_id, requested_route_id, reason]
    );

    const io = req.app.get('io');
    if (io) io.emit('new_route_change_request', result.rows[0]);

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// PATCH /api/route-changes/:id/review - AO only
const reviewRouteChange = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, review_notes } = req.body;

    if (!['APPROVED', 'REJECTED'].includes(status)) {
      return res.status(400).json({ error: 'Status must be APPROVED or REJECTED' });
    }

    const result = await pool.query(
      `UPDATE route_change_requests SET status = $1, review_notes = $2, reviewed_by = $3, reviewed_at = NOW(), updated_at = NOW()
       WHERE id = $4 RETURNING *`,
      [status, review_notes, req.user.id, id]
    );

    if (result.rows.length === 0) return res.status(404).json({ error: 'Request not found' });

    // If approved, update bus route
    if (status === 'APPROVED') {
      const rc = result.rows[0];
      await pool.query(
        'UPDATE buses SET route_id = $1, updated_at = NOW() WHERE id = $2',
        [rc.requested_route_id, rc.bus_id]
      );
      const io = req.app.get('io');
      if (io) io.emit('route_changed', { busId: rc.bus_id, newRouteId: rc.requested_route_id });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { getRouteChanges, createRouteChange, reviewRouteChange };
