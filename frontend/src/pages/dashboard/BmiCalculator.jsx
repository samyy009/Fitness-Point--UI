import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scale, Heart, Trash2, History, TrendingDown, HelpCircle } from 'lucide-react';

export default function BmiCalculator() {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('bmi_history');
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  const calculateBmi = (e) => {
    e.preventDefault();
    if (!height || !weight) return;

    const heightVal = parseFloat(height);
    const weightVal = parseFloat(weight);
    if (heightVal <= 0 || weightVal <= 0) return;

    const heightM = heightVal / 100;
    const weightKg = weightVal;
    const bmiVal = parseFloat((weightKg / (heightM * heightM)).toFixed(1));

    let category = '';
    let color = '';
    let recommendation = '';

    if (bmiVal < 18.5) {
      category = 'Underweight';
      color = 'var(--info)';
      recommendation = 'Focus on a nutrient-dense, calorie-surplus diet. Work on strength training exercises 3 times a week to build healthy muscle mass.';
    } else if (bmiVal >= 18.5 && bmiVal < 25) {
      category = 'Normal';
      color = 'var(--success)';
      recommendation = 'Maintain your balance! Combine core conditioning, functional training, and active stretching to preserve overall cardiovascular health.';
    } else if (bmiVal >= 25 && bmiVal < 30) {
      category = 'Overweight';
      color = 'var(--warning)';
      recommendation = 'Increase physical activity with at least 150 minutes of moderate cardio or HIIT per week, paired with a portion-controlled diet plan.';
    } else {
      category = 'Obese';
      color = 'var(--danger)';
      recommendation = 'Focus on sustainable fat-loss regimens. Blend low-impact cardio, strength workouts and consult a professional trainer for custom coaching.';
    }

    const newResult = {
      id: Date.now(),
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      height,
      weight,
      bmi: bmiVal,
      category,
      color,
      recommendation
    };

    setResult(newResult);
    const updatedHistory = [newResult, ...history].slice(0, 10);
    setHistory(updatedHistory);
    localStorage.setItem('bmi_history', JSON.stringify(updatedHistory));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('bmi_history');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }} 
      animate={{ opacity: 1, y: 0 }}
      style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem', marginTop: '1rem' }}
    >
      {/* Left Form */}
      <div className="card-premium" style={{ border: '1px solid rgba(0,229,255,0.08)' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Scale size={20} color="var(--primary)" /> Body Mass Index (BMI)
        </h2>

        <form onSubmit={calculateBmi} style={{ display: 'grid', gap: '1.25rem' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Height (in cm)</label>
            <input
              type="number"
              className="form-input"
              placeholder="e.g. 175"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              min="1"
              max="250"
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Weight (in kg)</label>
            <input
              type="number"
              className="form-input"
              placeholder="e.g. 72"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              min="1"
              max="200"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary btn-shine" style={{ justifyContent: 'center', marginTop: '0.5rem' }}>
            Calculate BMI
          </button>
        </form>

        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{ overflow: 'hidden', marginTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1.5rem' }}
            >
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Your Calculated BMI</p>
                <h3 style={{ fontSize: '3.5rem', fontWeight: 900, color: result.color, margin: '0.5rem 0' }}>{result.bmi}</h3>
                <span className="badge" style={{ backgroundColor: `${result.color}20`, color: result.color, border: `1px solid ${result.color}40`, fontSize: '0.8rem', padding: '0.4rem 1rem' }}>
                  {result.category}
                </span>
              </div>

              <div style={{ background: 'var(--dark-4)', padding: '1.25rem', borderRadius: 'var(--radius)', marginTop: '1.5rem', border: '1px solid rgba(255,255,255,0.04)' }}>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Heart size={14} color="var(--primary)" /> Health Recommendation:
                </h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-light)', lineHeight: '1.6' }}>{result.recommendation}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Right History & Chart Mockup */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* BMI Categories Reference */}
        <div className="card" style={{ border: '1px solid rgba(0,229,255,0.08)' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <HelpCircle size={16} color="var(--primary)" /> BMI Reference Ranges
          </h3>
          <div style={{ display: 'grid', gap: '0.65rem' }}>
            {[
              { range: '< 18.5', label: 'Underweight', color: 'var(--info)' },
              { range: '18.5 – 24.9', label: 'Normal Weight', color: 'var(--success)' },
              { range: '25.0 – 29.9', label: 'Overweight', color: 'var(--warning)' },
              { range: '≥ 30.0', label: 'Obese', color: 'var(--danger)' }
            ].map((cat, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.6rem 0.85rem', background: 'var(--dark-4)', borderRadius: '8px', fontSize: '0.82rem' }}>
                <span style={{ fontWeight: 700, color: cat.color }}>{cat.label}</span>
                <span style={{ color: 'var(--text-light)', fontWeight: 600 }}>{cat.range}</span>
              </div>
            ))}
          </div>
        </div>

        {/* History Records */}
        <div className="card" style={{ border: '1px solid rgba(0,229,255,0.08)', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <History size={16} color="var(--primary)" /> History Logs
            </h3>
            {history.length > 0 && (
              <button 
                onClick={clearHistory}
                style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', fontWeight: 700 }}
              >
                <Trash2 size={12} /> Clear All
              </button>
            )}
          </div>

          <div style={{ display: 'grid', gap: '0.75rem', overflowY: 'auto', maxHeight: '250px' }}>
            {history.length === 0 ? (
              <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem 0', fontSize: '0.85rem' }}>
                No records yet. Perform a calculation to save metrics.
              </div>
            ) : (
              history.map((record) => (
                <div key={record.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.85rem 1rem', background: 'var(--dark-4)', borderRadius: 'var(--radius)', border: '1px solid rgba(255,255,255,0.03)' }}>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{record.date}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-light)', marginTop: '0.15rem' }}>
                      Weight: <strong>{record.weight}kg</strong> | Height: <strong>{record.height}cm</strong>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.15rem', fontWeight: 900, color: record.color }}>{record.bmi}</div>
                    <div style={{ fontSize: '0.65rem', color: record.color, textTransform: 'uppercase', fontWeight: 700 }}>{record.category}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
