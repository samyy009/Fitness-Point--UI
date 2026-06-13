import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Award, Plus, Edit2, Trash2, X, Star, BookOpen, Image, UserPlus } from 'lucide-react';

export default function ManageTrainers() {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingTrainer, setEditingTrainer] = useState(null);

  // Form states
  const [formData, setFormData] = useState({ name: '', specialty: '', bio: '', avatar: '', rating: '5.0' });

  useEffect(() => {
    fetchTrainers();
  }, []);

  const fetchTrainers = async () => {
    try {
      const res = await api.get('/trainers');
      setTrainers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (t) => {
    setEditingTrainer(t);
    setFormData({ name: t.name, specialty: t.specialty, bio: t.bio || '', avatar: t.avatar || '', rating: t.rating || '5.0' });
  };

  const handleCancelEdit = () => {
    setEditingTrainer(null);
    setFormData({ name: '', specialty: '', bio: '', avatar: '', rating: '5.0' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTrainer) {
        await api.put(`/admin/trainers/${editingTrainer.id}`, formData);
        setEditingTrainer(null);
      } else {
        await api.post('/admin/trainers', formData);
      }
      setFormData({ name: '', specialty: '', bio: '', avatar: '', rating: '5.0' });
      fetchTrainers();
    } catch (err) {
      console.error(err);
      alert('Failed to save trainer.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to deactivate this trainer?')) return;
    try {
      await api.delete(`/admin/trainers/${id}`);
      fetchTrainers();
    } catch (err) {
      console.error(err);
      alert('Failed to deactivate trainer.');
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
          {editingTrainer ? <Edit2 size={20} color="var(--primary)" /> : <UserPlus size={20} color="var(--primary)" />}
          {editingTrainer ? 'Edit Trainer Profile' : 'Add New Trainer'}
        </h3>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input 
              type="text" 
              className="form-input" 
              value={formData.name} 
              onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
              required 
            />
          </div>

          <div className="form-group">
            <label className="form-label">Specialty / Role</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="e.g. Strength Coach, Cardio Mentor"
              value={formData.specialty} 
              onChange={(e) => setFormData({ ...formData, specialty: e.target.value })} 
              required 
            />
          </div>

          <div className="form-group">
            <label className="form-label">Biography</label>
            <textarea 
              className="form-textarea" 
              placeholder="Describe experience and certifications..."
              value={formData.bio} 
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })} 
            />
          </div>

          <div className="form-group">
            <label className="form-label">Avatar Image URL (Optional)</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="/assets/mentor-1.jpg"
              value={formData.avatar} 
              onChange={(e) => setFormData({ ...formData, avatar: e.target.value })} 
            />
          </div>

          <div className="form-group">
            <label className="form-label">Rating</label>
            <input 
              type="number" 
              step="0.1" 
              min="1" 
              max="5"
              className="form-input" 
              value={formData.rating} 
              onChange={(e) => setFormData({ ...formData, rating: e.target.value })} 
              required 
            />
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem' }}>
            <button type="submit" className="btn btn-primary btn-shine" style={{ flex: 1, justifyContent: 'center' }}>
              {editingTrainer ? 'Update Info' : 'Create Coach'}
            </button>
            {editingTrainer && (
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
          <Award size={20} color="var(--primary)" /> Active Trainers
        </h3>

        {loading ? (
          <LoadingSpinner />
        ) : trainers.length === 0 ? (
          <div className="empty-state">
            <p>No trainers added to the database yet.</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Coach</th>
                  <th>Specialty</th>
                  <th>Rating</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {trainers.map(t => (
                  <tr key={t.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--grad-2)', overflow: 'hidden', flexShrink: 0 }}>
                          {t.avatar ? <img src={t.avatar} alt={t.name} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', background: 'var(--dark-4)', fontSize: '1rem', fontWeight: 'bold' }}>{t.name.charAt(0).toUpperCase()}</div>}
                        </div>
                        <strong>{t.name}</strong>
                      </div>
                    </td>
                    <td>{t.specialty}</td>
                    <td>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem', fontWeight: 600, color: 'var(--warning)' }}>
                        <Star size={14} fill="var(--warning)" /> {t.rating || '5.0'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.35rem' }}>
                        <button className="btn btn-dark btn-sm" onClick={() => handleEditClick(t)} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                          <Edit2 size={12} /> Edit
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(t.id)} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
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
