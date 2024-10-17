import React, { useState, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { FaTrashAlt, FaEye, FaFilePdf, FaSearch, FaTimes } from 'react-icons/fa';
import { exportToPDF } from '../../utils/pdfExport';
import './Reports.css';

// New component for ReportList
const ReportList = React.memo(({ reports, onSelectReport, selectedReportId }) => (
  <div className="reports-list">
    {reports.length === 0 ? (
      <p className="no-reports">No reports found.</p>
    ) : (
      reports.map(report => (
        <div 
          key={report.id} 
          className={`report-item ${selectedReportId === report.id ? 'selected' : ''}`}
          onClick={() => onSelectReport(report)}
        >
          <h4>{report.name}</h4>
          <p>Created: {new Date(report.createdAt).toLocaleDateString()}</p>
          <p>Snags: {report.snags.length}</p>
        </div>
      ))
    )}
  </div>
));

// New component for ReportDetails
const ReportDetails = React.memo(({ report, onClose, onDelete, onExport }) => (
  <>
    <div className="report-details-header">
      <h3>{report.name}</h3>
      <button onClick={onClose} className="close-btn" aria-label="Close report details">
        <FaTimes />
      </button>
    </div>
    <p className="report-date">Created: {new Date(report.createdAt).toLocaleString()}</p>
    <div className="report-actions">
      <button onClick={() => onExport(report)} className="export-btn">
        <FaFilePdf /> Export to PDF
      </button>
      <button onClick={() => onDelete(report.id)} className="delete-btn">
        <FaTrashAlt /> Delete Report
      </button>
    </div>
    <h4>Snags:</h4>
    <div className="snag-list">
      {report.snags.map(snag => (
        <div key={snag.id} className="snag-item">
          <h5>{snag.title}</h5>
          <p>{snag.description}</p>
          <p>Category: {snag.category}</p>
          <p>Date: {new Date(snag.date).toLocaleDateString()}</p>
          {snag.image && (
            <img src={snag.image} alt={snag.title} className="snag-image" />
          )}
        </div>
      ))}
    </div>
  </>
));

const Reports = ({ savedReports, onDeleteReport, isDarkMode, addNotification }) => {
  const [selectedReport, setSelectedReport] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);

  const filteredReports = useMemo(() => {
    return savedReports.filter(report => 
      report.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [savedReports, searchTerm]);

  const handleReportSelect = useCallback((report) => {
    setSelectedReport(report);
  }, []);

  const handleExportPDF = useCallback((report) => {
    try {
      exportToPDF(report);
      addNotification('Report exported successfully', 'success');
    } catch (error) {
      console.error('Error exporting PDF:', error);
      addNotification('Failed to export report', 'error');
    }
  }, [addNotification]);

  const handleImageClick = useCallback((imageUrl) => {
    setSelectedImage(imageUrl);
  }, []);

  const closeImageModal = useCallback(() => {
    setSelectedImage(null);
  }, []);

  return (
    <div className={`reports-container ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="reports-sidebar">
        <h2 className="reports-title">Saved Reports</h2>
        <div className="reports-sidebar-content">
          <div className="search-bar">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search reports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <ReportList
            reports={filteredReports}
            onSelectReport={handleReportSelect}
            selectedReportId={selectedReport?.id}
          />
        </div>
      </div>
      <div className="report-details-container">
        {selectedReport ? (
          <div className="report-details">
            <h3>{selectedReport.name}</h3>
            <p className="report-date">Created: {new Date(selectedReport.createdAt).toLocaleString()}</p>
            <div className="report-actions">
              <button onClick={() => handleExportPDF(selectedReport)} className="export-btn">
                <FaFilePdf /> Export to PDF
              </button>
              <button onClick={() => onDeleteReport(selectedReport.id)} className="delete-btn">
                <FaTrashAlt /> Delete Report
              </button>
            </div>
            <h4>Snags:</h4>
            <div className="snag-list">
              {selectedReport.snags.map((snag) => (
                <div key={snag.id} className="snag-item">
                  <h5>{snag.title}</h5>
                  <p>{snag.description}</p>
                  <p>Category: {snag.category}</p>
                  <p>Date: {new Date(snag.date).toLocaleDateString()}</p>
                  {snag.image && (
                    <img
                      src={snag.image}
                      alt={snag.title}
                      className="snag-image"
                      onClick={() => handleImageClick(snag.image)}
                      style={{ cursor: 'pointer' }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="no-report-selected">
            <p>Select a report to view details</p>
          </div>
        )}
      </div>
      {selectedImage && (
        <div className="image-modal-overlay" onClick={closeImageModal}>
          <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
            <img src={selectedImage} alt="Full size" />
            <button className="image-modal-close" onClick={closeImageModal}>
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

Reports.propTypes = {
  savedReports: PropTypes.array.isRequired,
  onDeleteReport: PropTypes.func.isRequired,
  isDarkMode: PropTypes.bool.isRequired,
  addNotification: PropTypes.func.isRequired,
};

export default Reports;
