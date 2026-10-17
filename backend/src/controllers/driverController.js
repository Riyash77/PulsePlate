const pool = require('../db/pool');

// GET /api/drivers
const getAllDrivers = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        d.*,
        b.bus_number, b.vehicle_number, b.status as bus_status,
        r.route_name
      FROM drivers d
      LEFT JOIN buses b ON d.assigned_bus_id = b.id
      LEFT JOIN routes r ON b.route_id = r.id
      WHERE d.is_active = true
      ORDER BY d.name
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// GET /api/drivers/:id
const getDriverById = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT d.*, b.bus_number, b.vehicle_number, r.route_name
      FROM drivers d
      LEFT JOIN buses b ON d.assigned_bus_id = b.id
      LEFT JOIN routes r ON b.route_id = r.id
      WHERE d.id = $1
    `, [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Driver not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// GET /api/drivers/verification-logs - AI verification logs
const getVerificationLogs = async (req, res) => {
  try {
    const { bus_id, date, limit = 50 } = req.query;
    let conditions = [];
    let params = [];
    let paramIdx = 1;

    if (bus_id) { conditions.push(`dvl.bus_id = $${paramIdx++}`); params.push(bus_id); }
    if (date) { conditions.push(`dvl.timestamp::date = $${paramIdx++}`); params.push(date); }

    const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    params.push(limit);

    const result = await pool.query(`
      SELECT 
        dvl.*,
        b.bus_number, b.vehicle_number,
        d.name as driver_name, d.photo_path as driver_photo
      FROM driver_verification_logs dvl
      JOIN buses b ON dvl.bus_id = b.id
      LEFT JOIN drivers d ON dvl.driver_id = d.id
      ${whereClause}
      ORDER BY dvl.timestamp DESC
      LIMIT $${paramIdx}
    `, params);

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// POST /api/drivers/verify - Log AI verification result
const logVerification = async (req, res) => {
  try {
    const { bus_id, driver_id, attendance_log_id, face_verified, face_mismatch_reason, drowsiness_detected, seatbelt_detected, image_path, confidence_score } = req.body;

    const result = await pool.query(
      `INSERT INTO driver_verification_logs 
       (bus_id, driver_id, attendance_log_id, face_verified, face_mismatch_reason, drowsiness_detected, seatbelt_detected, image_path, confidence_score)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
      [bus_id, driver_id, attendance_log_id, face_verified, face_mismatch_reason, drowsiness_detected, seatbelt_detected, image_path, confidence_score]
    );

    // Emit alert if issues found
    const io = req.app.get('io');
    if (io && (!face_verified || drowsiness_detected || !seatbelt_detected)) {
      const busInfo = await pool.query('SELECT bus_number FROM buses WHERE id = $1', [bus_id]);
      io.emit('safety_alert', {
        busId: bus_id,
        busNumber: busInfo.rows[0]?.bus_number,
        faceVerified: face_verified,
        drowsinessDetected: drowsiness_detected,
        seatbeltDetected: seatbelt_detected,
        timestamp: new Date().toISOString(),
      });
    }

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { getAllDrivers, getDriverById, getVerificationLogs, logVerification };
