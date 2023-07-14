import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    /* <p className="m-0">
        Copyright &copy; {new Date().getFullYear()}{' '}
        <a href="/" className="text-muted">
          HabitCount
        </a>
        . All rights reserved.
      </p> */

    <nav className="nav nav-justified bg-black text-white p-1">
      <Link className="nav-link flex-column" to="/habits">
        <i className="fas fa-check-square"></i>
        <p>Habits</p>
      </Link>
      <Link className="nav-link flex-column" to="/about-us">
        <i className="fas fa-pen-square"></i>
        <p>Comments</p>
      </Link>
      <Link className="nav-link" to="/terms">
        <i className="fas fa-users"></i>
        <p>Share</p>
      </Link>
    </nav>
  );
};

export default Navbar;
