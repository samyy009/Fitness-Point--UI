import { useState } from 'react';
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Dumbbell,
  Apple,
  CheckSquare,
  TrendingUp,
  User,
  Shield,
  Home,
  LogOut,
  Menu,
  X,
  Zap,
  Scale,
  Droplet,
  Calendar
} from 'lucide-react';

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { to: '/dashboard', label: 'Overview', icon: <LayoutDashboard size={18} />, end: true },
    { to: '/dashboard/workouts', label: 'Workouts', icon: <Dumbbell size={18} /> },
    { to: '/dashboard/meals', label: 'Meal Logs', icon: <Apple size={18} /> },
    { to: '/dashboard/habits', label: 'Habit Tracker', icon: <CheckSquare size={18} /> },
    { to: '/dashboard/progress', label: 'Progress Logs', icon: <TrendingUp size={18} /> },
    { to: '/dashboard/bmi', label: 'BMI Calculator', icon: <Scale size={18} /> },
    { to: '/dashboard/calories', label: 'Calorie Counter', icon: <Zap size={18} /> },
    { to: '/dashboard/water', label: 'Water Tracker', icon: <Droplet size={18} /> },
    { to: '/dashboard/booking', label: 'Book Trainer', icon: <Calendar size={18} /> },
    { to: '/dashboard/profile', label: 'My Profile', icon: <User size={18} /> },
  ];

  const sidebarContent = (isMobile = false) => (
    <>
      <div className="dash-logo" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
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

      {/* User profile brief card in sidebar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', background: 'var(--dark-3)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 'var(--radius-lg)', marginBottom: '2rem' }}>
        <div className="user-avatar" style={{ width: '36px', height: '36px', fontSize: '0.9rem', cursor: 'default', margin: 0 }}>
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#fff' }}>{user?.name}</div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{user?.role === 'admin' ? 'Administrator' : 'Premium Member'}</div>
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

        {user?.role === 'admin' && (
          <Link to="/admin" className="dash-nav-item" style={{ color: 'var(--accent-2)', border: '1px solid rgba(168,85,247,0.15)', background: 'rgba(168,85,247,0.03)' }} onClick={() => setMobileOpen(false)}>
            <Shield size={18} /> Admin Panel
          </Link>
        )}
      </nav>

      <div style={{ marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1.25rem', display: 'grid', gap: '0.35rem' }}>
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
    <div className="dash-layout">
      {/* Desktop Sidebar */}
      <aside className="dash-sidebar" style={{ overflowY: 'auto' }}>
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
      <main className="dash-main" style={{ display: 'flex', flexDirection: 'column' }}>
        {/* Mobile Header Bar */}
        <div className="dash-mobile-header" style={{ display: 'none', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 0', borderBottom: '1px solid rgba(0,229,255,0.08)', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              onClick={() => setMobileOpen(true)}
              style={{ background: 'rgba(0,229,255,0.08)', border: '1px solid rgba(0,229,255,0.2)', color: 'var(--primary)', borderRadius: '8px', width: '38px', height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            >
              <Menu size={20} />
            </button>
            <span style={{ fontFamily: 'Outfit', fontWeight: 900, fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Zap size={16} color="var(--primary)" /> Fitness <span>Point</span>
            </span>
          </div>
          <div className="user-avatar" style={{ width: '36px', height: '36px', fontSize: '0.9rem', cursor: 'default', margin: 0 }}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
        </div>

        <header className="dash-header">
          <div>
            <h1 className="gradient-text" style={{ fontSize: '2rem', fontWeight: 900 }}>User Dashboard</h1>
            <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', marginTop: '0.25rem' }}>Welcome back, <strong>{user?.name}</strong>!</p>
          </div>
          <div className="user-avatar" style={{ cursor: 'default', userSelect: 'none' }}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
        </header>

        <Outlet />
      </main>
    </div>
  );
}
