import { useEffect, useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from '../components/Sidebar';
import { Bell, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { io } from 'socket.io-client';
import api from '../lib/api';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function DashboardLayout() {
  const { user, loading } = useAuth();
  const [pendingCount, setPendingCount] = useState(0);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!user) return;
    const socket = io(SOCKET_URL);
    socket.on('connect', () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));

    socket.on('attendance_update', ({ bus, log }) => {
      const emoji = log.event_type === 'ENTRY' ? '🚌' : '🏁';
      toast.success(`${emoji} ${bus.bus_number} ${log.event_type === 'ENTRY' ? 'entered' : 'left'} campus`, { duration: 4000 });
    });

    socket.on('safety_alert', ({ busNumber, drowsinessDetected, faceVerified, seatbeltDetected }) => {
      const issues = [];
      if (!faceVerified) issues.push('Driver mismatch');
      if (drowsinessDetected) issues.push('Drowsiness');
      if (!seatbeltDetected) issues.push('No seatbelt');
      toast.error(`⚠️ ${busNumber}: ${issues.join(', ')}`, { duration: 6000 });
    });

    socket.on('new_gate_pass_request', () => {
      setPendingCount(p => p + 1);
      toast('🚦 New gate pass request', { icon: '📋' });
    });

    socket.on('gate_pass_reviewed', () => {
      fetchPending();
    });

    // Fetch initial pending count
    const fetchPending = async () => {
      try {
        const res = await api.get('/gate-passes?status=PENDING');
        setPendingCount(res.data.length);
      } catch {}
    };
    fetchPending();

    return () => socket.disconnect();
  }, [user]);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div className="spinner" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'DRIVER') return <Navigate to="/driver" replace />;

  return (
    <div className="app-layout">
      <Sidebar pendingCount={pendingCount} />
      <div className="main-content">
        {/* Header */}
        <header className="header">
          <div>
            <div className="header-title">KPRIET Transport Management</div>
            <div className="header-sub">Coimbatore · Academic Year 2024-25</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="live-dot">
              {connected ? 'Live' : 'Connecting...'}
            </div>
            {pendingCount > 0 && (
              <div style={{ position: 'relative' }}>
                <Bell size={20} color="var(--text-secondary)" />
                <span style={{ position: 'absolute', top: '-6px', right: '-6px', background: 'var(--brand-danger)', color: 'white', fontSize: '0.6rem', fontWeight: '800', width: '16px', height: '16px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {pendingCount}
                </span>
              </div>
            )}
          </div>
        </header>

        <div className="page-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
