import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function UserProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const userEmail = sessionStorage.getItem('user-mail');
    const userType = sessionStorage.getItem('user-type');
    
    if (!userEmail || userType !== 'user') {
      navigate('/login');
      return;
    }

    fetchProfile(userEmail);
  }, [navigate]);

  const fetchProfile = async (email) => {
    console.log('REACT_APP_SERVER_URL:', process.env.REACT_APP_SERVER_URL);
    console.log('REACT_APP_WS_URL:', process.env.REACT_APP_WS_URL);
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/home/user-profile?email=${email}`);
      const data = await response.json();
      // process.env.SERVER_URL
      
      if (response.ok) {
        setProfile(data);
        setEditForm({ name: data.name });
      } else {
        setError(data.error || 'Failed to load profile');
      }
    } catch (err) {
      setError('Server error');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setEditing(true);
  };

  const handleSave = async () => {
    try {
      const userEmail = sessionStorage.getItem('user-mail');
      const response = await fetch(`${process.env.REACT_APP_SERVER_URL}home/user-profile?email=${userEmail}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm)
      });
      
      const data = await response.json();
      if (response.ok && data.success) {
        setProfile({ ...profile, ...editForm });
        setEditing(false);
        alert('Profile updated successfully!');
      } else {
        setError(data.error || 'Failed to update profile');
      }
    } catch (err) {
      setError('Server error');
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setEditForm({ name: profile.name });
  };

  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/login');
  };

  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: '2rem' }}>Loading...</div>;
  }

  if (error) {
    return <div style={{ color: 'red', textAlign: 'center', marginTop: '2rem' }}>{error}</div>;
  }

  return (

    <div style={{ maxWidth: 600, margin: '2rem auto', padding: 20, border: '1px solid #ccc', borderRadius: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>User Profile</h2>
        {console.log('REACT_APP_SERVER_URL:', process.env.REACT_APP_SERVER_URL)}
        <button onClick={handleLogout} style={{ padding: '8px 16px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px' }}>
          Logout
        </button>
      </div>
      
      {profile && (
        <div>
          <div style={{ marginBottom: '1rem' }}>
            <strong>Name:</strong>
            {editing ? (
              <input
                type="text"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                style={{ marginLeft: '10px', padding: '4px 8px' }}
              />
            ) : (
              <span style={{ marginLeft: '10px' }}>{profile.name}</span>
            )}
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <strong>Email:</strong>
            <span style={{ marginLeft: '10px' }}>{profile.email}</span>
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <strong>Member Since:</strong>
            <span style={{ marginLeft: '10px' }}>
              {new Date(profile.created_at).toLocaleDateString()}
            </span>
          </div>
          
          <div style={{ marginTop: '2rem' }}>
            {editing ? (
              <div>
                <button onClick={handleSave} style={{ marginRight: '10px', padding: '8px 16px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px' }}>
                  Save
                </button>
                <button onClick={handleCancel} style={{ padding: '8px 16px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px' }}>
                  Cancel
                </button>
              </div>
            ) : (
              <button onClick={handleEdit} style={{ padding: '8px 16px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}>
                Edit Profile
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default UserProfile; 