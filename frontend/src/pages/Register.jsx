import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, Eye, EyeOff, UserPlus, Zap, AlertCircle, CheckCircle } from 'lucide-react';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const passwordStrength = (pwd) => {
    if (!pwd) return null;
    if (pwd.length < 6) return { label: 'Weak', color: 'var(--danger)', width: '33%' };
    if (pwd.length < 10) return { label: 'Fair', color: 'var(--warning)', width: '66%' };
    return { label: 'Strong', color: 'var(--success)', width: '100%' };
  };
  const strength = passwordStrength(formData.password);
  const passwordsMatch = formData.confirmPassword && formData.password === formData.confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      setSubmitting(false);
      return;
    }
    try {
      await register(formData.name, formData.email, formData.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div style={{ position: 'absolute', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,229,255,0.06) 0%, transparent 70%)', top: -200, left: -200, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(168,85,247,0.05) 0%, transparent 70%)', bottom: -100, right: -100, pointerEvents: 'none' }} />

      <motion.div
        className="auth-card"
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
      >
        <Link to="/" className="auth-logo">
          <Zap size={22} color="var(--primary)" style={{ display: 'inline', marginRight: '0.35rem', verticalAlign: 'middle' }} />
          Fitness <span>Point</span>
        </Link>

        <h2 className="auth-title">Join the Community 🚀</h2>
        <p className="auth-subtitle">Create your account and start your fitness journey today.</p>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', background: 'rgba(255,56,96,0.1)', border: '1px solid rgba(255,56,96,0.25)', borderRadius: 'var(--radius)', padding: '0.85rem 1rem', marginBottom: '1.5rem', fontSize: '0.88rem', color: 'var(--danger)' }}
          >
            <AlertCircle size={16} /> {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Full Name */}
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <div style={{ position: 'relative' }}>
              <User size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input type="text" name="name" className="form-input" required placeholder="John Doe"
                value={formData.name} onChange={handleChange} style={{ paddingLeft: '2.75rem' }} />
            </div>
          </div>

          {/* Email */}
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input type="email" name="email" className="form-input" required placeholder="name@example.com"
                value={formData.email} onChange={handleChange} style={{ paddingLeft: '2.75rem' }} />
            </div>
          </div>

          {/* Password */}
          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input type={showPass ? 'text' : 'password'} name="password" className="form-input" required placeholder="Min. 6 characters"
                value={formData.password} onChange={handleChange} style={{ paddingLeft: '2.75rem', paddingRight: '3rem' }} />
              <button type="button" onClick={() => setShowPass(!showPass)}
                style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 }}>
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {strength && (
              <div style={{ marginTop: '0.5rem' }}>
                <div style={{ height: '3px', background: 'var(--dark-5)', borderRadius: '10px', overflow: 'hidden' }}>
                  <motion.div initial={{ width: 0 }} animate={{ width: strength.width }} style={{ height: '100%', background: strength.color, borderRadius: '10px' }} transition={{ duration: 0.4 }} />
                </div>
                <div style={{ fontSize: '0.75rem', color: strength.color, marginTop: '0.3rem', fontWeight: 600 }}>{strength.label} password</div>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <div style={{ position: 'relative' }}>
              {passwordsMatch
                ? <CheckCircle size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--success)' }} />
                : <Lock size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              }
              <input type={showConfirm ? 'text' : 'password'} name="confirmPassword" className="form-input" required placeholder="Re-type password"
                value={formData.confirmPassword} onChange={handleChange}
                style={{ paddingLeft: '2.75rem', paddingRight: '3rem', borderColor: formData.confirmPassword ? (passwordsMatch ? 'var(--success)' : 'var(--danger)') : undefined }} />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 }}>
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <motion.button type="submit" className="btn btn-primary btn-shine"
            style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem', padding: '1rem' }}
            disabled={submitting} whileTap={{ scale: 0.97 }}>
            {submitting
              ? <><div className="spinner spinner-sm" style={{ borderTopColor: 'var(--dark)' }} /> Creating account...</>
              : <><UserPlus size={18} /> Create Account</>
            }
          </motion.button>
        </form>

        <div className="auth-footer" style={{ marginTop: '1.5rem' }}>
          Already have an account? <Link to="/login">Sign In</Link>
        </div>
      </motion.div>
    </div>
  );
}
