import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import HeaderLoggedOut from './HeaderLoggedOut';
import HeaderLoggedIn from './HeaderLoggedIn';
// @ts-expect-error TS(2307) FIXME: Cannot find module '../../images/logo.svg' or its ... Remove this comment to see the full error message
import Logo from '../../images/logo.svg';
// @ts-expect-error TS(2307) FIXME: Cannot find module '../../images/logo-white.svg' o... Remove this comment to see the full error message
import LogoWhite from '../../images/logo-white.svg';
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
