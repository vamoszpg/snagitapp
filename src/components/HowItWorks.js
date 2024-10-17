import React from 'react';
import { Link } from 'react-router-dom';
import './HowItWorks.css';
import { FaClipboardCheck, FaCamera, FaFileAlt, FaChartBar } from 'react-icons/fa';

const HowItWorks = () => {
  const steps = [
    {
      icon: FaClipboardCheck,
      title: "Create an Inspection",
      description: "Start a new inspection by entering property details, selecting rooms, and defining the inspection type. Set up your checklist for efficient snag recording."
    },
    {
      icon: FaCamera,
      title: "Record Snags",
      description: "Walk through the property and record snags. Take photos, add descriptions, and categorize issues room by room."
    },
    {
      icon: FaFileAlt,
      title: "Generate Report",
      description: "Once you've recorded all snags, generate a comprehensive report with just a click. All your findings are organized neatly."
    },
    {
      icon: FaChartBar,
      title: "Track Progress",
      description: "Use the dashboard to track the progress of repairs and maintenance. Keep all stakeholders updated effortlessly."
    }
  ];

  return (
    <div className="how-it-works-page">
      <div className="background-animation"></div>
      <div className="content-wrapper">
        <h1>How Snag It Works</h1>
        <div className="steps-table">
          {steps.map((step, index) => (
            <div key={index} className="step-row">
              <div className="step-icon">
                <step.icon />
              </div>
              <div className="step-content">
                <h2>{step.title}</h2>
                <p>{step.description}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="cta-section">
          <h2>Ready to streamline your property inspections?</h2>
          <Link to="/" className="cta-button">Get Started Now</Link>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
