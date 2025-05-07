import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../index.css';
import api from '../api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await api.post('/users/login', { // Verify this endpoint matches your backend
        email,
        password
      });
      
      // Store authentication data
      console.log(response.data.data.token);
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data));

      console.log('Login successful:', response.data.data);
     // Redirect based on user role
     switch(response.data.data.role) {
      case 'admin':
        navigate('/DashboardAdmin');
        break;
      case 'vendor':
        navigate('/DashboardVendor');
        break;
      case 'client':
        navigate('/DashboardBuyer');;
        break;
      default:
        navigate('/');
    } // Changed to useNavigate for better SPA experience
      
    } catch (err) {
      // Improved error handling
      if (!err.response) {
        setError('Network error - please check your connection');
      } else {
        setError(err.response.data?.message || 'Login failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        {error && <p className="error">{error}</p>}
        
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            required
          />
        </div>
        
        <button 
          type="submit" 
          className="btn-primary"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      
      <p className="text-center">
        Don't have an account? <Link to="/register">Register here</Link>
      </p>
    </div>
  );
};

export default Login; 