import React, { useState, useEffect } from 'react';
import Page from '@/components/common/Page';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import Signup from '@/components/Auth/Signup';
import { useActions } from '@/store/store';

const Login = () => {
  const { login, openAlert } = useActions();
  const urlSearchString = window.location.search;
  const params = new URLSearchParams(urlSearchString);
  const redirectedFrom = params?.get('from');
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
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const res = await axios.post('/api/auth', { token, timezone });
    if (res.data) {
      login(res.data);
      openAlert({
        type: 'success',
        text: 'Congrats! You are logged in.',
      });
      navigate('/');
    } else {
      openAlert({
        type: 'danger',
        text: 'Incorrect email/password.',
      });
      console.log('Incorrect email/password');
    }
    navigate('/');
  }

  useEffect(() => {
    // if (window.google && document.getElementById('google')) {
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
    // }
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

      if (response.status === 204 || response.status === 201) {
        login(response.data);
        openAlert({
          type: 'success',
          text: 'Congrats! You are logged in.',
        });
        navigate('/');
      }
    } catch (e) {
      openAlert({
        type: 'danger',
        text: 'Incorrect email/password.',
      });
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
          {redirectedFrom === '401' && (
            <p className="text-danger">
              Your login has expired. Please log on again to continue.
            </p>
          )}
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
                autoFocus
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
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value=""
                  id="flexCheckDefault"
                />
                <label
                  className="form-check-label"
                  htmlFor="flexCheckDefault"
                >
                  Remember me
                </label>
              </div>
              <button
                type="submit"
                className="btn btn-md btn-primary"
              >
                Sign in
              </button>

              <ForgotPassword>
                <Link className="link" to="/forgot-password">
                  Forgot Password?
                </Link>
              </ForgotPassword>

              <div className="opacity-50">
                <hr></hr>
              </div>

              <div className="hstack gap-2 justify-content-between">
                <SignupButton
                  onClick={() => openSignup()}
                  className="btn btn-md btn-secondary"
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

const ForgotPassword = styled.div`
  text-align: center;
  .link {
    text-decoration: underline;
  }
`;
export default Login;
