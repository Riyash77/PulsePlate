import { useEffect, useState } from 'react';
import api from '../lib/api';
import { User, Phone, CreditCard, Bus, CheckCircle, XCircle } from 'lucide-react';

export default function DriversPage() {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/drivers')
      .then(res => setDrivers(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-center"><div className="spinner" /><span>Loading drivers...</span></div>;

  return (
    <div>
      <div className="page-header">
        <div><h2>Driver Details</h2><p>{drivers.length} drivers registered · {drivers.filter(d => d.is_present).length} present today</p></div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
        {drivers.map(driver => (
          <div key={driver.id} className="glass-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
              <div className="driver-avatar" style={{ width: '60px', height: '60px', fontSize: '1.4rem' }}>
                {driver.photo_path
                  ? <img src={driver.photo_path} alt={driver.name} />
                  : driver.name.charAt(0)
                }
              </div>
              <div>
                <div style={{ fontWeight: '700', fontSize: '1rem', color: 'var(--text-primary)' }}>{driver.name}</div>
                <div style={{ marginTop: '4px' }}>
                  <span className={`badge ${driver.is_present ? 'badge-success' : 'badge-danger'}`}>
                    {driver.is_present ? <CheckCircle size={12} /> : <XCircle size={12} />}
                    {driver.is_present ? 'Present' : 'Absent'}
                  </span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CreditCard size={14} color="var(--text-muted)" style={{ flexShrink: 0 }} />
                <span style={{ fontFamily: 'monospace', color: 'var(--text-accent)', fontSize: '0.8rem' }}>{driver.license_number}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Phone size={14} color="var(--text-muted)" style={{ flexShrink: 0 }} />
                <span style={{ color: 'var(--text-secondary)' }}>{driver.phone}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Bus size={14} color="var(--text-muted)" style={{ flexShrink: 0 }} />
                <span style={{ color: 'var(--text-secondary)' }}>
                  {driver.bus_number
                    ? <><span style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{driver.bus_number}</span> · {driver.vehicle_number}</>
                    : 'No bus assigned'
                  }
                </span>
              </div>
              {driver.route_name && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <User size={14} color="var(--text-muted)" style={{ flexShrink: 0 }} />
                  <span style={{ color: 'var(--text-secondary)' }}>{driver.route_name}</span>
                </div>
              )}
            </div>

            <div style={{ marginTop: '14px', paddingTop: '14px', borderTop: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className={`badge ${driver.bus_status === 'INSIDE' ? 'badge-success' : 'badge-danger'}`} style={{ fontSize: '0.7rem' }}>
                Bus: {driver.bus_status || 'Unknown'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
