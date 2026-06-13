import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Search, Edit2, ShieldAlert, UserMinus, UserCheck, ChevronLeft, ChevronRight, X, User } from 'lucide-react';

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', email: '', role: '' });

  useEffect(() => {
    fetchUsers();
  }, [page, search]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/users`, { params: { page, limit: 10, search } });
      setUsers(res.data.users);
      setPages(res.data.pages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleToggle = async (userId, currentRole) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    if (!window.confirm(`Are you sure you want to change this user's role to ${newRole}?`)) return;
    try {
      await api.put(`/admin/users/${userId}`, { role: newRole });
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert('Failed to change user role.');
    }
  };

  const handleDeactivate = async (userId) => {
    if (!window.confirm('Deactivate this user? They will not be able to log in.')) return;
    try {
      await api.delete(`/admin/users/${userId}`);
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert('Failed to deactivate user.');
    }
  };

  const handleEditClick = (user) => {
    setEditingUser(user);
    setEditForm({ name: user.name || '', email: user.email || '', role: user.role || '' });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/admin/users/${editingUser.id}`, editForm);
      setEditingUser(null);
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert('Failed to update user.');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.4 }}
      className="card-glass" 
      style={{ padding: '2.5rem' }}
    >
      <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '1.5rem' }}>Manage Registered Users</h2>

      {/* Search Input */}
      <div className="form-group" style={{ marginBottom: '2rem', position: 'relative' }}>
        <Search size={18} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        <input 
          type="text" 
          className="form-input" 
          placeholder="Search by name or email..." 
          value={search} 
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          style={{ paddingLeft: '3rem' }}
        />
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id}>
                    <td><strong>{u.name}</strong></td>
                    <td>{u.email}</td>
                    <td>
                      <span className={`badge ${u.role === 'admin' ? 'badge-danger' : 'badge-primary'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${u.is_active !== false ? 'badge-success' : 'badge-danger'}`}>
                        {u.is_active !== false ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.35rem' }}>
                        <button className="btn btn-dark btn-sm" onClick={() => handleEditClick(u)} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                          <Edit2 size={12} /> Edit
                        </button>
                        <button className="btn btn-outline btn-sm" onClick={() => handleRoleToggle(u.id, u.role)} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                          <ShieldAlert size={12} /> Role
                        </button>
                        {u.is_active !== false && (
                          <button className="btn btn-danger btn-sm" onClick={() => handleDeactivate(u.id)} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                            <UserMinus size={12} /> Disable
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination controls */}
          {pages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '2rem', alignItems: 'center' }}>
              <button className="btn btn-dark btn-sm" disabled={page === 1} onClick={() => setPage(p => p - 1)} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                <ChevronLeft size={14} /> Previous
              </button>
              <span style={{ color: 'var(--text-light)', fontSize: '0.85rem', fontWeight: 600 }}>Page {page} of {pages}</span>
              <button className="btn btn-dark btn-sm" disabled={page === pages} onClick={() => setPage(p => p + 1)} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                Next <ChevronRight size={14} />
              </button>
            </div>
          )}
        </>
      )}

      {/* Edit User Modal */}
      <AnimatePresence>
        {editingUser && (
          <div className="modal-overlay">
            <motion.div 
              className="modal"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25 }}
            >
              <div className="modal-header">
                <h3 className="modal-title">Edit User Info</h3>
                <button className="modal-close" onClick={() => setEditingUser(null)}><X size={16} /></button>
              </div>
              <form onSubmit={handleEditSubmit}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={editForm.name} 
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input 
                    type="email" 
                    className="form-input" 
                    value={editForm.email} 
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Role</label>
                  <select 
                    className="form-select" 
                    value={editForm.role} 
                    onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <button type="submit" className="btn btn-primary btn-shine" style={{ width: '100%', marginTop: '1.5rem', padding: '1rem' }}>
                  Save Changes
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
