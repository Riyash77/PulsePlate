import { useEffect, useState } from 'react';
import api from '../lib/api';
import { format } from 'date-fns';
import { Clock, CheckCircle, XCircle, Minus } from 'lucide-react';

const MORNING_START = 8 * 60;    // 08:00
const MORNING_END = 8 * 60 + 45; // 08:45

function getTimingStatus(timestamp) {
  if (!timestamp) return { label: 'Not Arrived', color: 'var(--text-muted)', icon: <Minus size={14} />, badge: 'badge-gray' };
  const t = new Date(timestamp);
  const mins = t.getHours() * 60 + t.getMinutes();
  if (mins <= MORNING_END) return { label: 'Good', color: '#10b981', icon: <CheckCircle size={14} />, badge: 'badge-success' };
  if (mins <= MORNING_END + 15) return { label: 'Slightly Late', color: '#f59e0b', icon: <Clock size={14} />, badge: 'badge-warning' };
  return { label: 'Late', color: '#ef4444', icon: <XCircle size={14} />, badge: 'badge-danger' };
}

export default function BusTimingsPage() {
  const [todayLogs, setTodayLogs] = useState([]);
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [logsRes, busesRes] = await Promise.all([
          api.get('/attendance/today'),
          api.get('/buses'),
        ]);
        setBuses(busesRes.data);
        setTodayLogs(logsRes.data);
      } catch {}
      finally { setLoading(false); }
    };
    fetch();
    const interval = setInterval(fetch, 30000);
    return () => clearInterval(interval);
  }, []);

  // Build timing summary per bus
  const busTimings = buses.map(bus => {
    const entries = todayLogs.filter(l => l.bus_id === bus.id && l.event_type === 'ENTRY');
    const exits = todayLogs.filter(l => l.bus_id === bus.id && l.event_type === 'EXIT');
    const firstEntry = entries[0];
    const lastExit = exits[exits.length - 1];
    const status = getTimingStatus(firstEntry?.timestamp);
    return { ...bus, firstEntry, lastExit, timingStatus: status };
  });

  const goodCount = busTimings.filter(b => b.firstEntry && b.timingStatus.label === 'Good').length;
  const lateCount = busTimings.filter(b => b.firstEntry && b.timingStatus.label !== 'Good').length;
  const notArrivedCount = busTimings.filter(b => !b.firstEntry).length;

  if (loading) return <div className="loading-center"><div className="spinner" /><span>Loading...</span></div>;

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Bus Timings</h2>
          <p>Morning entry window: 08:00 AM – 08:45 AM · {format(new Date(), 'dd MMM yyyy')}</p>
        </div>
        <div className="live-dot">Live</div>
      </div>

      {/* Morning window banner */}
      <div className="glass-card" style={{ padding: '20px 24px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '16px', border: '1px solid rgba(99,102,241,0.3)' }}>
        <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Clock size={24} color="white" />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: '700', fontSize: '1rem' }}>Morning Entry Window</div>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Expected: 08:00 AM – 08:45 AM</div>
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#10b981' }}>{goodCount}</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>On Time</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#ef4444' }}>{lateCount}</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Late</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-muted)' }}>{notArrivedCount}</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Pending</div>
          </div>
        </div>
      </div>

      {/* Timings Table */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <h3 style={{ marginBottom: '20px' }}>Today's Entry & Exit Log</h3>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Bus</th>
                <th>Vehicle No.</th>
                <th>Route</th>
                <th>Morning Entry</th>
                <th>Status</th>
                <th>Evening Exit</th>
                <th>Current Status</th>
              </tr>
            </thead>
            <tbody>
              {busTimings.map(bus => (
                <tr key={bus.id}>
                  <td className="bold">{bus.bus_number}</td>
                  <td style={{ fontFamily: 'monospace', color: 'var(--text-accent)', fontSize: '0.8rem' }}>{bus.vehicle_number}</td>
                  <td>{bus.route_name || '—'}</td>
                  <td>
                    {bus.firstEntry
                      ? <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{format(new Date(bus.firstEntry.timestamp), 'hh:mm a')}</span>
                      : <span style={{ color: 'var(--text-muted)' }}>Not arrived</span>
                    }
                  </td>
                  <td>
                    <span className={`badge ${bus.timingStatus.badge}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      {bus.timingStatus.icon} {bus.timingStatus.label}
                    </span>
                  </td>
                  <td>
                    {bus.lastExit
                      ? <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{format(new Date(bus.lastExit.timestamp), 'hh:mm a')}</span>
                      : <span style={{ color: 'var(--text-muted)' }}>—</span>
                    }
                  </td>
                  <td>
                    <span className={`badge ${bus.status === 'INSIDE' ? 'badge-success' : 'badge-danger'}`}>
                      {bus.status === 'INSIDE' ? '● Inside' : '● Outside'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
