import React, { useState, useEffect } from 'react';

const SnagItem = ({ snag, onDelete }) => {
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    if (snag.image instanceof File) {
      const url = URL.createObjectURL(snag.image);
      setImageUrl(url);
      return () => URL.revokeObjectURL(url);
    } else if (typeof snag.image === 'string') {
      setImageUrl(snag.image);
    }
  }, [snag.image]);

  return (
    <div className="snag-item">
      <h3>{snag.title}</h3>
      <p><strong>Room:</strong> {snag.category}</p>
      <p><strong>Description:</strong> {snag.description}</p>
      {imageUrl && <img src={imageUrl} alt="Snag" className="snag-image" />}
      <p><strong>Date:</strong> {new Date(snag.date).toLocaleString()}</p>
      <button onClick={onDelete} className="delete-button">Delete</button>
    </div>
  );
};

export default SnagItem;