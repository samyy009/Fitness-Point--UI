import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { Check, Zap, Star, Shield, ChevronDown, ChevronUp, AlertCircle, CheckCircle } from 'lucide-react';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, delay }
});

const FAQS = [
  { q: 'Can I cancel my membership at any time?', a: 'Yes, you can cancel your subscription from your dashboard anytime. Your access remains active until the end of your billing cycle.' },
  { q: 'Is there a refund policy?', a: 'We offer a 7-day money-back guarantee for first-time subscribers. Contact support from your portal to request a refund.' },
  { q: 'Do I need to sign a long-term contract?', a: 'No. All our plans are month-to-month or yearly. Change or cancel anytime with zero penalties.' },
  { q: 'Can I upgrade or downgrade my plan?', a: 'Absolutely. You can switch plans at any time. Upgrades take effect immediately; downgrades apply at the next billing cycle.' },
];

export default function Plans() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [myMemberships, setMyMemberships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/plans');
        setPlans(res.data);
        if (user) {
          const mRes = await api.get('/memberships/me');
          setMyMemberships(mRes.data);
        }
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchData();
  }, [user]);

  const handleSubscribe = async (planId) => {
    if (!user) { navigate('/login'); return; }
    setSubmitting(true); setMessage(null);
    try {
      await api.post('/memberships', { planId });
      setMessage({ type: 'success', text: '🎉 Successfully subscribed! Enjoy your membership.' });
      const mRes = await api.get('/memberships/me');
      setMyMemberships(mRes.data);
    } catch (err) {
      setMessage({ type: 'danger', text: err.response?.data?.message || 'Subscription failed. Please try again.' });
    } finally { setSubmitting(false); }
  };

  const isSubscribedTo = (planId) => myMemberships.some(m => m.planId === planId && m.status === 'active');

  const planEmoji = (name) => {
    if (!name) return '💪';
    const n = name.toLowerCase();
    if (n.includes('basic') || n.includes('starter')) return '🌱';
    if (n.includes('premium') || n.includes('pro') || n.includes('popular')) return '⚡';
    if (n.includes('elite') || n.includes('ultimate')) return '👑';
    return '💪';
  };

  return (
    <div style={{ marginTop: '70px', minHeight: '100vh', background: 'var(--dark)' }}>
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <div style={{
        background: 'var(--grad-hero)', padding: '5rem 0', textAlign: 'center',
        borderBottom: '1px solid rgba(0,229,255,0.08)', position: 'relative', overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 100%, rgba(0,229,255,0.1) 0%, transparent 60%)' }} />
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="section-tag" style={{ margin: '0 auto 1.25rem' }}>Pricing</motion.div>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
            style={{ fontSize: 'clamp(2.25rem, 5vw, 3.5rem)', fontWeight: 900, letterSpacing: '-0.03em', marginBottom: '1rem' }}>
            Simple, <span className="gradient-text">Transparent Pricing</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            className="section-subtitle" style={{ margin: '0 auto' }}>
            Choose the perfect plan for your fitness journey. No hidden fees, cancel anytime.
          </motion.p>
        </div>
      </div>

      {/* ── Message ───────────────────────────────────────────────────── */}
      <AnimatePresence>
        {message && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem', padding: '1rem', background: message.type === 'success' ? 'rgba(0,214,143,0.1)' : 'rgba(255,56,96,0.1)', borderBottom: `1px solid ${message.type === 'success' ? 'rgba(0,214,143,0.2)' : 'rgba(255,56,96,0.2)'}`, color: message.type === 'success' ? 'var(--success)' : 'var(--danger)', fontWeight: 600 }}>
            {message.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />} {message.text}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Plans Grid ────────────────────────────────────────────────── */}
      <div className="container" style={{ padding: '5rem 2rem' }}>
        {loading ? <LoadingSpinner /> : plans.length === 0 ? (
          <div className="empty-state"><div className="empty-state-icon">💳</div><p>No plans available at the moment.</p></div>
        ) : (
          <div className="plans-grid">
            {plans.map((plan, idx) => {
              const isPopular = plan.name?.toLowerCase().includes('popular') || plan.name?.toLowerCase().includes('premium');
              const active = isSubscribedTo(plan.id);
              const featuresList = Array.isArray(plan.features) ? plan.features
                : typeof plan.features === 'string' ? (() => { try { return JSON.parse(plan.features); } catch { return [plan.features]; } })()
                : ['All Gym Facilities', '1 Personal Trainer Session/mo', 'Dietary Plan Access', '24/7 Support'];

              return (
                <motion.div key={plan.id} className={`plan-card ${isPopular ? 'popular' : ''}`}
                  initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: idx * 0.1 }}
                  whileHover={{ y: -6 }}>
                  {isPopular && <div className="plan-popular-badge">⭐ Most Popular</div>}

                  <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>{planEmoji(plan.name)}</div>
                  <p className="plan-name">{plan.name}</p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: '1.65', marginBottom: '0.5rem' }}>
                    {plan.description || 'Perfect plan to kickstart your fitness journey'}
                  </p>

                  <div className="plan-price">
                    <sup>₹</sup>{plan.price}
                    <span>/{plan.duration_days === 30 ? 'mo' : plan.duration_days === 365 ? 'yr' : `${plan.duration_days}d`}</span>
                  </div>

                  <div className="plan-features">
                    {featuresList.map((f, i) => (
                      <div key={i} className="plan-feature">
                        <Check size={16} color="var(--primary)" className="plan-feature-icon" /> {f}
                      </div>
                    ))}
                  </div>

                  <motion.button whileTap={{ scale: 0.97 }}
                    className={`btn ${active ? 'btn-outline' : isPopular ? 'btn-primary btn-shine' : 'btn-dark'}`}
                    style={{ width: '100%', justifyContent: 'center' }}
                    onClick={() => handleSubscribe(plan.id)} disabled={submitting || active}>
                    {active ? <><CheckCircle size={16} /> Active Plan</> : submitting ? 'Processing...' : isPopular ? <><Zap size={16} /> Get Started</> : 'Select Plan'}
                  </motion.button>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Trust badges */}
        <motion.div {...fadeUp(0.3)} style={{ display: 'flex', justifyContent: 'center', gap: '2.5rem', flexWrap: 'wrap', marginTop: '4rem', paddingTop: '3rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          {[
            { icon: <Shield size={20} color="var(--success)" />, label: '7-Day Money Back' },
            { icon: <Zap size={20} color="var(--primary)" />, label: 'Instant Activation' },
            { icon: <Star size={20} color="var(--warning)" />, label: 'No Hidden Fees' },
          ].map((t, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--text-muted)', fontSize: '0.88rem', fontWeight: 600 }}>
              {t.icon} {t.label}
            </div>
          ))}
        </motion.div>
      </div>

      {/* ── FAQs ──────────────────────────────────────────────────────── */}
      <section className="section" style={{ background: 'var(--dark-2)', borderTop: '1px solid rgba(0,229,255,0.08)' }}>
        <div className="container" style={{ maxWidth: '760px' }}>
          <motion.div className="section-header" {...fadeUp()}>
            <div className="section-tag">Support</div>
            <h2 className="section-title">Frequently Asked <span className="gradient-text">Questions</span></h2>
          </motion.div>
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            {FAQS.map((faq, i) => (
              <motion.div key={i} {...fadeUp(i * 0.08)}
                style={{ background: 'var(--dark-3)', border: `1px solid ${openFaq === i ? 'rgba(0,229,255,0.25)' : 'rgba(0,229,255,0.08)'}`, borderRadius: 'var(--radius-lg)', overflow: 'hidden', transition: 'border-color 0.3s' }}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{ width: '100%', padding: '1.25rem 1.5rem', background: 'none', border: 'none', color: 'var(--white)', fontFamily: 'inherit', fontSize: '0.95rem', fontWeight: 700, textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                  {faq.q}
                  {openFaq === i ? <ChevronUp size={18} color="var(--primary)" /> : <ChevronDown size={18} color="var(--text-muted)" />}
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}
                      style={{ overflow: 'hidden' }}>
                      <div style={{ padding: '0 1.5rem 1.5rem', color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.75' }}>{faq.a}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
