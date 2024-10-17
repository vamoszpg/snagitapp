import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FaEllipsisV } from 'react-icons/fa';

const ReportList = ({ reports, onSelectReport, selectedReportId, onDeleteReport, onExportReport }) => {
  const [activeMenu, setActiveMenu] = useState(null);

  return (
    <div className="reports-list">
      {reports.map(report => (
        <div 
          key={report.id} 
          className={`report-item ${selectedReportId === report.id ? 'selected' : ''}`}
        >
          <div onClick={() => onSelectReport(report)}>
            <h4>{report.name}</h4>
            <p>Created: {new Date(report.createdAt).toLocaleDateString()}</p>
            <p>Snags: {report.snags.length}</p>
          </div>
          <button className="report-menu-btn" onClick={() => setActiveMenu(report.id)}>
            <FaEllipsisV />
          </button>
          {activeMenu === report.id && (
            <div className="report-quick-menu">
              <button onClick={() => onExportReport(report)}>Export</button>
              <button onClick={() => onDeleteReport(report.id)}>Delete</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

ReportList.propTypes = {
  reports: PropTypes.array.isRequired,
  onSelectReport: PropTypes.func.isRequired,
  selectedReportId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default React.memo(ReportList);
