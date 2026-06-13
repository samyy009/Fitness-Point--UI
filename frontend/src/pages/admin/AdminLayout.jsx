import { useState } from 'react';
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  Award,
  Calendar,
  CreditCard,
  BookOpen,
  MessageSquare,
  TrendingUp,
  Home,
  LogOut,
  Menu,
  X,
  Zap,
  ShieldCheck,
  Image
} from 'lucide-react';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { to: '/admin', label: 'Overview', icon: <LayoutDashboard size={18} />, end: true },
    { to: '/admin/users', label: 'Manage Users', icon: <Users size={18} /> },
    { to: '/admin/trainers', label: 'Manage Trainers', icon: <Award size={18} /> },
    { to: '/admin/classes', label: 'Manage Classes', icon: <Calendar size={18} /> },
    { to: '/admin/plans', label: 'Manage Plans', icon: <CreditCard size={18} /> },
    { to: '/admin/bookings', label: 'Manage Bookings', icon: <Calendar size={18} /> }, // Matches the trainer booking icon
    { to: '/admin/gallery', label: 'Manage Gallery', icon: <Image size={18} /> },
    { to: '/admin/blog', label: 'Manage Blog', icon: <BookOpen size={18} /> },
    { to: '/admin/messages', label: 'Messages', icon: <MessageSquare size={18} /> },
  ];

  const sidebarContent = (isMobile = false) => (
    <>
      <div className="dash-logo" style={{ display: 'grid', gap: '0.5rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={() => setMobileOpen(false)}>
            <Zap size={20} color="var(--primary)" strokeWidth={3} />
            <span>Fitness <span>Point</span></span>
          </Link>
          {isMobile && (
            <button 
              onClick={() => setMobileOpen(false)}
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '8px', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            >
              <X size={16} />
            </button>
          )}
        </div>
        <span className="admin-sidebar-badge" style={{ width: 'fit-content', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
          <ShieldCheck size={12} /> Admin Panel
        </span>
      </div>

      {/* Admin Profile Details */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', background: 'var(--dark-3)', border: '1px solid rgba(255,56,96,0.15)', borderRadius: 'var(--radius-lg)', marginBottom: '2rem' }}>
        <div className="user-avatar" style={{ width: '36px', height: '36px', fontSize: '0.9rem', cursor: 'default', margin: 0, background: 'rgba(255,56,96,0.15)', color: 'var(--danger)', border: '1px solid rgba(255,56,96,0.25)' }}>
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#fff' }}>{user?.name}</div>
          <div style={{ fontSize: '0.72rem', color: 'var(--danger)', fontWeight: 600 }}>Administrator</div>
        </div>
      </div>

      <nav className="dash-nav" style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) => `dash-nav-item ${isActive ? 'active' : ''}`}
            onClick={() => setMobileOpen(false)}
          >
            {item.icon} {item.label}
          </NavLink>
        ))}
      </nav>

      <div style={{ marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1.25rem', display: 'grid', gap: '0.35rem' }}>
        <Link to="/dashboard" className="dash-nav-item" style={{ color: 'var(--primary)' }} onClick={() => setMobileOpen(false)}>
          <TrendingUp size={18} /> User Dashboard
        </Link>
        <Link to="/" className="dash-nav-item" onClick={() => setMobileOpen(false)}>
          <Home size={18} /> Back to Site
        </Link>
        <button onClick={handleLogout} className="dash-nav-item" style={{ color: 'var(--danger)', width: '100%', display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <LogOut size={18} /> Log Out
        </button>
      </div>
    </>
  );

  return (
    <div className="admin-layout">
      {/* Desktop Sidebar */}
      <aside className="admin-sidebar" style={{ overflowY: 'auto' }}>
        {sidebarContent(false)}
      </aside>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0,0,0,0.75)',
                backdropFilter: 'blur(4px)',
                zIndex: 999
              }}
            />
            {/* Sidebar drawer */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              style={{
                position: 'fixed',
                top: 0, bottom: 0, left: 0,
                width: '280px',
                background: 'var(--dark-2)',
                borderRight: '1px solid rgba(0,229,255,0.08)',
                padding: '1.75rem 1.25rem',
                display: 'flex',
                flexDirection: 'column',
                zIndex: 1000,
                boxShadow: '10px 0 40px rgba(0,0,0,0.5)',
                overflowY: 'auto'
              }}
            >
              {sidebarContent(true)}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Panel */}
      <main className="admin-main" style={{ display: 'flex', flexDirection: 'column' }}>
        {/* Mobile Header Bar */}
        <div className="admin-mobile-header" style={{ display: 'none', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 0', borderBottom: '1px solid rgba(0,229,255,0.08)', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              onClick={() => setMobileOpen(true)}
              style={{ background: 'rgba(255,56,96,0.08)', border: '1px solid rgba(255,56,96,0.2)', color: 'var(--danger)', borderRadius: '8px', width: '38px', height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            >
              <Menu size={20} />
            </button>
            <span style={{ fontFamily: 'Outfit', fontWeight: 900, fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Zap size={16} color="var(--primary)" /> Fitness <span>Point</span>
            </span>
          </div>
          <div className="user-avatar" style={{ width: '36px', height: '36px', fontSize: '0.9rem', cursor: 'default', margin: 0, background: 'rgba(255,56,96,0.15)', color: 'var(--danger)', border: '1px solid rgba(255,56,96,0.25)' }}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
        </div>

        <header className="admin-header">
          <div>
            <h1 className="gradient-text" style={{ fontSize: '2rem', fontWeight: 900, backgroundImage: 'var(--grad-3)' }}>Admin Control Panel</h1>
            <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', marginTop: '0.25rem' }}>Logged in as: <strong>{user?.name}</strong> (Administrator)</p>
          </div>
          <div className="user-avatar" style={{ cursor: 'default', userSelect: 'none', background: 'rgba(255,56,96,0.15)', color: 'var(--danger)', border: '1px solid rgba(255,56,96,0.25)' }}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
        </header>

        <Outlet />
      </main>
    </div>
  );
}
