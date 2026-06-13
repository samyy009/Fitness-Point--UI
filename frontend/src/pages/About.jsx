import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Trophy, Users, Heart, Star, Target, Clock } from 'lucide-react';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.7, delay, ease: [0.25, 0.46, 0.45, 0.94] }
});

export default function About() {
  const navigate = useNavigate();

  const whyUs = [
    { icon: <Trophy size={28} color="var(--primary)" />, title: 'Modern Equipment', desc: 'Experience premium machines and workout tools designed for every fitness level.' },
    { icon: <Users size={28} color="var(--accent-2)" />, title: 'Expert Trainers', desc: 'Get personalized guidance from certified fitness professionals with proven results.' },
    { icon: <Heart size={28} color="var(--danger)" />, title: 'Personalized Programs', desc: 'Custom workouts tailored specifically to your body type, goals, and schedule.' },
    { icon: <Star size={28} color="var(--warning)" />, title: 'Community Support', desc: 'Join a supportive, motivational fitness family that celebrates every milestone.' },
    { icon: <Target size={28} color="var(--success)" />, title: 'Goal Tracking', desc: 'Advanced analytics and dashboards to visualize your progress in real-time.' },
    { icon: <Clock size={28} color="var(--primary)" />, title: '24/7 Access', desc: 'Train whenever you want. Our facilities and app are always open for you.' },
  ];

  const stats = [
    { val: '10+', label: 'Years of Excellence' },
    { val: '500+', label: 'Active Members' },
    { val: '50+', label: 'Expert Coaches' },
    { val: '99%', label: 'Satisfaction Rate' },
  ];

  const gallery = [
    '/assets/gallery1.jpg', '/assets/gallery2.jpg', '/assets/gallery3.jpg',
    '/assets/gallery4.jpg', '/assets/gallery5.jpg', '/assets/gallery6.jpg',
    '/assets/gallery.7.jpg', '/assets/gallary.8.jpg', '/assets/gallary.9.jpg', '/assets/gallary.10.jpg'
  ];

  return (
    <div>
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <div style={{
        background: 'linear-gradient(rgba(2,3,9,0.7), rgba(2,3,9,0.92)), url("/assets/facility.jpg") center/cover no-repeat',
        minHeight: '45vh',
        display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center',
        marginTop: '70px', position: 'relative', overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 100%, rgba(0,229,255,0.1) 0%, transparent 60%)' }} />
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="section-tag" style={{ margin: '0 auto 1.25rem' }}>
            Our Story
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
            style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 900, letterSpacing: '-0.03em' }}>
            About <span className="gradient-text">FitnessPoint</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            style={{ color: 'var(--text-light)', fontSize: '1.1rem', marginTop: '1rem', maxWidth: 500, margin: '1rem auto 0' }}>
            A decade of transforming lives through fitness, nutrition, and community.
          </motion.p>
        </div>
      </div>

      {/* ── Stats Bar ──────────────────────────────────────────────────── */}
      <div style={{ background: 'var(--dark-3)', borderTop: '1px solid rgba(0,229,255,0.1)', borderBottom: '1px solid rgba(0,229,255,0.1)' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0 }}>
          {stats.map((s, i) => (
            <motion.div key={i} {...fadeUp(i * 0.1)}
              style={{ padding: '2rem 1.5rem', textAlign: 'center', borderRight: i < 3 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
              <div style={{ fontSize: '2.25rem', fontWeight: 900, color: 'var(--primary)', letterSpacing: '-0.03em' }}>{s.val}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '0.25rem' }}>{s.label}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Mission ────────────────────────────────────────────────────── */}
      <section className="section" style={{ background: 'var(--dark)' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'center' }}>
          <motion.div {...fadeUp()}>
            <div className="section-tag">Our Mission</div>
            <h2 className="section-title" style={{ marginBottom: '1.5rem' }}>
              Transforming Lives<br /><span className="gradient-text">One Rep at a Time</span>
            </h2>
            <p style={{ color: 'var(--text-light)', lineHeight: '1.85', marginBottom: '1.25rem' }}>
              FitnessPoint was founded with a singular vision: to make world-class fitness accessible to everyone.
              We combine expert coaching, cutting-edge technology, and a powerful community to help you achieve goals
              you never thought possible.
            </p>
            <p style={{ color: 'var(--text-light)', lineHeight: '1.85', marginBottom: '2.5rem' }}>
              From our state-of-the-art facility to our AI-powered nutrition plans, every feature is designed with
              your transformation in mind. We don't just help you work out — we help you level up your entire life.
            </p>
            <button className="btn btn-primary btn-lg btn-shine" onClick={() => navigate('/register')}>
              Start Your Journey <ArrowRight size={18} />
            </button>
          </motion.div>
          <motion.div {...fadeUp(0.2)} style={{ position: 'relative' }}>
            <img src="/assets/about.png" alt="About FitnessPoint" loading="lazy"
              style={{ borderRadius: 'var(--radius-xl)', filter: 'brightness(1.15) drop-shadow(0 0 30px rgba(0,229,255,0.2))', boxShadow: 'var(--shadow-lg)' }} />
            <div style={{
              position: 'absolute', bottom: '1.5rem', left: '-1.5rem',
              background: 'var(--glass)', border: '1px solid var(--glass-border)',
              backdropFilter: 'blur(20px)', borderRadius: 'var(--radius-lg)',
              padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem'
            }}>
              <div style={{ width: 48, height: 48, borderRadius: '12px', background: 'rgba(0,229,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Trophy size={24} color="var(--primary)" />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '1rem' }}>Award Winning</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Best Gym 2024</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Why Choose Us ──────────────────────────────────────────────── */}
      <section className="section" style={{ background: 'var(--dark-2)' }}>
        <div className="container">
          <motion.div className="section-header" {...fadeUp()}>
            <div className="section-tag">Why Us</div>
            <h2 className="section-title">Everything You Need To<br /><span className="gradient-text">Succeed</span></h2>
          </motion.div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {whyUs.map((item, idx) => (
              <motion.div key={idx} className="card-premium" {...fadeUp(idx * 0.08)} whileHover={{ scale: 1.02 }}>
                <div style={{ width: 56, height: 56, borderRadius: 'var(--radius)', background: 'rgba(0,229,255,0.08)', border: '1px solid rgba(0,229,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                  {item.icon}
                </div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.75rem' }}>{item.title}</h4>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.75' }}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Gallery ────────────────────────────────────────────────────── */}
      <section className="section" style={{ background: 'var(--dark)' }}>
        <div className="container">
          <motion.div className="section-header" {...fadeUp()}>
            <div className="section-tag">Gallery</div>
            <h2 className="section-title">Take A Virtual Tour</h2>
            <p className="section-subtitle">Explore our world-class facilities and vibrant community.</p>
          </motion.div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
            {gallery.map((img, idx) => (
              <motion.div key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ scale: 1.04, zIndex: 10 }}
                style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', height: '200px', border: '1px solid rgba(0,229,255,0.08)', cursor: 'zoom-in', position: 'relative' }}
              >
                <img src={img} alt={`Gallery ${idx + 1}`} loading="lazy"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,229,255,0.1) 0%, transparent 60%)', opacity: 0, transition: '0.3s' }} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────────────────── */}
      <section className="section" style={{ background: 'var(--dark-2)', textAlign: 'center' }}>
        <motion.div className="container" {...fadeUp()}>
          <div className="section-tag" style={{ margin: '0 auto 1.5rem' }}>Ready?</div>
          <h2 className="section-title" style={{ marginBottom: '1.25rem' }}>Start Your Transformation<br /><span className="gradient-text">Today</span></h2>
          <p style={{ color: 'var(--text-light)', maxWidth: 500, margin: '0 auto 2.5rem', lineHeight: '1.85' }}>
            Join over 500 members who have already transformed their lives with FitnessPoint.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn btn-primary btn-xl btn-shine" onClick={() => navigate('/register')}>
              Join Now — It's Free <ArrowRight size={20} />
            </button>
            <button className="btn btn-ghost btn-xl" onClick={() => navigate('/plans')}>
              View Pricing
            </button>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
