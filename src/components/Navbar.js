import React from 'react';
import ErrorMessage from './ErrorMessage';

const Navbar = () => {

  return (
    <nav className="nav-wrapper white navbar">
      <div className="header-container">
        <h1 className="header-main-title">Task Manager ( Trello / Asana / Kanban board )</h1>
        <p>List of users is dummy data. There is no user authentication right now</p>
        <ErrorMessage />
      </div>
    </nav>
  )
}
 
export default Navbar;