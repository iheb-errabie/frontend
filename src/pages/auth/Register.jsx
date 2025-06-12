import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'; // <-- Import toast
import api from '../../api';

const INITIAL_FORM = {
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  role: 'client',
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Register = () => {
  const [form, setForm] = useState(INITIAL_FORM);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [dirty, setDirty] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setDirty((prev) => ({ ...prev, [name]: true }));
  };

  const passwordsMatch =
    form.password && form.confirmPassword && form.password === form.confirmPassword;
  const emailValid = !form.email || EMAIL_REGEX.test(form.email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { username, email, password, confirmPassword, role } = form;
      if (!username || !email || !password || !confirmPassword || !role) {
        throw new Error('Please fill in all fields');
      }
      if (!EMAIL_REGEX.test(email)) {
        throw new Error('Please enter a valid email address');
      }
      if (password !== confirmPassword) {
        throw new Error('Passwords do not match');
      }
      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }

      await api.post('/users/register', { username, email, password, role });
      toast.success("Registration successful! You can now log in."); // <-- Success toast
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modern-auth-bg">
      <div className="modern-auth-card compact">
        <h2 className="modern-auth-title" style={{ marginBottom: "1.2rem" }}>Create Account</h2>
        <form onSubmit={handleSubmit} autoComplete="off" className="modern-auth-form compact-form">
          {error && <div className="modern-auth-error">{error}</div>}

          <div className="modern-form-group">
            <label htmlFor="register-username" className="modern-label small-label">Name</label>
            <input
              id="register-username"
              name="username"
              type="text"
              value={form.username}
              onChange={handleChange}
              disabled={loading}
              required
              className="modern-input compact-input"
              placeholder="Full name"
              autoFocus
            />
          </div>

          <div className="modern-form-group">
            <label htmlFor="register-email" className="modern-label small-label">Email</label>
            <input
              id="register-email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              disabled={loading}
              required
              className={`modern-input compact-input ${dirty.email
                ? emailValid
                  ? 'modern-input-success'
                  : 'modern-input-error'
                : ''}`}
              placeholder="user@example.com"
            />
            {dirty.email && form.email && (
              <span className="input-hint" style={{ color: emailValid ? "#10b981" : "#ef4444" }}>
                {emailValid ? "Valid email" : "Invalid email"}
              </span>
            )}
          </div>

          <div className="modern-form-group">
            <label htmlFor="register-password" className="modern-label small-label">Password</label>
            <input
              id="register-password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              disabled={loading}
              required
              className="modern-input compact-input"
              placeholder="At least 6 characters"
            />
          </div>

          <div className="modern-form-group">
            <label htmlFor="register-confirm" className="modern-label small-label">Confirm</label>
            <input
              id="register-confirm"
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange}
              disabled={loading}
              required
              className={`modern-input compact-input ${dirty.confirmPassword
                ? passwordsMatch
                  ? 'modern-input-success'
                  : 'modern-input-error'
                : ''}`}
              placeholder="Re-type password"
              autoComplete="new-password"
            />
            {dirty.confirmPassword && form.confirmPassword && (
              <span className="input-hint" style={{ color: passwordsMatch ? "#10b981" : "#ef4444" }}>
                {passwordsMatch ? "Passwords match" : "Not matching"}
              </span>
            )}
          </div>

          <div className="modern-form-group">
            <label htmlFor="register-role" className="modern-label small-label">Role</label>
            <select
              id="register-role"
              name="role"
              value={form.role}
              onChange={handleChange}
              disabled={loading}
              className="modern-input compact-input"
              required
            >
              <option value="client">Client</option>
              <option value="vendor">Vendor</option>
            </select>
          </div>

          <button
            type="submit"
            className="modern-btn"
            disabled={
              loading ||
              (dirty.confirmPassword && !passwordsMatch) ||
              (dirty.email && !emailValid)
            }
            style={{ marginTop: "1rem" }}
          >
            {loading ? <span className="modern-spinner"></span> : 'Register'}
          </button>
        </form>
        <div className="modern-auth-footer" style={{ marginTop: "1.2rem" }}>
          <span>Already have an account? </span>
          <Link to="/login" className="modern-link">Login here</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;