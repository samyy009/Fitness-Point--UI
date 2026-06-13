import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Droplet, RotateCcw, Plus, Minus, Trophy, Sparkles } from 'lucide-react';

export default function WaterTracker() {
  const [goal, setGoal] = useState(3000); // 3000 ml default
  const [intake, setIntake] = useState(0);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const today = new Date().toDateString();
    const savedIntake = localStorage.getItem(`water_intake_${today}`);
    const savedGoal = localStorage.getItem('water_goal');
    if (savedIntake) setIntake(parseInt(savedIntake));
    if (savedGoal) setGoal(parseInt(savedGoal));

    // Load logs of last 7 days
    const savedLogs = localStorage.getItem('water_logs');
    if (savedLogs) setHistory(JSON.parse(savedLogs));
  }, []);

  const updateIntake = (amount) => {
    const today = new Date().toDateString();
    const newIntake = Math.max(0, intake + amount);
    setIntake(newIntake);
    localStorage.setItem(`water_intake_${today}`, newIntake.toString());

    // Update history
    const savedLogs = localStorage.getItem('water_logs');
    let logs = savedLogs ? JSON.parse(savedLogs) : [];
    const existingIndex = logs.findIndex(l => l.date === today);

    if (existingIndex > -1) {
      logs[existingIndex].intake = newIntake;
      logs[existingIndex].goal = goal;
    } else {
      logs.unshift({ date: today, intake: newIntake, goal });
    }

    logs = logs.slice(0, 7);
    setHistory(logs);
    localStorage.setItem('water_logs', JSON.stringify(logs));
  };

  const changeGoal = (newGoal) => {
    setGoal(newGoal);
    localStorage.setItem('water_goal', newGoal.toString());
  };

  const resetIntake = () => {
    if (window.confirm('Reset today\'s hydration progress?')) {
      updateIntake(-intake);
    }
  };

  const progressPercent = Math.min(100, Math.round((intake / goal) * 100));

  // Circular progress ring math
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', marginTop: '1rem' }}
    >
      {/* Left Tracker Panel */}
      <div className="card-premium" style={{ border: '1px solid rgba(0,229,255,0.08)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '2.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%', justifyContent: 'center' }}>
          <Droplet size={20} color="var(--primary)" /> Hydration Tracker
        </h2>

        {/* Circular Progress */}
        <div style={{ position: 'relative', width: '220px', height: '220px', margin: '1rem 0 2rem' }}>
          <svg style={{ transform: 'rotate(-90deg)', width: '220px', height: '220px' }}>
            <circle
              cx="110" cy="110" r={radius}
              stroke="rgba(255,255,255,0.05)" strokeWidth="12" fill="transparent"
            />
            <motion.circle
              cx="110" cy="110" r={radius}
              stroke="var(--primary)" strokeWidth="12" fill="transparent"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              strokeLinecap="round"
            />
          </svg>

          {/* Center text */}
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Droplet size={32} color="var(--primary)" style={{ filter: 'drop-shadow(0 0 10px rgba(0,229,255,0.5))', marginBottom: '0.25rem' }} />
            <div style={{ fontSize: '2rem', fontWeight: 900 }}>{intake} ml</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>of {goal} ml goal</div>
          </div>
        </div>

        {/* Log Buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', width: '100%', marginBottom: '1.5rem' }}>
          {[
            { label: '+250 ml', amount: 250 },
            { label: '+500 ml', amount: 500 },
            { label: '+750 ml', amount: 750 }
          ].map((btn, i) => (
            <button
              key={i}
              className="btn btn-ghost btn-sm"
              onClick={() => updateIntake(btn.amount)}
              style={{ justifyContent: 'center', fontWeight: 'bold' }}
            >
              {btn.label}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '1rem', width: '100%' }}>
          <button
            onClick={() => updateIntake(-250)}
            className="btn btn-dark btn-sm"
            style={{ flex: 1, justifyContent: 'center' }}
            disabled={intake === 0}
          >
            <Minus size={14} /> Remove 250ml
          </button>
          <button
            onClick={resetIntake}
            className="btn btn-outline btn-sm"
            style={{ flex: 1, justifyContent: 'center', borderColor: 'rgba(255,255,255,0.1)', color: 'var(--text-muted)' }}
          >
            <RotateCcw size={14} /> Reset
          </button>
        </div>
      </div>

      {/* Right Target / History */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* Set Goal Card */}
        <div className="card" style={{ border: '1px solid rgba(0,229,255,0.08)' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Trophy size={16} color="var(--primary)" /> Set Daily Target
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
            {[2000, 2500, 3000, 4000].map((tgt) => (
              <button
                key={tgt}
                onClick={() => changeGoal(tgt)}
                className={`btn btn-sm ${goal === tgt ? 'btn-primary' : 'btn-dark'}`}
                style={{ justifyContent: 'center', padding: '0.6rem 0' }}
              >
                {(tgt / 1000).toFixed(1)}L
              </button>
            ))}
          </div>
        </div>

        {/* Weekly Logs */}
        <div className="card" style={{ border: '1px solid rgba(0,229,255,0.08)', flexGrow: 1 }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '1.25rem' }}>Hydration History (Last 7 Days)</h3>
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            {history.length === 0 ? (
              <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem 0', fontSize: '0.85rem' }}>
                Start logging hydration to build streaks.
              </div>
            ) : (
              history.map((log, i) => {
                const percent = Math.min(100, Math.round((log.intake / log.goal) * 100));
                const isToday = log.date === new Date().toDateString();
                return (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', padding: '0.85rem 1rem', background: 'var(--dark-4)', borderRadius: 'var(--radius)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem' }}>
                      <span style={{ fontWeight: 700, color: isToday ? 'var(--primary)' : 'var(--text-light)' }}>
                        {isToday ? 'Today' : log.date.split(' ').slice(0, 3).join(' ')}
                      </span>
                      <span style={{ color: 'var(--text-muted)' }}>{log.intake}ml / {log.goal}ml ({percent}%)</span>
                    </div>
                    {/* Tiny Progress bar */}
                    <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden' }}>
                      <div style={{ width: `${percent}%`, height: '100%', background: 'var(--primary)', borderRadius: '10px' }} />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
