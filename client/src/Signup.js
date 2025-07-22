import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const domainOptions = ['Science', 'Math', 'History', 'Art']; // Example domains

const regex = {
  name: /^[A-Za-z\s]{2,30}$/,
  email: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
  password: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*]{8,}$/,
  domain: /.+/
};

function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '', domain: '' });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState('');
  const navigate = useNavigate();

  const validate = (field, value) => {
    if (!regex[field].test(value)) {
      switch (field) {
        case 'name':
          return 'Name must be 2-30 letters.';
        case 'email':
          return 'Invalid email address.';
        case 'password':
          return 'Password must be at least 8 characters, include a letter and a number.';
        case 'domain':
          return 'Please select a domain.';
        default:
          return 'Invalid input.';
      }
    }
    return '';
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setErrors({ ...errors, [name]: validate(name, value) });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const newErrors = {};
    Object.keys(form).forEach(field => {
      const err = validate(field, form[field]);
      if (err) newErrors[field] = err;
    });
    setErrors(newErrors);
    setSubmitted(true);
    setServerError('');
    if (Object.keys(newErrors).length === 0) {
      // Submit logic here
      try {
        const response = await fetch('http://localhost:8000/home/signups/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form)
        });
        const data = await response.json();
        if (data.success) {
          alert('Signup successful!');
          navigate('/')
        } else {
          setServerError(data.error || 'Signup failed.');
        }
      } catch (err) {
        setServerError('Server error.');
      }
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '2rem auto', padding: 20, border: '1px solid #ccc', borderRadius: 8 }}>
      <h2>Signup</h2>
      <form onSubmit={handleSubmit} noValidate>
        {serverError && <div style={{ color: 'red', marginBottom: 8 }}>{serverError}</div>}
        <div>
          <label>Name:</label><br />
          <input name="name" value={form.name} onChange={handleChange} required />
          {submitted && errors.name && <div style={{ color: 'red' }}>{errors.name}</div>}
        </div>
        <div>
          <label>Email:</label><br />
          <input name="email" value={form.email} onChange={handleChange} required />
          {submitted && errors.email && <div style={{ color: 'red' }}>{errors.email}</div>}
        </div>
        <div>
          <label>Password:</label><br />
          <input name="password" type="password" value={form.password} onChange={handleChange} required />
          {submitted && errors.password && <div style={{ color: 'red' }}>{errors.password}</div>}
        </div>
        <div>
          <label>Domain:</label><br />
          <select name="domain" value={form.domain} onChange={handleChange} required>
            <option value="">Select domain</option>
            {domainOptions.map(domain => (
              <option key={domain} value={domain}>{domain}</option>
            ))}
          </select>
          {submitted && errors.domain && <div style={{ color: 'red' }}>{errors.domain}</div>}
        </div>
        <button type="submit" style={{ marginTop: 16 }}>Sign Up</button>
      </form>
    </div>
  );
}

export default Signup;
