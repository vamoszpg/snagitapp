import React from 'react';
import PropTypes from 'prop-types';
import { FaTrashAlt, FaFilePdf, FaTimes } from 'react-icons/fa';
import Tooltip from '../Tooltip'; // You'll need to create this component

const ReportDetails = ({ report, onClose, onDelete, onExport }) => (
  <>
    <div className="report-details-header">
      <h3>{report.name}</h3>
      <button onClick={onClose} className="close-btn" aria-label="Close report details">
        <FaTimes />
      </button>
    </div>
    <p className="report-date">Created: {new Date(report.createdAt).toLocaleString()}</p>
    <div className="report-actions">
      <Tooltip content="Export this report as a PDF file">
        <button onClick={() => onExport(report)} className="export-btn">
          <FaFilePdf /> Export to PDF
        </button>
      </Tooltip>
      <Tooltip content="Permanently delete this report">
        <button onClick={() => onDelete(report.id)} className="delete-btn">
          <FaTrashAlt /> Delete Report
        </button>
      </Tooltip>
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
);

ReportDetails.propTypes = {
  report: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    snags: PropTypes.array.isRequired,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onExport: PropTypes.func.isRequired,
};

export default React.memo(ReportDetails);
