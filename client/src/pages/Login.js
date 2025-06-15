import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/auth/login', { email, password });
      login(res.data.token, res.data.user.id, res.data.user.name);
      setMessage('Login successful!');
      navigate('/');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Login failed.');
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px', padding: '20px' }}>
      <h2 style={{ fontSize: '2rem', color: '#333' }}>Login</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ marginBottom: '10px', padding: '5px' }} />
        <br />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ marginBottom: '10px', padding: '5px' }} />
        <br />
        <button type="submit" style={{ padding: '10px 20px', fontSize: '1rem', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          Login
        </button>
      </form>
      {message && <p style={{ marginTop: '20px', color: message.includes('successful') ? 'green' : 'red' }}>{message}</p>}
    </div>
  );
}

export default Login; 