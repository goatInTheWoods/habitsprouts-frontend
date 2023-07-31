import React, {
  useState,
  useEffect,
  useReducer,
  useContext,
  Suspense,
  StrictMode,
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
import Login from './components/Login';
import Home from './components/Home';
import Navbar from './components/Navbar';
import HabitList from './components/HabitList';
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
// const Search = React.lazy(() => import('./components/Search'));
// const Chat = React.lazy(() => import('./components/Chat'));
import LoadingDotsIcon from './components/LoadingDotsIcon';
import Collapse from 'react-bootstrap/Collapse';
import styled from 'styled-components';

function Main() {
  const habitList = localStorage.getItem('habitList');
  const initialState = {
    loggedIn: Boolean(localStorage.getItem('habitCountToken')),
    alert: {
      isOn: false,
      type: 'success',
      text: null,
    },
    user: {
      token: localStorage.getItem('habitCountToken'),
      username: localStorage.getItem('habitCountUsername'),
      avatar: localStorage.getItem('habitCountAvatar'),
    },
    isSearchOpen: false,
    isChatOpen: false,
    unreadChatCount: 0,
    habits: habitList ? JSON.parse(habitList) : [],
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
      case 'habits/add':
        draft.habits.push(action.payload);
        return;
      case 'habits/edit': {
        const habitIndex = draft.habits.findIndex(
          habit => habit.id === action.payload.id
        );
        if (habitIndex !== -1) {
          draft.habits[habitIndex] = action.payload;
        }
        return;
      }
      case 'habits/delete':
        {
          const habitIndex = draft.habits.findIndex(
            habit => habit.id === action.payload
          );
          draft.habits.splice(habitIndex, 1);
        }
        return;
      case 'habits/changeOrder': {
        const fromHabit = draft.habits[action.payload.fromId];
        draft.habits.splice(action.payload.fromId, 1);
        draft.habits.splice(action.payload.toId, 0, fromHabit);
      }
    }
  }

  const [state, dispatch] = useImmerReducer(ourReducer, initialState);

  useEffect(() => {
    if (state.loggedIn) {
      localStorage.setItem('habitCountToken', state.user.token);
      localStorage.setItem('habitCountUsername', state.user.username);
      localStorage.setItem('habitCountAvatar', state.user.avatar);
    } else {
      localStorage.removeItem('habitCountToken');
      localStorage.removeItem('habitCountUsername');
      localStorage.removeItem('habitCountAvatar');
    }
  }, [state.loggedIn]);

  useEffect(() => {
    localStorage.setItem('habitList', JSON.stringify(state.habits));
  }, [state.habits]);

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

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <BrowserRouter>
          <Container>
            <Collapse in={state.alert.isOn}>
              <div>
                <AlertMessages
                  type={state.alert.type}
                  text={state.alert.text}
                />
              </div>
            </Collapse>
            <Header />
            <MainContainer>
              <Suspense fallback={<LoadingDotsIcon />}>
                <Routes>
                  <Route
                    path="/"
                    element={
                      state.loggedIn ? <HabitList /> : <Login />
                    }
                  />
                  <Route path="/login" element={<Login />} />
                  <Route path="/habits" element={<HabitList />} />
                  <Route path="/about-us" element={<About />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/policy" element={<Terms />} />
                  <Route
                    path="/create-post"
                    element={<CreatePost />}
                  />
                  <Route
                    path="/post/:id"
                    element={<ViewSinglePost />}
                  />
                  <Route
                    path="/post/:id/edit"
                    element={<EditPost />}
                  />
                  <Route
                    path="/profile/:username/*"
                    element={<Profile />}
                  />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </MainContainer>
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
            {/* <Suspense fallback="">
              {state.loggedIn && <Chat />}
            </Suspense> */}
            <Navbar />
          </Container>
        </BrowserRouter>
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
}

const app = '#app';
const root = ReactDom.createRoot(document.querySelector(app));
root.render(
  <StrictMode>
    <Main />
  </StrictMode>
);

if (module.hot) {
  module.hot.accept();
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

const MainContainer = styled.div`
  flex-grow: 1;
  padding: 0 16px;
  overflow-y: auto;
`;
