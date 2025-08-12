import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './App.css';
import Chat from './Chat';
import { Link } from 'react-router-dom';
import PaymentModal from './PaymentModal';
import PaymentChart from './PaymentChart';

// ConnectFollowButtons Component
function ConnectFollowButtons({ coach }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  const userEmail = sessionStorage.getItem('user-mail');
  const userType = sessionStorage.getItem('user-type');
  
  const handleConnect = async () => {
    if (userType !== 'coach') {
      setMessage('Only coaches can connect with other coaches');
      return;
    }
    
    setLoading(true);
    setMessage('');
    
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/home/connect-coach/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          coach_id: coach.id,
          user_email: userEmail
        })
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        setMessage(data.message);
        // Optionally refresh the page to update connection count
        setTimeout(() => window.location.reload(), 1500);
      } else {
        setMessage(data.error || 'Connection failed');
      }
    } catch (err) {
      setMessage('Server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleFollow = async () => {
    if (userType !== 'user') {
      setMessage('Only users can follow coaches');
      return;
    }
    
    setLoading(true);
    setMessage('');
    
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/home/follow-user/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          coach_id: coach.id,
          user_email: userEmail
        })
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        setMessage(data.message);
        // Optionally refresh the page to update follower count
        setTimeout(() => window.location.reload(), 1500);
      } else {
        setMessage(data.error || 'Follow failed');
      }
    } catch (err) {
      setMessage('Server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Don't show buttons if not logged in
  if (!userEmail) {
    return null;
  }
  
  return (
    <div style={{ marginTop: '10px' }}>
      {userType === 'coach' && (
        <button 
          className="profile-chat-btn" 
          onClick={handleConnect}
          disabled={loading}
          style={{ marginLeft: '10px' }}
        >
          {loading ? 'Connecting...' : '🤝 Connect'}
        </button>
      )}
      
      {userType === 'user' && (
        <button 
          className="profile-chat-btn" 
          onClick={handleFollow}
          disabled={loading}
          style={{ marginLeft: '10px' }}
        >
          {loading ? 'Following...' : '👥 Follow'}
        </button>
      )}
      
      {message && (
        <div style={{ 
          color: message.includes('error') ? 'red' : 'green', 
          fontSize: '0.9rem', 
          marginTop: '5px' 
        }}>
          {message}
        </div>
      )}
    </div>
  );
}

function Profile() {
  const location = useLocation();
  const navigate = useNavigate();
  const coach = location.state?.coach;
  const [showChat, setShowChat] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showPaymentChart, setShowPaymentChart] = useState(false);

  useEffect(() => {
    // If no coach data, check if user clicked "Profile" button
    if (!coach) {
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
        navigate('/logins');
      }
    }
  }, [coach, navigate]);

  // If no coach data, show loading while redirecting
  if (!coach) {
    return (
      <div className="profile-container">
        <div className="profile-card">
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <div style={{ fontSize: '24px', color: '#667eea', marginBottom: '20px' }}>Redirecting...</div>
            <div style={{ width: '40px', height: '40px', border: '4px solid #e2e8f0', borderTop: '4px solid #667eea', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto' }}></div>
          </div>
        </div>
      </div>
    );
  }

  // Helper function to get field icons
  const getFieldIcon = (fieldName) => {
    const icons = {
      location: '📍',
      rating: '⭐',
      reviews: '📝',
      experience: '⭐',
      price: '💰',
      availability: '📅',
      email: '📧',
      phone: '📞',
      address: '🏠',
      connections: '👥',
      followers: '👤',
      following: '👥',
    };
    return icons[fieldName] || '📋';
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        {/* Header Section */}
        <div className="profile-header">
          <div className="profile-avatar-container">
            <img 
              src={ `${coach.image}` 
              } 
              alt={coach.name}
             
              className="profile-image"
            />
            <div className="profile-status">
              {coach.availability ? '🟢 Available' : '🔴 Not Available'}
            </div>
          </div>
          <div className="profile-details">
            <h2 className="profile-name">{coach.name}</h2>
            <div className="profile-badge">{coach.domain} Coach</div>
            <br></br>
                         <Link to="/chat" state={{ email: coach.email }}>
             <button className="profile-chat-btn">
               💬 
             </button>
             </Link>
             <button 
               className="profile-chat-btn" 
               onClick={() => setShowPaymentModal(true)}
               style={{ marginLeft: '10px' }}
             >
               💳 Pay
             </button>
             
             {/* Connect/Follow Buttons */}
             <ConnectFollowButtons coach={coach} />
            <div className="profile-location">📍 {coach.location}, {coach.country}</div>
            <div className="profile-rating">
              ⭐ {coach.rating} ({coach.reviews} reviews)
            </div>
          </div>
        </div>
      {/* followers */}
        <div className="profile-section">
          <h3 className="profile-section-title">👥 Social Stats</h3>
          <div className="profile-stats-grid">
            <div className="profile-stat-item">
              <span className="stat-icon">👥</span>
              <span className="stat-value">{coach.connections || 0}</span>
              <span className="stat-label">Connections</span>
            </div>
            <div className="profile-stat-item">
              <span className="stat-icon">👤</span>
              <span className="stat-value">{coach.followers || 0}</span>
              <span className="stat-label">Followers</span>
            </div>
            <div className="profile-stat-item">
              <span className="stat-icon">👥</span>
              <span className="stat-value">{coach.following || 0}</span>
              <span className="stat-label">Following</span>
            </div>
          </div>
        </div>
        {/* About Section */}

        {/* Contact Section */}
        <div className="profile-section">
          <h3 className="profile-section-title">📞 Contact Information</h3>
          <div className="profile-contact-grid">
            <div className="profile-contact-item">
              <span className="contact-icon">📧</span>
              <span className="contact-label">Email:</span>
              <span className="contact-value">{coach.email}</span>
            </div>
            <div className="profile-contact-item">
              <span className="contact-icon">📞</span>
              <span className="contact-label">Phone:</span>
              <span className="contact-value">{coach.phone || 'Not provided'}</span>
            </div>
            <div className="profile-contact-item">
              <span className="contact-icon">🏠</span>
              <span className="contact-label">Address:</span>
              <span className="contact-value">
                {coach.address}, {coach.city}, {coach.state}, {coach.zip}
              </span>
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div className="profile-section">
          <h3 className="profile-section-title">📊 Professional Details</h3>
          <div className="profile-details-grid">
            <div className="profile-detail-item">
              <span className="detail-icon">{getFieldIcon('experience')}</span>
              <span className="detail-label">Experience:</span>
              <span className="detail-value">{coach.experience} years</span>
            </div>
            <div className="profile-detail-item">
              <span className="detail-icon">{getFieldIcon('price')}</span>
              <span className="detail-label">Price:</span>
              <span className="detail-value">${coach.price}/session</span>
            </div>
            <div className="profile-detail-item">
              <span className="detail-icon">{getFieldIcon('availability')}</span>
              <span className="detail-label">Availability:</span>
              <span className="detail-value">
                {coach.availability ? '✅ Available' : '❌ Not Available'} ({coach.availability_days})
              </span>
            </div>
          </div>
        </div>

        {/* Social Stats */}

        <div className="profile-section">
          <h3 className="profile-section-title">📖 About</h3>
          <p className="profile-description">{coach.description || 'No description available.'}</p>
        </div>

        {/* Payment Statistics Section */}
        <div className="profile-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 className="profile-section-title">💰 Payment Statistics</h3>
            <button 
              onClick={() => setShowPaymentChart(!showPaymentChart)}
              style={{
                padding: '8px 16px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              {showPaymentChart ? 'Hide Chart' : 'Show Chart'}
            </button>
          </div>
          {showPaymentChart && <PaymentChart coachId={coach.id} />}
        </div>
        {/* Action Buttons */}
        <div className="profile-actions">
         
          
        </div>

        {/* Chat Section */}
        {/* {showChat && (
          <div className="profile-chat-section">
            <Chat />
          </div> */}
        {/* )} */}
      </div>
      
      {/* Payment Modal */}
      <PaymentModal 
        coach={coach}
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onPaymentSuccess={(data) => {
          console.log('Payment successful:', data);
          // Optionally refresh the chart
          if (showPaymentChart) {
            setShowPaymentChart(false);
            setTimeout(() => setShowPaymentChart(true), 100);
          }
        }}
      />
    </div>
  );
}

export default Profile;
