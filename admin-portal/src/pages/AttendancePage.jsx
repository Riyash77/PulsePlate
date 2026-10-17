import { useEffect, useState } from 'react';
import api from '../lib/api';
import { format } from 'date-fns';
import { FileText } from 'lucide-react';

export default function AttendancePage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState(format(new Date(), 'yyyy-MM-dd'));

  useEffect(() => {
    api.get(`/attendance?date=${dateFilter}&limit=100`)
      .then(res => setLogs(res.data))
      .finally(() => setLoading(false));
  }, [dateFilter]);

  if (loading) return <div className="loading-center"><div className="spinner" /></div>;

  return (
    <div>
      <div className="page-header">
        <div><h2>Attendance Logs</h2><p>All bus entry & exit records</p></div>
        <input type="date" className="form-input" style={{ width: 'auto' }} value={dateFilter} onChange={e => { setDateFilter(e.target.value); setLoading(true); }} />
      </div>

      <div className="glass-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h3>
            {format(new Date(dateFilter), 'dd MMMM yyyy')} · {logs.length} records
          </h3>
          <div style={{ display: 'flex', gap: '12px' }}>
            <span className="badge badge-success">{logs.filter(l => l.event_type === 'ENTRY').length} Entries</span>
            <span className="badge badge-danger">{logs.filter(l => l.event_type === 'EXIT').length} Exits</span>
          </div>
        </div>

        {logs.length === 0 ? (
          <div className="empty-state"><FileText size={40} /><p>No attendance logs for this date</p></div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Bus</th>
                  <th>Vehicle No.</th>
                  <th>Driver</th>
                  <th>Event</th>
                  <th>Plate Detected</th>
                  <th>Confidence</th>
                  <th>Time</th>
                  <th>Source</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log, i) => (
                  <tr key={log.id}>
                    <td style={{ color: 'var(--text-muted)' }}>{i + 1}</td>
                    <td className="bold">{log.bus_number}</td>
                    <td style={{ fontFamily: 'monospace', color: 'var(--text-accent)', fontSize: '0.8rem' }}>{log.vehicle_number}</td>
                    <td>{log.driver_name || '—'}</td>
                    <td>
                      <span className={`badge ${log.event_type === 'ENTRY' ? 'badge-success' : 'badge-danger'}`}>
                        {log.event_type === 'ENTRY' ? '↓ ENTRY' : '↑ EXIT'}
                      </span>
                    </td>
                    <td style={{ fontFamily: 'monospace', color: 'var(--text-accent)', fontSize: '0.8rem' }}>
                      {log.plate_detected || '—'}
                    </td>
                    <td>
                      {log.confidence_score
                        ? <span style={{ color: log.confidence_score > 0.9 ? '#10b981' : '#f59e0b' }}>{(log.confidence_score * 100).toFixed(0)}%</span>
                        : '—'
                      }
                    </td>
                    <td style={{ whiteSpace: 'nowrap' }}>{format(new Date(log.timestamp), 'hh:mm:ss a')}</td>
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
