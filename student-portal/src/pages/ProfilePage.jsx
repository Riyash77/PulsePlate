import { useEffect, useState } from 'react';
import api from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { User, Bus, LogOut } from 'lucide-react';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [buses, setBuses] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [editing, setEditing] = useState(false);
  const [selectedBusId, setSelectedBusId] = useState('');
  const [boardingStop, setBoardingStop] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/students/profile'),
      api.get('/buses'),
    ]).then(([pRes, bRes]) => {
      setProfile(pRes.data);
      setBuses(bRes.data);
      setSelectedBusId(pRes.data.selected_bus_id || '');
      setBoardingStop(pRes.data.boarding_stop || '');
    }).finally(() => setLoading(false));
  }, []);

  const selectedBusStops = selectedBusId
    ? (() => {
        const bus = buses.find(b => String(b.id) === String(selectedBusId));
        if (!bus) return [];
        const raw = bus.route_stops || bus.stops;
        const stops = raw ? (typeof raw === 'string' ? JSON.parse(raw) : (Array.isArray(raw) ? raw : [])) : [];
        return stops;
      })()
    : [];

  const savePreferences = async () => {
    try {
      const stop = selectedBusStops.find(s => s.name === boardingStop);
      await api.patch('/students/select-bus', {
        selected_bus_id: selectedBusId,
        boarding_stop: boardingStop,
        boarding_stop_order: stop?.order || 1,
      });
      toast.success('Preferences saved!');
      setEditing(false);
      const res = await api.get('/students/profile');
      setProfile(res.data);
    } catch {
      toast.error('Failed to save');
    }
  };

  const handleLogout = () => { logout(); navigate('/login'); };

  if (loading) return <div className="center"><div className="spinner" /></div>;

  return (
    <div className="page">
      <h2 className="page-title">My Profile</h2>
      <p className="page-sub">Manage your bus preferences</p>

      {/* User Info */}
      <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
        <div className="avatar" style={{ width: '52px', height: '52px', fontSize: '1.3rem' }}>{user?.name?.charAt(0)}</div>
        <div>
          <div style={{ fontWeight: '700', fontSize: '1rem' }}>{user?.name}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-2)' }}>{user?.email}</div>
          {profile?.roll_number && <div style={{ fontSize: '0.75rem', color: 'var(--text-3)', marginTop: '2px' }}>{profile.roll_number}</div>}
        </div>
      </div>

      {/* Bus Preferences */}
      <div className="section-label">Bus Preferences</div>
      <div className="card">
        {!editing ? (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.875rem', marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-3)' }}>My Bus</span>
                <span style={{ fontWeight: '700', color: 'var(--text)' }}>{profile?.bus_number || 'Not set'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-3)' }}>Boarding Stop</span>
                <span style={{ fontWeight: '700', color: 'var(--text)' }}>{profile?.boarding_stop || 'Not set'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-3)' }}>Route</span>
                <span style={{ fontWeight: '600', color: 'var(--text-2)' }}>{profile?.route_name || '—'}</span>
              </div>
            </div>
            <button className="btn btn-ghost" style={{ width: '100%', justifyContent: 'center' }} onClick={() => setEditing(true)}>
              Change Bus / Stop
            </button>
          </>
        ) : (
          <>
            <div className="form-group">
              <label className="label">Select Bus</label>
              <select className="select" value={selectedBusId} onChange={e => { setSelectedBusId(e.target.value); setBoardingStop(''); }}>
                <option value="">Choose your bus...</option>
                {buses.map(b => <option key={b.id} value={b.id}>{b.bus_number} – {b.route_name}</option>)}
              </select>
            </div>
            {selectedBusStops.length > 0 && (
              <div className="form-group">
                <label className="label">Boarding Stop</label>
                <select className="select" value={boardingStop} onChange={e => setBoardingStop(e.target.value)}>
                  <option value="">Choose your stop...</option>
                  {selectedBusStops.map(s => <option key={s.order} value={s.name}>{s.name}</option>)}
                </select>
              </div>
            )}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="btn btn-primary" onClick={savePreferences} style={{ flex: 1 }}>Save</button>
              <button className="btn btn-ghost" onClick={() => setEditing(false)}>Cancel</button>
            </div>
          </>
        )}
      </div>

      {/* Logout */}
      <button
        className="btn"
        style={{ width: '100%', justifyContent: 'center', background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)', marginTop: '24px' }}
        onClick={handleLogout}
      >
        <LogOut size={16} /> Sign Out
      </button>
    </div>
  );
}
