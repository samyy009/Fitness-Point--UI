import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { Clock, Users, User, ChevronRight, Filter, Dumbbell, Zap } from 'lucide-react';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, delay }
});

const CATEGORY_ICONS = {
  Strength: '🏋️', Cardio: '🏃', HIIT: '⚡', Yoga: '🧘', Flexibility: '🤸', All: '✨'
};

export default function Classes() {
  const navigate = useNavigate();
  const [classesList, setClassesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    api.get('/classes')
      .then(res => { setClassesList(res.data); setLoading(false); })
      .catch(() => { setError('Failed to load classes.'); setLoading(false); });
  }, []);

  const categories = ['All', 'Strength', 'Cardio', 'HIIT', 'Yoga', 'Flexibility'];
  const filtered = filter === 'All' ? classesList : classesList.filter(c => c.category?.toLowerCase() === filter.toLowerCase());

  const features = [
    { icon: '🏋️', title: 'Workout Planner', desc: 'Plan weekly strength, cardio, and HIIT routines with smart instruction cards.' },
    { icon: '🥗', title: 'Calorie Logger', desc: 'Log meals and get full nutrient breakdowns based on your personal goals.' },
    { icon: '🎯', title: 'Habit & Streak Tracker', desc: 'Build positive habits and track daily streaks to stay consistent.' },
  ];

  return (
    <div style={{ marginTop: '70px', minHeight: '100vh', background: 'var(--dark)' }}>
      {/* ── Hero Banner ─────────────────────────────────────────────── */}
      <div style={{
        background: 'linear-gradient(rgba(2,3,9,0.8), rgba(2,3,9,0.95)), url("/assets/facility.jpg") center/cover no-repeat',
        padding: '5rem 0', textAlign: 'center', borderBottom: '1px solid rgba(0,229,255,0.08)',
        position: 'relative', overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 100%, rgba(0,229,255,0.1) 0%, transparent 60%)' }} />
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="section-tag" style={{ margin: '0 auto 1.25rem' }}>
            Schedule
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
            style={{ fontSize: 'clamp(2.25rem, 5vw, 3.5rem)', fontWeight: 900, letterSpacing: '-0.03em', marginBottom: '1rem' }}>
            Our <span className="gradient-text">Gym Classes</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            className="section-subtitle" style={{ margin: '0 auto' }}>
            Find and join the perfect workout class tailored to your schedule and goals.
          </motion.p>
        </div>
      </div>

      {/* ── Filter Tabs ──────────────────────────────────────────────── */}
      <div style={{ borderBottom: '1px solid rgba(0,229,255,0.08)', background: 'var(--dark-2)', position: 'sticky', top: '70px', zIndex: 50 }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', padding: '1rem 2rem', flexWrap: 'wrap' }}>
          {categories.map(cat => (
            <motion.button key={cat} whileTap={{ scale: 0.95 }}
              className={`btn btn-sm ${filter === cat ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setFilter(cat)}
              style={{ gap: '0.4rem' }}
            >
              <span>{CATEGORY_ICONS[cat] || '🏃'}</span> {cat}
            </motion.button>
          ))}
        </div>
      </div>

      {/* ── Classes Grid ─────────────────────────────────────────────── */}
      <div className="container" style={{ padding: '3rem 2rem' }}>
        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--danger)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
            <p>{error}</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🔍</div>
            <p>No classes found in this category.</p>
            <button className="btn btn-outline btn-sm" style={{ marginTop: '1rem' }} onClick={() => setFilter('All')}>View All Classes</button>
          </div>
        ) : (
          <motion.div className="classes-grid" layout>
            <AnimatePresence mode="wait">
              {filtered.map((cls, idx) => (
                <motion.div key={cls.id} className="class-card"
                  initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }} transition={{ delay: idx * 0.08 }}
                  whileHover={{ y: -6 }}
                >
                  {/* Card Top Color Bar */}
                  <div style={{ height: '4px', background: 'var(--grad-2)' }} />

                  <div className="class-body">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                      <div style={{ fontSize: '2.5rem' }}>{CATEGORY_ICONS[cls.category] || '🏋️'}</div>
                      <span className="badge badge-primary">{cls.category}</span>
                    </div>
                    <h3>{cls.title}</h3>
                    <p>{cls.description}</p>
                    <div style={{ display: 'grid', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Clock size={14} color="var(--primary)" /> {cls.schedule || 'Flexible schedule'}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <User size={14} color="var(--primary)" /> {cls.Trainer?.name || 'Expert Trainer'}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Users size={14} color="var(--primary)" /> Max {cls.capacity || '20'} members
                      </div>
                    </div>
                    <div className="class-footer">
                      <span className="class-price">
                        {cls.price ? `$${cls.price}` : 'Free for Members'}
                      </span>
                      <motion.button whileTap={{ scale: 0.95 }}
                        className="btn btn-primary btn-sm btn-shine"
                        onClick={() => navigate('/plans')}>
                        Join Class <ChevronRight size={14} />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* ── Features Strip ───────────────────────────────────────────── */}
      <section className="section" style={{ background: 'var(--dark-2)', borderTop: '1px solid rgba(0,229,255,0.08)' }}>
        <div className="container">
          <motion.div className="section-header" {...fadeUp()}>
            <div className="section-tag">Member Benefits</div>
            <h2 className="section-title">Everything Included<br /><span className="gradient-text">In Your Membership</span></h2>
          </motion.div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {features.map((f, i) => (
              <motion.div key={i} className="card-premium" {...fadeUp(i * 0.1)} whileHover={{ scale: 1.02 }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{f.icon}</div>
                <h4 style={{ fontWeight: 800, marginBottom: '0.75rem' }}>{f.title}</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: '1.75' }}>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
