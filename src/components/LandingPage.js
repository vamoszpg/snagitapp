import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';
import { FaCheckCircle, FaEnvelope, FaMagic, FaInfoCircle } from 'react-icons/fa';

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
    // Basic email validation regex
    return /\S+@\S+\.\S+/.test(email);
  };

  return (
    <div className={`landing-page ${isLoaded ? 'loaded' : ''}`}>
      <div className="background-animation"></div>
      <div className="landing-content glassmorphism">
        <h1 className="title-animation">Welcome to Snag It</h1>
        <p className="tagline slide-in-top">Streamline Your Property Inspections</p>
        <div className="features">
          {[
            'Efficient property inspection tracking',
            'Comprehensive report generation',
            'Easy PDF export for sharing'
          ].map((feature, index) => (
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
        <Link to="/how-it-works" className="how-it-works-button">
          <FaInfoCircle className="info-icon" />
          <span>How It Works</span>
        </Link>
        <p className="privacy-note fade-in">Your property data is secure. We prioritize your privacy.</p>
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
