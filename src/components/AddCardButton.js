import React from 'react';

const AddCardButton = ({ openForm }) => {
  return (
    <div className="add-card" onClick={openForm}><i className="fas fa-plus"></i></div>
  );
}
 
export default AddCardButton;