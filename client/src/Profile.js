import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import './App.css';
import Chat from './Chat';
import { Link } from 'react-router-dom';

function Profile() {
  const location = useLocation();
  const coach = location.state?.coach;
  const [showChat, setShowChat] = useState(false);

  if (!coach) {
    return (
      <div className="profile-container">
        <div className="profile-card">
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <div style={{ fontSize: '24px', color: '#667eea', marginBottom: '20px' }}>No coach data provided.</div>
            <div style={{ color: '#718096' }}>Please select a coach from the main page.</div>
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
            <img src={`http://localhost:8000/${coach.image}`} alt={coach.name} className="profile-avatar" />
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
    </div>
  );
}

export default Profile;
