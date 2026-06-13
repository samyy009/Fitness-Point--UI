import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import { User, Phone, Calendar, Target, Award, ShieldCheck, Trash2, Heart, Activity } from 'lucide-react';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    date_of_birth: '',
    gender: '',
    height_cm: '',
    weight_kg: '',
    fitness_goal: ''
  });
  const [memberships, setMemberships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        date_of_birth: user.date_of_birth ? user.date_of_birth.split('T')[0] : '',
        gender: user.gender || '',
        height_cm: user.height_cm || '',
        weight_kg: user.weight_kg || '',
        fitness_goal: user.fitness_goal || ''
      });
    }

    const fetchMembership = async () => {
      try {
        const res = await api.get('/memberships/me');
        setMemberships(res.data);
      } catch (err) {
        console.error('Error fetching memberships:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMembership();
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);

    try {
      const payload = {
        ...formData,
        height_cm: formData.height_cm ? Number(formData.height_cm) : null,
        weight_kg: formData.weight_kg ? Number(formData.weight_kg) : null
      };
      const res = await api.put('/users/me', payload);
      updateUser(res.data);
      setFeedback({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err) {
      console.error(err);
      setFeedback({ type: 'danger', text: err.response?.data?.message || 'Failed to update profile.' });
    } finally {
      setSaving(false);
    }
  };

  const handleCancelMembership = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this membership plan?')) return;
    try {
      await api.put(`/memberships/${id}/cancel`);
      const res = await api.get('/memberships/me');
      setMemberships(res.data);
      alert('Membership cancelled successfully.');
    } catch (err) {
      console.error(err);
      alert('Failed to cancel membership.');
    }
  };

  if (loading) return <LoadingSpinner />;

  const activeMembership = memberships.find(m => m.status === 'active');

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.4 }}
      style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}
    >
      {/* Left Column: Form */}
      <div className="card-glass" style={{ padding: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: 40, height: 40, borderRadius: '10px', background: 'rgba(0,229,255,0.1)', border: '1px solid rgba(0,229,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <User size={20} color="var(--primary)" />
          </div>
          Personal Details
        </h2>
        
        {feedback && (
          <div className={`badge badge-${feedback.type}`} style={{ display: 'block', padding: '0.75rem', marginBottom: '1.25rem', borderRadius: 'var(--radius)', width: '100%', textTransform: 'none', letterSpacing: 'normal', fontWeight: 600 }}>
            {feedback.type === 'success' ? '✅ ' : '⚠️ '}{feedback.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input 
                type="text" 
                name="name" 
                className="form-input" 
                value={formData.name} 
                onChange={handleChange} 
                required 
              />
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input 
                type="text" 
                name="phone" 
                className="form-input" 
                value={formData.phone} 
                onChange={handleChange} 
                placeholder="+91 99999 88888"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Date of Birth</label>
              <input 
                type="date" 
                name="date_of_birth" 
                className="form-input" 
                value={formData.date_of_birth} 
                onChange={handleChange} 
              />
            </div>

            <div className="form-group">
              <label className="form-label">Gender</label>
              <select name="gender" className="form-select" value={formData.gender} onChange={handleChange}>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Height (cm)</label>
              <input 
                type="number" 
                name="height_cm" 
                className="form-input" 
                placeholder="175"
                value={formData.height_cm} 
                onChange={handleChange} 
              />
            </div>

            <div className="form-group">
              <label className="form-label">Weight (kg)</label>
              <input 
                type="number" 
                name="weight_kg" 
                className="form-input" 
                placeholder="70"
                value={formData.weight_kg} 
                onChange={handleChange} 
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Fitness Goal</label>
            <select name="fitness_goal" className="form-select" value={formData.fitness_goal} onChange={handleChange}>
              <option value="">Select Goal</option>
              <option value="Lose Weight">Lose Weight</option>
              <option value="Gain Muscle">Gain Muscle</option>
              <option value="Stay Fit">Stay Fit</option>
              <option value="Build Strength">Build Strength</option>
            </select>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary btn-shine" 
            style={{ width: '100%', justifyContent: 'center', marginTop: '1rem', padding: '1rem' }}
            disabled={saving}
          >
            {saving ? 'Saving Changes...' : 'Save Profile'}
          </button>
        </form>
      </div>

      {/* Right Column: Membership Info & Metadata */}
      <div style={{ display: 'grid', gap: '2rem', height: 'fit-content' }}>
        <div className="card-glass" style={{ padding: '2.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Award size={22} color="var(--primary)" /> Active Membership
          </h2>
          
          {activeMembership ? (
            <div style={{ display: 'grid', gap: '1.25rem' }}>
              <div style={{ padding: '1.25rem', background: 'rgba(0,229,255,0.03)', border: '1px solid rgba(0,229,255,0.15)', borderRadius: 'var(--radius-lg)' }}>
                <h3 style={{ color: 'var(--primary)', fontWeight: '800', fontSize: '1.2rem' }}>
                  {activeMembership.MembershipPlan?.name || 'Standard Gym Plan'}
                </h3>
                <div style={{ marginTop: '1rem', display: 'grid', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-light)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Billing Cycle:</span> <strong>{activeMembership.MembershipPlan?.duration_days} days</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Started:</span> <strong>{new Date(activeMembership.start_date).toLocaleDateString()}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Expires:</span> <strong>{new Date(activeMembership.end_date).toLocaleDateString()}</strong>
                  </div>
                </div>
              </div>

              <button 
                className="btn btn-danger" 
                style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem', padding: '0.9rem' }}
                onClick={() => handleCancelMembership(activeMembership.id)}
              >
                Cancel Membership Subscription
              </button>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>You do not have any active gym membership plan.</p>
              <Link to="/plans" className="btn btn-primary btn-shine btn-sm">Explore Plans</Link>
            </div>
          )}
        </div>

        {/* Account Details Readonly */}
        <div className="card" style={{ background: 'var(--dark-3)', border: '1px solid rgba(255,255,255,0.04)', padding: '2rem' }}>
          <h3 style={{ fontWeight: '800', marginBottom: '1.25rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Activity size={18} color="var(--accent-2)" /> Account Metadata
          </h3>
          <div style={{ display: 'grid', gap: '0.75rem', fontSize: '0.88rem', color: 'var(--text-light)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Email:</span> <strong>{user?.email}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Account Role:</span> <strong className="badge badge-accent" style={{ fontSize: '0.65rem', padding: '0.15rem 0.5rem' }}>{user?.role}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Joined:</span> <strong>{new Date(user?.createdAt || user?.created_at).toLocaleDateString()}</strong>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
