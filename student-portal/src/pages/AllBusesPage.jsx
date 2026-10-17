import { useEffect, useState } from 'react';
import api from '../lib/api';
import { Bus, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AllBusesPage() {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/buses').then(res => setBuses(res.data)).finally(() => setLoading(false));
    const interval = setInterval(() => api.get('/buses').then(r => setBuses(r.data)), 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="center"><div className="spinner" /></div>;

  const inside = buses.filter(b => b.status === 'INSIDE');
  const outside = buses.filter(b => b.status === 'OUTSIDE');

  return (
    <div className="page">
      <h2 className="page-title">All Buses</h2>
      <p className="page-sub">{inside.length} inside · {outside.length} outside campus</p>

      {/* Legend */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-2)' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981' }} />
          Inside Campus
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-2)' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444' }} />
          Left Campus
        </div>
      </div>

      {buses.map(bus => (
        <div
          key={bus.id}
          className="card"
          style={{ cursor: 'pointer', borderColor: bus.status === 'INSIDE' ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)' }}
          onClick={() => navigate(`/bus/${bus.id}`)}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: bus.status === 'INSIDE' ? 'linear-gradient(135deg,#10b981,#059669)' : 'linear-gradient(135deg,#ef4444,#dc2626)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Bus size={24} color="white" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span style={{ fontWeight: '800', fontSize: '1.1rem', fontFamily: 'Space Grotesk' }}>{bus.bus_number}</span>
                <div className={`status-pill ${bus.status === 'INSIDE' ? 'inside' : 'outside'}`} style={{ padding: '3px 10px', fontSize: '0.7rem' }}>
                  <div className={`pulse-dot ${bus.status === 'INSIDE' ? 'green' : 'red'}`} style={{ width: '6px', height: '6px' }} />
                  {bus.status === 'INSIDE' ? 'In Campus' : 'Outside'}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: 'var(--text-2)' }}>
                <MapPin size={12} />
                {bus.route_name || 'No route'}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-3)' }}>Driver</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-2)', fontWeight: '500' }}>{bus.driver_name || '—'}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
