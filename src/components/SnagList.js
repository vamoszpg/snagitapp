import React from 'react';

const SnagList = ({ roomSnags, onDelete, onEdit }) => {
  if (!Array.isArray(roomSnags) || roomSnags.length === 0) {
    return <p>No snags available.</p>;
  }

  let currentRoom = null;

  return (
    <div className="snag-list">
      {roomSnags.map((snag) => {
        const roomHeader = snag.room !== currentRoom ? (
          <h4 className="room-header">{snag.room}</h4>
        ) : null;
        currentRoom = snag.room;

        return (
          <React.Fragment key={snag.id}>
            {roomHeader}
            <div className="snag-item">
              {snag.image && (
                <img 
                  src={typeof snag.image === 'string' ? snag.image : URL.createObjectURL(snag.image)} 
                  alt="Snag" 
                  className="snag-item-image" 
                />
              )}
              <p className="snag-item-description">{snag.description}</p>
              <p className="snag-item-details">Date: {new Date(snag.date).toLocaleDateString()}</p>
              <div className="snag-item-actions">
                <button onClick={() => onEdit(snag.id)} className="snag-item-edit">Edit</button>
                <button onClick={() => onDelete(snag.id)} className="snag-item-delete">Delete</button>
              </div>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default SnagList;