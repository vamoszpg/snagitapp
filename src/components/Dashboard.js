import React, { useState } from 'react';
import PropTypes from 'prop-types';
import SnagForm from './SnagForm';
import SnagList from './SnagList';
import './Dashboard.css';

const Dashboard = ({ snags, onAddSnag, onDeleteSnag }) => {
  const [selectedRoom, setSelectedRoom] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const rooms = ['All', ...new Set(snags.map(snag => snag.category))];

  const filteredSnags = snags.filter(snag => 
    (selectedRoom === 'All' || snag.category === selectedRoom) &&
    (snag.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
     snag.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const groupedSnags = filteredSnags.reduce((acc, snag) => {
    if (!acc[snag.category]) {
      acc[snag.category] = [];
    }
    acc[snag.category].push(snag);
    return acc;
  }, {});

  return (
    <div className="dashboard">
      <h2 className="dashboard-title">Dashboard</h2>
      <div className="dashboard-content">
        <div className="dashboard-controls">
          <div className="filter-search-container">
            <select 
              value={selectedRoom} 
              onChange={(e) => setSelectedRoom(e.target.value)}
              className="room-filter"
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
              className="snag-search"
            />
          </div>
        </div>
        <SnagForm onSubmit={onAddSnag} />
        <div className="snag-list">
          {Object.entries(groupedSnags).map(([room, roomSnags]) => (
            <div key={room} className="room-group">
              <h3 className="room-title">{room}</h3>
              <SnagList 
                snags={filteredSnags} 
                onDeleteSnag={onDeleteSnag}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

Dashboard.propTypes = {
  snags: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    category: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    image: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(File)]),
    date: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]).isRequired,
  })).isRequired,
  onAddSnag: PropTypes.func.isRequired,
  onDeleteSnag: PropTypes.func.isRequired,
};

export default Dashboard;