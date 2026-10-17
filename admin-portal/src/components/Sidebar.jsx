import { useNavigate, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Bus, LayoutDashboard, Clock, Trophy, Users, FileText,
  CheckSquare, MapPin, LogOut, ShieldCheck, AlertTriangle,
  RefreshCw
} from 'lucide-react';

export default function Sidebar({ pendingCount = 0 }) {
  const { user, logout, isAO, isAdmin, isDriver } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const roleColor = isAO ? 'role-ao' : isAdmin ? 'role-admin' : 'role-driver';
  const roleLabel = isAO ? 'AO' : isAdmin ? 'Admin' : 'Driver';

  const navItems = isDriver ? [
    { to: '/driver', icon: <LayoutDashboard size={18} />, label: 'My Dashboard' },
    { to: '/driver/gate-pass', icon: <CheckSquare size={18} />, label: 'Gate Pass Request' },
    { to: '/driver/route-change', icon: <RefreshCw size={18} />, label: 'Route Change' },
  ] : [
    { section: 'Overview' },
    { to: '/dashboard', icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
    { to: '/bus-timings', icon: <Clock size={18} />, label: 'Bus Timings' },
    { to: '/rankings', icon: <Trophy size={18} />, label: 'Bus Rankings' },
    { section: 'Fleet' },
    { to: '/buses', icon: <Bus size={18} />, label: 'Bus Details' },
    { to: '/drivers', icon: <Users size={18} />, label: 'Driver Details' },
    { to: '/routes', icon: <MapPin size={18} />, label: 'Routes' },
    { section: 'Logs' },
    { to: '/attendance', icon: <FileText size={18} />, label: 'Attendance Logs' },
    { to: '/ai-logs', icon: <AlertTriangle size={18} />, label: 'AI Safety Logs' },
    ...(isAO ? [
      { section: 'Approvals (AO)' },
      { to: '/gate-passes', icon: <CheckSquare size={18} />, label: 'Gate Passes', badge: pendingCount },
      { to: '/route-changes', icon: <RefreshCw size={18} />, label: 'Route Changes' },
    ] : [
      { section: 'Requests' },
      { to: '/gate-passes', icon: <CheckSquare size={18} />, label: 'Gate Pass Requests' },
    ]),
    ...(isAO ? [
      { section: 'Security' },
      { to: '/ai-logs', icon: <ShieldCheck size={18} />, label: 'AI Verification' },
    ] : []),
  ];

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Bus size={20} color="white" />
          </div>
          <div>
            <div className="logo-text">PULSE PLATE</div>
            <div className="logo-sub">Admin Portal</div>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-subtle)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div className="driver-avatar" style={{ width: '36px', height: '36px', fontSize: '0.875rem' }}>
            {user?.name?.charAt(0)}
          </div>
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <div style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
              <span style={{ fontSize: '0.65rem', fontWeight: '700', padding: '2px 8px', borderRadius: '20px', color: 'white', background: isAO ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : isAdmin ? 'linear-gradient(135deg,#06b6d4,#6366f1)' : 'linear-gradient(135deg,#10b981,#059669)' }}>
                {roleLabel}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {navItems.map((item, i) => {
          if (item.section) {
            return <div key={i} className="nav-section-title">{item.section}</div>;
          }
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/dashboard' || item.to === '/driver'}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
              {item.badge > 0 && <span className="nav-badge">{item.badge}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <button className="nav-item btn-ghost" onClick={handleLogout} style={{ width: '100%', color: '#ef4444', border: 'none', background: 'rgba(239,68,68,0.08)' }}>
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
        <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '12px' }}>
          KPRIET, Coimbatore · v1.0
        </p>
      </div>
    </aside>
  );
}
