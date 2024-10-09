import React, { useState } from 'react';
import './App.css';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Reports from './components/Reports';
import './components/Reports.css';
import Footer from './components/Footer';
import BackToTopButton from './components/BackToTopButton';

function App() {
  const [snags, setSnags] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(false);

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