import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom'; 
import Chat from './Chat'; // Importing the Chat component
import Profile from './Profile'; // Importing the Profile component
import Signup from './Signup'
import Login from './Login'; // Importing the Login component
import { OwnProfile }  from './OwnProfile';
import UserProfile from './UserProfile';
import AI from './AI';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      {/* <App /> */}
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/logins" element={<Login />} />
        <Route path="/own-profile" element={<OwnProfile/>}/>
        <Route path="/user-profile" element={<UserProfile/>}/>
        <Route path="/ai" element={<AI/>}/>
        
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
