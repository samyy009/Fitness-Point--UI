import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, Users, Star, ShieldCheck, Mail, Calendar, Clock, ChevronRight } from 'lucide-react';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, delay }
});

export default function Trainers() {
  const navigate = useNavigate();
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('All');
  const [bookingTrainer, setBookingTrainer] = useState(null);
  const [bookingForm, setBookingForm] = useState({ date: '', time: '', notes: '' });
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState('');

  useEffect(() => {
    api.get('/admin/trainers')
      .then(res => {
        setTrainers(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        // Fallback to static trainers if API fails or empty
        const fallback = [
          { id: 1, name: 'John Doe', specialty: 'Bodybuilding & Strength', certifications: 'ISSA Certified', experience_years: 8, rating: 5.0, bio: 'Experienced coach specializing in hypertrophy, muscle development and raw strength training.' },
          { id: 2, name: 'Jane Smith', specialty: 'Cardio & Nutrition', certifications: 'ACE Certified', experience_years: 6, rating: 4.9, bio: 'Passion for designing active cardio circuits and healthy macronutrient-balanced diet regimes.' },
          { id: 3, name: 'Mike Johnson', specialty: 'Conditioning & CrossFit', certifications: 'CSCS Certified', experience_years: 5, rating: 4.8, bio: 'Functional trainer helping athletes boost flexibility, core stability and performance.' },
          { id: 4, name: 'Sarah Lee', specialty: 'Yoga & Pilates', certifications: 'RYT-500 Certified', experience_years: 7, rating: 4.9, bio: 'Holistic teacher helping members improve posture, mindfulness and body flexibility.' }
        ];
        setTrainers(fallback);
        setLoading(false);
      });
  }, []);

  const specialties = ['All', 'Bodybuilding', 'Cardio', 'Conditioning', 'Yoga'];

  const filteredTrainers = filter === 'All' 
    ? trainers 
    : trainers.filter(t => t.specialty?.toLowerCase().includes(filter.toLowerCase()));

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setBookingError('');
    setBookingSuccess(false);

    // Verify authentication
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      await api.post('/admin/bookings', {
        trainerId: bookingTrainer.id,
        date: bookingForm.date,
        time: bookingForm.time,
        notes: bookingForm.notes
      });
      setBookingSuccess(true);
      setTimeout(() => {
        setBookingTrainer(null);
        setBookingSuccess(false);
        setBookingForm({ date: '', time: '', notes: '' });
      }, 2000);
    } catch (err) {
      setBookingError(err.response?.data?.message || 'Failed to request booking. Please try again.');
    }
  };

  const getTrainerImage = (name) => {
    if (name.includes('David') || name.includes('John')) return '/assets/mentor-1.jpg';
    if (name.includes('Rosy') || name.includes('Jane')) return '/assets/mentor-2.jpg';
    if (name.includes('Matt') || name.includes('Mike')) return '/assets/mentor-3.jpg';
    return '/assets/facility.jpg';
  };

  return (
    <div style={{ marginTop: '70px', minHeight: '100vh', background: 'var(--dark)' }}>
      {/* ── Hero Banner ─────────────────────────────────────────────── */}
      <div style={{
        background: 'linear-gradient(rgba(2,3,9,0.8), rgba(2,3,9,0.95)), url("/assets/background.png") center/cover no-repeat',
        padding: '5rem 0', textAlign: 'center', borderBottom: '1px solid rgba(0,229,255,0.08)',
        position: 'relative', overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 100%, rgba(0,229,255,0.1) 0%, transparent 60%)' }} />
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="section-tag" style={{ margin: '0 auto 1.25rem' }}>Instructors</motion.div>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
            style={{ fontSize: 'clamp(2.25rem, 5vw, 3.5rem)', fontWeight: 900, letterSpacing: '-0.03em', marginBottom: '1rem' }}>
            Meet Our <span className="gradient-text">Certified Trainers</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            className="section-subtitle" style={{ margin: '0 auto' }}>
            Our team of professional trainers is here to guide, motivate, and help you reach your goals.
          </motion.p>
        </div>
      </div>

      {/* ── Filter Tabs ──────────────────────────────────────────────── */}
      <div style={{ borderBottom: '1px solid rgba(0,229,255,0.08)', background: 'var(--dark-2)', position: 'sticky', top: '70px', zIndex: 50 }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', padding: '1rem 2rem', flexWrap: 'wrap' }}>
          {specialties.map(spec => (
            <motion.button key={spec} whileTap={{ scale: 0.95 }}
              className={`btn btn-sm ${filter === spec ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setFilter(spec)}
            >
              {spec}
            </motion.button>
          ))}
        </div>
      </div>

      {/* ── Trainers Grid ────────────────────────────────────────────── */}
      <div className="container" style={{ padding: '4rem 2rem' }}>
        {loading ? (
          <LoadingSpinner />
        ) : filteredTrainers.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🔍</div>
            <p>No trainers found matching that specialty.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '2rem' }}>
            {filteredTrainers.map((t, idx) => (
              <motion.div
                key={t.id}
                className="trainer-card"
                {...fadeUp(idx * 0.08)}
                whileHover={{ y: -6 }}
                style={{ background: 'var(--dark-3)', border: '1px solid rgba(0,229,255,0.08)', borderRadius: 'var(--radius-xl)', overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '100%' }}
              >
                <div style={{ position: 'relative', height: '280px', overflow: 'hidden' }}>
                  <img 
                    src={getTrainerImage(t.name)} 
                    alt={t.name} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1567013127542-490d757e51fc?q=80&w=400";
                    }}
                  />
                  <div style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'var(--glass)', border: '1px solid var(--glass-border)', padding: '0.3rem 0.6rem', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '0.25rem', backdropFilter: 'blur(10px)' }}>
                    <Star size={12} fill="var(--warning)" color="var(--warning)" />
                    <span style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>{t.rating || '5.0'}</span>
                  </div>
                </div>

                <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.25rem' }}>{t.name}</h3>
                  <span style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem', display: 'block' }}>
                    {t.specialty}
                  </span>
                  
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', lineHeight: '1.6', marginBottom: '1.25rem', flexGrow: 1 }}>
                    {t.bio || 'Our expert fitness trainer committed to helping you transform your physique and lifestyle.'}
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.8rem', color: 'var(--text-muted)', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1rem', marginBottom: '1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Award size={14} color="var(--primary)" /> <span><strong>Certs:</strong> {t.certifications ? (Array.isArray(t.certifications) ? t.certifications.join(', ') : t.certifications) : 'ISSA CPT'}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Clock size={14} color="var(--primary)" /> <span>{t.experience_years ? `${t.experience_years} Years Experience` : '5+ Years Experience'}</span>
                    </div>
                  </div>

                  <button 
                    className="btn btn-primary btn-sm btn-shine"
                    style={{ width: '100%', justifyContent: 'center' }}
                    onClick={() => setBookingTrainer(t)}
                  >
                    Book Personal Session
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* ── Booking Modal ────────────────────────────────────────────── */}
      <AnimatePresence>
        {bookingTrainer && (
          <motion.div 
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setBookingTrainer(null)}
          >
            <motion.div 
              className="modal"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              style={{ maxWidth: '460px' }}
            >
              <div className="modal-header">
                <h3 className="modal-title">Book Session</h3>
                <button className="modal-close" onClick={() => setBookingTrainer(null)}>×</button>
              </div>

              {bookingSuccess ? (
                <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                  <div style={{ fontSize: '3rem', color: 'var(--success)', marginBottom: '1rem' }}>✓</div>
                  <h4 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>Request Submitted!</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>
                    Your session request with <strong>{bookingTrainer.name}</strong> has been logged. We will review and contact you.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleBookingSubmit} style={{ display: 'grid', gap: '1.25rem' }}>
                  {bookingError && (
                    <div style={{ padding: '0.75rem', background: 'rgba(255,56,96,0.1)', border: '1px solid var(--danger)', color: 'var(--danger)', borderRadius: 'var(--radius)', fontSize: '0.85rem' }}>
                      {bookingError}
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', background: 'var(--dark-4)', padding: '1rem', borderRadius: 'var(--radius)', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', overflow: 'hidden', flexShrink: 0 }}>
                      <img src={getTrainerImage(bookingTrainer.name)} alt={bookingTrainer.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div>
                      <h4 style={{ fontWeight: 800 }}>{bookingTrainer.name}</h4>
                      <p style={{ fontSize: '0.75rem', color: 'var(--primary)' }}>{bookingTrainer.specialty}</p>
                    </div>
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Preferred Date</label>
                    <input 
                      type="date" 
                      className="form-input" 
                      value={bookingForm.date}
                      onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Preferred Time</label>
                    <input 
                      type="time" 
                      className="form-input" 
                      value={bookingForm.time}
                      onChange={(e) => setBookingForm({ ...bookingForm, time: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Goals / Notes</label>
                    <textarea 
                      placeholder="e.g. Weight training guidance, nutrition tips, health limitations..." 
                      className="form-textarea"
                      style={{ minHeight: '85px' }}
                      value={bookingForm.notes}
                      onChange={(e) => setBookingForm({ ...bookingForm, notes: e.target.value })}
                    />
                  </div>

                  <button type="submit" className="btn btn-primary btn-shine" style={{ justifyContent: 'center', marginTop: '0.5rem' }}>
                    Confirm Booking Request
                  </button>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
