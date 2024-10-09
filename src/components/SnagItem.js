import React from 'react';

const SnagItem = ({ snag, onDelete }) => {
  return (
    <div className="snag-item">
      {snag.image && (
        <img src={snag.image} alt="Snag" className="snag-image" />
      )}
      <div className="snag-details">
        <h3>{snag.title}</h3>
        <p><strong>Description:</strong> {snag.description}</p>
        <p><strong>Category:</strong> {snag.category}</p>
        <p><strong>Date:</strong> {new Date(snag.date).toLocaleDateString()}</p>
      </div>
      <button onClick={() => onDelete(snag.id)} className="delete-button">Delete</button>
    </div>
  );
};

export default React.memo(SnagItem);