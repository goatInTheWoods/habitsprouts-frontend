import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = props => {
  return (
    <nav className="fixed-bottom nav nav-pills nav-justified  bg-black text-white p-3">
      <Link className="nav-link flex-column" to="/">
        <i class="fas fa-check-square"></i>
        <p>Habits</p>
      </Link>
      <Link className="nav-link flex-column" to="/about-us">
        <i class="fas fa-pen-square"></i>
        <p>Comments</p>
      </Link>
      <Link className="nav-link" to="/terms">
        <i class="fas fa-users"></i>
        <p>Share</p>
      </Link>
    </nav>
  );
};

export default Navbar;
