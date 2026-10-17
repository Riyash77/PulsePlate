import { useEffect, useState } from 'react';
import api from '../lib/api';
import { Trophy } from 'lucide-react';
import { format } from 'date-fns';

function getMedal(rank) {
  if (rank === 1) return { cls: 'gold', label: '🥇' };
  if (rank === 2) return { cls: 'silver', label: '🥈' };
  if (rank === 3) return { cls: 'bronze', label: '🥉' };
  return { cls: 'other', label: rank };
}

export default function RankingsPage() {
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/buses/rankings/today')
      .then(res => setRankings(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-center"><div className="spinner" /><span>Loading...</span></div>;

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Bus Rankings</h2>
          <p>Daily punctuality ranking · {format(new Date(), 'dd MMM yyyy')} · Score = max(0, 100 − minutes_late × 5)</p>
        </div>
        <Trophy size={28} color="#fbbf24" />
      </div>

      {/* Top 3 Podium */}
      {rankings.length >= 3 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px', marginBottom: '28px' }}>
          {rankings.slice(0, 3).map((r) => {
            const medal = getMedal(r.daily_rank);
            return (
              <div key={r.id} className="glass-card" style={{ padding: '24px', textAlign: 'center', border: r.daily_rank === 1 ? '1px solid rgba(251,191,36,0.4)' : '1px solid var(--border-subtle)', boxShadow: r.daily_rank === 1 ? '0 0 30px rgba(251,191,36,0.15)' : '' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>{medal.label}</div>
                <div style={{ fontFamily: 'Space Grotesk', fontSize: '1.3rem', fontWeight: '800', marginBottom: '4px' }}>
                  {r.bus_number}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '16px' }}>{r.route_name}</div>
                <div style={{ fontSize: '2rem', fontWeight: '900', color: r.daily_rank === 1 ? '#fbbf24' : r.daily_rank === 2 ? '#94a3b8' : '#d97706' }}>
                  {r.punctuality_score}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Score</div>
                <div className="score-bar" style={{ marginTop: '12px' }}>
                  <div className="score-bar-fill" style={{
                    width: `${r.punctuality_score}%`,
                    background: r.daily_rank === 1 ? 'linear-gradient(90deg,#fbbf24,#f59e0b)' : r.daily_rank === 2 ? 'linear-gradient(90deg,#94a3b8,#64748b)' : 'linear-gradient(90deg,#d97706,#b45309)'
                  }} />
                </div>
                {r.entry_time && (
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px' }}>
                    Arrived {format(new Date(r.entry_time), 'hh:mm a')}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Full Table */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <h3 style={{ marginBottom: '20px' }}>Complete Rankings</h3>
        {rankings.length === 0 ? (
          <div className="empty-state">
            <Trophy size={40} />
            <p>Rankings will appear after buses start arriving</p>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Bus</th>
                <th>Vehicle No.</th>
                <th>Driver</th>
                <th>Route</th>
                <th>Entry Time</th>
                <th>Minutes Late</th>
                <th>Score</th>
                <th>Progress</th>
              </tr>
            </thead>
            <tbody>
              {rankings.map(r => {
                const medal = getMedal(r.daily_rank);
                return (
                  <tr key={r.id}>
                    <td>
                      <div className={`rank-medal ${medal.cls}`}>{medal.label}</div>
                    </td>
                    <td className="bold">{r.bus_number}</td>
                    <td style={{ fontFamily: 'monospace', color: 'var(--text-accent)', fontSize: '0.8rem' }}>{r.vehicle_number}</td>
                    <td>{r.driver_name || '—'}</td>
                    <td>{r.route_name || '—'}</td>
                    <td>
                      {r.entry_time
                        ? <span style={{ color: r.minutes_late === 0 ? '#10b981' : '#ef4444' }}>{format(new Date(r.entry_time), 'hh:mm a')}</span>
                        : '—'
                      }
                    </td>
                    <td>
                      <span className={`badge ${r.minutes_late === 0 ? 'badge-success' : r.minutes_late <= 10 ? 'badge-warning' : 'badge-danger'}`}>
                        {r.minutes_late === 0 ? 'On Time' : `+${r.minutes_late} min`}
                      </span>
                    </td>
                    <td><span style={{ fontWeight: '800', color: r.punctuality_score >= 90 ? '#10b981' : r.punctuality_score >= 70 ? '#f59e0b' : '#ef4444' }}>{r.punctuality_score}</span></td>
                    <td style={{ width: '120px' }}>
                      <div className="score-bar">
                        <div className="score-bar-fill" style={{
                          width: `${r.punctuality_score}%`,
                          background: r.punctuality_score >= 90 ? 'linear-gradient(90deg,#10b981,#059669)' : r.punctuality_score >= 70 ? 'linear-gradient(90deg,#f59e0b,#d97706)' : 'linear-gradient(90deg,#ef4444,#dc2626)'
                        }} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
