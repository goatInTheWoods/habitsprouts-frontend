import React, { useState, useEffect } from 'react';
import Page from '@/components/common/Page';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import Button from 'react-bootstrap/Button';
import Signup from '@/components/Auth/Signup';
import { useActions } from '@/store/store';
import { useMutation } from '@tanstack/react-query';
import {
  axiosLogInUser,
  axiosGoogleLogInUser,
} from '@/services/UserService';
import { auth, signInWithPopup, googleProvider } from '@/firebase';
import GoogleButton from '../images/google-login.png';

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

  const logInUserMutation = useMutation({
    mutationFn: axiosLogInUser,
    onSuccess: res => {
      login(res.data);
      openAlert({
        type: 'success',
        text: 'Congrats! You are logged in.',
      });
      navigate('/');
    },
    onError: error => {
      console.log('There was a problem logging in', error);
      openAlert({
        type: 'danger',
        text: 'Failed to log in',
      });
    },
    onSettled: () => {
      setEmail('');
      setPassword('');
      setEmailInvalid(false);
      setPasswordInvalid(false);
    },
  });

  const googleLogInUserMutation = useMutation({
    mutationFn: axiosGoogleLogInUser,
    onSuccess: data => {
      login(data);
      openAlert({
        type: 'success',
        text: 'Congrats! You are logged in.',
      });
      navigate('/');
    },
    onError: error => {
      console.log('There was a problem logging in', error);
      openAlert({
        type: 'danger',
        text: 'Failed to log in',
      });
    },
  });

  async function handleCredentialResponse(response) {
    const token = response.credential;

    const res = await axios.post('/api/auth', { token });
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
    if (process.env.NODE_ENV === 'development') {
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
    }
  }, []);

  const signInWithGoogle = async () => {
    try {
      const userCredential = await signInWithPopup(
        auth,
        googleProvider
      );
      const user = userCredential.user;
      const uid = user.uid;
      const token = await user.getIdToken();

      googleLogInUserMutation.mutate({
        token,
        uid,
      });
    } catch (error) {
      console.error('Error signing in with Google:', error);
    }
  };

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

    await logInUserMutation.mutate({
      email,
      password,
    });
  }

  return (
    <Page title="Home" wide={true}>
      {isSignupOpen && (
        <Signup isOpen={isSignupOpen} close={closeSignup} />
      )}
      <div className=" row align-items-center justify">
        <div className="d-none d-md-block col-lg-6 py-3 text-secondary">
          <p className="display-3 pb-4 text-primary fw-semibold">
            HabitSprouts
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
                <Button
                  variant="secondary"
                  onClick={() => openSignup()}
                >
                  Sign up
                </Button>
                {process.env.NODE_ENV === 'development' && (
                  <StyledGoogle
                    src={GoogleButton}
                    onClick={signInWithGoogle}
                  />
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </Page>
  );
};

const ForgotPassword = styled.div`
  text-align: center;
  .link {
    text-decoration: underline;
  }
`;

const StyledGoogle = styled.img`
  width: 197px;
  height: 40px;
`;
export default Login;
