const pool = require('../db/pool');

// GET /api/buses - Get all buses with driver and route info
const getAllBuses = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        b.*,
        r.route_name, r.stops as route_stops,
        d.name as driver_name, d.photo_path as driver_photo,
        d.phone as driver_phone, d.is_present as driver_present,
        d.license_number
      FROM buses b
      LEFT JOIN routes r ON b.route_id = r.id
      LEFT JOIN drivers d ON b.current_driver_id = d.id
      WHERE b.is_active = true
      ORDER BY b.bus_number
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// GET /api/buses/:id
const getBusById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`
      SELECT 
        b.*,
        r.route_name, r.stops as route_stops, r.description as route_description,
        d.name as driver_name, d.photo_path as driver_photo,
        d.phone as driver_phone, d.is_present as driver_present,
        d.license_number
      FROM buses b
      LEFT JOIN routes r ON b.route_id = r.id
      LEFT JOIN drivers d ON b.current_driver_id = d.id
      WHERE b.id = $1
    `, [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Bus not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// GET /api/buses/status/summary - Dashboard stats
const getBusStatusSummary = async (req, res) => {
  try {
    const buses = await pool.query(`SELECT status FROM buses WHERE is_active = true`);
    const inside = buses.rows.filter(b => b.status === 'INSIDE').length;
    const outside = buses.rows.filter(b => b.status === 'OUTSIDE').length;
    const total = buses.rows.length;

    const drivers = await pool.query(`SELECT is_present FROM drivers WHERE is_active = true`);
    const driversPresent = drivers.rows.filter(d => d.is_present).length;
    const driversAbsent = drivers.rows.filter(d => !d.is_present).length;

    // Today's alerts (drowsiness or face mismatch)
    const alerts = await pool.query(`
      SELECT COUNT(*) FROM driver_verification_logs
      WHERE (drowsiness_detected = true OR face_verified = false OR seatbelt_detected = false)
      AND timestamp::date = CURRENT_DATE
    `);

    // Pending approvals
    const pendingGatePasses = await pool.query(`SELECT COUNT(*) FROM gate_pass_requests WHERE status = 'PENDING'`);
    const pendingRouteChanges = await pool.query(`SELECT COUNT(*) FROM route_change_requests WHERE status = 'PENDING'`);

    res.json({
      totalBuses: total,
      busesInside: inside,
      busesOutside: outside,
      driversPresent,
      driversAbsent,
      alertsToday: parseInt(alerts.rows[0].count),
      pendingApprovals: parseInt(pendingGatePasses.rows[0].count) + parseInt(pendingRouteChanges.rows[0].count),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// PATCH /api/buses/:id/status - Update bus status (for AI module)
const updateBusStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, timestamp } = req.body;

    const ts = timestamp || new Date().toISOString();
    let updateQuery;

    if (status === 'INSIDE') {
      updateQuery = `UPDATE buses SET status = $1, last_entry_time = $2, updated_at = NOW() WHERE id = $3 RETURNING *`;
    } else {
      updateQuery = `UPDATE buses SET status = $1, last_exit_time = $2, updated_at = NOW() WHERE id = $3 RETURNING *`;
    }

    const result = await pool.query(updateQuery, [status, ts, id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Bus not found' });

    // Emit socket event
    const io = req.app.get('io');
    if (io) {
      io.emit('bus_status_update', { busId: id, status, timestamp: ts });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// GET /api/buses/rankings/today - Get today's bus rankings
const getTodayRankings = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        br.*,
        b.bus_number, b.vehicle_number,
        r.route_name,
        d.name as driver_name
      FROM bus_rankings br
      JOIN buses b ON br.bus_id = b.id
      LEFT JOIN routes r ON b.route_id = r.id
      LEFT JOIN drivers d ON b.current_driver_id = d.id
      WHERE br.date = CURRENT_DATE
      ORDER BY br.daily_rank ASC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { getAllBuses, getBusById, getBusStatusSummary, updateBusStatus, getTodayRankings };
