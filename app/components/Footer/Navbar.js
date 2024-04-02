import React from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

const Navbar = () => {
  return (
    <Nav className="nav nav-justified bg-black text-white p-1">
      <NavLink className="nav-link flex-column" to="/habits">
        <i className="fas fa-check-square"></i>
        <p>Habits</p>
      </NavLink>
      <NavLink className="nav-link flex-column" to="/logs">
        <i className="fas fa-pen-square"></i>
        <p>Logs</p>
      </NavLink>
      <NavLink className="nav-link" to="/terms">
        <i className="fas fa-users"></i>
        <p>Share</p>
      </NavLink>
    </Nav>
  );
};

const Nav = styled.nav`
  a.active {
    color: #ff0;
  }
`;

export default Navbar;
