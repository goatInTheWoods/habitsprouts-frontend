import React from 'react';
import { Link } from 'react-router-dom';
import HeaderLoggedOut from './HeaderLoggedOut';
import HeaderLoggedIn from './HeaderLoggedIn';
import Logo from '../images/logo.svg';
import { useLoggedIn } from '../store';

function Header(props) {
  const loggedIn = useLoggedIn();
  const headerContent = loggedIn ? (
    <HeaderLoggedIn />
  ) : (
    <HeaderLoggedOut />
  );

  return (
    <header className="bg-white mb-3">
      <div className="container d-flex flex-md-row justify-content-between align-items-center p-3">
        <Link to="/">
          <Logo />
        </Link>
        <div></div>
        {!props.staticEmpty ? headerContent : ''}
      </div>
    </header>
  );
}

export default Header;
