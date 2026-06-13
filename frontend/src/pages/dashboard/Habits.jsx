import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import { CheckSquare, Trash2, Plus, Flame, Award, AlertCircle, CheckCircle } from 'lucide-react';

export default function Habits() {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newHabitName, setNewHabitName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchHabits();
  }, []);

  const fetchHabits = async () => {
    try {
      const res = await api.get('/habits');
      setHabits(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch habits list.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateHabit = async (e) => {
    e.preventDefault();
    if (!newHabitName.trim()) return;
    setSubmitting(true);
    setError(null);

    try {
      await api.post('/habits', { habit_name: newHabitName });
      setNewHabitName('');
      fetchHabits();
    } catch (err) {
      console.error(err);
      setError('Failed to create new habit.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggle = async (id) => {
    try {
      setHabits(habits.map(h => h.id === id ? { ...h, completed: !h.completed } : h));
      await api.put(`/habits/${id}/toggle`);
    } catch (err) {
      console.error(err);
      fetchHabits();
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this habit permanently?')) return;
    try {
      await api.delete(`/habits/${id}`);
      fetchHabits();
    } catch (err) {
      console.error(err);
      alert('Failed to delete habit.');
    }
  };

  const completedCount = habits.filter(h => h.completed).length;
  const totalCount = habits.length;
  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.4 }}
      style={{ maxWidth: '650px', margin: '0 auto' }}
    >
      <div className="card-glass" style={{ padding: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: 40, height: 40, borderRadius: '10px', background: 'rgba(0,229,255,0.1)', border: '1px solid rgba(0,229,255,0.2)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckSquare size={20} color="var(--primary)" />
          </div>
          Daily Habit Tracker
        </h2>

        {/* Completion percentage bar */}
        {totalCount > 0 && (
          <div style={{ marginBottom: '2rem', padding: '1rem', background: 'var(--dark-3)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: 600 }}>
              <span style={{ color: 'var(--text-light)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Award size={15} color="var(--primary)" /> Today's Progress
              </span>
              <span style={{ color: 'var(--primary)' }}>{percentage}% ({completedCount}/{totalCount})</span>
            </div>
            <div style={{ height: '6px', background: 'var(--dark-4)', borderRadius: '10px', overflow: 'hidden' }}>
              <motion.div 
                initial={{ width: 0 }} 
                animate={{ width: `${percentage}%` }} 
                style={{ height: '100%', background: 'var(--grad-2)', borderRadius: '10px' }} 
                transition={{ duration: 0.5 }} 
              />
            </div>
          </div>
        )}

        {error && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,56,96,0.1)', border: '1px solid rgba(255,56,96,0.2)', padding: '0.75rem 1rem', marginBottom: '1.25rem', borderRadius: 'var(--radius)', color: 'var(--danger)', fontSize: '0.9rem' }}>
            <AlertCircle size={16} /> {error}
          </div>
        )}

        {/* Add Habit Form */}
        <form onSubmit={handleCreateHabit} style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem' }}>
          <input 
            type="text" 
            className="form-input" 
            placeholder="Add habit (e.g. Drink 3L Water, 8h Sleep...)" 
            value={newHabitName}
            onChange={(e) => setNewHabitName(e.target.value)}
            required
            disabled={submitting}
          />
          <button type="submit" className="btn btn-primary btn-shine" disabled={submitting} style={{ gap: '0.35rem' }}>
            <Plus size={16} /> Add
          </button>
        </form>

        {/* Habit List */}
        {loading ? (
          <LoadingSpinner />
        ) : habits.length === 0 ? (
          <div className="empty-state">
            <p>No habits tracked yet. Create one above to start building your streak!</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            <AnimatePresence mode="popLayout">
              {habits.map(h => (
                <motion.div 
                  key={h.id} 
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="card" 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between', 
                    padding: '1rem 1.25rem', 
                    background: h.completed ? 'rgba(0,229,255,0.03)' : 'var(--dark-3)',
                    borderColor: h.completed ? 'rgba(0,229,255,0.2)' : 'rgba(255,255,255,0.07)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }} onClick={() => handleToggle(h.id)}>
                    <div 
                      style={{ 
                        width: '24px', 
                        height: '24px', 
                        borderRadius: '6px', 
                        border: '2px solid var(--primary)', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        background: h.completed ? 'var(--primary)' : 'transparent',
                        color: 'var(--dark)',
                        transition: 'all 0.2s',
                        userSelect: 'none'
                      }}
                    >
                      {h.completed && <CheckCircle size={14} color="var(--dark)" strokeWidth={3} />}
                    </div>
                    <span style={{ 
                      fontSize: '0.95rem', 
                      fontWeight: '600', 
                      textDecoration: h.completed ? 'line-through' : 'none',
                      color: h.completed ? 'var(--text-muted)' : 'var(--white)',
                      transition: 'all 0.2s'
                    }}>
                      {h.habit_name}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    {h.streak > 0 && (
                      <span className="badge badge-accent" style={{ fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                        <Flame size={12} fill="var(--accent-2)" /> {h.streak} day streak
                      </span>
                    )}
                    <button 
                      style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', transition: 'color 0.2s' }}
                      onClick={() => handleDelete(h.id)}
                      onMouseEnter={(e) => e.target.style.color = 'var(--danger)'}
                      onMouseLeave={(e) => e.target.style.color = 'var(--text-muted)'}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.div>
  );
}
