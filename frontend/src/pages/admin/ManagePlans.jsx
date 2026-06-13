import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import { CreditCard, Plus, Edit2, Trash2, Tag, ListPlus } from 'lucide-react';

export default function ManagePlans() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPlan, setEditingPlan] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    duration_days: '30',
    featuresInput: '',
    description: ''
  });

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const res = await api.get('/plans');
      setPlans(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (p) => {
    setEditingPlan(p);
    const parsedFeatures = Array.isArray(p.features) 
      ? p.features.join(', ') 
      : typeof p.features === 'string'
        ? (() => { try { return JSON.parse(p.features).join(', '); } catch { return p.features; } })()
        : '';
    setFormData({
      name: p.name,
      price: p.price,
      duration_days: String(p.duration_days),
      featuresInput: parsedFeatures,
      description: p.description || ''
    });
  };

  const handleCancelEdit = () => {
    setEditingPlan(null);
    setFormData({ name: '', price: '', duration_days: '30', featuresInput: '', description: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const cleanFeatures = formData.featuresInput.split(',').map(f => f.trim()).filter(f => f !== '');
      const payload = {
        name: formData.name,
        price: Number(formData.price),
        duration_days: Number(formData.duration_days),
        features: cleanFeatures,
        description: formData.description
      };

      if (editingPlan) {
        await api.put(`/admin/plans/${editingPlan.id}`, payload);
        setEditingPlan(null);
      } else {
        await api.post('/admin/plans', payload);
      }
      setFormData({ name: '', price: '', duration_days: '30', featuresInput: '', description: '' });
      fetchPlans();
    } catch (err) {
      console.error(err);
      alert('Failed to save membership plan.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Deactivate this membership plan?')) return;
    try {
      await api.delete(`/admin/plans/${id}`);
      fetchPlans();
    } catch (err) {
      console.error(err);
      alert('Failed to deactivate plan.');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.4 }}
      style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}
    >
      {/* Form */}
      <div className="card-glass" style={{ padding: '2.5rem', height: 'fit-content' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {editingPlan ? <Edit2 size={20} color="var(--primary)" /> : <Plus size={20} color="var(--primary)" />}
          {editingPlan ? 'Edit Pricing Plan' : 'Create Pricing Plan'}
        </h3>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Plan Name</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="VIP Gym Pass"
              value={formData.name} 
              onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
              required 
            />
          </div>

          <div className="form-group">
            <label className="form-label">Short Description</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="Who is this plan for?"
              value={formData.description} 
              onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Price ($)</label>
              <input 
                type="number" 
                className="form-input" 
                placeholder="49"
                value={formData.price} 
                onChange={(e) => setFormData({ ...formData, price: e.target.value })} 
                required 
              />
            </div>

            <div className="form-group">
              <label className="form-label">Duration</label>
              <select 
                className="form-select" 
                value={formData.duration_days} 
                onChange={(e) => setFormData({ ...formData, duration_days: e.target.value })}
              >
                <option value="30">30 Days (Monthly)</option>
                <option value="90">90 Days (Quarterly)</option>
                <option value="365">365 Days (Annual)</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Features list (comma-separated)</label>
            <textarea 
              className="form-textarea" 
              placeholder="All Facilities Access, 2 Personal Trainer sessions/mo, Free locker"
              value={formData.featuresInput} 
              onChange={(e) => setFormData({ ...formData, featuresInput: e.target.value })} 
              required
            />
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem' }}>
            <button type="submit" className="btn btn-primary btn-shine" style={{ flex: 1, justifyContent: 'center' }}>
              {editingPlan ? 'Update Plan' : 'Create Plan'}
            </button>
            {editingPlan && (
              <button type="button" className="btn btn-dark" onClick={handleCancelEdit}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* List */}
      <div className="card-glass" style={{ padding: '2.5rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CreditCard size={20} color="var(--primary)" /> Active Membership Plans
        </h3>

        {loading ? (
          <LoadingSpinner />
        ) : plans.length === 0 ? (
          <div className="empty-state">
            <p>No membership plans added to the system yet.</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Plan Name</th>
                  <th>Price</th>
                  <th>Duration</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {plans.map(p => (
                  <tr key={p.id}>
                    <td><strong>{p.name}</strong></td>
                    <td style={{ color: 'var(--primary)', fontWeight: 'bold' }}>${p.price}</td>
                    <td>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.82rem', color: 'var(--text-light)', fontWeight: 600 }}>
                        <Tag size={12} color="var(--primary)" /> {p.duration_days} days
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.35rem' }}>
                        <button className="btn btn-dark btn-sm" onClick={() => handleEditClick(p)} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                          <Edit2 size={12} /> Edit
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p.id)} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                          <Trash2 size={12} /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </motion.div>
  );
}
