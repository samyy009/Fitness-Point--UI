import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Image, Plus, Trash2, CheckCircle, AlertCircle } from 'lucide-react';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function ManageGallery() {
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [name, setName] = useState('');
  const [change, setChange] = useState('');
  const [beforeImg, setBeforeImg] = useState('');
  const [afterImg, setAfterImg] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState(null);

  const fetchGallery = async () => {
    try {
      const res = await api.get('/admin/gallery');
      setGallery(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load gallery items.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!name || !change || !beforeImg || !afterImg) return;

    setSubmitting(true);
    setMsg(null);

    try {
      await api.post('/admin/gallery', {
        name,
        change,
        before_img: beforeImg,
        after_img: afterImg
      });
      setMsg({ type: 'success', text: '🎉 Transformation added successfully!' });
      setName('');
      setChange('');
      setBeforeImg('');
      setAfterImg('');
      fetchGallery();
    } catch (err) {
      setMsg({ type: 'danger', text: err.response?.data?.message || 'Failed to add item.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this transformation record?')) return;
    try {
      await api.delete(`/admin/gallery/${id}`);
      setGallery(gallery.filter(item => item.id !== id));
    } catch (err) {
      alert('Failed to delete gallery item.');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', marginTop: '1rem' }}
    >
      {/* Left Form */}
      <div className="card-premium" style={{ border: '1px solid rgba(0,229,255,0.08)' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Image size={20} color="var(--primary)" /> Add Transformation Card
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

        <form onSubmit={handleAdd} style={{ display: 'grid', gap: '1.25rem' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Client Name</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Alex M."
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Transformation description</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Lost 20kg in 6 Months"
              value={change}
              onChange={(e) => setChange(e.target.value)}
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Before Image URL</label>
            <input
              type="url"
              className="form-input"
              placeholder="https://..."
              value={beforeImg}
              onChange={(e) => setBeforeImg(e.target.value)}
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">After Image URL</label>
            <input
              type="url"
              className="form-input"
              placeholder="https://..."
              value={afterImg}
              onChange={(e) => setAfterImg(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-shine"
            disabled={submitting}
            style={{ justifyContent: 'center', marginTop: '0.5rem' }}
          >
            <Plus size={18} /> {submitting ? 'Adding...' : 'Add Transformation'}
          </button>
        </form>
      </div>

      {/* Right List Grid */}
      <div className="card" style={{ border: '1px solid rgba(0,229,255,0.08)' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1.5rem' }}>Existing Transformations</h3>

        {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem' }}>{error}</div>}

        <div style={{ display: 'grid', gap: '1rem', overflowY: 'auto', maxHeight: '520px' }}>
          {gallery.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '4rem 0', fontSize: '0.88rem' }}>
              No transformations logged. Add one on the left.
            </div>
          ) : (
            gallery.map((item) => (
              <div 
                key={item.id} 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between', 
                  padding: '0.85rem', 
                  background: 'var(--dark-4)', 
                  borderRadius: 'var(--radius)',
                  border: '1px solid rgba(255,255,255,0.04)'
                }}
              >
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  {/* Thumbnails before/after */}
                  <div style={{ display: 'flex', gap: '0.15rem' }}>
                    <img src={item.before_img} alt="Before" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} onError={(e)=>{e.target.src="https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=40";}} />
                    <img src={item.after_img} alt="After" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} onError={(e)=>{e.target.src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=40";}} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#fff' }}>{item.name}</h4>
                    <p style={{ fontSize: '0.75rem', color: 'var(--primary)' }}>{item.change}</p>
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(item.id)}
                  style={{ background: 'rgba(255,56,96,0.1)', border: '1px solid rgba(255,56,96,0.2)', color: 'var(--danger)', width: '32px', height: '32px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                  title="Remove Item"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </motion.div>
  );
}
