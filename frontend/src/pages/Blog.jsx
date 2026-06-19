import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { Search, Calendar, User, ArrowRight, BookOpen } from 'lucide-react';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, delay }
});

const CATEGORIES = ['All', 'Fitness', 'Nutrition', 'Wellness', 'Training', 'Lifestyle'];
const PLACEHOLDER_EMOJI = ['💪', '🥗', '🧘', '🏋️', '🏃', '⚡'];

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const categories = ['All', ...new Set(posts.map(p => p.category).filter(Boolean).map(cat => cat.charAt(0).toUpperCase() + cat.slice(1).toLowerCase()))];

  useEffect(() => {
    api.get('/blog')
      .then(res => { setPosts(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = posts.filter(p => {
    const matchSearch = p.title?.toLowerCase().includes(searchTerm.toLowerCase()) || p.content?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat = activeCategory === 'All' || p.category?.toLowerCase() === activeCategory.toLowerCase();
    return matchSearch && matchCat;
  });

  return (
    <div style={{ marginTop: '70px', minHeight: '100vh', background: 'var(--dark)' }}>
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <div style={{ background: 'var(--grad-hero)', padding: '5rem 0', textAlign: 'center', borderBottom: '1px solid rgba(0,229,255,0.08)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 100%, rgba(0,229,255,0.1) 0%, transparent 60%)' }} />
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="section-tag" style={{ margin: '0 auto 1.25rem' }}>Articles & Insights</motion.div>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
            style={{ fontSize: 'clamp(2.25rem, 5vw, 3.5rem)', fontWeight: 900, letterSpacing: '-0.03em', marginBottom: '1rem' }}>
            Fitness <span className="gradient-text">Knowledge Hub</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            className="section-subtitle" style={{ margin: '0 auto 2.5rem' }}>
            Expert articles on nutrition, workouts, and health tips to keep you on track.
          </motion.p>
          {/* Search */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
            style={{ maxWidth: 520, margin: '0 auto', position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input type="text" className="form-input" placeholder="Search articles..." value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '3rem', background: 'rgba(8,15,26,0.8)', backdropFilter: 'blur(20px)', border: '1px solid rgba(0,229,255,0.2)', fontSize: '1rem' }} />
          </motion.div>
        </div>
      </div>

      {/* ── Category Filter ────────────────────────────────────────────── */}
      <div style={{ background: 'var(--dark-2)', borderBottom: '1px solid rgba(0,229,255,0.08)', position: 'sticky', top: '70px', zIndex: 50 }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', padding: '1rem 2rem', flexWrap: 'wrap' }}>
          {categories.map(cat => (
            <motion.button key={cat} whileTap={{ scale: 0.95 }}
               className={`btn btn-sm ${activeCategory === cat ? 'btn-primary' : 'btn-ghost'}`}
               onClick={() => setActiveCategory(cat)}>
              {cat}
            </motion.button>
          ))}
        </div>
      </div>

      {/* ── Blog Grid ─────────────────────────────────────────────────── */}
      <div className="container" style={{ padding: '3rem 2rem' }}>
        {loading ? <LoadingSpinner /> : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon"><BookOpen size={48} /></div>
            <p>No articles found. Check back later!</p>
            {searchTerm && <button className="btn btn-outline btn-sm" style={{ marginTop: '1rem' }} onClick={() => setSearchTerm('')}>Clear Search</button>}
          </div>
        ) : (
          <motion.div className="blog-grid" layout>
            <AnimatePresence mode="wait">
              {filtered.map((post, idx) => (
                <motion.div key={post.id} className="blog-card"
                  initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }} transition={{ delay: idx * 0.07 }}
                  whileHover={{ y: -6 }}>
                  <div className="blog-img-wrap">
                    {post.imageUrl
                      ? <img src={post.imageUrl} alt={post.title} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <div className="blog-img">{PLACEHOLDER_EMOJI[idx % PLACEHOLDER_EMOJI.length]}</div>
                    }
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(2,3,9,0.7) 0%, transparent 60%)' }} />
                    <span className="badge badge-accent" style={{ position: 'absolute', top: '1rem', left: '1rem' }}>
                      {post.category || 'Fitness'}
                    </span>
                  </div>
                  <div className="blog-body">
                    <div className="blog-meta">
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        <Calendar size={12} />{new Date(post.createdAt || post.publishedAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                      <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'var(--text-muted)', display: 'inline-block' }} />
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        <User size={12} /> {post.Author?.name || 'Admin'}
                      </span>
                    </div>
                    <h3>{post.title}</h3>
                    <p>{post.content?.substring(0, 130)}...</p>
                    <div className="blog-footer">
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {Math.ceil((post.content?.length || 600) / 800)} min read
                      </div>
                      <motion.button whileTap={{ scale: 0.95 }}
                        className="btn btn-outline btn-sm" style={{ gap: '0.35rem' }}>
                        Read More <ArrowRight size={14} />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* ── Newsletter CTA ────────────────────────────────────────────── */}
      <section style={{ background: 'var(--dark-3)', borderTop: '1px solid rgba(0,229,255,0.08)', padding: '5rem 0', textAlign: 'center' }}>
        <motion.div className="container" {...fadeUp()}>
          <div className="section-tag" style={{ margin: '0 auto 1.25rem' }}>Newsletter</div>
          <h2 className="section-title" style={{ marginBottom: '1rem' }}>
            Stay in the <span className="gradient-text">Loop</span>
          </h2>
          <p style={{ color: 'var(--text-light)', maxWidth: 480, margin: '0 auto 2.5rem', lineHeight: '1.8' }}>
            Get the latest fitness tips, workout plans, and nutrition guides delivered to your inbox weekly.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', maxWidth: 480, margin: '0 auto', flexWrap: 'wrap', justifyContent: 'center' }}>
            <input type="email" className="form-input" placeholder="Enter your email" style={{ flex: 1, minWidth: 240 }} />
            <button className="btn btn-primary btn-shine">Subscribe <ArrowRight size={16} /></button>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
