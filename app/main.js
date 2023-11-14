import React, {
  useState,
  useEffect,
  Suspense,
  StrictMode,
  useLayoutEffect,
} from 'react';
import ReactDom from 'react-dom/client';
import {
  BrowserRouter,
  Router,
  Routes,
  Route,
} from 'react-router-dom';

import { history } from './history';
import './axiosConfig';
// Import our custom CSS
import './scss/styles.scss';

// Import all of Bootstrap's JS
import * as bootstrap from 'bootstrap';

import Header from './components/Header';
import Login from './components/Login';
// import Home from './components/Home';
import Navbar from './components/Navbar';
import HabitList from './components/HabitList';
import About from './components/About';
import Terms from './components/Terms';
import ResetPassword from './components/ResetPassword';
import ForgotPassword from './components/ForgotPassword';
// const CreatePost = React.lazy(() =>
//   import('./components/CreatePost')
// );
// const ViewSinglePost = React.lazy(() =>
//   import('./components/ViewSinglePost')
// );
import AlertMessages from './components/AlertMessages';
import Profile from './components/Profile';
// import EditPost from './components/EditPost';
import NotFound from './components/NotFound';
import LoadingDotsIcon from './components/LoadingDotsIcon';
import Collapse from 'react-bootstrap/Collapse';
import styled from 'styled-components';
import { useAlertStatus, useActions } from './store';

function Main() {
  const { closeAlert } = useActions();
  const alertStatus = useAlertStatus();

  useEffect(() => {
    let timeout;
    if (alertStatus?.isOn) {
      timeout = setTimeout(() => {
        closeAlert();
      }, 2500);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [alertStatus?.isOn]);

  const CustomRouter = ({ history, ...props }) => {
    const [state, setState] = useState({
      action: history.action,
      location: history.location,
    });

    useLayoutEffect(() => history.listen(setState), [history]);

    return (
      <Router
        {...props}
        location={state.location}
        navigationType={state.action}
        navigator={history}
      />
    );
  };

  const Alert = () => {
    return (
      <>
        <Collapse in={alertStatus?.isOn}>
          <div>
            <AlertMessages
              type={alertStatus?.type}
              text={alertStatus?.text}
            />
          </div>
        </Collapse>
        ;
      </>
    );
  };

  return (
    <CustomRouter history={history}>
      <Container>
        <Alert />
        <Header />
        <MainContainer>
          <Suspense fallback={<LoadingDotsIcon />}>
            <Routes>
              <Route path="/" element={<HabitList />} />
              <Route path="/login" element={<Login />} />
              <Route
                path="/forgot-password"
                element={<ForgotPassword />}
              />
              <Route
                path="/reset-password"
                element={<ResetPassword />}
              />
              <Route path="/habits" element={<HabitList />} />
              <Route path="/about-us" element={<About />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/policy" element={<Terms />} />
              {/* <Route path="/create-post" element={<CreatePost />} />
              <Route path="/post/:id" element={<ViewSinglePost />} />
              <Route path="/post/:id/edit" element={<EditPost />} /> */}
              <Route
                path="/profile/:username/*"
                element={<Profile />}
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </MainContainer>
        <Navbar />
      </Container>
    </CustomRouter>
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
