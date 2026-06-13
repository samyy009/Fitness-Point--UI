import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Calendar, Plus, Edit2, Trash2, Users, Clock, Tag } from 'lucide-react';

export default function ManageClasses() {
  const [classes, setClasses] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingClass, setEditingClass] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    trainer_id: '',
    category: 'Strength',
    schedule: '',
    capacity: '20'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [clsRes, trRes] = await Promise.all([
        api.get('/classes'),
        api.get('/trainers')
      ]);
      setClasses(clsRes.data);
      setTrainers(trRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (c) => {
    setEditingClass(c);
    setFormData({
      title: c.title,
      description: c.description || '',
      trainer_id: c.trainer_id || '',
      category: c.category || 'Strength',
      schedule: c.schedule || '',
      capacity: c.capacity || '20'
    });
  };

  const handleCancelEdit = () => {
    setEditingClass(null);
    setFormData({ title: '', description: '', trainer_id: '', category: 'Strength', schedule: '', capacity: '20' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        trainer_id: formData.trainer_id ? Number(formData.trainer_id) : null,
        capacity: Number(formData.capacity) || 20
      };

      if (editingClass) {
        await api.put(`/admin/classes/${editingClass.id}`, payload);
        setEditingClass(null);
      } else {
        await api.post('/admin/classes', payload);
      }
      setFormData({ title: '', description: '', trainer_id: '', category: 'Strength', schedule: '', capacity: '20' });
      fetchData();
    } catch (err) {
      console.error(err);
      alert('Failed to save class.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Deactivate this gym class?')) return;
    try {
      await api.delete(`/admin/classes/${id}`);
      fetchData();
    } catch (err) {
      console.error(err);
      alert('Failed to deactivate class.');
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
          {editingClass ? <Edit2 size={20} color="var(--primary)" /> : <Plus size={20} color="var(--primary)" />}
          {editingClass ? 'Edit Class Details' : 'Create Gym Class'}
        </h3>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Class Title</label>
            <input 
              type="text" 
              className="form-input" 
              value={formData.title} 
              onChange={(e) => setFormData({ ...formData, title: e.target.value })} 
              required 
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea 
              className="form-textarea" 
              value={formData.description} 
              onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select 
                className="form-select" 
                value={formData.category} 
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="Strength">Strength</option>
                <option value="Cardio">Cardio</option>
                <option value="HIIT">HIIT</option>
                <option value="Yoga">Yoga</option>
                <option value="Flexibility">Flexibility</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Trainer / Coach</label>
              <select 
                className="form-select" 
                value={formData.trainer_id} 
                onChange={(e) => setFormData({ ...formData, trainer_id: e.target.value })}
                required
              >
                <option value="">Select Coach</option>
                {trainers.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Schedule</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="e.g. Mon, Wed @ 10:00 AM"
                value={formData.schedule} 
                onChange={(e) => setFormData({ ...formData, schedule: e.target.value })} 
                required 
              />
            </div>

            <div className="form-group">
              <label className="form-label">Capacity</label>
              <input 
                type="number" 
                className="form-input" 
                value={formData.capacity} 
                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })} 
                required 
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem' }}>
            <button type="submit" className="btn btn-primary btn-shine" style={{ flex: 1, justifyContent: 'center' }}>
              {editingClass ? 'Update Class' : 'Create Class'}
            </button>
            {editingClass && (
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
          <Calendar size={20} color="var(--primary)" /> Active Classes
        </h3>

        {loading ? (
          <LoadingSpinner />
        ) : classes.length === 0 ? (
          <div className="empty-state">
            <p>No gym classes configured yet.</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Class</th>
                  <th>Category</th>
                  <th>Coach</th>
                  <th>Schedule</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {classes.map(cls => (
                  <tr key={cls.id}>
                    <td><strong>{cls.title}</strong></td>
                    <td><span className="badge badge-primary">{cls.category}</span></td>
                    <td>{cls.trainer?.name || 'TBA'}</td>
                    <td>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.82rem', color: 'var(--text-light)' }}>
                        <Clock size={12} color="var(--primary)" /> {cls.schedule}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.35rem' }}>
                        <button className="btn btn-dark btn-sm" onClick={() => handleEditClick(cls)} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                          <Edit2 size={12} /> Edit
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(cls.id)} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
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
