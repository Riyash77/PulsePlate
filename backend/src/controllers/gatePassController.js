const pool = require('../db/pool');

// GET /api/gate-passes
const getGatePasses = async (req, res) => {
  try {
    const { status } = req.query;
    const { role, id: userId } = req.user;

    let query = `
      SELECT gp.*, 
        d.name as driver_name, d.phone as driver_phone,
        b.bus_number, b.vehicle_number,
        u.name as reviewed_by_name
      FROM gate_pass_requests gp
      JOIN drivers d ON gp.driver_id = d.id
      JOIN buses b ON gp.bus_id = b.id
      LEFT JOIN users u ON gp.reviewed_by = u.id
    `;
    const params = [];

    // Drivers can only see their own requests
    if (role === 'DRIVER') {
      const driverResult = await pool.query('SELECT id FROM drivers WHERE user_id = $1', [userId]);
      if (driverResult.rows.length === 0) return res.json([]);
      query += ` WHERE gp.driver_id = $1`;
      params.push(driverResult.rows[0].id);
      if (status) { query += ` AND gp.status = $2`; params.push(status); }
    } else {
      if (status) { query += ` WHERE gp.status = $1`; params.push(status); }
    }

    query += ` ORDER BY gp.requested_at DESC`;
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// POST /api/gate-passes - Driver submits request
const createGatePass = async (req, res) => {
  try {
    const { bus_id, reason, request_type, exit_time, expected_return } = req.body;
    const driverResult = await pool.query('SELECT id FROM drivers WHERE user_id = $1', [req.user.id]);
    if (driverResult.rows.length === 0) return res.status(400).json({ error: 'Driver profile not found' });

    const result = await pool.query(
      `INSERT INTO gate_pass_requests (driver_id, bus_id, reason, request_type, exit_time, expected_return)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [driverResult.rows[0].id, bus_id, reason, request_type || 'SERVICE', exit_time, expected_return]
    );

    // Notify admins via socket
    const io = req.app.get('io');
    if (io) io.emit('new_gate_pass_request', result.rows[0]);

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// PATCH /api/gate-passes/:id/review - AO approves/rejects
const reviewGatePass = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, review_notes } = req.body;

    if (!['APPROVED', 'REJECTED'].includes(status)) {
      return res.status(400).json({ error: 'Status must be APPROVED or REJECTED' });
    }

    const result = await pool.query(
      `UPDATE gate_pass_requests SET status = $1, review_notes = $2, reviewed_by = $3, reviewed_at = NOW(), updated_at = NOW()
       WHERE id = $4 RETURNING *`,
      [status, review_notes, req.user.id, id]
    );

    if (result.rows.length === 0) return res.status(404).json({ error: 'Gate pass not found' });

    const io = req.app.get('io');
    if (io) io.emit('gate_pass_reviewed', { id, status });

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { getGatePasses, createGatePass, reviewGatePass };
