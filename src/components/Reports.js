import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { FaFileAlt, FaTrashAlt, FaEye, FaFilePdf, FaSearch, FaSort } from 'react-icons/fa';
import jsPDF from 'jspdf';
import 'jspdf-autotable';  // Make sure to install this package: npm install jspdf-autotable
import './Reports.css';

const Reports = ({ savedReports, onDeleteReport }) => {
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
      const pdf = new jsPDF();
      const pageWidth = pdf.internal.pageSize.width;
      const pageHeight = pdf.internal.pageSize.height;
      const margin = 15;
      const contentWidth = pageWidth - 2 * margin;

      // Colors
      const primaryColor = [0, 123, 255];  // #007bff
      const secondaryColor = [108, 117, 125];  // #6c757d
      const lightGray = [240, 240, 240];  // #f0f0f0

      // Helper function to add header and footer
      const addHeaderAndFooter = () => {
        // Header
        pdf.setFillColor(...primaryColor);
        pdf.rect(0, 0, pageWidth, 20, 'F');
        pdf.setTextColor(255);
        pdf.setFontSize(12);
        pdf.text('Snag It Report', margin, 14);
        // Footer
        pdf.setFillColor(...lightGray);
        pdf.rect(0, pageHeight - 15, pageWidth, 15, 'F');
        pdf.setTextColor(...secondaryColor);
        pdf.setFontSize(8);
        pdf.text(`Generated on ${new Date().toLocaleDateString()}`, margin, pageHeight - 5);
        pdf.text(`Page ${pdf.internal.getNumberOfPages()}`, pageWidth - margin, pageHeight - 5, { align: 'right' });
      };

      // Add first page
      addHeaderAndFooter();

      // Title
      pdf.setFontSize(24);
      pdf.setTextColor(...primaryColor);
      pdf.text(selectedReport.name, pageWidth / 2, 40, { align: 'center' });

      // Report info
      pdf.setFontSize(12);
      pdf.setTextColor(...secondaryColor);
      pdf.text(`Created: ${new Date(selectedReport.createdAt).toLocaleDateString()}`, margin, 55);
      pdf.text(`Total Snags: ${selectedReport.snags.length}`, pageWidth - margin, 55, { align: 'right' });

      let yOffset = 70;

      // Add snags
      for (const [index, snag] of selectedReport.snags.entries()) {
        const snagHeight = 10 + 30 + 100 + 30;  // Title + Table + Image + Padding

        // Check if there's enough space on the current page
        if (yOffset + snagHeight > pageHeight - 30) {
          pdf.addPage();
          addHeaderAndFooter();
          yOffset = 30;
        }

        // Snag title
        pdf.setFontSize(16);
        pdf.setTextColor(...primaryColor);
        pdf.text(`Snag ${index + 1}: ${snag.title || 'No Title'}`, margin, yOffset);
        yOffset += 10;

        // Snag details table
        pdf.autoTable({
          startY: yOffset,
          head: [['Room', 'Description', 'Date']],
          body: [
            [
              snag.category || 'Not specified',
              snag.description || 'No description',
              snag.date ? new Date(snag.date).toLocaleDateString() : 'Not specified'
            ]
          ],
          headStyles: { fillColor: primaryColor, textColor: 255 },
          alternateRowStyles: { fillColor: lightGray },
          margin: { left: margin, right: margin },
          tableWidth: contentWidth
        });

        yOffset = pdf.lastAutoTable.finalY + 10;

        // Add image if available
        if (snag.image) {
          try {
            const imgData = await fetchImageAsBase64(snag.image);
            const imgProps = pdf.getImageProperties(imgData);
            const imgWidth = contentWidth;
            const imgHeight = (imgProps.height * imgWidth) / imgProps.width;
            pdf.addImage(imgData, 'JPEG', margin, yOffset, imgWidth, imgHeight, undefined, 'FAST');
            yOffset += imgHeight + 10;
          } catch (error) {
            console.error('Error adding image to PDF:', error);
            pdf.text('Error loading image', margin, yOffset);
            yOffset += 10;
          }
        }

        // Add some space between snags
        yOffset += 20;
      }

      // Add header and footer to all pages
      const totalPages = pdf.internal.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        addHeaderAndFooter();
      }

      pdf.save(`${selectedReport.name}_report.pdf`);
    } catch (error) {
      console.error('Error exporting to PDF:', error);
      alert('Error generating PDF. Please check the console for details.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchImageAsBase64 = async (url) => {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  return (
    <div className="reports">
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
};

export default Reports;