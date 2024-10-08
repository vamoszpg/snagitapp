import React from 'react';
import { Link } from 'react-router-dom';

const Header = ({ user, onLogout }) => {
  return (
    <header className="App-header">
      <div className="header-content">
        <div className="logo-container">
          <h1>Snag It</h1>
        </div>
        <nav className="main-nav">
          <ul>
            <li><Link to="/">Dashboard</Link></li>
            <li><Link to="/reports">Reports</Link></li>
          </ul>
        </nav>
        <div className="user-controls">
          <span className="user-greeting">Welcome, {user}!</span>
          <button onClick={onLogout} className="logout-btn">Logout</button>
        </div>
      </div>
    </header>
  );
};

export default Header;