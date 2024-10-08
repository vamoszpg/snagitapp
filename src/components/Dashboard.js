import React, { useState } from 'react';
import SnagForm from './SnagForm';
import SnagList from './SnagList';

const Dashboard = () => {
  const [snags, setSnags] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('room');

  const handleAddSnag = (room, description, image) => {
    const newSnag = {
      id: Date.now(),
      room,
      description,
      image,
      date: new Date(),
    };
    setSnags([...snags, newSnag]);
  };

  const handleDeleteSnag = (id) => {
    setSnags(snags.filter(snag => snag.id !== id));
  };

  const handleEditSnag = (id, updatedSnag) => {
    setSnags(snags.map(snag => snag.id === id ? { ...snag, ...updatedSnag } : snag));
  };

  const filteredAndSortedSnags = snags
    .filter(snag => snag.description.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortOption === 'room') {
        const roomComparison = a.room.localeCompare(b.room);
        if (roomComparison !== 0) return roomComparison;
        return new Date(b.date) - new Date(a.date);
      } else if (sortOption === 'date') {
        return new Date(b.date) - new Date(a.date);
      } else if (sortOption === 'description') {
        return a.description.localeCompare(b.description);
      }
      return 0;
    });

  return (
    <div className="dashboard">
      <div className="dashboard-summary">
        <h2>Dashboard Overview</h2>
        <div className="summary-stats">
          <div className="stat-item">
            <span className="stat-value">{snags.length}</span>
            <span className="stat-label">Total Snags</span>
          </div>
        </div>
      </div>
      <div className="dashboard-content">
        <div className="snag-form-section">
          <h3>Add New Snag</h3>
          <SnagForm onSubmit={handleAddSnag} />
        </div>
        <div className="snag-list-section">
          <h3>Snag List</h3>
          <div className="search-sort-container">
            <input
              type="text"
              placeholder="Search snags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <select 
              value={sortOption} 
              onChange={(e) => setSortOption(e.target.value)} 
              className="sort-select"
            >
              <option value="room">Sort by Room</option>
              <option value="date">Sort by Date</option>
              <option value="description">Sort by Description</option>
            </select>
          </div>
          <SnagList 
            roomSnags={filteredAndSortedSnags} 
            onDelete={handleDeleteSnag}
            onEdit={handleEditSnag}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;