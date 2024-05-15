import React, { useEffect, Suspense, StrictMode } from 'react';
import ReactDom from 'react-dom/client';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

import AxiosWrapper from '@/components/Auth/AxiosWrapper';
// Import our custom CSS
import './scss/styles.scss';

// Import all of Bootstrap's JS
import * as bootstrap from 'bootstrap';

import 'react-day-picker/dist/style.css';
import '@/scss/day-picker.scss';

import Header from '@/components/Header/Header';
import Login from '@/pages/Login';
// import Home from './components/Home';
import Navbar from '@/components/Footer/Navbar';
import HabitList from '@/components/Habits/HabitList';
import LogList from '@/components/Logs/LogList';
import About from '@/pages/About';
import Terms from '@/pages/Terms';
import ResetPassword from '@/components/Auth/ResetPassword';
import ForgotPassword from '@/components/Auth/ForgotPassword';
import AlertMessages from '@/components/common/AlertMessages';
import NotFound from '@/pages/NotFound';
import Share from '@/pages/Share';
import ConfirmationModal from '@/components/common/Modal/ConfirmationModal';
import LoadingDotsIcon from '@/components/common/LoadingDotsIcon';
import Collapse from 'react-bootstrap/Collapse';
import styled from 'styled-components';
import { useAlertStatus, useActions } from '@/store/store';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { disableReactDevTools } from '@fvilers/disable-react-devtools';

function Main() {
  const queryClient = new QueryClient();

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
      </>
    );
  };

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AxiosWrapper>
          <Container>
            <ConfirmationModal />
            <Alert />
            <Header />
            <MainContainer>
              <Suspense fallback={<LoadingDotsIcon />}>
                <Routes>
                  <Route
                    path="/"
                    element={<Navigate to="/habits" replace />}
                  />
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
                  <Route path="/logs" element={<LogList />} />
                  <Route path="/about-us" element={<About />} />
                  <Route path="/share" element={<Share />} />
                  <Route path="/policy" element={<Terms />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </MainContainer>
            <NavbarStyles />
          </Container>
        </AxiosWrapper>
      </Router>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

if (process.env.NODE_ENV === 'production') {
  disableReactDevTools();
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
  max-height: 100dvh;
`;

const MainContainer = styled.div`
  padding: 0 16px;
  flex-grow: 1;
  overflow-y: hidden;
`;

const NavbarStyles = styled(Navbar)`
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
`;
