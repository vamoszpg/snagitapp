import React from 'react';

const ReportPDF = ({ report }) => (
  <div className="pdf-container" style={{padding: '20px', fontFamily: 'Arial, sans-serif'}}>
    <h1 style={{textAlign: 'center', color: '#2c3e50'}}>{report.name}</h1>
    <h2 style={{textAlign: 'center', color: '#7f8c8d'}}>Snag Report</h2>
    <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '20px'}}>
      <span>Created: {new Date(report.createdAt).toLocaleDateString()}</span>
      <span>Total Snags: {report.snags.length}</span>
    </div>
    {report.snags.map((snag) => (
      <div key={snag.id} style={{border: '1px solid #bdc3c7', borderRadius: '8px', padding: '20px', marginBottom: '20px'}}>
        <h3 style={{color: '#2980b9', marginTop: '0'}}>{snag.title}</h3>
        <p><strong>Category:</strong> {snag.category}</p>
        <p><strong>Description:</strong> {snag.description}</p>
        <p><strong>Date:</strong> {new Date(snag.date).toLocaleDateString()}</p>
        {snag.image && <img src={snag.image} alt={snag.title} style={{maxWidth: '100%', height: 'auto', marginTop: '10px'}} />}
      </div>
    ))}
  </div>
);

export default ReportPDF;
