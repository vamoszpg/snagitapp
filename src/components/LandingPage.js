import React, { useState, useEffect } from 'react';
import './LandingPage.css';
import { FaCheckCircle, FaEnvelope, FaMagic } from 'react-icons/fa';

const LandingPage = ({ onEnter }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateEmail(email)) {
      onEnter(email);
    } else {
      setError('Please enter a valid email address');
    }
  };

  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
  };

  return (
    <div className={`landing-page ${isLoaded ? 'loaded' : ''}`}>
      <div className="background-animation"></div>
      <div className="landing-content glassmorphism">
        <h1 className="title-animation">Welcome to Snag It</h1>
        <p className="tagline slide-in-top">Revolutionize Your Project Management</p>
        <div className="features">
          {['AI-powered issue tracking', 'Real-time collaboration', 'Intuitive data visualization'].map((feature, index) => (
            <div key={index} className={`feature slide-in-left delay-${index}`}>
              <FaCheckCircle className="feature-icon" />
              <span>{feature}</span>
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit} className="email-form slide-in-bottom">
          <div className="input-group">
            <FaEnvelope className="input-icon" />
            <input
              type="email"
              placeholder="Enter your email to get started"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="cta-button">
            <span>Get Started</span>
            <FaMagic className="button-icon" />
          </button>
        </form>
        {error && <p className="error-message">{error}</p>}
        <p className="privacy-note fade-in">Your data is secure. We prioritize your privacy.</p>
      </div>
      <div className="floating-shapes">
        <div className="shape shape1"></div>
        <div className="shape shape2"></div>
        <div className="shape shape3"></div>
      </div>
    </div>
  );
};

export default LandingPage;
