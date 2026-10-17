import { useEffect, useState } from 'react';
import api from '../lib/api';
import { Bell, Bus, RefreshCw, User } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';

const notifIcons = {
  BUS_ENTRY: { icon: <Bus size={16} color="white" />, color: 'linear-gradient(135deg,#10b981,#059669)' },
  BUS_EXIT: { icon: <Bus size={16} color="white" />, color: 'linear-gradient(135deg,#ef4444,#dc2626)' },
  ROUTE_CHANGE: { icon: <RefreshCw size={16} color="white" />, color: 'linear-gradient(135deg,#06b6d4,#6366f1)' },
  DRIVER_CHANGE: { icon: <User size={16} color="white" />, color: 'linear-gradient(135deg,#f59e0b,#d97706)' },
};

export default function NotificationsPage() {
  const [notifs, setNotifs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/students/notifications')
      .then(res => setNotifs(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="center"><div className="spinner" /></div>;

  return (
    <div className="page">
      <h2 className="page-title">Notifications</h2>
      <p className="page-sub">{notifs.length} alerts for your bus</p>

      {notifs.length === 0 ? (
        <div className="empty">
          <Bell size={40} style={{ opacity: 0.3 }} />
          <p>No notifications yet</p>
          <p style={{ color: 'var(--text-3)', fontSize: '0.78rem' }}>You'll be notified when your bus arrives or departs</p>
        </div>
      ) : (
        notifs.map(notif => {
          const config = notifIcons[notif.type] || { icon: <Bell size={16} color="white" />, color: 'linear-gradient(135deg,#6366f1,#8b5cf6)' };
          return (
            <div key={notif.id} className="notif-item">
              <div className="notif-icon" style={{ background: config.color }}>
                {config.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '600', fontSize: '0.875rem', color: 'var(--text)', marginBottom: '3px' }}>{notif.title}</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-2)', marginBottom: '6px' }}>{notif.message}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-3)' }}>
                  {formatDistanceToNow(new Date(notif.sent_at), { addSuffix: true })}
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
