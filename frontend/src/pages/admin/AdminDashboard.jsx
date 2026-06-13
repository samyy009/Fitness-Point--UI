import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import { 
  Users, 
  CreditCard, 
  Calendar, 
  Mail, 
  ArrowUpRight,
  DollarSign,
  Activity,
  Award,
  BookOpen
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from 'recharts';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    api.get('/admin/stats')
      .then(res => {
        setStats(res.data);
        const data = res.data;
        setChartData([
          { name: 'Users', value: data.totalUsers, color: 'var(--primary)' },
          { name: 'Active Plans', value: data.totalMemberships, color: 'var(--success)' },
          { name: 'Classes', value: data.totalClasses, color: 'var(--info)' },
          { name: 'Inquiries', value: data.unreadMessages, color: 'var(--danger)' }
        ]);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <LoadingSpinner />;
  if (!stats) return <div style={{ color: 'var(--danger)', textAlign: 'center', padding: '4rem 0' }}>Failed to load dashboard metrics.</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{ display: 'grid', gap: '2rem' }}
    >
      {/* Stats Grid */}
      <div className="admin-stats-grid">
        <motion.div className="stat-card" whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
          <div className="stat-icon" style={{ background: 'rgba(0,229,255,0.1)', color: 'var(--primary)' }}>
            <Users size={20} />
          </div>
          <div>
            <div className="stat-value">{stats.totalUsers}</div>
            <div className="stat-label">Registered Users</div>
          </div>
        </motion.div>

        <motion.div className="stat-card" whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
          <div className="stat-icon" style={{ background: 'rgba(0,214,143,0.1)', color: 'var(--success)' }}>
            <CreditCard size={20} />
          </div>
          <div>
            <div className="stat-value">{stats.totalMemberships}</div>
            <div className="stat-label">Active Plans</div>
          </div>
        </motion.div>

        <motion.div className="stat-card" whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
          <div className="stat-icon" style={{ background: 'rgba(59,130,246,0.1)', color: 'var(--info)' }}>
            <Calendar size={20} />
          </div>
          <div>
            <div className="stat-value">{stats.totalClasses}</div>
            <div className="stat-label">Active Classes</div>
          </div>
        </motion.div>

        <motion.div className="stat-card" whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
          <div className="stat-icon" style={{ background: 'rgba(255,56,96,0.1)', color: 'var(--danger)' }}>
            <Mail size={20} />
          </div>
          <div>
            <div className="stat-value">{stats.unreadMessages}</div>
            <div className="stat-label">Unread Messages</div>
          </div>
        </motion.div>
      </div>

      {/* Chart and Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
        {/* Recharts Bar Chart */}
        <div className="card-glass" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem' }}>System Distribution</h3>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ background: 'var(--dark-3)', border: '1px solid rgba(0,229,255,0.15)', borderRadius: '8px' }}
                  labelStyle={{ fontWeight: 'bold', color: '#fff' }}
                  cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                />
                <Bar dataKey="value" name="Total Count" radius={[6, 6, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Financial Analytics */}
        <div className="card-glass" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem' }}>Financial & Activity</h3>
            <div style={{ display: 'grid', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.85rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}><DollarSign size={16} /> Monthly Revenue</span>
                <strong style={{ color: 'var(--success)', fontSize: '1.05rem' }}>${stats.revenue}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.85rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}><Activity size={16} /> Workouts (Past 7d)</span>
                <strong style={{ color: 'var(--white)', fontSize: '1.05rem' }}>{stats.recentWorkouts}</strong>
              </div>
            </div>
          </div>
          <div style={{ marginTop: '2rem' }}>
            <Link to="/admin/messages" className="btn btn-outline btn-sm" style={{ width: '100%', justifyContent: 'center', gap: '0.35rem' }}>
              <Mail size={14} /> View Contact Inquiries <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Admin Actions */}
      <div className="card-glass" style={{ padding: '2.5rem' }}>
        <h2 style={{ fontSize: '1.35rem', fontWeight: '800', marginBottom: '1.5rem' }}>Quick Admin Actions</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
          {[
            { to: '/admin/users', icon: <Users size={20} color="var(--primary)" />, title: 'Manage Users', desc: 'Edit profiles, toggle roles, and manage permissions.' },
            { to: '/admin/trainers', icon: <Award size={20} color="var(--accent-2)" />, title: 'Manage Trainers', desc: 'Add specialty details, ratings, and bios.' },
            { to: '/admin/classes', icon: <Calendar size={20} color="var(--info)" />, title: 'Manage Classes', desc: 'Configure schedules, capacities, and assign coaches.' },
            { to: '/admin/blog', icon: <BookOpen size={20} color="var(--success)" />, title: 'Manage Blog', desc: 'Write new articles, update categories, and remove posts.' },
          ].map(action => (
            <Link key={action.to} to={action.to} style={{ textDecoration: 'none' }}>
              <motion.div 
                className="card" 
                whileHover={{ y: -4, borderColor: 'rgba(0,229,255,0.2)' }}
                style={{ background: 'var(--dark-3)', padding: '1.25rem', height: '100%', border: '1px solid rgba(255,255,255,0.04)' }}
              >
                <div style={{ marginBottom: '0.75rem' }}>{action.icon}</div>
                <h4 style={{ fontWeight: '800', fontSize: '0.95rem', marginBottom: '0.35rem', color: '#fff' }}>{action.title}</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>{action.desc}</p>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
