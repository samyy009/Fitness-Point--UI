import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, LogIn, Zap, Eye, EyeOff, AlertCircle } from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || null;

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [showPass, setShowPass] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const data = await login(formData.email, formData.password);
      const dest = from || (data.user?.role === 'admin' ? '/admin' : '/dashboard');
      navigate(dest, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const demos = [
    { label: 'Admin', email: 'admin@fitnesspoint.com', pass: 'admin123' },
    { label: 'User', email: 'john@example.com', pass: 'password123' },
  ];

  return (
    <div className="auth-page">
      {/* Background orbs */}
      <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,229,255,0.06) 0%, transparent 70%)', top: -150, right: -150, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(168,85,247,0.05) 0%, transparent 70%)', bottom: -100, left: -100, pointerEvents: 'none' }} />

      <motion.div
        className="auth-card"
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
      >
        {/* Logo */}
        <Link to="/" className="auth-logo">
          <Zap size={22} color="var(--primary)" style={{ display: 'inline', marginRight: '0.35rem', verticalAlign: 'middle' }} />
          Fitness <span>Point</span>
        </Link>

        <h2 className="auth-title">Welcome Back 👋</h2>
        <p className="auth-subtitle">Sign in to track your workouts and nutrition.</p>

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', background: 'rgba(255,56,96,0.1)', border: '1px solid rgba(255,56,96,0.25)', borderRadius: 'var(--radius)', padding: '0.85rem 1rem', marginBottom: '1.5rem', fontSize: '0.88rem', color: 'var(--danger)' }}
          >
            <AlertCircle size={16} /> {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="email" name="email" className="form-input" required
                placeholder="name@example.com"
                value={formData.email} onChange={handleChange}
                style={{ paddingLeft: '2.75rem' }}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type={showPass ? 'text' : 'password'} name="password" className="form-input" required
                placeholder="••••••••"
                value={formData.password} onChange={handleChange}
                style={{ paddingLeft: '2.75rem', paddingRight: '3rem' }}
              />
              <button type="button" onClick={() => setShowPass(!showPass)}
                style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 }}>
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <motion.button
            type="submit"
            className="btn btn-primary btn-shine"
            style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem', padding: '1rem' }}
            disabled={submitting}
            whileTap={{ scale: 0.97 }}
          >
            {submitting ? (
              <><div className="spinner spinner-sm" style={{ borderTopColor: 'var(--dark)' }} /> Signing in...</>
            ) : (
              <><LogIn size={18} /> Sign In</>
            )}
          </motion.button>
        </form>

        {/* Demo accounts */}
        <div className="auth-divider"><span>Quick Demo Login</span></div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem' }}>
          {demos.map(d => (
            <button
              key={d.label}
              type="button"
              className="btn btn-ghost btn-sm"
              style={{ justifyContent: 'center', fontSize: '0.82rem' }}
              onClick={() => setFormData({ email: d.email, password: d.pass })}
            >
              {d.label === 'Admin' ? '🛡️' : '👤'} {d.label} Demo
            </button>
          ))}
        </div>

        <div className="auth-footer">
          Don't have an account? <Link to="/register">Create Account</Link>
        </div>
      </motion.div>
    </div>
  );
}
