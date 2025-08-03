import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function ProfileRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    const userType = sessionStorage.getItem('user-type');
    const userEmail = sessionStorage.getItem('user-mail');
    
    if (!userEmail) {
      navigate('/logins');
      return;
    }

    // Redirect based on user type
    if (userType === 'coach') {
      navigate('/own-profile');
    } else if (userType === 'user') {
      navigate('/user-profile');
    } else {
      // If no user type is stored, redirect to login
      navigate('/logins');
    }
  }, [navigate]);

  return (
    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
      Redirecting to your profile...
    </div>
  );
}

export default ProfileRedirect; 