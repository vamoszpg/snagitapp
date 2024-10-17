import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import SnagForm from './SnagForm';
import SnagList from './SnagList';
import { FaFilePdf } from 'react-icons/fa';
import './Dashboard.css';

// Import the predefined rooms list
import { predefinedRooms } from './SnagForm';

import { exportToPDF } from '../utils/pdfExport';

const Dashboard = ({ 
  snags, 
  onAddSnag, 
  onDeleteSnag, 
  onSaveReport, 
  onClearAllSnags, 
  isDarkMode,
  addNotification
}) => {
  const [selectedRoom, setSelectedRoom] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const rooms = useMemo(() => {
    const uniqueRooms = [...new Set([...predefinedRooms, ...snags.map(snag => snag.category)])];
    return ['All', ...uniqueRooms.sort()];
  }, [snags]);

  const filteredSnags = useMemo(() => 
    snags.filter(snag => 
      (selectedRoom === 'All' || snag.category === selectedRoom) &&
      ((snag.title && snag.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
       (snag.description && snag.description.toLowerCase().includes(searchTerm.toLowerCase())))
    ), [snags, selectedRoom, searchTerm]);

  const groupedSnags = useMemo(() => 
    filteredSnags.reduce((acc, snag) => {
      if (!acc[snag.category]) {
        acc[snag.category] = [];
      }
      acc[snag.category].push(snag);
      return acc;
    }, {}), [filteredSnags]);

  const handleRoomChange = (e) => {
    setSelectedRoom(e.target.value);
  };

  const handleAddSnag = async (formData) => {
    try {
      const newSnag = {
        id: Date.now(),
        category: formData.get('category'),
        title: formData.get('title'),
        description: formData.get('description'),
        date: new Date().toISOString(),
      };

      const imageFile = formData.get('image');
      if (imageFile) {
        const reader = new FileReader();
        reader.onload = (e) => {
          newSnag.image = e.target.result;
          onAddSnag(newSnag);
        };
        reader.readAsDataURL(imageFile);
      } else {
        onAddSnag(newSnag);
      }
    } catch (error) {
      console.error('Error adding snag:', error);
    }
  };

  const handleSaveReport = (reportName) => {
    const reportSnags = snags.map(snag => ({
      ...snag,
      image: snag.image // Ensure the image data is included
    }));

    const newReport = {
      id: Date.now(),
      name: reportName,
      snags: reportSnags,
      createdAt: new Date().toISOString()
    };
    console.log('Dashboard: Saving report', newReport);
    onSaveReport(newReport);
  };

  const handleExportToPDF = async () => {
    if (snags.length === 0) {
      addNotification('There are no snags to export');
      return;
    }

    const report = {
      name: 'Current Snags',
      createdAt: new Date().toISOString(),
      snags: snags
    };

    try {
      await exportToPDF(report);
      addNotification('PDF exported successfully');
    } catch (error) {
      console.error('Error exporting to PDF:', error);
      addNotification('Error exporting PDF. Please try again.');
    }
  };

  return (
    <div className={`dashboard ${isDarkMode ? 'dark-mode' : ''}`}>
      <SnagForm 
        onSubmit={handleAddSnag} 
        rooms={rooms.filter(room => room !== 'All')} 
        onClearAllSnags={onClearAllSnags}
        onSaveReport={handleSaveReport}
      />
      {snags.length > 0 && (
        <div className="dashboard-controls">
          <select 
            value={selectedRoom} 
            onChange={handleRoomChange}
            className="room-select"
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
            className="search-input"
          />
          <button 
            className="export-pdf-btn" 
            onClick={handleExportToPDF}
            title="Export the current snag report as a PDF file"
          >
            <FaFilePdf /> Export to PDF
          </button>
        </div>
      )}
      <SnagList 
        groupedSnags={groupedSnags} 
        onDeleteSnag={onDeleteSnag} 
        isDarkMode={isDarkMode}
      />
    </div>
  );
};

Dashboard.propTypes = {
  snags: PropTypes.array.isRequired,
  onAddSnag: PropTypes.func.isRequired,
  onDeleteSnag: PropTypes.func.isRequired,
  onSaveReport: PropTypes.func.isRequired,
  onClearAllSnags: PropTypes.func.isRequired,
  isDarkMode: PropTypes.bool.isRequired,
  addNotification: PropTypes.func.isRequired,
};

export default Dashboard;
