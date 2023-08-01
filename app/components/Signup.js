import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';
import { useImmerReducer } from 'use-immer';
import { CSSTransition } from 'react-transition-group';
import DispatchContext from '../DispatchContext';

function Signup({ isOpen, close }) {
  const appDispatch = useContext(DispatchContext);
  const navigate = useNavigate();
  const initialState = {
    username: {
      value: '',
      hasErrors: false,
      message: '',
      isUnique: false,
      checkCount: 0,
    },
    email: {
      value: '',
      hasErrors: false,
      message: '',
      isUnique: false,
      checkCount: 0,
    },
    password: {
      value: '',
      hasErrors: false,
      message: '',
    },
    submitCount: 0,
  };

  function ourReducer(draft, action) {
    switch (action.type) {
      case 'usernameImmediately':
        draft.username.hasErrors = false;
        draft.username.value = action.value;

        if (draft.username.value.length > 30) {
          draft.username.hasErrors = true;
          draft.username.message =
            'Username cannot exceed 30 characters.';
        }

        if (
          draft.username.value &&
          !/^([a-zA-Z0-9]+)$/.test(draft.username.value)
        ) {
          draft.username.hasErrors = true;
          draft.username.message =
            'Username can only contain letters and numbers';
        }
        return;

      case 'usernameAfterDelay':
        if (draft.username.value.length < 3) {
          draft.username.hasErrors = true;
          draft.username.message =
            'Username must be at least 3 characters.';
        }

        if (!draft.username.hasErrors && !action.noRequest) {
          draft.username.checkCount++;
        }
        return;

      case 'usernameUniqueResults':
        if (action.value) {
          draft.username.hasErrors = true;
          draft.username.isUnique = false;
          draft.username.message = 'That username is already taken.';
        } else {
          draft.username.isUnique = true;
        }
        return;

      case 'emailImmediately':
        draft.email.hasErrors = false;
        draft.email.value = action.value;
        return;

      case 'emailAfterDelay':
        if (!/^\S+@\S+$/.test(draft.email.value)) {
          draft.email.hasErrors = true;
          draft.email.message =
            'You must provide a valid email address.';
        }

        if (!draft.email.hasErrors && !action.noRequest) {
          draft.email.checkCount++;
        }
        return;

      case 'emailUniqueResults':
        if (action.value) {
          draft.email.hasErrors = true;
          draft.email.isUnique = false;
          draft.email.message = 'That email is already being used';
        } else {
          draft.email.isUnique = true;
        }
        return;

      case 'passwordImmediately':
        draft.password.hasErrors = false;
        draft.password.value = action.value;

        if (draft.password.value.length > 50) {
          draft.password.hasErrors = true;
          draft.password.message =
            'Username cannot exceed 50 characters.';
        }
        return;

      case 'passwordAfterDelay':
        if (draft.password.value.length < 12) {
          draft.password.hasErrors = true;
          draft.password.message =
            'Password must be at least 12 characters.';
        }
        return;

      case 'submitForm':
        if (
          !draft.username.hasErrors &&
          draft.username.isUnique &&
          !draft.email.hasErrors &&
          draft.email.isUnique &&
          !draft.password.hasErrors
        ) {
          draft.submitCount++;
        }
        return;
    }
  }

  const [state, dispatch] = useImmerReducer(ourReducer, initialState);

  function handleSubmit(e) {
    e.preventDefault();
    dispatch({
      type: 'usernameImmediately',
      value: state.username.value,
    });
    dispatch({
      type: 'usernameAfterDelay',
      value: state.username.value,
      noRequest: true,
    });
    dispatch({
      type: 'emailImmediately',
      value: state.email.value,
    });
    dispatch({
      type: 'emailAfterDelay',
      value: state.email.value,
      noRequest: true,
    });
    dispatch({
      type: 'passwordImmediately',
      value: state.password.value,
    });
    dispatch({
      type: 'passwordAfterDelay',
      value: state.password.value,
    });
    dispatch({ type: 'submitForm' });
  }

  async function fetchDoesUsernameExist(ourRequest) {
    try {
      const response = await axios.post(
        '/users/signup/doesUsernameExist',
        { username: state.username.value },
        { cancelToken: ourRequest.token }
      );

      dispatch({
        type: 'usernameUniqueResults',
        value: response.data,
      });
    } catch (e) {
      console.log(
        'There was a problem or the request was cancelled.'
      );
    }
  }

  useEffect(() => {
    if (state.username.checkCount) {
      const ourRequest = axios.CancelToken.source();
      fetchDoesUsernameExist(ourRequest);

      return () => {
        ourRequest.cancel();
      };
    }
  }, [state.username.checkCount]);

  async function fetchDoesEmailExist(ourRequest) {
    try {
      const response = await axios.post(
        '/users/signup/doesEmailExist',
        { email: state.email.value },
        { cancelToken: ourRequest.token }
      );

      dispatch({
        type: 'emailUniqueResults',
        value: response.data,
      });
    } catch (e) {
      console.log(
        'There was a problem or the request was cancelled.'
      );
    }
  }

  useEffect(() => {
    if (state.email.checkCount) {
      const ourRequest = axios.CancelToken.source();
      fetchDoesEmailExist(ourRequest);

      return () => {
        ourRequest.cancel();
      };
    }
  }, [state.email.checkCount]);

  async function fetchRegister(ourRequest) {
    try {
      const response = await axios.post(
        '/users',
        {
          username: state.username.value,
          email: state.email.value,
          password: state.password.value,
        },
        { cancelToken: ourRequest.token }
      );
      if (response.data) {
        close();
        navigate('/');
        appDispatch({ type: 'login', data: response.data });
        appDispatch({
          type: 'alert/open',
          payload: {
            type: 'success',
            text: 'Congrats! Welcome to your new account.',
          },
        });
      }
    } catch (e) {
      console.log(
        'There was a problem or the request was cancelled.'
      );
    }
  }

  useEffect(() => {
    if (state.submitCount) {
      const ourRequest = axios.CancelToken.source();

      fetchRegister(ourRequest);

      return () => {
        ourRequest.cancel();
      };
    }
  }, [state.submitCount]);

  function inputCheck(input) {
    return useEffect(() => {
      if (state[input].value) {
        const delay = setTimeout(() => {
          dispatch({ type: `${input}AfterDelay` });
        }, 800);

        return () => {
          clearTimeout(delay);
        };
      }
    }, [state[input].value]);
  }

  inputCheck('username');
  inputCheck('email');
  inputCheck('password');

  function handleKeyPress(event) {
    if (event.key === 'Enter') {
      handleSubmit(event);
    }
  }

  return (
    <>
      <Modal
        show={isOpen}
        onHide={close}
        backdrop="static"
        centered
        onKeyPress={handleKeyPress}
      >
        <Modal.Header
          className="d-flex align-items-start"
          closeButton
        >
          <Modal.Title>
            <p>Sign Up</p>
            <p className="fs-6 fw-light lh-sm">
              Welcome to HabitCount! Our service is completely free,
              so once you sign up, you're good to go!
            </p>
            {/* <span className="fs-6 fw-light">
              Once yo sign up, you are all set up!
            </span> */}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group
              className="mb-3"
              controlId="username-register"
            >
              <Form.Control
                type="text"
                onChange={e =>
                  dispatch({
                    type: 'usernameImmediately',
                    value: e.target.value,
                  })
                }
                name="username"
                placeholder="Username"
                required
                autoFocus
              />
              <CSSTransition
                in={state.username.hasErrors}
                timeout={330}
                classNames="liveValidateMessage"
                unmountOnExit
              >
                <div className="alert alert-danger p-2 small liveValidateMessage">
                  {state.username.message}
                </div>
              </CSSTransition>
            </Form.Group>
            <Form.Group className="mb-3" controlId="email-register">
              <Form.Control
                onChange={e =>
                  dispatch({
                    type: 'emailImmediately',
                    value: e.target.value,
                  })
                }
                name="email"
                type="email"
                placeholder="Email"
                autoComplete="off"
              />
              <CSSTransition
                in={state.email.hasErrors}
                timeout={330}
                classNames="liveValidateMessage"
                unmountOnExit
              >
                <div className="alert alert-danger p-2 small liveValidateMessage">
                  {state.email.message}
                </div>
              </CSSTransition>
            </Form.Group>
            <Form.Group
              className="mb-3"
              controlId="password-register"
            >
              <Form.Control
                onChange={e =>
                  dispatch({
                    type: 'passwordImmediately',
                    value: e.target.value,
                  })
                }
                name="password"
                type="password"
                placeholder="Password"
              />
              <CSSTransition
                in={state.password.hasErrors}
                timeout={330}
                classNames="liveValidateMessage"
                unmountOnExit
              >
                <div className="alert alert-danger p-2 small liveValidateMessage">
                  {state.password.message}
                </div>
              </CSSTransition>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-center">
          <Button variant="primary" onClick={handleSubmit}>
            Sign Up
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Signup;
