import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import DispatchContext from '../DispatchContext';
const HeaderLoggedOut = props => {
  const appDispatch = useContext(DispatchContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [usernameInvalid, setUsernameInvalid] = useState(false);
  const [passwordInvalid, setPasswordInvalid] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!username) {
      setUsernameInvalid(true);
      return;
    }
    if (!password) {
      setPasswordInvalid(true);
      return;
    }

    try {
      const response = await axios.post('/login', {
        username,
        password,
      });

      setUsername('');
      setPassword('');
      setUsernameInvalid(false);
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
            text: 'Incorrect username/password.',
          },
        });

        console.log('Incorrect username/password');
      }
    } catch (e) {
      console.log('There was a problem', e);
    }
  }

  return (
    <div className="col-md-auto">
      <button className="btn btn-outline-secondary btn-sm rounded-0">
        Sign In
      </button>
    </div>
    // <form
    //   onSubmit={handleSubmit}
    //   className={
    //     'needs-validation mb-0 pt-2 pt-md-0' +
    //     (usernameInvalid || passwordInvalid ? ' was-validated' : '')
    //   }
    //   noValidate
    // >
    //   <div className="row align-items-center">
    //     <div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
    //       <input
    //         value={username}
    //         onChange={e => setUsername(e.target.value)}
    //         name="username"
    //         className="form-control form-control-sm input-dark"
    //         type="text"
    //         placeholder="Username"
    //         autoComplete="off"
    //         required
    //       />
    //     </div>

    //     <div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
    //       <input
    //         value={password}
    //         onChange={e => setPassword(e.target.value)}
    //         name="password"
    //         className="form-control form-control-sm input-dark"
    //         type="password"
    //         placeholder="Password"
    //         required
    //       />
    //     </div>
    //     <div className="col-md-auto">
    //       <button className="btn btn-success btn-sm">Sign In</button>
    //     </div>
    //   </div>
    // </form>
  );
};

export default HeaderLoggedOut;
