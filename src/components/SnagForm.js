import React, { useState } from 'react';

const SnagForm = ({ onSubmit }) => {
  const [room, setRoom] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [fileName, setFileName] = useState('No file chosen');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(room, description, image);
    setRoom('');
    setDescription('');
    setImage(null);
    setFileName('No file chosen');
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
      setFileName(e.target.files[0].name);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="snag-form">
      <div className="form-group">
        <label htmlFor="room">Room:</label>
        <select
          id="room"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          required
        >
          <option value="">Select a room</option>
          <option value="Living Room">Living Room</option>
          <option value="Kitchen">Kitchen</option>
          <option value="Bedroom">Bedroom</option>
          <option value="Bathroom">Bathroom</option>
          <option value="Other">Other</option>
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="description">Snag Description:</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        ></textarea>
      </div>
      <div className="form-group">
        <label htmlFor="image">Upload Image:</label>
        <div className="file-input-container">
          <label htmlFor="image" className="file-input-button">
            Choose File
          </label>
          <input
            type="file"
            id="image"
            onChange={handleImageChange}
            accept="image/*"
            className="file-input"
          />
          <span className="file-name-display">{fileName}</span>
        </div>
      </div>
      <button type="submit" className="submit-btn">Submit Snag</button>
    </form>
  );
};

export default SnagForm;