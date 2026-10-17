const pool = require('../db/pool');

// GET /api/routes
const getAllRoutes = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM routes WHERE is_active = true ORDER BY route_name');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// GET /api/routes/:id
const getRouteById = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT r.*, 
        json_agg(json_build_object('bus_number', b.bus_number, 'vehicle_number', b.vehicle_number, 'status', b.status)) as buses
       FROM routes r
       LEFT JOIN buses b ON b.route_id = r.id AND b.is_active = true
       WHERE r.id = $1
       GROUP BY r.id`,
      [req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Route not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// GET /api/routes/:id/eta - Estimate arrival times at each stop based on last exit time
const getRouteETA = async (req, res) => {
  try {
    const { id } = req.params;
    const { bus_id } = req.query;

    const routeResult = await pool.query('SELECT * FROM routes WHERE id = $1', [id]);
    if (routeResult.rows.length === 0) return res.status(404).json({ error: 'Route not found' });

    const route = routeResult.rows[0];
    const rawStops = route.stops;
    const stops = typeof rawStops === 'string' ? JSON.parse(rawStops) : (Array.isArray(rawStops) ? rawStops : []);

    let exitTime = null;
    if (bus_id) {
      const busResult = await pool.query('SELECT last_exit_time FROM buses WHERE id = $1', [bus_id]);
      exitTime = busResult.rows[0]?.last_exit_time;
    }

    // Calculate ETA for each stop (from college = reverse order)
    const now = new Date();
    const base = exitTime ? new Date(exitTime) : now;

    // Reverse stops (from college outward)
    const reversedStops = [...stops].reverse();
    const stopsWithETA = reversedStops.map((stop, index) => {
      const etaMs = base.getTime() + (stop.estimated_minutes * 60 * 1000);
      const eta = new Date(etaMs);
      return {
        ...stop,
        eta: eta.toISOString(),
        eta_formatted: eta.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        minutes_from_now: Math.round((etaMs - now.getTime()) / 60000),
      };
    });

    res.json({
      route_name: route.route_name,
      exit_time: exitTime,
      stops: stopsWithETA,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { getAllRoutes, getRouteById, getRouteETA };
