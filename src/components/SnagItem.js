import React from 'react';
import PropTypes from 'prop-types';
import { FaTrashAlt } from 'react-icons/fa';
import './SnagItem.css';

const SnagItem = ({ snag, onDelete, isDarkMode }) => {
  return (
    <div className={`snag-item ${isDarkMode ? 'dark-mode' : ''}`}>
      {snag.image && <img src={snag.image} alt={snag.title} className="snag-image" />}
      <div className="snag-content">
        <h3 className="snag-title">{snag.title}</h3>
        <p className="snag-description">{snag.description}</p>
        <p className="snag-category">Category: {snag.category}</p>
        <p className="snag-date">Date: {new Date(snag.date).toLocaleDateString()}</p>
        <button onClick={() => onDelete(snag.id)} className="delete-button">
          <FaTrashAlt /> Delete
        </button>
      </div>
    </div>
  );
};

SnagItem.propTypes = {
  snag: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    image: PropTypes.string,
  }).isRequired,
  onDelete: PropTypes.func.isRequired,
  isDarkMode: PropTypes.bool.isRequired,
};

export default SnagItem;
