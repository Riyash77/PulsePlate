import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import api from '../lib/api';
import toast from 'react-hot-toast';
import { Bus, FileText, RefreshCw, Clock, CheckCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import Sidebar from '../components/Sidebar';

export default function DriverPage() {
  const { user, isDriver, loading } = useAuth();
  const [driver, setDriver] = useState(null);
  const [gatePasses, setGatePasses] = useState([]);
  const [routeChanges, setRouteChanges] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [buses, setBuses] = useState([]);
  const [tab, setTab] = useState('home');

  // Gate pass form
  const [gpReason, setGpReason] = useState('');
  const [gpType, setGpType] = useState('SERVICE');
  const [gpBus, setGpBus] = useState('');

  // Route change form
  const [rcReason, setRcReason] = useState('');
  const [rcRoute, setRcRoute] = useState('');
  const [rcBus, setRcBus] = useState('');

  useEffect(() => {
    if (!user) return;
    Promise.all([
      api.get('/drivers'),
      api.get('/gate-passes'),
      api.get('/route-changes'),
      api.get('/routes'),
      api.get('/buses'),
    ]).then(([driversRes, gpRes, rcRes, routeRes, busRes]) => {
      const myDriver = driversRes.data.find(d => d.user_id === user.id);
      setDriver(myDriver);
      setGatePasses(gpRes.data);
      setRouteChanges(rcRes.data);
      setRoutes(routeRes.data);
      setBuses(busRes.data);
      if (myDriver?.assigned_bus_id) {
        setGpBus(myDriver.assigned_bus_id);
        setRcBus(myDriver.assigned_bus_id);
      }
    }).catch(() => {});
  }, [user]);

  if (loading) return <div className="loading-center"><div className="spinner" /></div>;
  if (!user) return <Navigate to="/login" replace />;
  if (!isDriver) return <Navigate to="/dashboard" replace />;

  const submitGatePass = async (e) => {
    e.preventDefault();
    try {
      await api.post('/gate-passes', { bus_id: gpBus, reason: gpReason, request_type: gpType });
      toast.success('Gate pass request submitted!');
      setGpReason('');
      const res = await api.get('/gate-passes');
      setGatePasses(res.data);
      setTab('home');
    } catch {
      toast.error('Failed to submit');
    }
  };

  const submitRouteChange = async (e) => {
    e.preventDefault();
    try {
      await api.post('/route-changes', { bus_id: rcBus, requested_route_id: rcRoute, reason: rcReason });
      toast.success('Route change request submitted!');
      setRcReason('');
      const res = await api.get('/route-changes');
      setRouteChanges(res.data);
      setTab('home');
    } catch {
      toast.error('Failed to submit');
    }
  };

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <header className="header">
          <div>
            <div className="header-title">Driver Portal</div>
            <div className="header-sub">Welcome, {user.name}</div>
          </div>
        </header>
        <div className="page-content">
          {/* Tabs */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
            {[
              { key: 'home', label: 'Dashboard', icon: <Bus size={16} /> },
              { key: 'gatepass', label: 'Gate Pass Request', icon: <FileText size={16} /> },
              { key: 'routechange', label: 'Route Change', icon: <RefreshCw size={16} /> },
            ].map(t => (
              <button
                key={t.key}
                className={`btn ${tab === t.key ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => setTab(t.key)}
              >
                {t.icon} {t.label}
              </button>
            ))}
          </div>

          {/* Home Tab */}
          {tab === 'home' && (
            <div>
              {driver && (
                <div className="glass-card" style={{ padding: '24px', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div className="driver-avatar" style={{ width: '64px', height: '64px', fontSize: '1.5rem' }}>
                      {driver.name.charAt(0)}
                    </div>
                    <div>
                      <h3>{driver.name}</h3>
                      <p style={{ fontSize: '0.85rem' }}>{driver.license_number}</p>
                    </div>
                    <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                      <div style={{ fontSize: '1.5rem', fontWeight: '800', fontFamily: 'Space Grotesk' }}>{driver.bus_number || '—'}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Assigned Bus</div>
                    </div>
                  </div>
                </div>
              )}

              {/* My Requests */}
              <div className="glass-card" style={{ padding: '24px' }}>
                <h3 style={{ marginBottom: '16px' }}>My Requests</h3>
                {[...gatePasses.map(gp => ({ ...gp, type: 'GATE_PASS' })), ...routeChanges.map(rc => ({ ...rc, type: 'ROUTE_CHANGE' }))].sort((a, b) => new Date(b.requested_at) - new Date(a.requested_at)).slice(0, 10).map(req => (
                  <div key={req.id} style={{ background: 'var(--bg-elevated)', borderRadius: '10px', padding: '14px 16px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: req.type === 'GATE_PASS' ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : 'linear-gradient(135deg,#06b6d4,#6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {req.type === 'GATE_PASS' ? <FileText size={16} color="white" /> : <RefreshCw size={16} color="white" />}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: '600', fontSize: '0.875rem', color: 'var(--text-primary)' }}>
                        {req.type === 'GATE_PASS' ? `Gate Pass – ${req.request_type}` : `Route Change`}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        {format(new Date(req.requested_at), 'dd MMM, hh:mm a')}
                      </div>
                    </div>
                    <span className={`badge ${req.status === 'PENDING' ? 'badge-warning' : req.status === 'APPROVED' ? 'badge-success' : 'badge-danger'}`}>
                      {req.status === 'PENDING' ? <Clock size={10} /> : req.status === 'APPROVED' ? <CheckCircle size={10} /> : <XCircle size={10} />}
                      {req.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Gate Pass Tab */}
          {tab === 'gatepass' && (
            <div className="glass-card" style={{ padding: '28px', maxWidth: '540px' }}>
              <h3 style={{ marginBottom: '8px' }}>Submit Gate Pass Request</h3>
              <p style={{ marginBottom: '24px', fontSize: '0.875rem' }}>Request will be reviewed by the AO</p>
              <form onSubmit={submitGatePass} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Request Type</label>
                  <select className="form-select" value={gpType} onChange={e => setGpType(e.target.value)}>
                    <option value="SERVICE">Service</option>
                    <option value="FUEL">Fuel Filling</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Reason</label>
                  <textarea className="form-textarea" value={gpReason} onChange={e => setGpReason(e.target.value)} placeholder="Describe the reason..." required />
                </div>
                <button className="btn btn-primary" type="submit" style={{ justifyContent: 'center' }}>
                  <FileText size={16} /> Submit Request
                </button>
              </form>
            </div>
          )}

          {/* Route Change Tab */}
          {tab === 'routechange' && (
            <div className="glass-card" style={{ padding: '28px', maxWidth: '540px' }}>
              <h3 style={{ marginBottom: '8px' }}>Request Route Change</h3>
              <p style={{ marginBottom: '24px', fontSize: '0.875rem' }}>Route changes must be approved by the AO</p>
              <form onSubmit={submitRouteChange} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Requested Route</label>
                  <select className="form-select" value={rcRoute} onChange={e => setRcRoute(e.target.value)} required>
                    <option value="">Select a route...</option>
                    {routes.map(r => <option key={r.id} value={r.id}>{r.route_name}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Reason</label>
                  <textarea className="form-textarea" value={rcReason} onChange={e => setRcReason(e.target.value)} placeholder="Why do you need this route change?" required />
                </div>
                <button className="btn btn-primary" type="submit" style={{ justifyContent: 'center' }}>
                  <RefreshCw size={16} /> Submit Request
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
