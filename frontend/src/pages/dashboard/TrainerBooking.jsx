import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Star, Heart, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function TrainerBooking() {
  const [trainers, setTrainers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedTrainer, setSelectedTrainer] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('08:00 AM');
  const [notes, setNotes] = useState('');
  
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState(null);

  const fetchBookings = async () => {
    try {
      const res = await api.get('/admin/bookings/me');
      setBookings(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const [trainersRes, bookingsRes] = await Promise.all([
          api.get('/trainers').catch(() => ({
            data: [
              { id: 1, name: 'John Doe', specialty: 'Bodybuilding & Strength' },
              { id: 2, name: 'Jane Smith', specialty: 'Cardio & Nutrition' },
              { id: 3, name: 'Mike Johnson', specialty: 'Conditioning & CrossFit' },
              { id: 4, name: 'Sarah Lee', specialty: 'Yoga & Pilates' }
            ]
          })),
          api.get('/admin/bookings/me').catch(() => ({ data: [] }))
        ]);
        setTrainers(trainersRes.data);
        setBookings(bookingsRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!selectedTrainer || !date || !time) return;

    setSubmitting(true);
    setMsg(null);

    try {
      await api.post('/admin/bookings', {
        trainerId: selectedTrainer,
        date,
        time,
        notes
      });
      setMsg({ type: 'success', text: '🎉 Booking requested successfully!' });
      setSelectedTrainer('');
      setDate('');
      setNotes('');
      fetchBookings();
    } catch (err) {
      setMsg({ type: 'danger', text: err.response?.data?.message || 'Failed to submit booking.' });
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusStyle = (status) => {
    if (status === 'approved') return { bg: 'rgba(0,214,143,0.12)', color: 'var(--success)', label: 'Approved' };
    if (status === 'rejected') return { bg: 'rgba(255,56,96,0.12)', color: 'var(--danger)', label: 'Rejected' };
    return { bg: 'rgba(255,170,0,0.12)', color: 'var(--warning)', label: 'Pending' };
  };

  const timeSlots = [
    '06:00 AM', '08:00 AM', '10:00 AM', '12:00 PM', '02:00 PM', '04:00 PM', '06:00 PM'
  ];

  if (loading) return <LoadingSpinner />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem', marginTop: '1rem' }}
    >
      {/* Booking Form Card */}
      <div className="card-premium" style={{ border: '1px solid rgba(0,229,255,0.08)' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Calendar size={20} color="var(--primary)" /> Book Trainer Session
        </h2>

        {msg && (
          <div style={{
            padding: '0.85rem',
            background: msg.type === 'success' ? 'rgba(0,214,143,0.08)' : 'rgba(255,56,96,0.08)',
            border: `1px solid ${msg.type === 'success' ? 'var(--success)' : 'var(--danger)'}`,
            color: msg.type === 'success' ? 'var(--success)' : 'var(--danger)',
            borderRadius: 'var(--radius)',
            fontSize: '0.88rem',
            fontWeight: 600,
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            {msg.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
            {msg.text}
          </div>
        )}

        <form onSubmit={handleBooking} style={{ display: 'grid', gap: '1.25rem' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Select Trainer</label>
            <select
              className="form-select"
              value={selectedTrainer}
              onChange={(e) => setSelectedTrainer(e.target.value)}
              required
            >
              <option value="">-- Choose a Trainer --</option>
              {trainers.map((t) => (
                <option key={t.id} value={t.id}>{t.name} ({t.specialty})</option>
              ))}
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Preferred Date</label>
            <input
              type="date"
              className="form-input"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Preferred Time Slot</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
              {timeSlots.map((slot) => (
                <button
                  type="button"
                  key={slot}
                  onClick={() => setTime(slot)}
                  className={`btn btn-sm ${time === slot ? 'btn-primary' : 'btn-dark'}`}
                  style={{ fontSize: '0.75rem', justifyContent: 'center', padding: '0.5rem 0' }}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Session Notes / Goals</label>
            <textarea
              className="form-textarea"
              placeholder="e.g. Weight loss training, posture correction help, injury recovery..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              style={{ minHeight: '80px' }}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-shine"
            disabled={submitting}
            style={{ justifyContent: 'center', marginTop: '0.5rem' }}
          >
            {submitting ? 'Submitting Request...' : 'Request Booking'}
          </button>
        </form>
      </div>

      {/* Booking History Card */}
      <div className="card" style={{ border: '1px solid rgba(0,229,255,0.08)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Clock size={16} color="var(--primary)" /> My Booking History
          </h3>
          <button 
            onClick={fetchBookings} 
            style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', fontWeight: 700 }}
          >
            <RefreshCw size={12} /> Sync
          </button>
        </div>

        <div style={{ display: 'grid', gap: '1rem', overflowY: 'auto', maxHeight: '420px', flexGrow: 1 }}>
          {bookings.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '4rem 0', fontSize: '0.88rem' }}>
              No trainer sessions booked yet. Request one on the left.
            </div>
          ) : (
            bookings.map((booking) => {
              const status = getStatusStyle(booking.status);
              return (
                <div 
                  key={booking.id} 
                  style={{ 
                    padding: '1rem', 
                    background: 'var(--dark-4)', 
                    borderRadius: 'var(--radius)', 
                    border: '1px solid rgba(255,255,255,0.04)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ fontWeight: 800, fontSize: '0.9rem', color: '#fff' }}>
                      {booking.trainer?.name || 'Expert Trainer'}
                    </h4>
                    <span 
                      className="badge" 
                      style={{ 
                        backgroundColor: status.bg, 
                        color: status.color, 
                        border: `1px solid ${status.color}30`,
                        fontSize: '0.65rem',
                        padding: '0.25rem 0.65rem'
                      }}
                    >
                      {status.label}
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: 'var(--text-light)' }}>
                    <span><strong>Date:</strong> {booking.date}</span>
                    <span><strong>Time:</strong> {booking.time}</span>
                  </div>

                  {booking.notes && (
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', background: 'var(--dark-3)', padding: '0.5rem 0.75rem', borderRadius: '4px', marginTop: '0.25rem' }}>
                      {booking.notes}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </motion.div>
  );
}
