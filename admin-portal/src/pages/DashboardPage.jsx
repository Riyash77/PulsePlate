import { useEffect, useState } from 'react';
import api from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import {
  Bus, Users, AlertTriangle, CheckSquare,
  TrendingUp, Clock, ArrowUpRight
} from 'lucide-react';
import { format } from 'date-fns';

function StatCard({ icon, label, value, color, gradient, delta }) {
  return (
    <div className="stat-card">
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div className="stat-icon" style={{ background: gradient }}>
          {icon}
        </div>
        {delta !== undefined && (
          <span style={{ fontSize: '0.75rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '2px' }}>
            <ArrowUpRight size={12} /> {delta}
          </span>
        )}
      </div>
      <div className="stat-value" style={{ color }}>{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

export default function DashboardPage() {
  const { user, isAO } = useAuth();
  const [summary, setSummary] = useState(null);
  const [todayLogs, setTodayLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [sumRes, logsRes] = await Promise.all([
          api.get('/buses/summary'),
          api.get('/attendance/today'),
        ]);
        setSummary(sumRes.data);
        setTodayLogs(logsRes.data.slice(0, 8));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetch();
    const interval = setInterval(fetch, 30000); // refresh every 30s
    return () => clearInterval(interval);
  }, []);

  if (loading) return (
    <div className="loading-center">
      <div className="spinner" />
      <span>Loading dashboard...</span>
    </div>
  );

  const now = new Date();
  const timeStr = format(now, 'EEEE, dd MMMM yyyy');

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h2>Welcome back, {user?.name?.split(' ')[0]} 👋</h2>
          <p>{timeStr} · KPRIET Campus Transport</p>
        </div>
        <span className="live-dot">Live Data</span>
      </div>

      {/* Stats Grid */}
      <div className="grid-4" style={{ marginBottom: '24px' }}>
        <StatCard
          icon={<Bus size={22} color="white" />}
          label="Total Buses"
          value={summary?.totalBuses ?? '—'}
          color="var(--text-primary)"
          gradient="linear-gradient(135deg,#6366f1,#8b5cf6)"
        />
        <StatCard
          icon={<Bus size={22} color="white" />}
          label="Inside Campus"
          value={summary?.busesInside ?? '—'}
          color="#10b981"
          gradient="linear-gradient(135deg,#10b981,#059669)"
        />
        <StatCard
          icon={<Bus size={22} color="white" />}
          label="Outside Campus"
          value={summary?.busesOutside ?? '—'}
          color="#ef4444"
          gradient="linear-gradient(135deg,#ef4444,#dc2626)"
        />
        <StatCard
          icon={<Users size={22} color="white" />}
          label="Drivers Present"
          value={`${summary?.driversPresent ?? '—'} / ${(summary?.driversPresent ?? 0) + (summary?.driversAbsent ?? 0)}`}
          color="#f59e0b"
          gradient="linear-gradient(135deg,#f59e0b,#d97706)"
        />
      </div>

      <div className="grid-4" style={{ marginBottom: '28px' }}>
        <StatCard
          icon={<AlertTriangle size={22} color="white" />}
          label="Safety Alerts Today"
          value={summary?.alertsToday ?? '0'}
          color={summary?.alertsToday > 0 ? '#ef4444' : '#10b981'}
          gradient={summary?.alertsToday > 0 ? 'linear-gradient(135deg,#ef4444,#dc2626)' : 'linear-gradient(135deg,#10b981,#059669)'}
        />
        <StatCard
          icon={<CheckSquare size={22} color="white" />}
          label="Pending Approvals"
          value={summary?.pendingApprovals ?? '0'}
          color={summary?.pendingApprovals > 0 ? '#f59e0b' : '#10b981'}
          gradient="linear-gradient(135deg,#f59e0b,#d97706)"
        />
        <StatCard
          icon={<TrendingUp size={22} color="white" />}
          label="Drivers Absent"
          value={summary?.driversAbsent ?? '0'}
          color="var(--text-secondary)"
          gradient="linear-gradient(135deg,#475569,#334155)"
        />
        <StatCard
          icon={<Clock size={22} color="white" />}
          label="Morning Window"
          value="08:00–08:45"
          color="var(--text-accent)"
          gradient="linear-gradient(135deg,#06b6d4,#6366f1)"
        />
      </div>

      {/* Today's Activity */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h3>Today's Activity</h3>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Last 8 events</span>
        </div>

        {todayLogs.length === 0 ? (
          <div className="empty-state">
            <Bus size={40} />
            <p>No bus activity recorded today yet</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Bus</th>
                  <th>Event</th>
                  <th>Plate Detected</th>
                  <th>Confidence</th>
                  <th>Time</th>
                  <th>Type</th>
                </tr>
              </thead>
              <tbody>
                {todayLogs.map(log => (
                  <tr key={log.id}>
                    <td className="bold">{log.bus_number}</td>
                    <td>
                      <span className={`badge ${log.event_type === 'ENTRY' ? 'badge-success' : 'badge-danger'}`}>
                        {log.event_type === 'ENTRY' ? '↓ ENTRY' : '↑ EXIT'}
                      </span>
                    </td>
                    <td style={{ fontFamily: 'monospace', color: 'var(--text-accent)' }}>
                      {log.plate_detected || '—'}
                    </td>
                    <td>
                      {log.confidence_score ? (
                        <span style={{ color: log.confidence_score > 0.9 ? '#10b981' : '#f59e0b' }}>
                          {(log.confidence_score * 100).toFixed(0)}%
                        </span>
                      ) : '—'}
                    </td>
                    <td>{format(new Date(log.timestamp), 'hh:mm a')}</td>
                    <td>
                      <span className={`badge ${log.is_manual ? 'badge-warning' : 'badge-info'}`}>
                        {log.is_manual ? 'Manual' : 'AI/ANPR'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
