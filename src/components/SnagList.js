import React from 'react';
import PropTypes from 'prop-types';
import SnagItem from './SnagItem';
import './SnagList.css';

const SnagList = ({ groupedSnags, onDeleteSnag, isDarkMode }) => {
  if (Object.keys(groupedSnags).length === 0) {
    return <div className="snag-list empty">No snags to display</div>;
  }

  return (
    <div className={`snag-list ${isDarkMode ? 'dark-mode' : ''}`}>
      {Object.entries(groupedSnags).map(([category, snags]) => (
        <div key={category} className="category-section">
          <h3 className="category-title">{category}</h3>
          <div className="category-snags">
            {snags.map(snag => (
              <SnagItem
                key={snag.id}
                snag={snag}
                onDelete={() => onDeleteSnag(snag.id)}
                isDarkMode={isDarkMode}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

SnagList.propTypes = {
  groupedSnags: PropTypes.object.isRequired,
  onDeleteSnag: PropTypes.func.isRequired,
  isDarkMode: PropTypes.bool.isRequired,
};

export default SnagList;
