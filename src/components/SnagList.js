import React from 'react';
import SnagItem from './SnagItem';

const SnagList = ({ snags, onDeleteSnag }) => {
  if (!Array.isArray(snags) || snags.length === 0) {
    return <div className="snag-list empty">No snags to display</div>;
  }

  return (
    <div className="room-snags">
      {snags.map(snag => (
        <SnagItem
          key={snag.id}
          snag={snag}
          onDelete={() => onDeleteSnag(snag.id)}
        />
      ))}
    </div>
  );
};

export default SnagList;