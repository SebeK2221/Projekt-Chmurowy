import React from "react";
import { FaTrash } from 'react-icons/fa'; // Import ikony kosza

const AnnounceCart = ({ id, localization, date, dataDescription, description, isAdmin, onDelete }) => (
  <div className="card mb-3">
    <div className="card-body">
      <h5 className="card-title">{localization}</h5>
      <h6 className="card-subtitle mb-2 text-muted">{date}</h6>
      <p className="card-text">
        <strong>{dataDescription}</strong>
      </p>
      <p className="card-text">{description}</p>
      {isAdmin && (
        <button 
          className="btn btn-danger" 
          onClick={() => onDelete(id)} 
        >
          <FaTrash />
        </button>
      )}
    </div>
  </div>
);

export default AnnounceCart;
