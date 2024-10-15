import React, { useState } from 'react';
import PropTypes from 'prop-types';
import SnagForm from './SnagForm';
import { exportToPDF } from '../utils/pdfExport';
import './Dashboard.css';

const Dashboard = ({ snags, onAddSnag, onDeleteSnag, onSaveReport, onClearAllSnags }) => {
  const [selectedRoom, setSelectedRoom] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [reportName, setReportName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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

  const handleSaveReport = async () => {
    if (!reportName) {
      alert('Please enter a report name');
      return;
    }
    setIsLoading(true);
    try {
      const newReport = {
        name: reportName,
        snags: filteredSnags.map(snag => ({
          id: snag.id,
          title: snag.title,
          category: snag.category,
          description: snag.description,
          date: snag.date,
          image: snag.image
        })),
        createdAt: new Date().toISOString()
      };
      console.log("Saving new report:", newReport);
      await onSaveReport(newReport);
      setReportName('');
    } catch (error) {
      console.error('Error saving report:', error);
      alert('Failed to save report. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportToPDF = () => {
    exportToPDF(filteredSnags, reportName || 'Snag Report');
  };

  return (
    <div className="dashboard">
      <h2 className="dashboard-title">Dashboard</h2>
      <div className="dashboard-controls">
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
        <button onClick={handleExportToPDF} className="export-pdf-btn">Export to PDF</button>
        <button onClick={onClearAllSnags} className="clear-snags-btn">Clear All Snags</button>
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
