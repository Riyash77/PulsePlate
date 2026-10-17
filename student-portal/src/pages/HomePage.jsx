import { useEffect, useState } from 'react';
import api from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import { Bus, MapPin, User, Clock, Navigation } from 'lucide-react';
import { format } from 'date-fns';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function HomePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [eta, setEta] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/students/profile');
      setProfile(res.data);
      if (res.data.selected_bus_id && res.data.status === 'OUTSIDE' && res.data.route_id) {
        fetchETA(res.data.route_id, res.data.selected_bus_id);
      }
    } catch {}
    setLoading(false);
  };

  const fetchETA = async (routeId, busId) => {
    try {
      const res = await api.get(`/routes/${routeId}/eta?bus_id=${busId}`);
      setEta(res.data);
    } catch {}
  };

  useEffect(() => {
    fetchProfile();
    const socket = io(SOCKET_URL);

    socket.on('attendance_update', ({ bus }) => {
      if (profile && bus.id === profile.selected_bus_id) {
        fetchProfile();
        const msg = bus.status === 'OUTSIDE'
          ? `🚌 Your bus has left campus! Check ETA for your stop.`
          : `🎉 Your bus has arrived at campus!`;
        toast(msg, { duration: 6000 });
      }
    });

    socket.on('route_changed', () => fetchProfile());

    return () => socket.disconnect();
  }, []);

  if (loading) return <div className="center"><div className="spinner" /></div>;
  if (!profile) return <div className="center">Profile not set up</div>;

  const rawStops = profile.route_stops || profile.stops;
  const stops = rawStops ? (typeof rawStops === 'string' ? JSON.parse(rawStops) : (Array.isArray(rawStops) ? rawStops : [])) : [];
  const isInside = profile.bus_status === 'INSIDE';

  return (
    <div className="page">
      {/* Greeting */}
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '1.4rem' }}>Hi, {user?.name?.split(' ')[0]} 👋</h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-2)', marginTop: '2px' }}>
          {format(new Date(), 'EEEE, dd MMM')} · Live Bus Tracker
        </p>
      </div>

      {/* My Bus Status */}
      <div className={`bus-status-card ${isInside ? 'inside' : 'outside'}`}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: isInside ? 'linear-gradient(135deg,#10b981,#059669)' : 'linear-gradient(135deg,#ef4444,#dc2626)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Bus size={22} color="white" />
            </div>
            <div>
              <div style={{ fontWeight: '800', fontSize: '1.2rem', fontFamily: 'Space Grotesk' }}>{profile.bus_number || 'Bus Pending'}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-2)' }}>{profile.vehicle_number || 'Select your bus in Profile'}</div>
            </div>
          </div>
          <div className={`status-pill ${isInside ? 'inside' : 'outside'}`}>
            <div className={`pulse-dot ${isInside ? 'green' : 'red'}`} />
            {isInside ? 'In Campus' : 'Left Campus'}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.875rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MapPin size={14} color="var(--text-3)" />
            <span style={{ color: 'var(--text-2)' }}>{profile.route_name || 'Route not assigned'}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <User size={14} color="var(--text-3)" />
            <span style={{ color: 'var(--text-2)' }}>
              {profile.driver_name || 'No driver'}
              {!profile.driver_present && ' (Absent)'}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Navigation size={14} color="var(--text-3)" />
            <span style={{ color: 'var(--text-2)' }}>Your stop: <strong style={{ color: 'var(--text)' }}>{profile.boarding_stop || 'Not configured'}</strong></span>
          </div>
        </div>

        {/* Exit time */}
        {profile.last_exit_time && !isInside && (
          <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px solid rgba(239,68,68,0.2)', fontSize: '0.8rem', color: '#fca5a5' }}>
            <Clock size={12} style={{ display: 'inline', marginRight: '4px' }} />
            Left at {format(new Date(profile.last_exit_time), 'hh:mm a')}
          </div>
        )}
      </div>

      {/* ETA Card */}
      {!isInside && eta && Array.isArray(eta.stops) && (
        <div className="card">
          <div className="section-label" style={{ marginBottom: '14px' }}>Estimated Arrival at Your Stop</div>
          {eta.stops
            .filter(s => s.name === profile.boarding_stop)
            .map((stop, i) => (
              <div key={i} style={{ textAlign: 'center', padding: '8px' }}>
                <div style={{ fontSize: '2rem', fontWeight: '900', fontFamily: 'Space Grotesk', color: '#06b6d4' }}>
                  {stop.eta_formatted}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-2)', marginTop: '4px' }}>
                  {stop.minutes_from_now > 0
                    ? `~${stop.minutes_from_now} minutes away`
                    : stop.minutes_from_now === 0
                    ? 'Arriving now!'
                    : 'Already passed'}
                </div>
              </div>
            ))
          }
        </div>
      )}

      {/* Route Stops with ETA */}
      {stops.length > 0 && (
        <div className="card">
          <div className="section-label" style={{ marginBottom: '14px' }}>Route Stops</div>
          <div className="stop-timeline">
            {[...stops].reverse().map((stop, i, arr) => {
              const etaStop = eta?.stops?.find(s => s.name === stop.name);
              const isMyStop = stop.name === profile.boarding_stop;
              return (
                <div key={i} className="stop-item">
                  {i < arr.length - 1 && <div className="stop-line" />}
                  <div className={`stop-dot`} style={{ background: isMyStop ? '#818cf8' : i === 0 ? '#6366f1' : i === arr.length - 1 ? '#10b981' : 'var(--text-3)' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: isMyStop ? '#818cf8' : 'var(--text-2)', fontWeight: isMyStop ? '700' : '400', fontSize: '0.875rem' }}>
                      {stop.name} {isMyStop ? '← You' : ''}
                    </span>
                    {etaStop && !isInside ? (
                      <span className="eta-chip">{etaStop.eta_formatted}</span>
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
      )}
    </div>
  );
}
