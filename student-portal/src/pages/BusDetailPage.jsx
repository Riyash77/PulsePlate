import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { Bus, User, Phone, MapPin, ArrowLeft, Clock } from 'lucide-react';
import { format } from 'date-fns';

export default function BusDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bus, setBus] = useState(null);
  const [eta, setEta] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get(`/buses/${id}`),
    ]).then(([busRes]) => {
      setBus(busRes.data);
      if (busRes.data.route_id) {
        api.get(`/routes/${busRes.data.route_id}/eta?bus_id=${id}`)
          .then(r => setEta(r.data))
          .catch(() => {});
      }
    }).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="center"><div className="spinner" /></div>;
  if (!bus) return <div className="center">Bus not found</div>;

  const stops = bus.route_stops ? (typeof bus.route_stops === 'string' ? JSON.parse(bus.route_stops) : bus.route_stops) : [];
  const isInside = bus.status === 'INSIDE';

  return (
    <div className="page">
      <button className="btn btn-ghost" style={{ marginBottom: '16px', padding: '8px 12px', width: 'auto' }} onClick={() => navigate(-1)}>
        <ArrowLeft size={16} /> Back
      </button>

      {/* Bus Header */}
      <div className={`bus-status-card ${isInside ? 'inside' : 'outside'}`}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: isInside ? 'linear-gradient(135deg,#10b981,#059669)' : 'linear-gradient(135deg,#ef4444,#dc2626)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Bus size={28} color="white" />
          </div>
          <div>
            <div style={{ fontFamily: 'Space Grotesk', fontSize: '1.5rem', fontWeight: '800' }}>{bus.bus_number}</div>
            <div style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--text-2)' }}>{bus.vehicle_number}</div>
          </div>
          <div className={`status-pill ${isInside ? 'inside' : 'outside'}`} style={{ marginLeft: 'auto' }}>
            <div className={`pulse-dot ${isInside ? 'green' : 'red'}`} />
            {isInside ? 'In Campus' : 'Outside'}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.85rem' }}>
          <div>
            <div style={{ color: 'var(--text-3)', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Capacity</div>
            <div style={{ fontWeight: '600', marginTop: '2px' }}>{bus.capacity} seats</div>
          </div>
          <div>
            <div style={{ color: 'var(--text-3)', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Route</div>
            <div style={{ fontWeight: '600', marginTop: '2px' }}>{bus.route_name || '—'}</div>
          </div>
          {bus.last_entry_time && (
            <div>
              <div style={{ color: 'var(--text-3)', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Last Entry</div>
              <div style={{ fontWeight: '600', marginTop: '2px', color: '#10b981' }}>{format(new Date(bus.last_entry_time), 'hh:mm a')}</div>
            </div>
          )}
          {bus.last_exit_time && (
            <div>
              <div style={{ color: 'var(--text-3)', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Last Exit</div>
              <div style={{ fontWeight: '600', marginTop: '2px', color: '#ef4444' }}>{format(new Date(bus.last_exit_time), 'hh:mm a')}</div>
            </div>
          )}
        </div>
      </div>

      {/* Driver Info */}
      <div className="section-label">Driver</div>
      <div className="driver-chip" style={{ marginBottom: '16px' }}>
        <div className="avatar">{bus.driver_name?.charAt(0) || '?'}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{bus.driver_name || 'No driver'}</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-2)', marginTop: '2px' }}>
            {bus.license_number} · {bus.driver_phone}
          </div>
        </div>
        <div className={`status-pill ${bus.driver_present ? 'inside' : 'outside'}`} style={{ fontSize: '0.72rem', padding: '4px 10px' }}>
          {bus.driver_present ? 'Present' : 'Absent'}
        </div>
      </div>

      {/* Route Stops */}
      {stops.length > 0 && (
        <>
          <div className="section-label">Route Stops</div>
          <div className="card">
            <div className="stop-timeline">
              {[...stops].reverse().map((stop, i, arr) => {
                const etaStop = eta?.stops?.find(s => s.name === stop.name);
                return (
                  <div key={i} className="stop-item">
                    {i < arr.length - 1 && <div className="stop-line" />}
                    <div className="stop-dot" style={{ background: i === 0 ? '#6366f1' : i === arr.length - 1 ? '#10b981' : 'var(--text-3)' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.875rem', color: 'var(--text-2)' }}>{stop.name}</span>
                      {etaStop && !isInside ? (
                        <span className="eta-chip">
                          <Clock size={10} style={{ marginRight: '3px' }} />
                          {etaStop.eta_formatted}
                        </span>
                      ) : (
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-3)' }}>
                          {stop.estimated_minutes > 0 ? `+${stop.estimated_minutes}m` : 'Start'}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
