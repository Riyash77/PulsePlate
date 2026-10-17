import { useEffect, useState } from 'react';
import api from '../lib/api';
import { format } from 'date-fns';
import { ShieldCheck, AlertTriangle } from 'lucide-react';

export default function AILogsPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/drivers/verification-logs?limit=100')
      .then(res => setLogs(res.data))
      .finally(() => setLoading(false));
  }, []);

  const alerts = logs.filter(l => !l.face_verified || l.drowsiness_detected || !l.seatbelt_detected);

  if (loading) return <div className="loading-center"><div className="spinner" /></div>;

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>AI Safety Logs</h2>
          <p>Driver face verification, drowsiness & seatbelt detection results</p>
        </div>
        {alerts.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '10px', padding: '8px 14px', color: '#fca5a5', fontSize: '0.875rem' }}>
            <AlertTriangle size={16} />
            {alerts.length} alerts today
          </div>
        )}
      </div>

      <div className="glass-card" style={{ padding: '24px' }}>
        {logs.length === 0 ? (
          <div className="empty-state"><ShieldCheck size={40} /><p>No AI verification logs yet</p></div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Bus</th>
                  <th>Driver</th>
                  <th>Face Verified</th>
                  <th>Drowsiness</th>
                  <th>Seatbelt</th>
                  <th>Confidence</th>
                  <th>Time</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {logs.map(log => {
                  const hasAlert = !log.face_verified || log.drowsiness_detected || !log.seatbelt_detected;
                  return (
                    <tr key={log.id} style={{ background: hasAlert ? 'rgba(239,68,68,0.04)' : '' }}>
                      <td className="bold">{log.bus_number}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div className="driver-avatar" style={{ width: '28px', height: '28px', fontSize: '0.75rem' }}>
                            {log.driver_name?.charAt(0) || '?'}
                          </div>
                          {log.driver_name || '—'}
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${log.face_verified ? 'badge-success' : 'badge-danger'}`}>
                          {log.face_verified ? '✓ Matched' : '✗ Mismatch'}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${log.drowsiness_detected ? 'badge-danger' : 'badge-success'}`}>
                          {log.drowsiness_detected ? '⚠ Detected' : '✓ Alert'}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${log.seatbelt_detected ? 'badge-success' : 'badge-danger'}`}>
                          {log.seatbelt_detected ? '✓ Worn' : '✗ Missing'}
                        </span>
                      </td>
                      <td>
                        {log.confidence_score
                          ? <span style={{ color: log.confidence_score > 0.85 ? '#10b981' : '#f59e0b' }}>{(log.confidence_score * 100).toFixed(0)}%</span>
                          : '—'}
                      </td>
                      <td style={{ whiteSpace: 'nowrap' }}>{format(new Date(log.timestamp), 'hh:mm a')}</td>
                      <td>
                        {hasAlert
                          ? <span className="badge badge-danger"><AlertTriangle size={10} /> Alert</span>
                          : <span className="badge badge-success"><ShieldCheck size={10} /> Safe</span>
                        }
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
