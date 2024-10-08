import React from 'react';

const PrintableSnagList = React.forwardRef(({ snags }, ref) => {
  return (
    <div className="printable-snag-list" ref={ref}>
      <div className="print-header">
        <div className="print-header-logo">Snag It</div>
        <div className="print-header-info">
          <div>Report Date: {new Date().toLocaleDateString()}</div>
          <div>Snag It Ltd.</div>
          <div>123 Main St, City, Country</div>
        </div>
      </div>
      <h1>Snag Report</h1>
      {Object.entries(snags).map(([room, roomSnags]) => (
        <div key={room} className="printable-room-snags">
          <h2 className="printable-room-title">{room}</h2>
          <table className="printable-snag-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Description</th>
                <th>Reported By</th>
              </tr>
            </thead>
            <tbody>
              {roomSnags.map((snag) => (
                <tr key={snag.id} className="printable-snag-item">
                  <td className="printable-snag-image-cell">
                    {snag.image && (
                      <img src={snag.image} alt="Snag" className="printable-snag-image" />
                    )}
                  </td>
                  <td className="printable-snag-description">{snag.description}</td>
                  <td className="printable-snag-user">{snag.user}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
      <div className="print-footer">
        <div>Snag It - Professional Snag Reporting</div>
        <div>www.snagit.com | info@snagit.com | +1 (123) 456-7890</div>
        <div className="page-number">Page </div>
      </div>
    </div>
  );
});

export default PrintableSnagList;