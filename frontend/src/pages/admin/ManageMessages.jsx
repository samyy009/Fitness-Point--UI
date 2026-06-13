import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Mail, MailOpen, Trash2, User, Clock, Phone, Inbox } from 'lucide-react';

export default function ManageMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await api.get('/contact');
      setMessages(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await api.put(`/contact/${id}/read`);
      // Update local state
      setMessages(messages.map(m => m.id === id ? { ...m, is_read: true } : m));
    } catch (err) {
      console.error(err);
      alert('Failed to mark message as read.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this inquiry message permanently?')) return;
    try {
      await api.delete(`/contact/${id}`);
      setMessages(messages.filter(m => m.id !== id));
    } catch (err) {
      console.error(err);
      alert('Failed to delete message.');
    }
  };

  const filteredMessages = filter === 'All'
    ? messages
    : filter === 'Unread'
      ? messages.filter(m => !m.is_read)
      : messages.filter(m => m.is_read);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.06
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.4 }}
      className="card-glass" 
      style={{ padding: '2.5rem' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Inbox size={22} className="gradient-text" />
          <span>User Inquiries & Messages</span>
        </h2>
        
        {/* Toggle Filters */}
        <div style={{ display: 'flex', gap: '0.4rem', background: 'var(--dark-4)', padding: '0.25rem', borderRadius: '50px', border: '1px solid rgba(255,255,255,0.06)' }}>
          {['All', 'Unread', 'Read'].map(opt => (
            <button 
              key={opt} 
              className={`btn btn-sm ${filter === opt ? 'btn-primary' : ''}`}
              onClick={() => setFilter(opt)}
              style={{ 
                borderRadius: '50px', 
                background: filter === opt ? 'var(--grad-2)' : 'transparent',
                color: filter === opt ? 'var(--dark)' : 'var(--text-light)',
                border: 'none',
                boxShadow: filter === opt ? '0 4px 12px rgba(0,229,255,0.2)' : 'none',
                padding: '0.4rem 1.1rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem'
              }}
            >
              {opt === 'All' && <Inbox size={12} />}
              {opt === 'Unread' && <Mail size={12} />}
              {opt === 'Read' && <MailOpen size={12} />}
              <span>{opt}</span>
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : filteredMessages.length === 0 ? (
        <div className="empty-state" style={{ padding: '4rem 1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          <p>No messages found in this category.</p>
        </div>
      ) : (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          style={{ display: 'grid', gap: '1.25rem' }}
        >
          <AnimatePresence mode="popLayout">
            {filteredMessages.map(msg => (
              <motion.div 
                layout
                variants={itemVariants}
                key={msg.id} 
                className="card" 
                style={{ 
                  background: msg.is_read ? 'var(--dark-3)' : 'rgba(0, 229, 255, 0.03)',
                  borderColor: msg.is_read ? 'rgba(255,255,255,0.06)' : 'rgba(0, 229, 255, 0.2)',
                  padding: '1.75rem',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {!msg.is_read && (
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '4px',
                    height: '100%',
                    background: 'var(--grad-2)'
                  }} />
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '1rem', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <h4 style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--white)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {msg.is_read ? <MailOpen size={16} style={{ color: 'var(--text-muted)' }} /> : <Mail size={16} style={{ color: 'var(--primary)' }} />}
                      {msg.subject || 'No Subject'}
                    </h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                        <User size={12} style={{ color: 'var(--primary)' }} />
                        <strong>{msg.name}</strong>
                      </span>
                      <span style={{ color: 'var(--text-muted)' }}>•</span>
                      <span>{msg.email}</span>
                      {msg.phone && (
                        <>
                          <span style={{ color: 'var(--text-muted)' }}>•</span>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                            <Phone size={12} style={{ color: 'var(--text-muted)' }} />
                            <span>{msg.phone}</span>
                          </span>
                        </>
                      )}
                    </p>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Clock size={12} />
                    <span>{new Date(msg.createdAt || msg.created_at).toLocaleString()}</span>
                  </div>
                </div>

                <p style={{ color: 'var(--text-light)', fontSize: '0.95rem', lineHeight: '1.7', whiteSpace: 'pre-wrap' }}>
                  {msg.message}
                </p>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  {!msg.is_read && (
                    <button className="btn btn-primary btn-sm" onClick={() => handleMarkRead(msg.id)} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                      <MailOpen size={12} /> Mark as Read
                    </button>
                  )}
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(msg.id)} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Trash2 size={12} /> Delete Message
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </motion.div>
  );
}
