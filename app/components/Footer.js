import React from 'react';
import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

const Footer = () => {
  return (
    /* <p className="m-0">
        Copyright &copy; {new Date().getFullYear()}{' '}
        <a href="/" className="text-muted">
          HabitCount
        </a>
        . All rights reserved.
      </p> */

    <nav className="fixed-bottom nav nav-pills nav-justified  bg-black text-white p-4">
      <Link className="nav-link" to="/">
        Habits
      </Link>
      <Link className="nav-link" to="/about-us">
        About Us
      </Link>
      <Link className="nav-link" to="/terms">
        Terms
      </Link>
    </nav>
  );
};

export default Footer;
