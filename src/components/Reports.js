import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './Reports.css';

const Reports = ({ snags }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const groupSnagsByCategory = (snags) => {
    return snags.reduce((acc, snag) => {
      if (!acc[snag.category]) {
        acc[snag.category] = [];
      }
      acc[snag.category].push(snag);
      return acc;
    }, {});
  };

  const filteredSnags = snags.filter(snag => 
    (!startDate || new Date(snag.date) >= new Date(startDate)) &&
    (!endDate || new Date(snag.date) <= new Date(endDate))
  );

  const groupedSnags = groupSnagsByCategory(filteredSnags);

  const getBase64Image = (imgUrl) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      };
      img.onerror = reject;
      img.src = imgUrl;
    });
  };

  const processSnagImage = async (snag) => {
    if (!snag.image) return 'No image';
    
    try {
      const imageUrl = snag.image instanceof File ? URL.createObjectURL(snag.image) : snag.image;
      const base64Image = await getBase64Image(imageUrl);
      return `<img src="${base64Image}" alt="${snag.title}" style="max-width: 200px; max-height: 200px;">`;
    } catch (error) {
      console.error('Error processing image:', error);
      return 'Error loading image';
    }
  };

  const generateHtmlContent = (snagRows) => `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Snag Report</title>
        <style>
          body { font-family: Arial, sans-serif; }
          table { border-collapse: collapse; width: 100%; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
          tr:nth-child(even) { background-color: #f9f9f9; }
          h1 { color: #333; }
        </style>
      </head>
      <body>
        <h1>Snag Report</h1>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Category</th>
              <th>Title</th>
              <th>Description</th>
              <th>Date</th>
              <th>Image</th>
            </tr>
          </thead>
          <tbody>
            ${snagRows.join('')}
          </tbody>
        </table>
      </body>
    </html>
  `;

  const exportToHTML = async () => {
    const snagRows = await Promise.all(filteredSnags.map(async (snag) => {
      const imageHtml = await processSnagImage(snag);
      return `
        <tr>
          <td>${snag.id}</td>
          <td>${snag.category}</td>
          <td>${snag.title}</td>
          <td>${snag.description}</td>
          <td>${new Date(snag.date).toLocaleString()}</td>
          <td>${imageHtml}</td>
        </tr>
      `;
    }));

    const htmlContent = generateHtmlContent(snagRows);
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `snags_report_${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="reports">
      <h2 className="reports-title">Snag Reports</h2>
      <div className="report-controls">
        <div className="date-filter">
          <label htmlFor="start-date">Start Date:</label>
          <input 
            type="date" 
            id="start-date"
            value={startDate} 
            onChange={(e) => setStartDate(e.target.value)}
          />
          <label htmlFor="end-date">End Date:</label>
          <input 
            type="date" 
            id="end-date"
            value={endDate} 
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <button onClick={exportToHTML} className="export-button">
          Export Report
        </button>
      </div>
      <div className="report-content">
        {Object.entries(groupedSnags).map(([category, categorySnags]) => (
          <ReportCategory key={category} category={category} snags={categorySnags} />
        ))}
      </div>
    </div>
  );
};

const ReportCategory = ({ category, snags }) => (
  <div className="report-category">
    <h3 className="category-title">{category}</h3>
    {snags.map(snag => (
      <ReportItem key={snag.id} snag={snag} />
    ))}
  </div>
);

const ReportItem = ({ snag }) => (
  <div className="report-item">
    <div className="report-image">
      {snag.image && (
        <img 
          src={snag.image instanceof File ? URL.createObjectURL(snag.image) : snag.image} 
          alt={snag.title} 
        />
      )}
    </div>
    <div className="report-content">
      <h4 className="report-title">{snag.title}</h4>
      <p className="report-description">{snag.description}</p>
      <p className="report-date">
        <strong>Date:</strong> {new Date(snag.date).toLocaleString()}
      </p>
    </div>
  </div>
);

Reports.propTypes = {
  snags: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    category: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    image: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(File)]),
    date: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]).isRequired,
  })).isRequired,
};

ReportCategory.propTypes = {
  category: PropTypes.string.isRequired,
  snags: PropTypes.arrayOf(PropTypes.object).isRequired,
};

ReportItem.propTypes = {
  snag: PropTypes.shape({
    id: PropTypes.number.isRequired,
    category: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    image: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(File)]),
    date: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]).isRequired,
  }).isRequired,
};

export default Reports;