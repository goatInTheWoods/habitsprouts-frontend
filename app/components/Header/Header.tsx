import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import HeaderLoggedOut from './HeaderLoggedOut';
import HeaderLoggedIn from './HeaderLoggedIn';
import { ReactComponent as LogoWhite } from '../../images/logo-white.svg';
import { useLoggedIn } from '../../store/store';

function Header(props: $TSFixMe) {
  // const [darkMode, setDarkMode] = useState(false);

  const loggedIn = useLoggedIn();
  const headerContent = loggedIn ? (
    <HeaderLoggedIn />
  ) : (
    <HeaderLoggedOut />
  );

  // useEffect(() => {
  //   const mediaQuery = window.matchMedia(
  //     '(prefers-color-scheme: dark)'
  //   );
  //   setDarkMode(mediaQuery.matches);

  //   const handler = e => setDarkMode(e.matches);
  //   mediaQuery.addEventListener('change', handler);

  //   return () => mediaQuery.removeEventListener('change', handler);
  // }, []);

  return (
    <header className="bg-white mb-3">
      <div className="container d-flex flex-md-row justify-content-between align-items-center p-3">
        <Link to="/">
          <LogoWhite />
        </Link>
        <div></div>
        {!props.staticEmpty ? headerContent : ''}
      </div>
    </header>
  );
}

export default Header;
