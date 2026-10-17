const pool = require('../db/pool');

// GET /api/students/profile
const getStudentProfile = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT s.*, 
        b.bus_number, b.vehicle_number, b.status as bus_status,
        b.last_entry_time, b.last_exit_time,
        d.name as driver_name, d.is_present as driver_present,
        r.id as route_id, r.route_name, r.stops as route_stops, r.stops as stops
      FROM students s
      LEFT JOIN buses b ON s.selected_bus_id = b.id
      LEFT JOIN drivers d ON b.current_driver_id = d.id
      LEFT JOIN routes r ON b.route_id = r.id
      WHERE s.user_id = $1
    `, [req.user.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Student not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// PATCH /api/students/select-bus - Student picks their bus and stop
const selectBus = async (req, res) => {
  try {
    const { selected_bus_id, boarding_stop, boarding_stop_order } = req.body;
    const result = await pool.query(
      `UPDATE students SET selected_bus_id = $1, boarding_stop = $2, boarding_stop_order = $3, updated_at = NOW()
       WHERE user_id = $4 RETURNING *`,
      [selected_bus_id, boarding_stop, boarding_stop_order, req.user.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Student not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// PATCH /api/students/fcm-token - Save FCM token for push notifications
const updateFcmToken = async (req, res) => {
  try {
    const { fcm_token } = req.body;
    await pool.query(
      'UPDATE students SET fcm_token = $1, updated_at = NOW() WHERE user_id = $2',
      [fcm_token, req.user.id]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// GET /api/students/notifications - Get recent notifications for student's bus
const getStudentNotifications = async (req, res) => {
  try {
    const studentResult = await pool.query(
      'SELECT selected_bus_id FROM students WHERE user_id = $1',
      [req.user.id]
    );
    if (studentResult.rows.length === 0) return res.json([]);
    const busId = studentResult.rows[0].selected_bus_id;

    const result = await pool.query(`
      SELECT * FROM notifications
      WHERE target_type = 'ALL'
         OR (target_type = 'BUS' AND target_bus_id = $1)
         OR (target_type = 'USER' AND target_user_id = $2)
      ORDER BY sent_at DESC
      LIMIT 20
    `, [busId, req.user.id]);

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { getStudentProfile, selectBus, updateFcmToken, getStudentNotifications };
