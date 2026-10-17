const pool = require('../db/pool');

// GET /api/attendance - Get all logs (with filter)
const getAttendanceLogs = async (req, res) => {
  try {
    const { bus_id, date, event_type, limit = 50, offset = 0 } = req.query;
    let conditions = [];
    let params = [];
    let paramIdx = 1;

    if (bus_id) { conditions.push(`al.bus_id = $${paramIdx++}`); params.push(bus_id); }
    if (date) { conditions.push(`al.timestamp::date = $${paramIdx++}`); params.push(date); }
    if (event_type) { conditions.push(`al.event_type = $${paramIdx++}`); params.push(event_type); }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    params.push(limit, offset);

    const result = await pool.query(`
      SELECT 
        al.*,
        b.bus_number, b.vehicle_number,
        d.name as driver_name
      FROM attendance_logs al
      JOIN buses b ON al.bus_id = b.id
      LEFT JOIN drivers d ON b.current_driver_id = d.id
      ${whereClause}
      ORDER BY al.timestamp DESC
      LIMIT $${paramIdx++} OFFSET $${paramIdx}
    `, params);

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// GET /api/attendance/today - Today's summary
const getTodayAttendance = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        al.*,
        b.bus_number, b.vehicle_number, b.status as current_status,
        r.route_name,
        d.name as driver_name
      FROM attendance_logs al
      JOIN buses b ON al.bus_id = b.id
      LEFT JOIN routes r ON b.route_id = r.id
      LEFT JOIN drivers d ON b.current_driver_id = d.id
      WHERE al.timestamp::date = CURRENT_DATE
      ORDER BY al.timestamp ASC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// POST /api/attendance - Log entry/exit (called by AI module)
const logAttendance = async (req, res) => {
  try {
    const { bus_id, event_type, plate_detected, confidence_score, image_path, is_manual } = req.body;

    if (!bus_id || !event_type) {
      return res.status(400).json({ error: 'bus_id and event_type required' });
    }

    const result = await pool.query(
      `INSERT INTO attendance_logs (bus_id, event_type, plate_detected, confidence_score, image_path, is_manual)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [bus_id, event_type, plate_detected, confidence_score, image_path, is_manual || false]
    );

    const log = result.rows[0];

    // Update bus status
    if (event_type === 'ENTRY') {
      await pool.query(
        `UPDATE buses SET status = 'INSIDE', last_entry_time = NOW(), updated_at = NOW() WHERE id = $1`,
        [bus_id]
      );
    } else if (event_type === 'EXIT') {
      await pool.query(
        `UPDATE buses SET status = 'OUTSIDE', last_exit_time = NOW(), updated_at = NOW() WHERE id = $1`,
        [bus_id]
      );
    }

    // Calculate punctuality score for morning entry
    if (event_type === 'ENTRY') {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const totalMinutes = hours * 60 + minutes;
      const windowStart = 8 * 60; // 8:00
      const windowEnd = 8 * 60 + 45; // 8:45

      let score = 100;
      let minutesLate = 0;

      if (totalMinutes > windowEnd) {
        minutesLate = totalMinutes - windowEnd;
        score = Math.max(0, 100 - minutesLate * 5);
      }

      await pool.query(
        `INSERT INTO bus_rankings (bus_id, date, entry_time, minutes_late, punctuality_score)
         VALUES ($1, CURRENT_DATE, NOW(), $2, $3)
         ON CONFLICT (bus_id, date) DO UPDATE SET entry_time = NOW(), minutes_late = $2, punctuality_score = $3`,
        [bus_id, minutesLate, score]
      );

      // Update daily ranks
      await pool.query(`
        UPDATE bus_rankings r2 SET daily_rank = sub.rank
        FROM (
          SELECT id, ROW_NUMBER() OVER (PARTITION BY date ORDER BY punctuality_score DESC, entry_time ASC) as rank
          FROM bus_rankings WHERE date = CURRENT_DATE
        ) sub
        WHERE r2.id = sub.id
      `);
    }

    // Get bus info for socket event and notification
    const busInfo = await pool.query(
      `SELECT b.*, d.name as driver_name FROM buses b LEFT JOIN drivers d ON b.current_driver_id = d.id WHERE b.id = $1`,
      [bus_id]
    );
    const bus = busInfo.rows[0];

    // Emit socket event
    const io = req.app.get('io');
    if (io) {
      io.emit('attendance_update', {
        log,
        bus: { id: bus.id, bus_number: bus.bus_number, status: event_type === 'ENTRY' ? 'INSIDE' : 'OUTSIDE' },
      });
    }

    res.status(201).json({ log, bus });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { getAttendanceLogs, getTodayAttendance, logAttendance };
