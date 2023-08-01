import React, { useEffect, useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import ReactTooltip from 'react-tooltip';
import StateContext from '../StateContext';
import DispatchContext from '../DispatchContext';
import Bars from '../images/bars.svg';
import Button from 'react-bootstrap/Button';
import Menu from './Menu';
import User from '../images/user.svg';

function HeaderLoggedIn(props) {
  const appDispatch = useContext(DispatchContext);
  const appState = useContext(StateContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const openMenu = () => setIsMenuOpen(true);
  const closeMenu = () => setIsMenuOpen(false);

  function handleSearchIcon(e) {
    e.preventDefault();
    appDispatch({ type: 'openSearch' });
  }

  function handleChat() {
    appDispatch({ type: 'toggleChat' });
  }

  return (
    <>
      {isMenuOpen && <Menu isOpen={isMenuOpen} close={closeMenu} />}
      <div className="d-flex flex-row my-3 my-md-0 gap-3">
        {/* <a
        data-for="search"
        data-tip="Search"
        onClick={handleSearchIcon}
        href="#"
        className="text-white mr-2 header-search-icon"
      >
        <i className="fas fa-search"></i>
      </a>
      <ReactTooltip
        place="bottom"
        id="search"
        className="custom-tooltip"
      />{' '}
      <span
        data-for="chat"
        data-tip="Chat"
        onClick={handleChat}
        className={
          'mr-2 header-chat-icon ' +
          (appState.unreadChatCount ? 'text-danger' : 'text-white')
        }
      >
        <i className="fas fa-comment"></i>
        {appState.unreadChatCount ? (
          <span className="chat-count-badge text-white">
            {appState.unreadChatCount < 10
              ? appState.unreadChatCount
              : '9+'}
          </span>
        ) : (
          ''
        )}
      </span>
      <ReactTooltip
        place="bottom"
        id="chat"
        className="custom-tooltip"
      />{' '} */}
        <Link
          data-for="profile"
          data-tip="My Profile"
          to={`/profile/${appState.user.username}`}
          className="mr-2"
        >
          {appState.user.avatar !== 'undefined' && (
            <img
              className="small-header-avatar"
              src={appState.user.avatar}
            />
          )}
          {appState.user.avatar === 'undefined' && <User />}
        </Link>{' '}
        <ReactTooltip
          place="bottom"
          id="profile"
          className="custom-tooltip"
        />
        {/* <Link
        className="btn btn-sm btn-outline-secondary mr-2"
        to="/create-post"
      >
        Create Log
      </Link>{' '}
      <button
        onClick={handleLogOut}
        className="btn btn-sm btn-secondary"
      >
        Sign Out
      </button> */}
        <Button onClick={openMenu} className="bg-white">
          <Bars />
        </Button>
      </div>
    </>
  );
}

export default HeaderLoggedIn;
