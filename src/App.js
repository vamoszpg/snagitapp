import React, { useState } from 'react';
import './App.css';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Reports from './components/Reports';
import './components/Reports.css';
import Footer from './components/Footer';
import BackToTopButton from './components/BackToTopButton';
import Login from './components/Login';
import Signup from './components/Signup'; // You'll need to create this component

function App() {
  const [snags, setSnags] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLogin, setShowLogin] = useState(true);

  const handleAddSnag = (category, title, description, image) => {
    const newSnag = {
      id: Date.now(),
      category,
      title,
      description,
      image,
      date: new Date(),
    };
    setSnags(prevSnags => [...prevSnags, newSnag]);
    
    const newNotification = {
      id: Date.now(),
      message: `New snag added: ${title} in ${category}`
    };
    setNotifications(prevNotifications => [...prevNotifications, newNotification]);
  };

  const handleDeleteSnag = (id) => {
    setSnags(prevSnags => prevSnags.filter(snag => snag.id !== id));
  };

  const clearNotification = (id) => {
    setNotifications(prevNotifications => prevNotifications.filter(notif => notif.id !== id));
  };

  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => !prevMode);
    document.body.classList.toggle('dark-mode');
  };

  const handleLogin = (username, password) => {
    console.log('Login attempt:', username, password);
    if (username === "zak" && password === "zak") {
      setIsAuthenticated(true);
      console.log("Login successful");
    } else {
      console.log("Login failed");
      alert("Invalid credentials. Please try again.");
    }
  };

  const handleSignup = (username, password) => {
    // Implement signup logic here
    console.log('Signup attempt:', username, password);
    // For now, let's just log in the user after signup
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setShowLogin(true);
  };

  if (!isAuthenticated) {
    return (
      <div className={`App ${isDarkMode ? 'dark-mode' : ''}`}>
        {showLogin ? (
          <Login onLogin={handleLogin} onSwitchToSignup={() => setShowLogin(false)} />
        ) : (
          <Signup onSignup={handleSignup} onSwitchToLogin={() => setShowLogin(true)} />
        )}
      </div>
    );
  }

  return (
    <div className={`App ${isDarkMode ? 'dark-mode' : ''}`}>
      <Header 
        onAddSnag={handleAddSnag}
        notifications={notifications}
        clearNotification={clearNotification}
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
      />
      <main className="main-content">
        {activeTab === 'dashboard' ? (
          <Dashboard 
            snags={snags} 
            onAddSnag={handleAddSnag}
            onDeleteSnag={handleDeleteSnag}
          />
        ) : (
          <Reports snags={snags} />
        )}
      </main>
      <Footer isDarkMode={isDarkMode} />
      <BackToTopButton />
    </div>
  );
}

export default App;