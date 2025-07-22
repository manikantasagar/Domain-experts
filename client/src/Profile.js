import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import './App.css';
import Chat from './Chat';
import { Link } from 'react-router-dom';

function Profile() {
  // const location = useLocation();
  const location = useLocation();
  const coach = location.state?.coach;
  const [showChat, setShowChat] = useState(false);
//   console.log(state)

  if (!coach) {
    return <div className="profile-container"><h2>No coach data provided.</h2></div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <img src={`http://localhost:8000/${coach.image}`} alt={coach.name} className="profile-avatar" />
        <div className="profile-details">
          <h2>{coach.name}</h2>
          <p>{coach.domain} Coach</p>
          <p>{coach.location}, {coach.country}</p>
          <p>Rating: {coach.rating} ({coach.reviews} reviews)</p>
        </div>
      </div>
      <div className="profile-bio">
        <h4>About</h4>
        <p>{coach.description}</p>
      </div>
      <div className="profile-bio">
        <h4>Contact</h4>
        <p>Email: {coach.email}</p>
        <p>Phone: {coach.phone}</p>
        <p>Address: {coach.address}, {coach.city}, {coach.state}, {coach.zip}</p>
      </div>
      <div className="profile-bio">
        <h4>Details</h4>
        <p>Experience: {coach.experience} years</p>
        <p>Price: ${coach.price}/session</p>
        <p>Availability: {coach.availability ? 'Available' : 'Not Available'} ({coach.availability_days})</p>
        <p>Connections: {coach.connections} | Followers: {coach.followers} | Following: {coach.following}</p>
      </div>
      <button className="profile-message-btn" onClick={() => setShowChat(!showChat)}>
        {showChat ? 'Close Messenger' : 'Message Coach'}
      </button>
      <Link to="/chat" state={{ roomName:coach.name.replace(/\s+/g, '').toLowerCase()  }}>
        <button className="profile-chat-btn">   Chat with Coach</button>
      </Link>
    </div>
  );
}

export default Profile;
