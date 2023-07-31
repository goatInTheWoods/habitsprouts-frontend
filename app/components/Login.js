import React, { useState, useEffect, useContext } from 'react';
import Page from './Page';
import axios from 'axios';
import DispatchContext from '../DispatchContext';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Signup from './Signup';

const Login = () => {
  const appDispatch = useContext(DispatchContext);
  const navigate = useNavigate();
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const closeSignup = () => setIsSignupOpen(false);
  const openSignup = () => setIsSignupOpen(true);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailInvalid, setEmailInvalid] = useState(false);
  const [passwordInvalid, setPasswordInvalid] = useState(false);

  async function handleCredentialResponse(response) {
    const token = response.credential;

    const res = await axios.post('/api/auth', { token });
    if (res.data) {
      appDispatch({ type: 'login', data: res.data });
      appDispatch({
        type: 'alert/open',
        payload: {
          type: 'success',
          text: 'Congrats! You are logged in.',
        },
      });
      navigate('/');
    } else {
      appDispatch({
        type: 'alert/open',
        payload: {
          type: 'danger',
          text: 'Incorrect email/password.',
        },
      });

      console.log('Incorrect email/password');
    }
    navigate('/');
  }

  useEffect(() => {
    const google = window.google;
    google.accounts.id.initialize({
      client_id: process.env.GOOGLE_CLIENT_ID,
      callback: handleCredentialResponse,
    });
    google.accounts.id.renderButton(
      document.getElementById('google'),
      { theme: 'filled_blue', size: 'medium', text: 'google' } // customization attributes
    );
    google.accounts.id.prompt(); // also display the One Tap dialog
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!email) {
      setEmailInvalid(true);
      return;
    }
    if (!password) {
      setPasswordInvalid(true);
      return;
    }

    try {
      const response = await axios.post('users/login', {
        email,
        password,
      });

      setEmail('');
      setPassword('');
      setEmailInvalid(false);
      setPasswordInvalid(false);

      if (response.data) {
        appDispatch({ type: 'login', data: response.data });
        appDispatch({
          type: 'alert/open',
          payload: {
            type: 'success',
            text: 'Congrats! You are logged in.',
          },
        });
        navigate('/');
      } else {
        appDispatch({
          type: 'alert/open',
          payload: {
            type: 'danger',
            text: 'Incorrect email/password.',
          },
        });

        console.log('Incorrect email/password');
      }
    } catch (e) {
      console.log('There was a problem', e);
    }
  }

  return (
    <Page title="Home" wide={true}>
      {isSignupOpen && (
        <Signup isOpen={isSignupOpen} close={closeSignup} />
      )}
      <div className=" row align-items-center justify">
        <div className="d-none d-md-block col-lg-6 py-3 text-secondary">
          <p className="display-3 pb-4 text-primary fw-semibold">
            HabitCount
          </p>
          <p className="fs-2 text-muted">
            Build your habits in the simplest way and become a better
            you.
          </p>
        </div>
        <div className="container-sm col-md-8 col-lg-4 pl-lg-4 pb-3 py-lg-5">
          <h1 className="d-block d-md-none text-primary text-center">
            Log in
          </h1>
          <form
            onSubmit={handleSubmit}
            className={
              'needs-validation' +
              ((!isSignupOpen && emailInvalid) || passwordInvalid
                ? ' was-validated'
                : '')
            }
            noValidate
          >
            <div className="form-group">
              <label
                htmlFor="email-register"
                className="text-muted mb-1"
              >
                <small>Email</small>
              </label>
              <input
                value={email}
                onChange={e => setEmail(e.target.value)}
                name="email"
                className="form-control placeholder-secondary input-dark"
                type="email"
                placeholder="Email"
                autoComplete="off"
                required
              />
            </div>
            <div className="form-group">
              <label
                htmlFor="password-register"
                className="text-muted mb-1"
              >
                <small>Password</small>
              </label>
              <input
                value={password}
                onChange={e => setPassword(e.target.value)}
                name="password"
                className="form-control input-dark"
                type="password"
                placeholder="Password"
                required
              />
            </div>
            <div className="mt-3 vstack gap-3 mx-auto">
              <button
                type="submit"
                className="btn btn-md btn-primary"
              >
                Sign in
              </button>

              <div className="opacity-50">
                <hr></hr>
              </div>
              <div className="hstack gap-2 justify-content-between">
                <SignupButton
                  onClick={() => openSignup()}
                  className="btn btn-md btn-secondary mw-auto"
                >
                  Sign up
                </SignupButton>
                <div id="google"></div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Page>
  );
};

const SignupButton = styled.button`
  font-size: 14px;
`;

export default Login;
