import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Dumbbell, Calendar, Flame, Plus, Trash2, Clock, X, AlertCircle } from 'lucide-react';

export default function Workouts() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // New log form state
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [duration, setDuration] = useState('');
  const [calories, setCalories] = useState('');
  const [exercises, setExercises] = useState([{ name: '', sets: '', reps: '', weight: '' }]);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await api.get('/workouts');
      setLogs(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch workout logs.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddExercise = () => {
    setExercises([...exercises, { name: '', sets: '', reps: '', weight: '' }]);
  };

  const handleRemoveExercise = (index) => {
    const updated = exercises.filter((_, idx) => idx !== index);
    setExercises(updated);
  };

  const handleExerciseChange = (index, field, value) => {
    const updated = [...exercises];
    updated[index][field] = value;
    setExercises(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const cleanExercises = exercises.filter(ex => ex.name.trim() !== '');
    if (cleanExercises.length === 0) {
      setError('Please add at least one exercise name.');
      setSubmitting(false);
      return;
    }

    try {
      const payload = {
        date,
        duration: Number(duration) || 0,
        calories: Number(calories) || 0,
        exercises: cleanExercises
      };
      await api.post('/workouts', payload);
      setDuration('');
      setCalories('');
      setExercises([{ name: '', sets: '', reps: '', weight: '' }]);
      setDate(new Date().toISOString().split('T')[0]);
      fetchLogs();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to save workout log.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this log?')) return;
    try {
      await api.delete(`/workouts/${id}`);
      fetchLogs();
    } catch (err) {
      console.error(err);
      alert('Failed to delete workout log.');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.4 }}
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
        {/* Left: Log new session */}
        <div className="card-glass" style={{ padding: '2.5rem', height: 'fit-content' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: 40, height: 40, borderRadius: '10px', background: 'rgba(0,229,255,0.1)', border: '1px solid rgba(0,229,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Dumbbell size={20} color="var(--primary)" />
            </div>
            Log A Workout
          </h2>

          {error && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,56,96,0.1)', border: '1px solid rgba(255,56,96,0.2)', padding: '0.75rem 1rem', marginBottom: '1.25rem', borderRadius: 'var(--radius)', color: 'var(--danger)', fontSize: '0.9rem' }}>
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Date</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type="date" 
                    className="form-input" 
                    value={date} 
                    onChange={(e) => setDate(e.target.value)} 
                    required 
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Duration (minutes)</label>
                <input 
                  type="number" 
                  className="form-input" 
                  placeholder="e.g. 45" 
                  value={duration} 
                  onChange={(e) => setDuration(e.target.value)} 
                  required 
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Calories Burned (kcal)</label>
              <input 
                type="number" 
                className="form-input" 
                placeholder="e.g. 350" 
                value={calories} 
                onChange={(e) => setCalories(e.target.value)} 
                required 
              />
            </div>

            <div style={{ margin: '1.75rem 0 1rem' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: '800', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-light)' }}>
                <span>Exercises</span>
                <button type="button" className="btn btn-outline btn-sm" onClick={handleAddExercise} style={{ padding: '0.35rem 0.85rem' }}>
                  <Plus size={14} /> Add
                </button>
              </h3>

              <div style={{ display: 'grid', gap: '0.85rem' }}>
                <AnimatePresence>
                  {exercises.map((ex, idx) => (
                    <motion.div 
                      key={idx} 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr auto', gap: '0.4rem', alignItems: 'center', background: 'var(--dark-3)', padding: '0.75rem', border: '1px solid rgba(255,255,255,0.04)', borderRadius: 'var(--radius)' }}
                    >
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="Bench Press" 
                        value={ex.name} 
                        onChange={(e) => handleExerciseChange(idx, 'name', e.target.value)} 
                        required 
                        style={{ padding: '0.6rem 0.85rem', fontSize: '0.85rem' }}
                      />
                      <input 
                        type="number" 
                        className="form-input" 
                        placeholder="Sets" 
                        value={ex.sets} 
                        onChange={(e) => handleExerciseChange(idx, 'sets', e.target.value)} 
                        style={{ padding: '0.6rem 0.5rem', fontSize: '0.85rem', textAlign: 'center' }}
                      />
                      <input 
                        type="number" 
                        className="form-input" 
                        placeholder="Reps" 
                        value={ex.reps} 
                        onChange={(e) => handleExerciseChange(idx, 'reps', e.target.value)} 
                        style={{ padding: '0.6rem 0.5rem', fontSize: '0.85rem', textAlign: 'center' }}
                      />
                      <input 
                        type="number" 
                        className="form-input" 
                        placeholder="kg" 
                        value={ex.weight} 
                        onChange={(e) => handleExerciseChange(idx, 'weight', e.target.value)} 
                        style={{ padding: '0.6rem 0.5rem', fontSize: '0.85rem', textAlign: 'center' }}
                      />
                      {exercises.length > 1 && (
                        <button 
                          type="button" 
                          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} 
                          onClick={() => handleRemoveExercise(idx)}
                          onMouseEnter={(e) => e.currentTarget.style.color = 'var(--danger)'}
                          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                        >
                          <X size={16} />
                        </button>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary btn-shine" 
              style={{ width: '100%', justifyContent: 'center', marginTop: '1rem', padding: '1rem' }}
              disabled={submitting}
            >
              {submitting ? 'Saving...' : 'Save Workout'}
            </button>
          </form>
        </div>

        {/* Right: History */}
        <div style={{ display: 'grid', gap: '1.5rem', height: 'fit-content' }}>
          <div className="card-glass" style={{ padding: '2.5rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '1.5rem' }}>Workout History</h2>
            {loading ? (
              <LoadingSpinner />
            ) : logs.length === 0 ? (
              <div className="empty-state">
                <p>No workout sessions logged yet. Log your first session to track progress!</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '1rem', maxHeight: '70vh', overflowY: 'auto', paddingRight: '0.25rem' }}>
                <AnimatePresence>
                  {logs.map(log => (
                    <motion.div 
                      key={log.id} 
                      className="card" 
                      style={{ background: 'var(--dark-3)', border: '1px solid rgba(255,255,255,0.04)' }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0.75rem', marginBottom: '0.75rem' }}>
                        <div>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <Calendar size={12} /> {new Date(log.date).toLocaleDateString()}
                          </span>
                          <div style={{ fontSize: '0.82rem', color: 'var(--text-light)', marginTop: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.15rem' }}><Clock size={12} color="var(--primary)" /> {log.duration}m</span>
                            <span style={{ color: 'rgba(255,255,255,0.15)' }}>|</span>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.15rem', color: 'var(--danger)' }}><Flame size={12} /> {log.calories} kcal</span>
                          </div>
                        </div>
                        <button 
                          style={{ background: 'rgba(255,56,96,0.1)', border: '1px solid rgba(255,56,96,0.2)', color: 'var(--danger)', cursor: 'pointer', fontSize: '0.75rem', padding: '0.25rem 0.6rem', borderRadius: '6px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                          onClick={() => handleDelete(log.id)}
                        >
                          <Trash2 size={12} /> Delete
                        </button>
                      </div>

                      <div style={{ display: 'grid', gap: '0.4rem' }}>
                        {Array.isArray(log.exercises) && log.exercises.map((ex, exIdx) => (
                          <div key={exIdx} style={{ fontSize: '0.85rem', color: 'var(--text-light)', display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontWeight: 600 }}>
                              <span style={{ width: 4, height: 4, background: 'var(--primary)', borderRadius: '50%' }} /> {ex.name}
                            </span>
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                              {ex.sets && `${ex.sets}s`} {ex.reps && `x ${ex.reps}r`} {ex.weight && `@ ${ex.weight}kg`}
                            </span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
