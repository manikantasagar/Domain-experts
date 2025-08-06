import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const domainOptions =[
  'Software Engineering',
  'Data Science',
  'Machine Learning & AI',
  'Cybersecurity',
  'DevOps',
  'Cloud Computing',
  'UI/UX Design',
  'Blockchain',
  'IoT',
  'Robotics',
  'General Medicine',
  'Surgery',
  'Psychology',
  'Psychiatry',
  'Dentistry',
  'Physiotherapy',
  'Nutrition & Dietetics',
  'Ayurveda',
  'Homeopathy',
  'Pharmacology',
  'Chartered Accountancy',
  'Financial Analysis',
  'Investment Advisory',
  'Tax Consultancy',
  'Business Strategy',
  'Management Consulting',
  'Risk Analysis',
  'Auditing',
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'History',
  'Geography',
  'Political Science',
  'Economics',
  'Language & Linguistics',
  'Curriculum Design',
  'Academic Research',
  'Career Counseling',
  'Law',
  'Corporate Law',
  'Legal Advisory',
  'Intellectual Property Law',
  'Compliance',
  'Human Rights',
  'Electrician Services',
  'Plumbing',
  'Mechanical Services',
  'Carpentry',
  'Welding',
  'HVAC Services',
  'Graphic Design',
  'Video Editing',
  'Animation',
  'Content Writing',
  'Photography',
  'Digital Marketing',
  'Social Media Strategy',
  'Agriculture',
  'Environmental Science',
  'Forestry',
  'Soil & Water Conservation',
  'Climate Change',
  'Travel Consulting',
  'Logistics & Supply Chain',
  'Import/Export',
  'Aviation & Pilot Training',
  'Civil Services Guidance',
  'Policy Analysis',
  'Urban Planning',
  'Public Health',
  'Disaster Management',
  'Life Coaching',
  'Career Coaching',
  'Fitness Training',
  'Meditation & Mindfulness',
  'Motivational Speaking'
]
 // Example domains

function Signup() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    domain: '',
    experience: '',
    location: '',
    coach: false,
  });
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
    let response;
    try {
      if(!form.coach){  
        // User signup
        response = await fetch(`${process.env.REACT_APP_SERVER_URL}/home/signups_user/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form)
        });
      }
      else{
        // Coach signup
        response = await fetch(`${process.env.REACT_APP_SERVER_URL}/home/signups/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form)
        });
      }
      const data = await response.json();
      if (response.ok && data.success) {
        alert('Signup successful! Please log in.');
        navigate('/logins');
      } else {
        setError(data.error || 'Signup failed.');
      }
    } catch (err) {
      setError('Server error.');
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 400, margin: '2rem auto', padding: 20, border: '1px solid #ccc', borderRadius: 8 }}>
      <h2>Signup</h2>
      <form onSubmit={handleSubmit}>
        {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}
        <div>
          <label>Name:</label><br />
          <input name="name" value={form.name} onChange={handleChange} required />
        </div>
        <div>
          <label>Email:</label><br />
          <input name="email" value={form.email} onChange={handleChange} required />
        </div>
        <div>
          <label>Password:</label><br />
          <input name="password" type="password" value={form.password} onChange={handleChange} required />
        </div>
        <div>
          <label>Domain:</label><br />
          <select name="domain" value={form.domain} onChange={handleChange} required>
            <option value="">Select domain</option>
            {domainOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>
        <div>
          <label>Experience:</label><br />
          <input name="experience" value={form.experience} onChange={handleChange} required />
        </div>
        <div>
          <label>Location:</label><br />
          <input name="location" value={form.location} onChange={handleChange} required />
        </div>
        <div>
          <label>Are you a coach?</label>
          <input name="coach" type="checkbox" checked={form.coach} onChange={e => setForm({ ...form, coach: e.target.checked })} />
        </div>
        <button type="submit" style={{ marginTop: 16 }} disabled={loading}>
          {loading ? 'Signing up...' : 'Signup'}
        </button>
      </form>
    </div>
  );
}

export default Signup;
