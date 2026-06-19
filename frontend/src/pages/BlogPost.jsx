import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get(`/blog/${slug}`)
      .then(res => {
        setPost(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load blog post:', err);
        setError('Post not found or failed to load.');
        setLoading(false);
      });
  }, [slug]);

  if (loading) return <LoadingSpinner fullPage />;
  if (error) {
    return (
      <div style={{ marginTop: '100px', textAlign: 'center', minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <h2 style={{ color: 'var(--danger)' }}>{error}</h2>
        <Link to="/blog" className="btn btn-primary" style={{ marginTop: '1.5rem' }}>Back to Blog</Link>
      </div>
    );
  }

  return (
    <div style={{ marginTop: '80px', minHeight: '100vh', background: 'var(--dark)' }}>
      {/* Blog Header / Cover Image */}
      <div 
        className="blogpost-hero"
        style={{ 
          position: 'relative', 
          height: '50vh', 
          background: `var(--blog-overlay), url(${post.imageUrl || '/assets/facility.jpg'}) center/cover no-repeat`,
          display: 'flex',
          alignItems: 'flex-end',
          paddingBottom: '3rem'
        }}
      >
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
            <span className="badge badge-primary">{post.category || 'Fitness'}</span>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>
              {new Date(post.createdAt || post.publishedAt).toLocaleDateString()}
            </span>
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: '900', lineHeight: '1.2' }}>{post.title}</h1>
          <p style={{ marginTop: '1rem', color: 'var(--text-light)', fontSize: '1rem' }}>
            Written by <strong>{post.Author?.name || 'Admin'}</strong>
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container section-sm" style={{ maxWidth: '800px' }}>
        <Link to="/blog" className="btn btn-dark btn-sm" style={{ marginBottom: '2rem' }}>
          ⬅️ Back to Blog
        </Link>
        
        <div className="card-glass" style={{ padding: '2.5rem', lineHeight: '1.9', fontSize: '1.1rem', color: 'var(--text-light)' }}>
          {/* Support line breaks in stored content */}
          {post.content?.split('\n').map((para, idx) => para.trim() && (
            <p key={idx} style={{ marginBottom: '1.5rem' }}>{para}</p>
          ))}
        </div>
      </div>
    </div>
  );
}
