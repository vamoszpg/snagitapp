import React, { useState, useEffect } from 'react';
// import { getSnags, addSnag, deleteSnag } from './mockApi';
import './App.css';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Reports from './components/Reports';
import './components/Reports.css';
import Footer from './components/Footer';
import BackToTopButton from './components/BackToTopButton';
import Login from './components/Login';
import Register from './components/Register';
import config from './config';
import LandingPage from './components/LandingPage';  // Import the new LandingPage component

function App() {
  console.log('API URL:', config.API_URL);
  const [snags, setSnags] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [savedReports, setSavedReports] = useState([]);
  const [showLandingPage, setShowLandingPage] = useState(true);  // New state for showing landing page

  useEffect(() => {
    // Check if user has already entered email
    const userEmail = localStorage.getItem('userEmail');
    if (userEmail) {
      setShowLandingPage(false);
    }
    setSnags([]);
  }, []);

  const handleAddSnag = (newSnag) => {
    setSnags(prevSnags => [...prevSnags, { ...newSnag, id: Date.now() }]);
    // Add a notification when a new snag is created
    addNotification(`New snag added: ${newSnag.title}`);
  };

  const addNotification = (message) => {
    const newNotification = {
      id: Date.now(),
      message,
    };
    setNotifications(prevNotifications => [...prevNotifications, newNotification]);
    // Increase the notification display time to 10 seconds (10000 milliseconds)
    setTimeout(() => {
      removeNotification(newNotification.id);
    }, 10000);
  };

  const removeNotification = (id) => {
    setNotifications(prevNotifications => 
      prevNotifications.filter(notification => notification.id !== id)
    );
  };

  const handleDeleteSnag = (id) => {
    setSnags(prevSnags => prevSnags.filter(snag => snag.id !== id));
  };

  const handleSaveReport = (report) => {
    console.log("Received report in App.js:", report);
    setSavedReports(prevReports => [...prevReports, { ...report, id: Date.now() }]);
    // Add a notification when a report is saved
    addNotification(`Report saved: ${report.name}`);
  };

  const handleDeleteReport = (reportId) => {
    setSavedReports(prevReports => prevReports.filter(report => report.id !== reportId));
  };

  const handleClearAllSnags = () => {
    if (window.confirm('Are you sure you want to clear all snags?')) {
      setSnags([]);
    }
  };

  const clearNotification = (id) => {
    setNotifications(prevNotifications => prevNotifications.filter(notif => notif.id !== id));
  };

  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => !prevMode);
    document.body.classList.toggle('dark-mode');
  };

  const handleLogin = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    setShowAuthModal(false);
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    setShowLandingPage(true);  // Show landing page on logout
  };

  const recentSnags = snags.filter(snag => {
    const snagDate = new Date(snag.date);
    const now = new Date();
    const differenceInDays = (now - snagDate) / (1000 * 3600 * 24);
    return differenceInDays <= 7; // Only show snags from the last 7 days
  });

  const handleEnter = (email) => {
    localStorage.setItem('userEmail', email);
    setShowLandingPage(false);
  };

  if (showLandingPage) {
    return <LandingPage onEnter={handleEnter} />;
  }

  return (
    <div className={`App ${isDarkMode ? 'dark-mode' : ''}`}>
      {error && <div className="error-message">{error}</div>}
      <Header 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
        notifications={notifications}
        removeNotification={removeNotification}
        addNotification={addNotification}
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
        onAddSnag={handleAddSnag}
        userEmail={localStorage.getItem('userEmail')}  // Pass userEmail to Header
      />
      <main className="main-content">
        {activeTab === 'dashboard' ? (
          <Dashboard 
            snags={snags} 
            onAddSnag={handleAddSnag}
            onDeleteSnag={handleDeleteSnag}
            onSaveReport={handleSaveReport}
            onClearAllSnags={handleClearAllSnags}
            isDarkMode={isDarkMode}
          />
        ) : activeTab === 'reports' ? (
          <Reports 
            savedReports={savedReports}
            onDeleteReport={handleDeleteReport}
            isDarkMode={isDarkMode}
          />
        ) : null}
      </main>
      <Footer isDarkMode={isDarkMode} />
      <BackToTopButton />
      {showAuthModal && (
        <div className="auth-modal">
          {isLogin ? (
            <Login onLogin={handleLogin} onClose={() => setShowAuthModal(false)} />
          ) : (
            <Register onRegister={handleLogin} onClose={() => setShowAuthModal(false)} />
          )}
          <button onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Need an account? Register' : 'Already have an account? Login'}
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
