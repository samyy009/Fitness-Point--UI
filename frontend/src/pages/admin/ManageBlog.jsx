import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import { BookOpen, Plus, Edit2, Trash2, Calendar, Globe, Folder, Image, FileText } from 'lucide-react';

export default function ManageBlog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPost, setEditingPost] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    image_url: '',
    category: 'General',
    is_published: true
  });

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      // Fetching blog posts
      const res = await api.get('/blog');
      setPosts(res.data);
    } catch (err) {
      console.error('Error fetching blog posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (post) => {
    setEditingPost(post);
    setFormData({
      title: post.title || '',
      excerpt: post.excerpt || '',
      content: post.content || '',
      image_url: post.image_url || '',
      category: post.category || 'General',
      is_published: post.is_published !== false
    });
  };

  const handleCancelEdit = () => {
    setEditingPost(null);
    setFormData({ title: '', excerpt: '', content: '', image_url: '', category: 'General', is_published: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        is_published: Boolean(formData.is_published)
      };

      if (editingPost) {
        await api.put(`/blog/${editingPost.id}`, payload);
        setEditingPost(null);
      } else {
        await api.post('/blog', payload);
      }
      setFormData({ title: '', excerpt: '', content: '', image_url: '', category: 'General', is_published: true });
      fetchPosts();
    } catch (err) {
      console.error(err);
      alert('Failed to save blog post.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this blog post permanently?')) return;
    try {
      await api.delete(`/blog/${id}`);
      fetchPosts();
    } catch (err) {
      console.error(err);
      alert('Failed to delete blog post.');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.4 }}
      style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '2rem' }}
    >
      {/* Editor Form */}
      <div className="card-glass" style={{ padding: '2.5rem', height: 'fit-content' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {editingPost ? (
            <>
              <Edit2 size={18} style={{ color: 'var(--primary)' }} />
              <span>Edit Article</span>
            </>
          ) : (
            <>
              <Plus size={18} style={{ color: 'var(--primary)' }} />
              <span>Create Article</span>
            </>
          )}
        </h3>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <FileText size={14} /> Article Title
            </label>
            <input 
              type="text" 
              className="form-input" 
              value={formData.title} 
              onChange={(e) => setFormData({ ...formData, title: e.target.value })} 
              required 
            />
          </div>

          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <FileText size={14} /> Excerpt / Summary
            </label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="Brief 1-sentence hook..."
              value={formData.excerpt} 
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })} 
            />
          </div>

          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <BookOpen size={14} /> Article Content
            </label>
            <textarea 
              className="form-textarea" 
              style={{ minHeight: '180px' }}
              placeholder="Write full post details here..."
              value={formData.content} 
              onChange={(e) => setFormData({ ...formData, content: e.target.value })} 
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Folder size={14} /> Category
              </label>
              <select 
                className="form-select" 
                value={formData.category} 
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="General">General</option>
                <option value="Nutrition">Nutrition</option>
                <option value="Workouts">Workouts</option>
                <option value="Health">Health</option>
                <option value="Motivation">Motivation</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Image size={14} /> Cover Image URL
              </label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="e.g. /assets/gallery1.jpg"
                value={formData.image_url} 
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })} 
              />
            </div>
          </div>

          <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: '1.25rem 0' }}>
            <input 
              type="checkbox" 
              id="is_published"
              style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              checked={formData.is_published} 
              onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })} 
            />
            <label htmlFor="is_published" style={{ margin: 0, cursor: 'pointer', fontSize: '0.9rem', color: 'var(--text-light)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Globe size={14} /> Publish immediately (visible on site)
            </label>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem' }}>
            <button type="submit" className="btn btn-primary btn-shine" style={{ flex: 1, justifyContent: 'center' }}>
              {editingPost ? 'Save Article' : 'Publish Article'}
            </button>
            {editingPost && (
              <button type="button" className="btn btn-dark" onClick={handleCancelEdit}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Articles List */}
      <div className="card-glass" style={{ padding: '2.5rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <BookOpen size={18} className="gradient-text" />
          <span>Blog Articles</span>
        </h3>

        {loading ? (
          <LoadingSpinner />
        ) : posts.length === 0 ? (
          <div className="empty-state" style={{ padding: '3rem 1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            <p>No blog posts published yet.</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Published Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.map(post => (
                  <tr key={post.id}>
                    <td>
                      <strong style={{ fontSize: '0.9rem', color: 'var(--white)' }}>{post.title}</strong>
                    </td>
                    <td><span className="badge badge-accent">{post.category || 'General'}</span></td>
                    <td style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Calendar size={12} />
                        {new Date(post.createdAt || post.publishedAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <button className="btn btn-dark btn-sm" onClick={() => handleEditClick(post)} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                          <Edit2 size={12} /> Edit
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(post.id)} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                          <Trash2 size={12} /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </motion.div>
  );
}
