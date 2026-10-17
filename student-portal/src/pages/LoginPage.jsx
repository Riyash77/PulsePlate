import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { Bus, Eye, EyeOff, User } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('student2@kpriet.ac.in');
  const [password, setPassword] = useState('Student1');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(email.trim(), password);
      navigate('/');
      toast.success(`Welcome, ${user.name}!`);
    } catch (err) {
      const msg = err.response?.data?.error 
        || (err.code === 'ERR_NETWORK' || !err.response 
            ? 'Backend API server not reachable on port 5000. Please start backend!' 
            : err.message || 'Login failed');
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (demoEmail, demoPw) => {
    setEmail(demoEmail);
    setPassword(demoPw);
  };

  const DEMO_STUDENTS = [
    { label: 'Arun (Bus 2)', email: 'student2@kpriet.ac.in', pw: 'Student1' },
    { label: 'Priya (Bus 1)', email: 'student1@kpriet.ac.in', pw: 'Student1' },
    { label: 'Deepa (Bus 3)', email: 'student3@kpriet.ac.in', pw: 'Student1' },
    { label: 'Vijay (Bus 1)', email: 'student4@kpriet.ac.in', pw: 'Student1' },
    { label: 'Kavitha (Bus 2)', email: 'student5@kpriet.ac.in', pw: 'Student1' },
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', maxWidth: '440px', margin: '0 auto' }}>
      {/* Orbs */}
      <div style={{ position: 'fixed', top: '-100px', left: '-100px', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', bottom: '-100px', right: '-100px', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />

      {/* Logo */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div style={{ width: '68px', height: '68px', borderRadius: '20px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px', boxShadow: '0 8px 32px rgba(99,102,241,0.4)' }}>
          <Bus size={34} color="white" />
        </div>
        <div style={{ fontFamily: 'Space Grotesk', fontSize: '1.6rem', fontWeight: '800', background: 'linear-gradient(135deg,#818cf8,#c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
          PULSE PLATE
        </div>
        <div style={{ color: 'var(--text-2)', fontSize: '0.85rem', marginTop: '4px' }}>Student Portal · KPRIET</div>
      </div>

      <div className="card" style={{ width: '100%' }}>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '6px' }}>Sign In</h2>
        <p style={{ fontSize: '0.85rem', marginBottom: '20px' }}>Track your bus in real-time</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="label">Email</label>
            <input className="input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@kpriet.ac.in" required />
          </div>
          <div className="form-group" style={{ position: 'relative' }}>
            <label className="label">Password</label>
            <input className="input" type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required style={{ paddingRight: '44px' }} />
            <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: '14px', bottom: '12px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)' }}>
              {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          <button className="btn btn-primary" type="submit" disabled={loading} style={{ marginTop: '8px', width: '100%', justifyContent: 'center' }}>
            {loading ? <div className="spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }} /> : null}
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Quick Demo Switcher */}
        <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <p style={{ fontSize: '0.72rem', color: 'var(--text-3)', textAlign: 'center', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Quick Demo Login (Select Student)
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px' }}>
            {DEMO_STUDENTS.map(s => (
              <button
                key={s.email}
                type="button"
                className="btn btn-ghost"
                style={{
                  fontSize: '0.74rem',
                  padding: '6px 8px',
                  justifyContent: 'center',
                  background: email === s.email ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.03)',
                  borderColor: email === s.email ? '#6366f1' : 'rgba(255,255,255,0.08)',
                }}
                onClick={() => fillDemo(s.email, s.pw)}
              >
                <User size={12} style={{ marginRight: '4px' }} />
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <p style={{ marginTop: '16px', fontSize: '0.75rem', color: 'var(--text-3)', textAlign: 'center' }}>
        Default Password: <code style={{ color: '#818cf8' }}>Student1</code>
      </p>
    </div>
  );
}
