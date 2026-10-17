import { useEffect, useState } from 'react';
import api from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { CheckSquare, Clock, CheckCircle, XCircle, FileText } from 'lucide-react';
import { format } from 'date-fns';

function ReviewModal({ request, onClose, onDone }) {
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const review = async (status) => {
    setLoading(true);
    try {
      await api.patch(`/gate-passes/${request.id}/review`, { status, review_notes: notes });
      toast.success(`Gate pass ${status.toLowerCase()}`);
      onDone();
      onClose();
    } catch (err) {
      toast.error('Failed to update');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <h3 style={{ marginBottom: '8px' }}>Review Gate Pass Request</h3>
        <p style={{ marginBottom: '20px', fontSize: '0.875rem' }}>
          <strong>{request.driver_name}</strong> — {request.bus_number} — {request.request_type}
        </p>
        <div style={{ background: 'var(--bg-elevated)', borderRadius: '10px', padding: '14px', marginBottom: '16px', fontSize: '0.875rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
          "{request.reason}"
        </div>
        <div className="form-group" style={{ marginBottom: '20px' }}>
          <label className="form-label">Review Notes (optional)</label>
          <textarea className="form-textarea" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Add a note..." />
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn btn-success" style={{ flex: 1, justifyContent: 'center' }} onClick={() => review('APPROVED')} disabled={loading}>
            <CheckCircle size={16} /> Approve
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

export default function GatePassesPage() {
  const { isAO } = useAuth();
  const [passes, setPasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewing, setReviewing] = useState(null);
  const [filter, setFilter] = useState('');

  const fetchPasses = async () => {
    try {
      const url = filter ? `/gate-passes?status=${filter}` : '/gate-passes';
      const res = await api.get(url);
      setPasses(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPasses(); }, [filter]);

  if (loading) return <div className="loading-center"><div className="spinner" /></div>;

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Gate Pass Requests</h2>
          <p>{isAO ? 'Approve or reject driver gate pass requests' : 'View gate pass requests'}</p>
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
        {passes.length === 0 ? (
          <div className="empty-state">
            <CheckSquare size={40} />
            <p>No gate pass requests found</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {passes.map(pass => (
              <div key={pass.id} style={{ background: 'var(--bg-elevated)', borderRadius: '12px', padding: '16px 20px', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: pass.request_type === 'FUEL' ? 'linear-gradient(135deg,#f59e0b,#d97706)' : 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <FileText size={20} color="white" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                    <span style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{pass.driver_name}</span>
                    <span className="badge badge-info">{pass.request_type}</span>
                    <span className={`badge ${pass.status === 'PENDING' ? 'badge-warning' : pass.status === 'APPROVED' ? 'badge-success' : 'badge-danger'}`}>
                      {pass.status === 'PENDING' ? <Clock size={10} /> : pass.status === 'APPROVED' ? <CheckCircle size={10} /> : <XCircle size={10} />}
                      {pass.status}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    {pass.bus_number} · {pass.reason}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Requested {format(new Date(pass.requested_at), 'dd MMM, hh:mm a')}
                    {pass.reviewed_by_name && ` · Reviewed by ${pass.reviewed_by_name}`}
                  </div>
                  {pass.review_notes && (
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-accent)', marginTop: '4px', fontStyle: 'italic' }}>Note: {pass.review_notes}</div>
                  )}
                </div>
                {isAO && pass.status === 'PENDING' && (
                  <button className="btn btn-primary btn-sm" onClick={() => setReviewing(pass)}>
                    Review
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {reviewing && (
        <ReviewModal
          request={reviewing}
          onClose={() => setReviewing(null)}
          onDone={fetchPasses}
        />
      )}
    </div>
  );
}
