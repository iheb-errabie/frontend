import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.post('/users/forgot-password', { email });
      toast.success('Password reset link sent to your email');
    } catch (err) {
      setError(err.response?.data?.message || 'Error sending reset link');
    } finally {
      setLoading(false);
    }
  };

    const handleBackHome = () => navigate("/login");

  return (
    <div className="modern-auth-bg">
      <ToastContainer position="top-center" />
      <div className="modern-auth-card position-relative">
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

        <h2 className="modern-auth-title">Forgot Password</h2>
        <form onSubmit={handleSubmit} className="modern-auth-form">
          {error && <div className="modern-auth-error">{error}</div>}
          <div className="modern-form-group">
            <label htmlFor="forgot-email" className="modern-label">Email</label>
            <input
              type="email"
              id="forgot-email"
              className="modern-input"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="modern-btn" disabled={loading}>
            {loading ? <span className="modern-spinner"></span> : 'Send Reset Link'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
