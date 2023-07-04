import React, { useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import ReactTooltip from 'react-tooltip';
import StateContext from '../StateContext';
import DispatchContext from '../DispatchContext';

function HeaderLoggedIn(props) {
  const appDispatch = useContext(DispatchContext);
  const appState = useContext(StateContext);

  function handleLogOut() {
    appDispatch({ type: 'logout' });
    appDispatch({
      type: 'alert/open',
      payload: {
        type: 'success',
        text: 'You have successfully logged out.',
      },
    });
  }

  function handleSearchIcon(e) {
    e.preventDefault();
    appDispatch({ type: 'openSearch' });
  }

  function handleChat() {
    appDispatch({ type: 'toggleChat' });
  }

  function handleTest() {
    console.log(1);
    appDispatch({
      type: 'alert/open',
      payload: { type: 'success', text: 'good' },
    });
  }

  return (
    <div className="flex-row my-3 my-md-0">
      <a
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
      />{' '}
      <Link
        data-for="profile"
        data-tip="My Profile"
        to={`/profile/${appState.user.username}`}
        className="mr-2"
      >
        <img
          className="small-header-avatar"
          src={appState.user.avatar}
        />
      </Link>{' '}
      <ReactTooltip
        place="bottom"
        id="profile"
        className="custom-tooltip"
      />
      <Link className="btn btn-sm btn-success mr-2" to="/create-post">
        Create Post
      </Link>{' '}
      <button
        onClick={handleLogOut}
        className="btn btn-sm btn-secondary"
      >
        Sign Out
      </button>
      <button
        onClick={handleTest}
        className="btn btn-sm btn-secondary"
      >
        poo
      </button>
    </div>
  );
}

export default HeaderLoggedIn;
