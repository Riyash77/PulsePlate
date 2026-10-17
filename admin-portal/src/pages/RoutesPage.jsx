import { useEffect, useState } from 'react';
import api from '../lib/api';
import { MapPin } from 'lucide-react';

export default function RoutesPage() {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/routes').then(res => setRoutes(res.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-center"><div className="spinner" /></div>;

  return (
    <div>
      <div className="page-header">
        <div><h2>Routes</h2><p>{routes.length} active routes</p></div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '16px' }}>
        {routes.map(route => {
          const stops = typeof route.stops === 'string' ? JSON.parse(route.stops) : route.stops;
          return (
            <div key={route.id} className="glass-card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'linear-gradient(135deg,#06b6d4,#6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <MapPin size={20} color="white" />
                </div>
                <div>
                  <div style={{ fontWeight: '700', fontSize: '1rem' }}>{route.route_name}</div>
                  {route.description && <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{route.description}</div>}
                </div>
              </div>

              {/* Route timeline */}
              <div style={{ position: 'relative', paddingLeft: '20px' }}>
                {stops.map((stop, i) => (
                  <div key={i} style={{ position: 'relative', paddingBottom: i < stops.length - 1 ? '16px' : 0 }}>
                    {/* Connector line */}
                    {i < stops.length - 1 && (
                      <div style={{ position: 'absolute', left: '-13px', top: '12px', width: '1px', height: '100%', background: 'var(--border-subtle)' }} />
                    )}
                    {/* Dot */}
                    <div style={{ position: 'absolute', left: '-16px', top: '5px', width: '7px', height: '7px', borderRadius: '50%', background: i === 0 ? '#10b981' : i === stops.length - 1 ? '#6366f1' : 'var(--text-muted)' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.875rem', color: i === 0 ? '#10b981' : i === stops.length - 1 ? '#818cf8' : 'var(--text-secondary)', fontWeight: (i === 0 || i === stops.length - 1) ? '600' : '400' }}>
                        {stop.name}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {stop.estimated_minutes > 0 ? `+${stop.estimated_minutes} min` : 'Start'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid var(--border-subtle)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Total: ~{stops[stops.length - 1]?.estimated_minutes} min · {stops.length} stops
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
