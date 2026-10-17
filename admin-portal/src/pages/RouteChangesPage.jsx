import { useEffect, useState } from 'react';
import api from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { RefreshCw, CheckCircle, XCircle, Clock } from 'lucide-react';
import { format } from 'date-fns';

function ReviewModal({ request, onClose, onDone }) {
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const review = async (status) => {
    setLoading(true);
    try {
      await api.patch(`/route-changes/${request.id}/review`, { status, review_notes: notes });
      toast.success(`Route change ${status.toLowerCase()}`);
      onDone();
      onClose();
    } catch {
      toast.error('Failed to update');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <h3 style={{ marginBottom: '8px' }}>Review Route Change Request</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', width: '120px' }}>Driver:</span>
            <span style={{ fontWeight: '600' }}>{request.driver_name}</span>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', width: '120px' }}>Bus:</span>
            <span>{request.bus_number}</span>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', width: '120px' }}>Current Route:</span>
            <span>{request.current_route_name}</span>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', width: '120px' }}>Requested Route:</span>
            <span style={{ fontWeight: '700', color: '#818cf8' }}>{request.requested_route_name}</span>
          </div>
          <div style={{ background: 'var(--bg-elevated)', borderRadius: '10px', padding: '12px', fontSize: '0.875rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
            "{request.reason}"
          </div>
        </div>
        <div className="form-group" style={{ marginBottom: '20px' }}>
          <label className="form-label">Review Notes</label>
          <textarea className="form-textarea" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Optional notes..." />
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn btn-success" style={{ flex: 1, justifyContent: 'center' }} onClick={() => review('APPROVED')} disabled={loading}>
            <CheckCircle size={16} /> Approve & Apply
          </button>
          <button className="btn btn-danger" style={{ flex: 1, justifyContent: 'center' }} onClick={() => review('REJECTED')} disabled={loading}>
            <XCircle size={16} /> Reject
          </button>
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default function RouteChangesPage() {
  const { isAO } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewing, setReviewing] = useState(null);
  const [filter, setFilter] = useState('');

  const fetchRequests = async () => {
    try {
      const url = filter ? `/route-changes?status=${filter}` : '/route-changes';
      const res = await api.get(url);
      setRequests(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRequests(); }, [filter]);

  if (loading) return <div className="loading-center"><div className="spinner" /></div>;

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Route Change Requests</h2>
          <p>{isAO ? 'Approve route changes — changes take effect immediately' : 'View route change requests'}</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {['', 'PENDING', 'APPROVED', 'REJECTED'].map(s => (
            <button key={s} className={`btn btn-sm ${filter === s ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setFilter(s)}>
              {s || 'All'}
            </button>
          ))}
        </div>
      </div>

      <div className="glass-card" style={{ padding: '24px' }}>
        {requests.length === 0 ? (
          <div className="empty-state"><RefreshCw size={40} /><p>No route change requests</p></div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {requests.map(req => (
              <div key={req.id} style={{ background: 'var(--bg-elevated)', borderRadius: '12px', padding: '16px 20px', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'linear-gradient(135deg,#06b6d4,#6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <RefreshCw size={20} color="white" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                    <span style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{req.driver_name}</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{req.bus_number}</span>
                    <span className={`badge ${req.status === 'PENDING' ? 'badge-warning' : req.status === 'APPROVED' ? 'badge-success' : 'badge-danger'}`}>
                      {req.status === 'PENDING' ? <Clock size={10} /> : req.status === 'APPROVED' ? <CheckCircle size={10} /> : <XCircle size={10} />}
                      {req.status}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>{req.current_route_name}</span>
                    <span style={{ color: 'var(--text-muted)' }}>→</span>
                    <span style={{ fontWeight: '700', color: '#818cf8' }}>{req.requested_route_name}</span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px', fontStyle: 'italic' }}>"{req.reason}"</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    {format(new Date(req.requested_at), 'dd MMM, hh:mm a')}
                  </div>
                </div>
                {isAO && req.status === 'PENDING' && (
                  <button className="btn btn-primary btn-sm" onClick={() => setReviewing(req)}>Review</button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {reviewing && <ReviewModal request={reviewing} onClose={() => setReviewing(null)} onDone={fetchRequests} />}
    </div>
  );
}
