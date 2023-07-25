import React, { useEffect, useState, useContext } from 'react';
import Page from './Page';
import axios from 'axios';
import DispatchContext from '../DispatchContext';

const Login = props => {
  const appDispatch = useContext(DispatchContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailInvalid, setEmailInvalid] = useState(false);
  const [passwordInvalid, setPasswordInvalid] = useState(false);

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
        <div className="container-sm col-md-8 col-lg-5 pl-lg-5 pb-3 py-lg-5">
          <h1 className="d-block d-md-none text-primary text-center">
            Log in
          </h1>
          <form
            onSubmit={handleSubmit}
            className={
              'needs-validation' +
              (emailInvalid || passwordInvalid
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
                type="text"
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
            <div className="mt-3 d-grid gap-3">
              <button
                type="submit"
                className="btn btn-md btn-primary"
              >
                Log in
              </button>
              <div className="opacity-50">
                <hr></hr>
              </div>
              <button className="btn btn-md btn-secondary">
                Create account
              </button>
            </div>
          </form>
        </div>
      </div>
    </Page>
  );
};

export default Login;
