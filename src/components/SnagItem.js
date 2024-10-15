import React from 'react';

const SnagItem = ({ snag, onDelete }) => {
  return (
    <div className="snag-item">
      {snag.image && <img src={snag.image} alt={snag.title} className="snag-image" />}
      <h3>{snag.title}</h3>
      <p>{snag.description}</p>
      <p>Category: {snag.category}</p>
      <p>Date: {new Date(snag.date).toLocaleDateString()}</p>
      <button onClick={() => onDelete(snag.id)}>Delete</button>
    </div>
  );
};

export default SnagItem;
