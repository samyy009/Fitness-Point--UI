import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import { TrendingUp, Calendar, Trash2, AlertCircle } from 'lucide-react';

export default function Progress() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Form states
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [weight, setWeight] = useState('');
  const [bodyFat, setBodyFat] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await api.get('/progress');
      setLogs(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch progress logs.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const payload = {
        date,
        weight: Number(weight),
        body_fat: bodyFat ? Number(bodyFat) : null,
        notes
      };
      await api.post('/progress', payload);
      setWeight('');
      setBodyFat('');
      setNotes('');
      setDate(new Date().toISOString().split('T')[0]);
      fetchLogs();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to save progress log.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this log?')) return;
    try {
      await api.delete(`/progress/${id}`);
      fetchLogs();
    } catch (err) {
      console.error(err);
      alert('Failed to delete log.');
    }
  };

  // Calculate stats
  const initialWeight = logs.length > 0 ? logs[0].weight : null;
  const currentWeight = logs.length > 0 ? logs[logs.length - 1].weight : null;
  const weightChange = initialWeight !== null && currentWeight !== null 
    ? (currentWeight - initialWeight).toFixed(1) 
    : 0;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.4 }}
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
        {/* Left Form */}
        <div className="card-glass" style={{ padding: '2.5rem', height: 'fit-content' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: 40, height: 40, borderRadius: '10px', background: 'rgba(0,229,255,0.1)', border: '1px solid rgba(0,229,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TrendingUp size={20} color="var(--primary)" />
            </div>
            Log Body Metrics
          </h2>

          {error && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,56,96,0.1)', border: '1px solid rgba(255,56,96,0.2)', padding: '0.75rem 1rem', marginBottom: '1.25rem', borderRadius: 'var(--radius)', color: 'var(--danger)', fontSize: '0.9rem' }}>
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Log Date</label>
              <input 
                type="date" 
                className="form-input" 
                value={date} 
                onChange={(e) => setDate(e.target.value)} 
                required 
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Weight (kg)</label>
                <input 
                  type="number" 
                  step="0.1" 
                  className="form-input" 
                  placeholder="e.g. 74.5"
                  value={weight} 
                  onChange={(e) => setWeight(e.target.value)} 
                  required 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Body Fat % (Optional)</label>
                <input 
                  type="number" 
                  step="0.1" 
                  className="form-input" 
                  placeholder="e.g. 14.5"
                  value={bodyFat} 
                  onChange={(e) => setBodyFat(e.target.value)} 
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Notes</label>
              <textarea 
                className="form-textarea" 
                placeholder="How do you feel? Muscle soreness? Energy levels?"
                value={notes} 
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary btn-shine" 
              style={{ width: '100%', justifyContent: 'center', marginTop: '1rem', padding: '1rem' }}
              disabled={submitting}
            >
              {submitting ? 'Saving...' : 'Save Log'}
            </button>
          </form>
        </div>

        {/* Right Summary and Table */}
        <div style={{ display: 'grid', gap: '1.5rem', height: 'fit-content' }}>
          {/* Trend Summary */}
          {logs.length > 1 && (
            <div className="card" style={{ background: 'var(--dark-3)', borderLeft: `4px solid ${weightChange <= 0 ? 'var(--success)' : 'var(--warning)'}` }}>
              <h4 style={{ fontWeight: 800, fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <TrendingUp size={16} color={weightChange <= 0 ? 'var(--success)' : 'var(--warning)'} /> Weight Journey Summary
              </h4>
              <p style={{ marginTop: '0.5rem', color: 'var(--text-light)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                You have started at <strong>{initialWeight} kg</strong>. Your latest recorded weight is <strong>{currentWeight} kg</strong>. 
                That's a total change of <strong style={{ color: weightChange <= 0 ? 'var(--success)' : 'var(--warning)' }}>{weightChange > 0 ? `+${weightChange}` : weightChange} kg</strong>.
              </p>
            </div>
          )}

          {/* History table */}
          <div className="card-glass" style={{ padding: '2.5rem' }}>
            <h3 style={{ fontWeight: '800', marginBottom: '1.25rem', fontSize: '1.15rem' }}>Logs History</h3>

            {loading ? (
              <LoadingSpinner />
            ) : logs.length === 0 ? (
              <div className="empty-state">
                <p>No body metrics logged yet. Start tracking to see your progress trends!</p>
              </div>
            ) : (
              <div className="table-wrap" style={{ maxHeight: '60vh' }}>
                <table className="table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Weight</th>
                      <th>Body Fat</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.map(log => (
                      <tr key={log.id}>
                        <td>{new Date(log.date).toLocaleDateString()}</td>
                        <td><strong>{log.weight} kg</strong></td>
                        <td>{log.body_fat ? `${log.body_fat}%` : '—'}</td>
                        <td>
                          <button 
                            style={{ background: 'rgba(255,56,96,0.1)', border: '1px solid rgba(255,56,96,0.2)', color: 'var(--danger)', cursor: 'pointer', fontSize: '0.75rem', padding: '0.25rem 0.5rem', borderRadius: '6px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                            onClick={() => handleDelete(log.id)}
                          >
                            <Trash2 size={12} /> Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
