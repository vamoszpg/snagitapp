import React from 'react';

const Reports = ({ snags }) => {
  const totalSnags = Object.values(snags).flat().length;
  const snagsByRoom = Object.entries(snags).map(([room, roomSnags]) => ({
    room,
    count: roomSnags.length
  }));

  return (
    <div className="reports">
      <h2>Snag Reports</h2>
      <div className="report-summary">
        <h3>Total Snags: {totalSnags}</h3>
      </div>
      <div className="report-details">
        <h3>Snags by Room</h3>
        <ul>
          {snagsByRoom.map(({ room, count }) => (
            <li key={room}>
              {room}: {count} snag{count !== 1 ? 's' : ''}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Reports;