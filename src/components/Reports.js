import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { FaFileAlt, FaTrashAlt, FaEye, FaFilePdf, FaSearch, FaSort } from 'react-icons/fa';
import { exportToPDF } from '../utils/pdfExport';
import './Reports.css';

const Reports = ({ savedReports, onDeleteReport, isDarkMode }) => {
  const [selectedReport, setSelectedReport] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [isLoading, setIsLoading] = useState(false);

  const filteredAndSortedReports = useMemo(() => {
    return savedReports
      .filter(report => report.name.toLowerCase().includes(searchTerm.toLowerCase()))
      .sort((a, b) => {
        if (sortBy === 'date') {
          return sortOrder === 'asc' 
            ? new Date(a.createdAt) - new Date(b.createdAt)
            : new Date(b.createdAt) - new Date(a.createdAt);
        } else {
          return sortOrder === 'asc'
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name);
        }
      });
  }, [savedReports, searchTerm, sortBy, sortOrder]);

  const handleSelectReport = (report) => {
    setSelectedReport(report);
  };

  const handleClearSelection = () => {
    setSelectedReport(null);
  };

  const handleDeleteReport = async (id) => {
    setIsLoading(true);
    try {
      await onDeleteReport(id);
      if (selectedReport && selectedReport.id === id) {
        setSelectedReport(null);
      }
    } catch (error) {
      console.error('Error deleting report:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportToPDF = async () => {
    if (!selectedReport) return;
    setIsLoading(true);

    try {
      await exportToPDF(selectedReport);
    } catch (error) {
      console.error('Error exporting to PDF:', error);
      alert('Error generating PDF. Please check the console for details.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`reports ${isDarkMode ? 'dark-mode' : ''}`}>
      <h2 className="reports-title">Saved Reports</h2>
      <div className="reports-container">
        <div className="reports-list">
          <div className="reports-controls">
            <div className="search-and-sort">
              <div className="search-container">
                <FaSearch className="search-icon" />
                <input
                  type="text"
                  placeholder="Search reports..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="sort-controls">
                <button onClick={() => setSortBy(sortBy === 'date' ? 'name' : 'date')} className="sort-btn">
                  Sort by: {sortBy === 'date' ? 'Date' : 'Name'}
                </button>
                <button onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')} className="sort-order-btn">
                  {sortOrder === 'asc' ? '↑' : '↓'}
                </button>
              </div>
            </div>
          </div>
          <div className="reports-scroll-container">
            {filteredAndSortedReports.map(report => (
              <div key={report.id} className="report-item" onClick={() => handleSelectReport(report)}>
                <div className="report-info">
                  <h4>{report.name}</h4>
                  <p>Created: {new Date(report.createdAt).toLocaleDateString()}</p>
                  <p>Snags: {report.snags.length}</p>
                </div>
                <div className="report-actions">
                  <button onClick={(e) => { e.stopPropagation(); handleSelectReport(report); }} className="view-btn">
                    <FaEye /> View
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); handleDeleteReport(report.id); }} className="delete-btn">
                    <FaTrashAlt /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="report-view">
          {selectedReport ? (
            <>
              <h3>{selectedReport.name}</h3>
              <div className="report-stats">
                <p>Created: {new Date(selectedReport.createdAt).toLocaleDateString()}</p>
                <p>Total Snags: {selectedReport.snags.length}</p>
              </div>
              <button 
                onClick={() => {
                  console.log("Export to PDF button clicked");
                  handleExportToPDF();
                }} 
                className="export-btn" 
                disabled={isLoading}
              >
                <FaFilePdf /> {isLoading ? 'Exporting...' : 'Export to PDF'}
              </button>
              <button onClick={handleClearSelection} className="close-btn">
                Close Report
              </button>
              <div className="report-content">
                {selectedReport.snags.map(snag => (
                  <div key={snag.id} className="report-snag-item">
                    <h4>{snag.title}</h4>
                    <p><strong>Category:</strong> {snag.category}</p>
                    <p><strong>Description:</strong> {snag.description}</p>
                    <p><strong>Date:</strong> {new Date(snag.date).toLocaleDateString()}</p>
                    {snag.image && (
                      <img src={snag.image} alt={snag.title} className="snag-image" />
                    )}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="no-report-selected">
              <p>Select a report to view its details</p>
            </div>
          )}
        </div>
      </div>
      {isLoading && <div className="loading-overlay">Loading...</div>}
    </div>
  );
};

Reports.propTypes = {
  savedReports: PropTypes.array.isRequired,
  onDeleteReport: PropTypes.func.isRequired,
  isDarkMode: PropTypes.bool.isRequired,
};

export default Reports;
