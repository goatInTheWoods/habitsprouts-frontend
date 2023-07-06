import React, {
  useState,
  useEffect,
  useReducer,
  useContext,
  Suspense,
} from 'react';
import { useImmerReducer } from 'use-immer';
import ReactDom from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Axios from 'axios';

// Import our custom CSS
import './scss/styles.scss';

// Import all of Bootstrap's JS
import * as bootstrap from 'bootstrap';

Axios.defaults.baseURL =
  process.env.BACKENDURL ||
  'https://myreactbackendtest-4lua.onrender.com';

import Header from './components/Header';
import HomeGuest from './components/HomeGuest';
import Home from './components/Home';
import Footer from './components/Footer';
import About from './components/About';
import Terms from './components/Terms';
const CreatePost = React.lazy(() =>
  import('./components/CreatePost')
);
const ViewSinglePost = React.lazy(() =>
  import('./components/ViewSinglePost')
);
import AlertMessages from './components/AlertMessages';
import StateContext from './StateContext';
import DispatchContext from './DispatchContext';
import Profile from './components/Profile';
import EditPost from './components/EditPost';
import NotFound from './components/NotFound';
const Search = React.lazy(() => import('./components/Search'));
const Chat = React.lazy(() => import('./components/Chat'));
import axios from 'axios';
import LoadingDotsIcon from './components/LoadingDotsIcon';
import Collapse from 'react-bootstrap/Collapse';

function Main() {
  const initialState = {
    loggedIn: Boolean(localStorage.getItem('complexappToken')),
    alert: {
      isOn: false,
      type: 'success',
      text: null,
    },
    user: {
      token: localStorage.getItem('complexappToken'),
      username: localStorage.getItem('complexappUsername'),
      avatar: localStorage.getItem('complexappAvatar'),
    },
    isSearchOpen: false,
    isChatOpen: false,
    unreadChatCount: 0,
  };

  function ourReducer(draft, action) {
    switch (action.type) {
      case 'login':
        draft.loggedIn = true;
        draft.user = action.data;
        return;
      case 'logout':
        draft.loggedIn = false;
        return;
      case 'alert/open':
        draft.alert.type = action.payload.type;
        draft.alert.text = action.payload.text;
        draft.alert.isOn = true;
        return;
      case 'alert/close':
        draft.alert.isOn = false;
        return;
      case 'openSearch':
        draft.isSearchOpen = true;
        return;
      case 'closeSearch':
        draft.isSearchOpen = false;
        return;
      case 'toggleChat':
        draft.isChatOpen = !draft.isChatOpen;
        return;
      case 'closeChat':
        draft.isChatOpen = false;
        return;
      case 'incrementUnreadChatCount':
        draft.unreadChatCount++;
        return;
      case 'clearUnreadChatCount':
        draft.unreadChatCount = 0;
        return;
    }
  }

  const [state, dispatch] = useImmerReducer(ourReducer, initialState);

  useEffect(() => {
    if (state.loggedIn) {
      localStorage.setItem('complexappToken', state.user.token);
      localStorage.setItem('complexappUsername', state.user.username);
      localStorage.setItem('complexappAvatar', state.user.avatar);
    } else {
      localStorage.removeItem('complexappToken');
      localStorage.removeItem('complexappUsername');
      localStorage.removeItem('complexappAvatar');
    }
  }, [state.loggedIn]);

  useEffect(() => {
    let timeout;

    if (state.alert.isOn) {
      timeout = setTimeout(() => {
        dispatch({ type: 'alert/close' });
      }, 2500);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [state.alert.isOn]);

  // Check if token has expired or not on first render
  useEffect(() => {
    if (state.loggedIn) {
      const ourRequest = axios.CancelToken.source();
      async function fetchResults() {
        try {
          const response = await axios.post(
            '/checkToken',
            { token: state.user.token },
            { cancelToken: ourRequest.token }
          );

          if (!response.data) {
            dispatch({ type: 'logout' });
            appDispatch({
              type: 'alert/open',
              payload: {
                type: 'danger',
                text: 'Your session has expired. Please log in again.',
              },
            });
          }
        } catch (e) {
          console.log(
            'There was a problem or the request was cancelled.'
          );
        }
      }
      fetchResults();

      return () => {
        ourRequest.cancel();
      };
    }
  }, []);

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <BrowserRouter>
          <Collapse in={state.alert.isOn}>
            <div>
              <AlertMessages
                type={state.alert.type}
                text={state.alert.text}
              />
            </div>
          </Collapse>
          <Header />
          <Suspense fallback={<LoadingDotsIcon />}>
            <Routes>
              <Route
                path="/"
                element={state.loggedIn ? <Home /> : <HomeGuest />}
              />
              <Route path="/about-us" element={<About />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/create-post" element={<CreatePost />} />
              <Route path="/post/:id" element={<ViewSinglePost />} />
              <Route path="/post/:id/edit" element={<EditPost />} />
              <Route
                path="/profile/:username/*"
                element={<Profile />}
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
          {/* <CSSTransition
            timeout={330}
            in={state.isSearchOpen}
            classNames="search-overlay"
            unmountOnExit
          >
            <div className="search-overlay">
              <Suspense fallback="">
                <Search />
              </Suspense>
            </div>
          </CSSTransition> */}
          <Suspense fallback="">
            {state.loggedIn && <Chat />}
          </Suspense>
          <Footer />
        </BrowserRouter>
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
}
const app = '#app';
const root = ReactDom.createRoot(document.querySelector(app));
root.render(<Main />);

if (module.hot) {
  module.hot.accept();
}
