import { useEffect, useState } from 'react';
import api from '../lib/api';
import { Bus, MapPin, Users } from 'lucide-react';

export default function BusesPage() {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    api.get('/buses')
      .then(res => setBuses(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-center"><div className="spinner" /><span>Loading buses...</span></div>;

  return (
    <div>
      <div className="page-header">
        <div><h2>Bus Details</h2><p>{buses.length} buses registered</p></div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
        {buses.map(bus => (
          <div key={bus.id} className="glass-card" style={{ padding: '20px', cursor: 'pointer', borderColor: selected?.id === bus.id ? 'rgba(99,102,241,0.5)' : '' }} onClick={() => setSelected(bus)}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: bus.status === 'INSIDE' ? 'linear-gradient(135deg,#10b981,#059669)' : 'linear-gradient(135deg,#ef4444,#dc2626)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Bus size={22} color="white" />
                </div>
                <div>
                  <div style={{ fontWeight: '800', fontSize: '1.1rem', fontFamily: 'Space Grotesk' }}>{bus.bus_number}</div>
                  <div style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: 'var(--text-accent)' }}>{bus.vehicle_number}</div>
                </div>
              </div>
              <span className={`badge ${bus.status === 'INSIDE' ? 'badge-success' : 'badge-danger'}`}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'currentColor' }} />
                {bus.status}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
                <MapPin size={14} color="var(--text-muted)" />
                <span style={{ color: 'var(--text-secondary)' }}>{bus.route_name || 'No route assigned'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
                <Users size={14} color="var(--text-muted)" />
                <span style={{ color: 'var(--text-secondary)' }}>
                  {bus.driver_name || 'No driver'} {!bus.driver_present && bus.driver_name ? '(Absent)' : ''}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
                <Bus size={14} color="var(--text-muted)" />
                <span style={{ color: 'var(--text-secondary)' }}>Capacity: {bus.capacity} seats</span>
              </div>
            </div>

            {/* Route Stops Preview */}
            {bus.route_stops && (
              <div style={{ marginTop: '14px', paddingTop: '14px', borderTop: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '8px' }}>Route Stops</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {(typeof bus.route_stops === 'string' ? JSON.parse(bus.route_stops) : bus.route_stops)?.map((stop, i) => (
                    <span key={i} style={{ fontSize: '0.72rem', background: 'var(--bg-elevated)', color: 'var(--text-secondary)', padding: '2px 8px', borderRadius: '20px', border: '1px solid var(--border-subtle)' }}>
                      {stop.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
