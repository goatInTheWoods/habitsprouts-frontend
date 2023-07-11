import React, { useState, useContext, lazy } from 'react';
import { Link } from 'react-router-dom';
import HeaderLoggedOut from './HeaderLoggedOut';
import HeaderLoggedIn from './HeaderLoggedIn';
import StateContext from '../StateContext';
import Logo from '../logo.svg';

function Header(props) {
  const appState = useContext(StateContext);
  const headerContent = appState.loggedIn ? (
    <HeaderLoggedIn />
  ) : (
    <HeaderLoggedOut />
  );

  return (
    <header className="bg-white mb-3">
      <div className="container d-flex flex-md-row d-flex justify-content-between align-items-center p-3">
        <Logo />
        <div></div>
        {/* {!props.staticEmpty ? headerContent : ''} */}
      </div>
    </header>
  );
}

export default Header;
