import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Apple, Calendar, Plus, Trash2, X, AlertCircle } from 'lucide-react';

export default function Meals() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Form states
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [mealItems, setMealItems] = useState([{ name: '', calories: '', carbs: '', protein: '', fat: '' }]);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await api.get('/meals');
      setLogs(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch meal logs.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = () => {
    setMealItems([...mealItems, { name: '', calories: '', carbs: '', protein: '', fat: '' }]);
  };

  const handleRemoveItem = (index) => {
    const updated = mealItems.filter((_, idx) => idx !== index);
    setMealItems(updated);
  };

  const handleItemChange = (index, field, value) => {
    const updated = [...mealItems];
    updated[index][field] = value;
    setMealItems(updated);
  };

  const calculatedTotalCalories = mealItems.reduce((sum, item) => sum + (Number(item.calories) || 0), 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const cleanMeals = mealItems.filter(item => item.name.trim() !== '');
    if (cleanMeals.length === 0) {
      setError('Please add at least one meal item name.');
      setSubmitting(false);
      return;
    }

    try {
      const payload = {
        date,
        total_calories: calculatedTotalCalories,
        meals: cleanMeals
      };
      await api.post('/meals', payload);
      setMealItems([{ name: '', calories: '', carbs: '', protein: '', fat: '' }]);
      setDate(new Date().toISOString().split('T')[0]);
      fetchLogs();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to save meal log.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this log?')) return;
    try {
      await api.delete(`/meals/${id}`);
      fetchLogs();
    } catch (err) {
      console.error(err);
      alert('Failed to delete meal log.');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.4 }}
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
        {/* Left: Form */}
        <div className="card-glass" style={{ padding: '2.5rem', height: 'fit-content' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: 40, height: 40, borderRadius: '10px', background: 'rgba(0,229,255,0.1)', border: '1px solid rgba(0,229,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Apple size={20} color="var(--primary)" />
            </div>
            Log A Meal
          </h2>

          {error && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,56,96,0.1)', border: '1px solid rgba(255,56,96,0.2)', padding: '0.75rem 1rem', marginBottom: '1.25rem', borderRadius: 'var(--radius)', color: 'var(--danger)', fontSize: '0.9rem' }}>
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: '1rem', alignItems: 'flex-end' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Date</label>
                <input 
                  type="date" 
                  className="form-input" 
                  value={date} 
                  onChange={(e) => setDate(e.target.value)} 
                  required 
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Total Calories</label>
                <input 
                  type="text" 
                  className="form-input" 
                  style={{ background: 'var(--dark-4)', fontWeight: 'bold', textAlign: 'center', border: '1px solid rgba(0,229,255,0.15)', color: 'var(--primary)' }} 
                  value={`${calculatedTotalCalories} kcal`} 
                  readOnly 
                />
              </div>
            </div>

            <div style={{ margin: '1.75rem 0 1rem' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: '800', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-light)' }}>
                <span>Food & Drink Items</span>
                <button type="button" className="btn btn-outline btn-sm" onClick={handleAddItem} style={{ padding: '0.35rem 0.85rem' }}>
                  <Plus size={14} /> Add Food
                </button>
              </h3>

              <div style={{ display: 'grid', gap: '0.85rem' }}>
                <AnimatePresence>
                  {mealItems.map((item, idx) => (
                    <motion.div 
                      key={idx} 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr 1fr 1fr 1fr auto', gap: '0.4rem', alignItems: 'center', background: 'var(--dark-3)', padding: '0.75rem', border: '1px solid rgba(255,255,255,0.04)', borderRadius: 'var(--radius)' }}
                    >
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="Chicken & Rice" 
                        value={item.name} 
                        onChange={(e) => handleItemChange(idx, 'name', e.target.value)} 
                        required 
                        style={{ padding: '0.6rem 0.85rem', fontSize: '0.85rem' }}
                      />
                      <input 
                        type="number" 
                        className="form-input" 
                        placeholder="kcal" 
                        value={item.calories} 
                        onChange={(e) => handleItemChange(idx, 'calories', e.target.value)} 
                        required 
                        style={{ padding: '0.6rem 0.5rem', fontSize: '0.85rem', textAlign: 'center' }}
                      />
                      <input 
                        type="number" 
                        className="form-input" 
                        placeholder="Carbs (g)" 
                        value={item.carbs} 
                        onChange={(e) => handleItemChange(idx, 'carbs', e.target.value)} 
                        style={{ padding: '0.6rem 0.5rem', fontSize: '0.85rem', textAlign: 'center' }}
                      />
                      <input 
                        type="number" 
                        className="form-input" 
                        placeholder="Prot (g)" 
                        value={item.protein} 
                        onChange={(e) => handleItemChange(idx, 'protein', e.target.value)} 
                        style={{ padding: '0.6rem 0.5rem', fontSize: '0.85rem', textAlign: 'center' }}
                      />
                      <input 
                        type="number" 
                        className="form-input" 
                        placeholder="Fat (g)" 
                        value={item.fat} 
                        onChange={(e) => handleItemChange(idx, 'fat', e.target.value)} 
                        style={{ padding: '0.6rem 0.5rem', fontSize: '0.85rem', textAlign: 'center' }}
                      />
                      {mealItems.length > 1 && (
                        <button 
                          type="button" 
                          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} 
                          onClick={() => handleRemoveItem(idx)}
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
              {submitting ? 'Saving...' : 'Save Meal Log'}
            </button>
          </form>
        </div>

        {/* Right: History */}
        <div style={{ display: 'grid', gap: '1.5rem', height: 'fit-content' }}>
          <div className="card-glass" style={{ padding: '2.5rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '1.5rem' }}>Meal Log History</h2>
            {loading ? (
              <LoadingSpinner />
            ) : logs.length === 0 ? (
              <div className="empty-state">
                <p>No meals logged yet. Log your breakfast, lunch, or dinner to monitor nutrition!</p>
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
                          <div style={{ fontSize: '0.82rem', color: 'var(--success)', marginTop: '0.35rem', fontWeight: 'bold' }}>
                            🟢 Total Calories: {log.total_calories} kcal
                          </div>
                        </div>
                        <button 
                          style={{ background: 'rgba(255,56,96,0.1)', border: '1px solid rgba(255,56,96,0.2)', color: 'var(--danger)', cursor: 'pointer', fontSize: '0.75rem', padding: '0.25rem 0.6rem', borderRadius: '6px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                          onClick={() => handleDelete(log.id)}
                        >
                          <Trash2 size={12} /> Delete
                        </button>
                      </div>

                      <div style={{ display: 'grid', gap: '0.5rem' }}>
                        {Array.isArray(log.meals) && log.meals.map((item, itemIdx) => (
                          <div key={itemIdx} style={{ fontSize: '0.85rem', color: 'var(--text-light)', display: 'grid', gridTemplateColumns: '2fr 1fr 1.5fr', gap: '0.5rem', alignItems: 'center' }}>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontWeight: 600 }}>
                              <span style={{ width: 4, height: 4, background: 'var(--success)', borderRadius: '50%' }} /> {item.name}
                            </span>
                            <span style={{ color: 'var(--text-muted)' }}>{item.calories} kcal</span>
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem', textAlign: 'right' }}>
                              {item.carbs && `C:${item.carbs}g`} {item.protein && `P:${item.protein}g`} {item.fat && `F:${item.fat}g`}
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
