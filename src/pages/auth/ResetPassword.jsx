import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../../api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const emailFromUrl = query.get('email');
    if (!emailFromUrl) {
      setError('Invalid or missing email.');
    } else {
      setEmail(emailFromUrl);
    }
  }, [location]);

const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');

  if (password !== confirmPassword) {
    return setError('Passwords do not match.');
  }

  try {
    await api.post('/users/reset-password', { email, newPassword: password });
    toast.success('Password reset successfully!');
    setTimeout(() => navigate('/login'), 2000);
  } catch (err) {
    setError(err.response?.data?.message || 'Failed to reset password.');
  }
};
  return (
    <div className="modern-auth-bg">
      <ToastContainer position="top-center" />
      <div className="modern-auth-card">
        <h2 className="modern-auth-title">Reset Password</h2>
        {error && <div className="modern-auth-error">{error}</div>}
        <form onSubmit={handleSubmit} className="modern-auth-form">
          <div className="modern-form-group">
            <label htmlFor="password" className="modern-label">New Password</label>
            <input
              type="password"
              id="password"
              className="modern-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="modern-form-group">
            <label htmlFor="confirmPassword" className="modern-label">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              className="modern-input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="modern-btn">Reset Password</button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
