import { useState } from 'react';
import { Link } from 'react-router-dom';

function Toast({ message, type, visible }) {
  if (!visible) return null;
  return (
    <div
      className="newsletter-toast"
      style={{ background: type === 'success' ? 'var(--primary)' : '#ff4545' }}
    >
      {type === 'success' ? '✅' : '❌'} {message}
    </div>
  );
}

export default function Footer() {
  const [email, setEmail] = useState('');
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setToast({ visible: true, message: 'Please enter a valid email address.', type: 'error' });
      setTimeout(() => setToast(t => ({ ...t, visible: false })), 3500);
      return;
    }

    setLoading(true);
    // Simulate API call
    await new Promise(res => setTimeout(res, 900));
    setLoading(false);
    setEmail('');
    setToast({ visible: true, message: 'You\'re subscribed! Welcome to Fitness Point. 🎉', type: 'success' });
    setTimeout(() => setToast(t => ({ ...t, visible: false })), 4000);
  };

  return (
    <>
      <Toast {...toast} />
      <footer className="footer">
        {/* Newsletter Banner */}
        <div className="footer-newsletter-banner">
          <div className="container">
            <div className="footer-newsletter-inner">
              <div className="footer-newsletter-text">
                <h3>🏋️ Stay Fit. Stay Informed.</h3>
                <p>Get exclusive workout tips, nutrition advice, and member deals delivered to your inbox.</p>
              </div>
              <form className="footer-newsletter-form" onSubmit={handleSubscribe}>
                <div className="footer-newsletter-input-wrap">
                  <input
                    id="newsletter-email"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Enter your email address..."
                    className="footer-newsletter-input"
                    aria-label="Newsletter email address"
                    disabled={loading}
                  />
                  <button
                    type="submit"
                    className="footer-newsletter-btn"
                    disabled={loading}
                    id="newsletter-subscribe-btn"
                  >
                    {loading ? (
                      <span className="newsletter-spinner" />
                    ) : (
                      <>Subscribe <span>→</span></>
                    )}
                  </button>
                </div>
                <p className="footer-newsletter-disclaimer">
                  🔒 No spam, ever. Unsubscribe anytime.
                </p>
              </form>
            </div>
          </div>
        </div>

        {/* Main Footer Grid */}
        <div className="container footer-grid">
          <div className="footer-col">
            <Link to="/" className="footer-logo">
              Fitness <span>Point</span>
            </Link>
            <p className="footer-desc">
              Your premium fitness destination. We offer premium gym facilities, world-class personal trainers, and customizable nutrition plans to help you reach your goals.
            </p>
            <div className="footer-socials">
              {/* Facebook */}
              <a href="#" className="footer-social" aria-label="Facebook" title="Facebook">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
              {/* Twitter/X */}
              <a href="#" className="footer-social" aria-label="Twitter" title="Twitter">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M4 4l16 16M4 20L20 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
                </svg>
              </a>
              {/* Instagram */}
              <a href="#" className="footer-social" aria-label="Instagram" title="Instagram">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <circle cx="12" cy="12" r="5" />
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                </svg>
              </a>
              {/* YouTube */}
              <a href="#" className="footer-social" aria-label="YouTube" title="YouTube">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.4a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
                  <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="var(--dark-2)" />
                </svg>
              </a>
            </div>
          </div>

          <div className="footer-col">
            <h4>Quick Links</h4>
            <div className="footer-links">
              <Link to="/">→ Home</Link>
              <Link to="/about">→ About Us</Link>
              <Link to="/classes">→ Classes</Link>
              <Link to="/trainers">→ Trainers</Link>
              <Link to="/plans">→ Pricing Plans</Link>
              <Link to="/store">→ Store</Link>
            </div>
          </div>

          <div className="footer-col">
            <h4>Community</h4>
            <div className="footer-links">
              <Link to="/blog">→ Blog & Articles</Link>
              <Link to="/contact">→ Contact Support</Link>
              <Link to="/login">→ Member Portal</Link>
              <Link to="/register">→ Join Now</Link>
              <Link to="/dashboard">→ My Dashboard</Link>
            </div>
          </div>

          <div className="footer-col">
            <h4>Contact Info</h4>
            <div className="footer-links" style={{ display: 'grid', gap: '1rem' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                <span>📍</span> 123 Fitness Street, Gymville, MH 400001
              </span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>📞</span> +91 98765 43210
              </span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>✉️</span> contact@fitnesspoint.in
              </span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>🕐</span> Mon–Sat: 5AM – 10PM
              </span>
            </div>
          </div>
        </div>

        <div className="container footer-bar">
          <p>&copy; {new Date().getFullYear()} Fitness Point. All Rights Reserved.</p>
          <p>Built for visual excellence &amp; premium user experience. 🚀</p>
        </div>
      </footer>
    </>
  );
}
