import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Activity, Flame, ShieldAlert, Sparkles } from 'lucide-react';

export default function CalorieCalculator() {
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('male');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [activity, setActivity] = useState('1.2'); // sedentary default
  const [results, setResults] = useState(null);

  const calculateCalories = (e) => {
    e.preventDefault();
    if (!age || !weight || !height) return;

    const ageNum = parseInt(age);
    const weightKg = parseFloat(weight);
    const heightCm = parseFloat(height);
    const actMultiplier = parseFloat(activity);

    // Harris-Benedict Equation (Revised)
    let bmr = 0;
    if (gender === 'male') {
      bmr = 88.362 + (13.397 * weightKg) + (4.799 * heightCm) - (5.677 * ageNum);
    } else {
      bmr = 447.593 + (9.247 * weightKg) + (3.098 * heightCm) - (4.330 * ageNum);
    }

    const tdee = Math.round(bmr * actMultiplier);

    // Nutrition splits (Protein 30%, Fat 25%, Carbs 45%)
    const getMacros = (calories) => {
      const pCals = calories * 0.30;
      const fCals = calories * 0.25;
      const cCals = calories * 0.45;
      return {
        protein: Math.round(pCals / 4),
        fat: Math.round(fCals / 9),
        carbs: Math.round(cCals / 4)
      };
    };

    setResults({
      bmr: Math.round(bmr),
      tdee,
      maintenance: { cals: tdee, macros: getMacros(tdee) },
      cutting: { cals: tdee - 500, macros: getMacros(tdee - 500) },
      bulking: { cals: tdee + 500, macros: getMacros(tdee + 500) }
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '2rem', marginTop: '1rem' }}
    >
      {/* Left Input Form */}
      <div className="card-premium" style={{ border: '1px solid rgba(0,229,255,0.08)' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Flame size={20} color="var(--primary)" /> Calorie & Macro Calculator
        </h2>

        <form onSubmit={calculateCalories} style={{ display: 'grid', gap: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Age</label>
              <input
                type="number"
                className="form-input"
                placeholder="e.g. 25"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                min="10"
                max="100"
                required
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Gender</label>
              <select
                className="form-select"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Weight (kg)</label>
              <input
                type="number"
                className="form-input"
                placeholder="e.g. 70"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                min="30"
                max="200"
                required
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Height (cm)</label>
              <input
                type="number"
                className="form-input"
                placeholder="e.g. 175"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                min="100"
                max="250"
                required
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '0.5rem' }}>
            <label className="form-label">Daily Activity Level</label>
            <select
              className="form-select"
              value={activity}
              onChange={(e) => setActivity(e.target.value)}
            >
              <option value="1.2">Sedentary (Little/no exercise)</option>
              <option value="1.375">Lightly Active (Light exercise 1-3 days/week)</option>
              <option value="1.55">Moderately Active (Moderate exercise 3-5 days/week)</option>
              <option value="1.725">Very Active (Hard exercise 6-7 days/week)</option>
              <option value="1.9">Extra Active (Very hard exercise, physical job)</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary btn-shine" style={{ justifyContent: 'center', marginTop: '0.5rem' }}>
            Calculate Needs
          </button>
        </form>
      </div>

      {/* Right Results Dashboard */}
      <div>
        <AnimatePresence mode="wait">
          {results ? (
            <motion.div
              key="results"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{ display: 'grid', gap: '1.5rem' }}
            >
              {/* Daily Expenditure summary */}
              <div className="card" style={{ border: '1px solid rgba(0,229,255,0.12)', background: 'var(--grad-hero)', textAlign: 'center', padding: '2rem' }}>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Your Estimated TDEE</p>
                <h3 style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--primary)', margin: '0.5rem 0' }}>{results.tdee} kcal</h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Daily calories burned including your activity factor (BMR: {results.bmr} kcal).</p>
              </div>

              {/* Goal-based breakdowns */}
              <div style={{ display: 'grid', gap: '1rem' }}>
                {[
                  { title: 'Lose Weight (Cutting)', value: results.cutting, desc: 'Recommended calorie intake for healthy fat loss (500 kcal deficit).', color: 'var(--accent)' },
                  { title: 'Maintain Weight (Maintenance)', value: results.maintenance, desc: 'Your base metabolic requirement for steady-state weight maintenance.', color: 'var(--success)' },
                  { title: 'Gain Weight (Bulking)', value: results.bulking, desc: 'Calorie goal optimized to build clean lean muscle (500 kcal surplus).', color: 'var(--accent-2)' }
                ].map((goal, idx) => (
                  <div key={idx} className="card" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                      <div>
                        <h4 style={{ fontWeight: 800, fontSize: '0.95rem', color: '#fff' }}>{goal.title}</h4>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>{goal.desc}</p>
                      </div>
                      <div style={{ fontSize: '1.4rem', fontWeight: 950, color: goal.color }}>
                        {goal.value.cals} <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 'normal' }}>kcal</span>
                      </div>
                    </div>

                    {/* Macro splits */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '0.85rem' }}>
                      <div style={{ textAlign: 'center', background: 'var(--dark-4)', padding: '0.5rem', borderRadius: '8px' }}>
                        <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Carbs (45%)</div>
                        <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--primary)', marginTop: '0.15rem' }}>{goal.value.macros.carbs}g</div>
                      </div>
                      <div style={{ textAlign: 'center', background: 'var(--dark-4)', padding: '0.5rem', borderRadius: '8px' }}>
                        <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Protein (30%)</div>
                        <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--accent)', marginTop: '0.15rem' }}>{goal.value.macros.protein}g</div>
                      </div>
                      <div style={{ textAlign: 'center', background: 'var(--dark-4)', padding: '0.5rem', borderRadius: '8px' }}>
                        <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Fat (25%)</div>
                        <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--warning)', marginTop: '0.15rem' }}>{goal.value.macros.fat}g</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="placeholder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="card"
              style={{ textAlign: 'center', padding: '5rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderStyle: 'dashed', borderColor: 'rgba(0,229,255,0.2)', height: '100%' }}
            >
              <Activity size={48} style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--white)', marginBottom: '0.5rem' }}>Awaiting Parameters</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', maxWidth: '260px' }}>Enter your age, gender, height, and activity level to compute daily calories and custom macro targets.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
