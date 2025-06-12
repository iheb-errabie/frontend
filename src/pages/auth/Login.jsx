import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../index.css';
import api from '../../api';
// --- NEW: Import toast ---
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ROLE_ROUTE_MAP = {
  admin: '/DashboardAdmin',
  vendor: '/DashboardVendor',
  client: '/DashboardBuyer',
  default: '/',
};

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { email, password } = form;
      const { data } = await api.post('/users/login', { email, password });
      const user = data?.data;
      localStorage.setItem('token', user.token);
      localStorage.setItem('user', JSON.stringify(user));
      // --- NEW: Show toast on success ---
      toast.success('Login successful!', { autoClose: 1500 });
      const route = ROLE_ROUTE_MAP[user.role] || '/';
      setTimeout(() => {
        navigate(route);
      }, 1600); // Wait for toast to show
    } catch (err) {
      if (!err.response) {
        setError('Network error - please check your connection');
      } else {
        setError(err.response.data?.message || 'Login failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBackHome = () => navigate("/");

  return (
    <div className="modern-auth-bg">
      {/* --- NEW: Toast container --- */}
      <ToastContainer position="top-center" />
      <div className="modern-auth-card position-relative">
        {/* Back Arrow Button */}
        <button
          onClick={handleBackHome}
          aria-label="Back to Home"
          className="modern-back-btn"
          style={{
            position: 'absolute',
            top: 18,
            left: 18,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            zIndex: 10
          }}
        >
          <i className="bi bi-arrow-left-circle-fill" style={{ fontSize: 28, color: '#2563eb' }}></i>
        </button>
        <h2 className="modern-auth-title">Sign In</h2>
        <form onSubmit={handleSubmit} autoComplete="off" className="modern-auth-form">
          {error && <div className="modern-auth-error">{error}</div>}

          <div className="modern-form-group">
            <label htmlFor="login-email" className="modern-label">Email</label>
            <input
              id="login-email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              disabled={loading}
              required
              autoFocus
              className="modern-input"
              placeholder="e.g. user@example.com"
            />
          </div>

          <div className="modern-form-group">
            <label htmlFor="login-password" className="modern-label">Password</label>
            <input
              id="login-password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              disabled={loading}
              required
              className="modern-input"
              placeholder="Your password"
            />
          </div>

          <button
            type="submit"
            className="modern-btn"
            disabled={loading}
          >
            {loading ? (
              <span className="modern-spinner"></span>
            ) : (
              'Login'
            )}
          </button>
          <div style={{ textAlign: 'right', marginTop: '8px' }}>
  <Link to="/forgot_password" className="modern-link">Forgot password?</Link>
</div>

        </form>
        <div className="modern-auth-footer">
         <span>Don't have an account? </span>
          <Link to="/register" className="modern-link">Register here</Link>
          
        </div>
      </div>
    </div>
  );
};

export default Login;