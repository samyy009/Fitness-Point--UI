import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import CartDrawer from './CartDrawer';
import { 
  LayoutDashboard, ShieldCheck, LogOut, Menu, X, Zap, 
  ShoppingBag, Sun, Moon 
} from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (theme === 'light') {
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/');
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
    { to: '/classes', label: 'Classes' },
    { to: '/trainers', label: 'Trainers' },
    { to: '/plans', label: 'Plans' },
    { to: '/store', label: 'Store' },
    { to: '/blog', label: 'Blog' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="container nav-inner">
        {/* Logo */}
        <Link to="/" className="nav-logo" onClick={() => setMobileOpen(false)}>
          <Zap size={20} color="var(--primary)" strokeWidth={3} />
          Fitness <span>Point</span>
        </Link>

        {/* Desktop Links */}
        <div className="nav-links">
          {navLinks.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        {/* Actions */}
        <div className="nav-actions" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: 'var(--white)', 
              cursor: 'pointer', 
              display: 'flex', 
              alignItems: 'center', 
              padding: '0.4rem',
              transition: 'color 0.3s'
            }}
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* Cart Trigger */}
          <div 
            style={{ position: 'relative', display: 'flex', alignItems: 'center', cursor: 'pointer', padding: '0.4rem' }} 
            onClick={() => setCartOpen(true)}
          >
            <ShoppingBag 
              size={20} 
              style={{ 
                color: 'var(--white)', 
                transition: 'color 0.3s' 
              }} 
              className="nav-cart-icon"
            />
            {cartCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  background: 'var(--grad-3)',
                  color: '#fff',
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  borderRadius: '50%',
                  width: '16px',
                  height: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 8px rgba(255,107,107,0.4)'
                }}
              >
                {cartCount}
              </motion.span>
            )}
          </div>

          {user ? (
            <div style={{ position: 'relative' }}>
              <div className="user-avatar" onClick={() => setDropdownOpen(!dropdownOpen)}>
                {user.name.charAt(0).toUpperCase()}
              </div>
              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    className="user-dropdown"
                    initial={{ opacity: 0, scale: 0.9, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: '0.35rem' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{user.name}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{user.email}</div>
                    </div>
                    <Link to="/dashboard" onClick={() => setDropdownOpen(false)}>
                      <LayoutDashboard size={15} /> Dashboard
                    </Link>
                    {user.role === 'admin' && (
                      <Link to="/admin" onClick={() => setDropdownOpen(false)}>
                        <ShieldCheck size={15} /> Admin Panel
                      </Link>
                    )}
                    <button onClick={handleLogout} style={{ color: 'var(--danger)' }}>
                      <LogOut size={15} /> Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <Link to="/login" className="btn btn-ghost btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm btn-shine">Get Started</Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="nav-mobile-btn" onClick={() => setMobileOpen(true)}>
          <Menu size={22} />
        </button>
      </div>

      {/* Mobile Nav Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="nav-mobile"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            style={{ left: 'auto', width: '80%', maxWidth: '340px', boxShadow: '-20px 0 60px rgba(0,0,0,0.6)' }}
          >
            <div className="nav-mobile-header">
              <span className="nav-logo">Fitness <span>Point</span></span>
              <button
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '8px', width: '38px', height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                onClick={() => setMobileOpen(false)}
              >
                <X size={18} />
              </button>
            </div>
            <div className="nav-mobile-links">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.to}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                >
                  <Link to={link.to} className="nav-mobile-link" onClick={() => setMobileOpen(false)}>
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', margin: '0.75rem 0' }} />
              {user ? (
                <>
                  <Link to="/dashboard" className="nav-mobile-link" onClick={() => setMobileOpen(false)}>Dashboard</Link>
                  {user.role === 'admin' && (
                    <Link to="/admin" className="nav-mobile-link" onClick={() => setMobileOpen(false)}>Admin Panel</Link>
                  )}
                  <button
                    className="nav-mobile-link"
                    style={{ background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', color: 'var(--danger)', width: '100%' }}
                    onClick={() => { handleLogout(); setMobileOpen(false); }}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="nav-mobile-link" onClick={() => setMobileOpen(false)}>Login</Link>
                  <Link to="/register" className="btn btn-primary" style={{ marginTop: '1rem', textAlign: 'center', justifyContent: 'center' }} onClick={() => setMobileOpen(false)}>Get Started</Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart Drawer */}
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </nav>
  );
}
