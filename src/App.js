import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import { getSnags, addSnag, deleteSnag } from './mockApi';
import './App.css';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Reports from './components/Reports/Reports';
// import './components/Reports.css';
import Footer from './components/Footer';
import BackToTopButton from './components/BackToTopButton';
import Login from './components/Login';
import Register from './components/Register';
import config from './config';
import LandingPage from './components/LandingPage';  // Import the new LandingPage component
import HowItWorks from './components/HowItWorks';
import jsPDF from 'jspdf';

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
  const [reports, setReports] = useState([]);

  useEffect(() => {
    // Check if user has already entered email
    const userEmail = localStorage.getItem('userEmail');
    if (userEmail) {
      setShowLandingPage(false);
    }
    setSnags([]);
  }, []);

  useEffect(() => {
    console.log('App: Reports state updated:', reports);
  }, [reports]);

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

  const handleSaveReport = (newReport) => {
    console.log('App: Saving new report:', newReport);
    setReports(prevReports => {
      const updatedReports = [...prevReports, newReport];
      console.log('App: Updated reports:', updatedReports);
      return updatedReports;
    });
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
    // Implement your logout logic here
    // For example:
    localStorage.removeItem('userEmail');
    setUser(null);
    setIsAuthenticated(false);
    // Redirect to login page or show landing page
    setShowLandingPage(true);
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

  const handleExportPDF = (snags) => {
    const doc = new jsPDF();
    let yOffset = 10;

    doc.setFontSize(20);
    doc.text('Snag Report', 105, yOffset, { align: 'center' });
    yOffset += 20;

    snags.forEach((snag, index) => {
      doc.setFontSize(14);
      doc.text(`Snag ${index + 1}: ${snag.title}`, 10, yOffset);
      yOffset += 10;

      doc.setFontSize(12);
      doc.text(`Category: ${snag.category}`, 20, yOffset);
      yOffset += 7;
      doc.text(`Description: ${snag.description}`, 20, yOffset);
      yOffset += 7;
      doc.text(`Date: ${new Date(snag.date).toLocaleDateString()}`, 20, yOffset);
      yOffset += 15;

      if (snag.image) {
        doc.addImage(snag.image, 'JPEG', 20, yOffset, 170, 100);
        yOffset += 110;
      }

      if (yOffset > 280) {
        doc.addPage();
        yOffset = 10;
      }
    });

    doc.save('snag_report.pdf');
  };

  if (showLandingPage) {
    return (
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage onEnter={handleEnter} />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
        </Routes>
      </Router>
    );
  }

  return (
    <Router>
      <div className={`App ${isDarkMode ? 'dark-mode' : ''}`}>
        <Header 
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
          onLogout={handleLogout}
        />
        <main className="main-content">
          <Routes>
            <Route path="/" element={
              <Dashboard 
                snags={snags} 
                onAddSnag={handleAddSnag}
                onDeleteSnag={handleDeleteSnag}
                onSaveReport={handleSaveReport}
                onClearAllSnags={handleClearAllSnags}
                onExportPDF={handleExportPDF}
                isDarkMode={isDarkMode}
                addNotification={addNotification}
              />
            } />
            <Route path="/reports" element={
              <Reports 
                savedReports={reports}
                onDeleteReport={(id) => {
                  setReports(prevReports => prevReports.filter(report => report.id !== id));
                }}
                isDarkMode={isDarkMode}
                addNotification={addNotification}
              />
            } />
          </Routes>
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
    </Router>
  );
}

export default App;
