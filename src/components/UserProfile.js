import React from 'react';
import './UserProfile.css';

const UserProfile = ({ user, onLogout }) => {
  return (
    <div className="user-profile">
      <h2>Welcome, {user.name}</h2>
      <p>Username: {user.username}</p>
      <button onClick={onLogout}>Logout</button>
    </div>
  );
};

export default UserProfile;