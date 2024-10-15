import React, { useState } from 'react';
import PropTypes from 'prop-types';

const SnagForm = ({ onSubmit }) => {
  const [category, setCategory] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');

  const categories = [
    'Bedroom', 'Bathroom', 'Kitchen', 'Living Room', 
    'Dining Room', 'Garden', 'Garage', 'Attic', 
    'Basement', 'Hallway', 'Office', 'Other'
  ];

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log('Attempting to add snag:', { category, title, description, image });

    try {
      const newSnag = {
        category,
        title,
        description,
        image: image ? URL.createObjectURL(image) : null,
        date: new Date().toISOString()
      };

      console.log('New snag created:', newSnag);
      onSubmit(newSnag);

      // Reset form fields
      setCategory('');
      setTitle('');
      setDescription('');
      setImage(null);
      setError('');
    } catch (error) {
      console.error('Error adding snag:', error);
      setError('Failed to add snag. Please try again.');
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
      console.log('Image file selected:', e.target.files[0].name);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="snag-form" encType="multipart/form-data">
      <h3>Add New Snag</h3>
      {error && <p className="error-message">{error}</p>}
      <div>
        <label htmlFor="category">Room:</label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        >
          <option value="">Select a room</option>
          {categories.map((room) => (
            <option key={room} value={room}>{room}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="title">Title:</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="description">Description:</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="image">Image:</label>
        <input
          type="file"
          id="image"
          onChange={handleImageChange}
          accept="image/*"
        />
      </div>
      <button type="submit">Add Snag</button>
    </form>
  );
};

SnagForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default SnagForm;
