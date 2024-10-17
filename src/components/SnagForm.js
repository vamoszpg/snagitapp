import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FaTrash, FaFileUpload, FaSave } from 'react-icons/fa';
import './SnagForm.css';

export const predefinedRooms = [
  // Interior Rooms
  "Living Room",
  "Dining Room",
  "Kitchen",
  "Master Bedroom",
  "Bedroom",
  "Bathroom",
  "Ensuite",
  "Home Office",
  "Study",
  "Playroom",
  "Family Room",
  "Laundry Room",
  "Utility Room",
  "Pantry",
  "Closet",
  "Hallway",
  "Staircase",
  "Attic",
  "Basement",
  "Garage",
  
  // Exterior Areas
  "Front Yard",
  "Back Yard",
  "Patio",
  "Deck",
  "Balcony",
  "Porch",
  "Driveway",
  "Walkway",
  "Garden",
  "Pool Area",
  "Shed",
  "Exterior Walls",
  "Roof",
  "Gutters",
  "Fencing",
  
  // Additional Areas
  "Other Interior",
  "Other Exterior"
];

const SnagForm = ({ onSubmit, rooms, onClearAllSnags, onSaveReport }) => {
  const [category, setCategory] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('category', category);
    formData.append('title', title);
    formData.append('description', description);
    if (image) {
      formData.append('image', image);
    }
    onSubmit(formData);
    setCategory('');
    setTitle('');
    setDescription('');
    setImage(null);
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSaveReport = () => {
    const reportName = prompt("Enter a name for this report:");
    if (reportName) {
      console.log('SnagForm: Saving report with name:', reportName);
      onSaveReport(reportName);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="snag-form">
      <div className="form-group">
        <label htmlFor="category">Select Room:</label>
        <select
          id="category"
          name="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        >
          <option value="" disabled>Select a room</option>
          {rooms.map((room) => (
            <option key={room} value={room}>{room}</option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="title">Title:</label>
        <input
          type="text"
          id="title"
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter snag title"
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="description">Description:</label>
        <textarea
          id="description"
          name="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter snag description"
          required
        />
      </div>
      
      <div className="form-actions">
        <label htmlFor="file-input" className="file-input-label" title="Select an image file to attach to the snag">
          Choose File
          <input
            type="file"
            id="file-input"
            onChange={handleImageChange}
            style={{ display: 'none' }}
          />
        </label>
        <button type="submit" className="add-snag-btn" title="Add a new snag to the list">Add Snag</button>
        <button type="button" onClick={onClearAllSnags} className="clear-all-btn" title="Remove all snags from the list">Clear All Snags</button>
        <button type="button" onClick={handleSaveReport} className="save-report-btn">Save Report</button>
      </div>
    </form>
  );
};

SnagForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  rooms: PropTypes.array.isRequired,
  onClearAllSnags: PropTypes.func.isRequired,
  onSaveReport: PropTypes.func.isRequired,
};

export default SnagForm;
