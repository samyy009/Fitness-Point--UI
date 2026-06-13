import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Check, X, Clock, User, MessageSquare } from 'lucide-react';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function ManageBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBookings = async () => {
    try {
      const res = await api.get('/admin/bookings');
      setBookings(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load bookings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      await api.put(`/admin/bookings/${id}`, { status });
      // Update locally
      setBookings(bookings.map(b => b.id === id ? { ...b, status } : b));
    } catch (err) {
      alert('Failed to update booking status.');
    }
  };

  const getStatusBadge = (status) => {
    if (status === 'approved') return <span className="badge badge-success">Approved</span>;
    if (status === 'rejected') return <span className="badge badge-danger">Rejected</span>;
    return <span className="badge badge-warning">Pending</span>;
  };

  if (loading) return <LoadingSpinner />;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="card"
      style={{ marginTop: '1rem', border: '1px solid rgba(0,229,255,0.08)' }}
    >
      <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Calendar size={20} color="var(--primary)" /> Manage Trainer Bookings
      </h2>

      {error && (
        <div style={{ color: 'var(--danger)', marginBottom: '1rem', fontSize: '0.85rem' }}>{error}</div>
      )}

      {bookings.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
          No session bookings have been requested.
        </div>
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Member</th>
                <th>Trainer</th>
                <th>Schedule</th>
                <th>Notes</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id}>
                  <td>
                    <div style={{ fontWeight: '700', color: '#fff' }}>{b.user?.name || 'Unknown User'}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{b.user?.email}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: '600', color: 'var(--primary)' }}>{b.trainer?.name || 'Expert Trainer'}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{b.trainer?.specialty}</div>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Clock size={12} color="var(--primary)" /> {b.date} at {b.time}
                    </div>
                  </td>
                  <td style={{ maxWidth: '200px', fontSize: '0.8rem', color: 'var(--text-light)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {b.notes || '—'}
                  </td>
                  <td>{getStatusBadge(b.status)}</td>
                  <td>
                    {b.status === 'pending' ? (
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => handleUpdateStatus(b.id, 'approved')}
                          className="btn btn-success btn-sm"
                          style={{ padding: '0.35rem 0.65rem', borderRadius: '6px' }}
                          title="Approve Booking"
                        >
                          <Check size={14} />
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(b.id, 'rejected')}
                          className="btn btn-danger btn-sm"
                          style={{ padding: '0.35rem 0.65rem', borderRadius: '6px' }}
                          title="Reject Booking"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Resolved</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
}
