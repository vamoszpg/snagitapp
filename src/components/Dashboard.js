import React, { useState } from 'react';
import PropTypes from 'prop-types';
import SnagForm from './SnagForm';
import { exportToPDF } from '../utils/pdfExport';
import './Dashboard.css';

const Dashboard = ({ 
  snags, 
  onAddSnag, 
  onDeleteSnag, 
  onSaveReport, 
  onClearAllSnags, 
  isDarkMode
}) => {
  console.log('Dashboard isDarkMode:', isDarkMode);
  const [selectedRoom, setSelectedRoom] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [reportName, setReportName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState('');
  const [isEmailSending, setIsEmailSending] = useState(false);
  const [error, setError] = useState('');

  const rooms = ['All', ...new Set(snags.map(snag => snag.category))];

  const filteredSnags = snags.filter(snag => 
    (selectedRoom === 'All' || snag.category === selectedRoom) &&
    ((snag.title && snag.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
     (snag.description && snag.description.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  const groupedSnags = filteredSnags.reduce((acc, snag) => {
    if (!acc[snag.category]) {
      acc[snag.category] = [];
    }
    acc[snag.category].push(snag);
    return acc;
  }, {});

  const handleSaveReport = () => {
    if (reportName.trim() === '') {
      setError('Please enter a report name');
      return;
    }

    const report = {
      name: reportName,
      snags: filteredSnags,
      createdAt: new Date().toISOString(),
    };

    onSaveReport(report);
    setReportName('');
    setError('');
  };

  const handleExportToPDF = async () => {
    // Assuming you have a way to get the current report data
    const currentReport = {
      name: reportName,
      createdAt: new Date(),
      snags: snags,
    };

    try {
      await exportToPDF(currentReport);
    } catch (error) {
      console.error('Error exporting to PDF:', error);
      alert('Error generating PDF. Please check the console for details.');
    }
  };

  const handleSendEmail = async () => {
    if (!recipientEmail) {
      alert('Please enter a recipient email address.');
      return;
    }

    setIsEmailSending(true);

    try {
      // Generate PDF
      const pdfBlob = await exportToPDF(snags, 'Snag Report');

      // Create form data
      const formData = new FormData();
      formData.append('recipient', recipientEmail);
      formData.append('subject', 'Snag Report');
      formData.append('message', 'Please find attached the Snag Report.');
      formData.append('attachment', pdfBlob, 'snag_report.pdf');

      // Send email
      const response = await fetch(`${process.env.REACT_APP_API_URL}/send-email`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        alert('Email sent successfully!');
        setRecipientEmail('');
      } else {
        throw new Error('Failed to send email');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Failed to send email. Please try again.');
    } finally {
      setIsEmailSending(false);
    }
  };

  return (
    <div className={`dashboard ${isDarkMode ? 'dark-mode' : ''}`}>
      <h2 className="dashboard-title">Dashboard</h2>
      <div className="dashboard-controls">
        <div className="control-group">
          <select 
            value={selectedRoom} 
            onChange={(e) => setSelectedRoom(e.target.value)}
            className="room-filter"
          >
            {rooms.map(room => (
              <option key={room} value={room}>{room}</option>
            ))}
          </select>
          <input 
            type="text" 
            placeholder="Search snags..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="snag-search"
          />
        </div>
        <div className="control-group">
          <input 
            type="text"
            placeholder="Report Name"
            value={reportName}
            onChange={(e) => setReportName(e.target.value)}
            className="report-name"
          />
          <button 
            onClick={handleSaveReport} 
            className="save-report-btn" 
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 'Save Report'}
          </button>
        </div>
        <div className="control-group">
          <input
            type="email"
            value={recipientEmail}
            onChange={(e) => setRecipientEmail(e.target.value)}
            placeholder="Recipient's email"
            className="email-input"
          />
          <button
            onClick={handleSendEmail}
            disabled={isEmailSending}
            className="send-email-btn"
          >
            {isEmailSending ? 'Sending...' : 'Send Report'}
          </button>
        </div>
        <div className="control-group">
          <button onClick={handleExportToPDF} className="export-pdf-btn">Export to PDF</button>
          <button onClick={onClearAllSnags} className="clear-snags-btn">Clear All Snags</button>
        </div>
      </div>
      <SnagForm onSubmit={onAddSnag} />
      <div className="snag-grid">
        {Object.entries(groupedSnags).map(([category, categorySnags]) => (
          <div key={category} className="category-section">
            <h3 className="category-title">{category}</h3>
            <div className="category-snags">
              {categorySnags.map(snag => (
                <SnagItem key={snag.id} snag={snag} onDelete={onDeleteSnag} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const SnagItem = ({ snag, onDelete }) => (
  <div className="snag-item">
    <div className="snag-image-container">
      {snag.image ? (
        <img src={snag.image} alt={snag.title} className="snag-image" />
      ) : (
        <div className="snag-image-placeholder">No Image</div>
      )}
    </div>
    <div className="snag-details">
      <h4>{snag.title}</h4>
      <p className="snag-description">{snag.description}</p>
      <p className="snag-date">Date: {new Date(snag.date).toLocaleDateString()}</p>
      <button onClick={() => onDelete(snag.id)} className="delete-button">Delete</button>
    </div>
  </div>
);

Dashboard.propTypes = {
  snags: PropTypes.array.isRequired,
  onAddSnag: PropTypes.func.isRequired,
  onDeleteSnag: PropTypes.func.isRequired,
  onSaveReport: PropTypes.func.isRequired,
  onClearAllSnags: PropTypes.func.isRequired,
};

export default Dashboard;
