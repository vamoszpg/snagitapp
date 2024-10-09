import React, { useState } from 'react';

const SnagForm = ({ onSubmit }) => {
  const [category, setCategory] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);

  const categories = [
    'Bedroom', 'Bathroom', 'Kitchen', 'Living Room', 
    'Dining Room', 'Garden', 'Garage', 'Attic', 
    'Basement', 'Hallway', 'Office', 'Other'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(category, title, description, image);
    setCategory('');
    setTitle('');
    setDescription('');
    setImage(null);
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="snag-form">
      <h3>Add New Snag</h3>
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

export default SnagForm;