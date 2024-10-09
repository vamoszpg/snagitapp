import React, { useState } from 'react';
import { FaUser, FaBell, FaPlus, FaMoon, FaSun, FaTimes, FaChartBar, FaSignOutAlt } from 'react-icons/fa';
import SnagForm from './SnagForm';
import Tooltip from './Tooltip';

const Header = ({ onAddSnag, notifications, clearNotification, isDarkMode, toggleDarkMode, activeTab, setActiveTab, onLogout }) => {
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleQuickAdd = () => {
    setShowQuickAdd(true);
  };

  const handleCloseQuickAdd = () => {
    setShowQuickAdd(false);
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  return (
    <header className="App-header">
      <div className="header-content">
        <h1>Snag It</h1>
        <nav className="header-nav">
          <button 
            className={`nav-button ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            Dashboard
          </button>
          <button 
            className={`nav-button ${activeTab === 'reports' ? 'active' : ''}`}
            onClick={() => setActiveTab('reports')}
          >
            <FaChartBar /> Reports
          </button>
        </nav>
      </div>
      <div className="header-actions">
        <Tooltip text="Add new snag">
          <button className="header-button" onClick={handleQuickAdd}>
            <FaPlus />
          </button>
        </Tooltip>
        <div className="notification-container">
          <Tooltip text="Notifications">
            <button className="header-button" onClick={toggleNotifications}>
              <FaBell />
              {notifications.length > 0 && (
                <span className="notification-badge">{notifications.length}</span>
              )}
            </button>
          </Tooltip>
          {showNotifications && (
            <div className="notification-dropdown">
              {notifications.length === 0 ? (
                <p>No new notifications</p>
              ) : (
                notifications.map(notif => (
                  <div key={notif.id} className="notification-item">
                    <p>{notif.message}</p>
                    <button onClick={() => clearNotification(notif.id)}>
                      <FaTimes />
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
        <Tooltip text={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}>
          <button className="header-button" onClick={toggleDarkMode}>
            {isDarkMode ? <FaSun /> : <FaMoon />}
          </button>
        </Tooltip>
        <Tooltip text="User profile">
          <button className="header-button">
            <FaUser />
          </button>
        </Tooltip>
        <Tooltip text="Logout">
          <button className="header-button" onClick={onLogout}>
            <FaSignOutAlt />
          </button>
        </Tooltip>
      </div>
      {showQuickAdd && (
        <div className="modal">
          <div className="modal-content">
            <button className="close-modal" onClick={handleCloseQuickAdd}>
              <FaTimes />
            </button>
            <h2>Quick Add Snag</h2>
            <SnagForm onSubmit={(category, title, description, image) => {
              onAddSnag(category, title, description, image);
              handleCloseQuickAdd();
            }} />
          </div>
        </div>
      )}
      <button onClick={onLogout}>Logout</button>
    </header>
  );
};

export default Header;