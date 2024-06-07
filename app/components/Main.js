import React, { useEffect, Suspense } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import Collapse from 'react-bootstrap/Collapse';
import styled from 'styled-components';
import { useAlertStatus, useActions } from '@/store/store';
import AlertMessages from '@/components/common/AlertMessages';
import Header from '@/components/Header/Header';
import Navbar from '@/components/Footer/Navbar';
import ConfirmationModal from '@/components/common/Modal/ConfirmationModal';
import LoadingDotsIcon from '@/components/common/LoadingDotsIcon';
import AxiosWrapper from '@/components/Auth/AxiosWrapper';
import HabitList from '@/components/Habits/HabitList';
import LogList from '@/components/Logs/LogList';
import About from '@/pages/About';
import Terms from '@/pages/Terms';
import ResetPassword from '@/components/Auth/ResetPassword';
import ForgotPassword from '@/components/Auth/ForgotPassword';
import NotFound from '@/pages/NotFound';
import Share from '@/pages/Share';
import Login from '@/pages/Login';

const Main = ({ queryClient }) => {
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

  const Alert = () => (
    <Collapse in={alertStatus?.isOn}>
      <div>
        <AlertMessages
          type={alertStatus?.type}
          text={alertStatus?.text}
        />
      </div>
    </Collapse>
  );

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
            <NavbarContainer>
              <Navbar />
            </NavbarContainer>
          </Container>
        </AxiosWrapper>
      </Router>
    </QueryClientProvider>
  );
};

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

const NavbarContainer = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
`;

export default Main;
