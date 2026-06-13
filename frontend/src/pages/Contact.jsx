import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, AlertCircle, MessageSquare } from 'lucide-react';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, delay }
});

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true); setFeedback(null);
    try {
      await api.post('/contact', formData);
      setFeedback({ type: 'success', text: 'Message sent! We\'ll get back to you within 24 hours.' });
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setFeedback({ type: 'danger', text: err.response?.data?.message || 'Failed to send. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  const contactItems = [
    { icon: <MapPin size={22} color="var(--primary)" />, title: 'Our Location', detail: '123 Fitness Street, Gymville, New Delhi, India' },
    { icon: <Phone size={22} color="var(--accent-2)" />, title: 'Call Center', detail: '+1 (555) 123-4567 / +91 98765 43210' },
    { icon: <Mail size={22} color="var(--success)" />, title: 'Email Address', detail: 'contact@fitnesspoint.com' },
    { icon: <Clock size={22} color="var(--warning)" />, title: 'Working Hours', detail: 'Mon–Sat: 6AM–10PM | Sun: 8AM–6PM' },
  ];

  return (
    <div style={{ marginTop: '70px', minHeight: '100vh', background: 'var(--dark)' }}>
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <div style={{ background: 'var(--grad-hero)', padding: '5rem 0', textAlign: 'center', borderBottom: '1px solid rgba(0,229,255,0.08)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 100%, rgba(0,229,255,0.1) 0%, transparent 60%)' }} />
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="section-tag" style={{ margin: '0 auto 1.25rem' }}>Get In Touch</motion.div>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
            style={{ fontSize: 'clamp(2.25rem, 5vw, 3.5rem)', fontWeight: 900, letterSpacing: '-0.03em', marginBottom: '1rem' }}>
            We're Here To <span className="gradient-text">Help You</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            className="section-subtitle" style={{ margin: '0 auto' }}>
            Got questions? We'd love to hear from you. Send a message and we'll respond within 24 hours.
          </motion.p>
        </div>
      </div>

      <div className="container section">
        <div className="contact-grid">
          {/* ── Left: Info ─────────────────────────────────────────────── */}
          <div>
            <motion.h2 {...fadeUp()} style={{ fontSize: '1.85rem', fontWeight: 900, letterSpacing: '-0.02em', marginBottom: '1rem' }}>
              Get In Touch
            </motion.h2>
            <motion.p {...fadeUp(0.1)} style={{ color: 'var(--text-light)', marginBottom: '2.5rem', lineHeight: '1.85' }}>
              Whether you want to learn about memberships, schedule personal training, or join our team as a certified coach — we're always ready to help.
            </motion.p>

            <div className="contact-info">
              {contactItems.map((item, i) => (
                <motion.div key={i} className="contact-info-item" {...fadeUp(i * 0.08)}>
                  <div className="contact-info-icon">{item.icon}</div>
                  <div>
                    <h4>{item.title}</h4>
                    <p>{item.detail}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Social links */}
            <motion.div {...fadeUp(0.4)} style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid rgba(0,229,255,0.08)' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1rem', color: 'var(--text-muted)' }}>Follow Us</h4>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                {['F', 'T', 'I', 'Y'].map((s, i) => (
                  <div key={i} className="footer-social" style={{ cursor: 'pointer' }}><strong>{s}</strong></div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* ── Right: Form ────────────────────────────────────────────── */}
          <motion.div {...fadeUp(0.15)}>
            <div className="card-premium" style={{ padding: '2.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
                <div style={{ width: 44, height: 44, borderRadius: 'var(--radius)', background: 'rgba(0,229,255,0.1)', border: '1px solid rgba(0,229,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <MessageSquare size={20} color="var(--primary)" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Send a Message</h3>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>We reply within 24 hours</p>
                </div>
              </div>

              <AnimatePresence>
                {feedback && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', background: feedback.type === 'success' ? 'rgba(0,214,143,0.1)' : 'rgba(255,56,96,0.1)', border: `1px solid ${feedback.type === 'success' ? 'rgba(0,214,143,0.25)' : 'rgba(255,56,96,0.25)'}`, borderRadius: 'var(--radius)', padding: '1rem', marginBottom: '1.5rem', color: feedback.type === 'success' ? 'var(--success)' : 'var(--danger)', fontSize: '0.9rem', fontWeight: 500 }}>
                    {feedback.type === 'success' ? <CheckCircle size={18} style={{ flexShrink: 0, marginTop: 2 }} /> : <AlertCircle size={18} style={{ flexShrink: 0, marginTop: 2 }} />}
                    {feedback.text}
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Your Name</label>
                    <input type="text" name="name" className="form-input" required placeholder="John Doe"
                      value={formData.name} onChange={handleChange} />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Email Address</label>
                    <input type="email" name="email" className="form-input" required placeholder="name@example.com"
                      value={formData.email} onChange={handleChange} />
                  </div>
                </div>

                <div className="form-group" style={{ marginTop: '1rem' }}>
                  <label className="form-label">Subject</label>
                  <input type="text" name="subject" className="form-input" required placeholder="How can we help you?"
                    value={formData.subject} onChange={handleChange} />
                </div>

                <div className="form-group">
                  <label className="form-label">Message</label>
                  <textarea name="message" className="form-textarea" required placeholder="Describe your question or request in detail..."
                    value={formData.message} onChange={handleChange} style={{ minHeight: '150px' }} />
                </div>

                <motion.button type="submit" className="btn btn-primary btn-shine"
                  style={{ width: '100%', justifyContent: 'center', padding: '1rem', marginTop: '0.5rem' }}
                  disabled={submitting} whileTap={{ scale: 0.97 }}>
                  {submitting
                    ? <><div className="spinner spinner-sm" style={{ borderTopColor: 'var(--dark)' }} /> Sending...</>
                    : <><Send size={18} /> Send Message</>
                  }
                </motion.button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
