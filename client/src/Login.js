import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/home/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await response.json();
      if (response.ok && data.token) {
        localStorage.setItem('jwt_token', data.token);
        alert('Login successful!');
        navigate('/');
      } else {
        setError(data.error || 'Login failed.');
      }
    } catch (err) {
      setError('Server error.');
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 400, margin: '2rem auto', padding: 20, border: '1px solid #ccc', borderRadius: 8 }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}
        <div>
          <label>Email:</label><br />
          <input name="email" value={form.email} onChange={handleChange} required />
        </div>
        <div>
          <label>Password:</label><br />
          <input name="password" type="password" value={form.password} onChange={handleChange} required />
        </div>
        <button type="submit" style={{ marginTop: 16 }} disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}

export default Login;
