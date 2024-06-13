import React, { useEffect, useRef } from 'react';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import { useImmerReducer } from 'use-immer';
import { CSSTransition } from 'react-transition-group';
import styled from 'styled-components';

// This component used in Signup, EditMyInfo, resetPassword

function AccountInfoForm({
  isInputVisible,
  accountInfo,
  onAccountInfoUpdate,
  triggerValidation,
  autoFocusInput
}: $TSFixMe) {
  const usernameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const initialState = {
    username: {
      value: accountInfo?.username,
      hasErrors: false,
      message: '',
      isUnique: false,
      checkCount: 0,
    },
    email: {
      value: accountInfo?.email,
      hasErrors: false,
      message: '',
      isUnique: false,
      checkCount: 0,
    },
    password: {
      value: accountInfo?.password,
      hasErrors: false,
      message: '',
      visible: false,
    },
    rePassword: {
      value: '',
      hasErrors: false,
      message: 'The password does not match.',
      visible: false,
    },
    isAllInfoClear: accountInfo.isAllInfoClear,
  };

  function ourReducer(draft: $TSFixMe, action: $TSFixMe) {
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

      case 'togglePasswordVisible':
        draft.password.visible = !draft.password.visible;
        return;

      case 'rePasswordImmediately':
        draft.rePassword.hasErrors = false;
        draft.rePassword.value = action.value;

        if (draft.password.value !== draft.rePassword.value) {
          draft.rePassword.hasErrors = true;
        }
        return;

      case 'toggleRepasswordVisible':
        draft.rePassword.visible = !draft.rePassword.visible;
        return;

      case 'validateAllAndUpdate': {
        const isUsernameClear = isInputVisible.username
          ? !draft.username.hasErrors && draft.username.isUnique
          : true;

        const isEmailClear = isInputVisible.email
          ? !draft.email.hasErrors && draft.email.isUnique
          : true;

        const isPasswordClear = isInputVisible.password
          ? !draft.password.hasErrors && !draft.rePassword.hasErrors
          : true;

        if (isUsernameClear && isEmailClear && isPasswordClear) {
          onAccountInfoUpdate({
            username: draft.username.value,
            email: draft.email.value,
            password: draft.password.value,
            isAllInfoClear: true,
          });
        } else {
          onAccountInfoUpdate({ isAllInfoClear: false });
        }
        return;
      }
    }
  }

  const [state, dispatch] = useImmerReducer(ourReducer, initialState);

  async function fetchDoesUsernameExist(ourRequest: $TSFixMe) {
    try {
      const response = await axios.post(
        '/users/signup/doesUsernameExist',
        { username: state.username.value }
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

  async function fetchDoesEmailExist(ourRequest: $TSFixMe) {
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

  useEffect(() => {
    if (
      !state.username.value &&
      !state.username.value &&
      !state.password.value &&
      !state.rePassword.value
    ) {
      return;
    }
    if (isInputVisible.username) {
      dispatch({
        type: 'usernameImmediately',
        value: state.username.value,
      });
      dispatch({
        type: 'usernameAfterDelay',
        value: state.username.value,
        noRequest: true,
      });
    }

    if (isInputVisible.email) {
      dispatch({
        type: 'emailImmediately',
        value: state.email.value,
      });
      dispatch({
        type: 'emailAfterDelay',
        value: state.email.value,
        noRequest: true,
      });
    }

    if (isInputVisible.password) {
      dispatch({
        type: 'passwordImmediately',
        value: state.password.value,
      });
      dispatch({
        type: 'passwordAfterDelay',
        value: state.password.value,
      });
    }

    if (isInputVisible.rePassword) {
      dispatch({
        type: 'rePasswordImmediately',
        value: state.rePassword.value,
      });
    }

    dispatch({ type: 'validateAllAndUpdate' });
  }, [triggerValidation]);

  useEffect(() => {
    switch (autoFocusInput) {
      case 'username':
        if (usernameRef.current) {
          // @ts-expect-error TS(2339) FIXME: Property 'focus' does not exist on type 'never'.
          usernameRef.current.focus();
        }
        break;

      case 'email':
        if (emailRef.current) {
          // @ts-expect-error TS(2339) FIXME: Property 'focus' does not exist on type 'never'.
          emailRef.current.focus();
        }
        break;

      case 'password':
        if (passwordRef.current) {
          // @ts-expect-error TS(2339) FIXME: Property 'focus' does not exist on type 'never'.
          passwordRef.current.focus();
        }
        break;

      default:
        break;
    }
  }, [autoFocusInput]);

  function inputCheck(input: $TSFixMe) {
    return useEffect(() => {
      // @ts-expect-error TS(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      if (state[input].value) {
        const delay = setTimeout(() => {
          dispatch({ type: `${input}AfterDelay` });
        }, 800);

        return () => {
          clearTimeout(delay);
        };
      }
    // @ts-expect-error TS(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    }, [state[input].value]);
  }

  inputCheck('username');
  inputCheck('email');
  inputCheck('password');

  return <>
    <Form>
      {isInputVisible.username && (
        <Form.Group className="mb-3" controlId="username-register">
          <Form.Control
            ref={usernameRef}
            type="text"
            onChange={(e: $TSFixMe) => dispatch({
              type: 'usernameImmediately',
              value: e.target.value,
            })
            }
            name="username"
            placeholder="Username"
            required
          />
          <CSSTransition
            in={state.username.hasErrors}
            timeout={280}
            classNames="liveValidateMessage"
            unmountOnExit
          >
            <div className="alert alert-danger p-2 small liveValidateMessage">
              {state.username.message}
            </div>
          </CSSTransition>
        </Form.Group>
      )}
      {isInputVisible.email && (
        <Form.Group className="mb-3" controlId="email-register">
          <Form.Control
            ref={emailRef}
            onChange={(e: $TSFixMe) => dispatch({
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
            timeout={280}
            classNames="liveValidateMessage"
            unmountOnExit
          >
            <div className="alert alert-danger p-2 small liveValidateMessage">
              {state.email.message}
            </div>
          </CSSTransition>
        </Form.Group>
      )}
      {isInputVisible.password && (
        <Form.Group
          className="mb-3 position-relative"
          controlId="password-register"
        >
          <Form.Control
            ref={passwordRef}
            onChange={(e: $TSFixMe) => dispatch({
              type: 'passwordImmediately',
              value: e.target.value,
            })
            }
            name="password"
            type={state.password.visible ? 'text' : 'password'}
            placeholder="Password"
          />
          <PasswordEye
            onClick={() => {
              dispatch({
                type: 'togglePasswordVisible',
              });
            }}
            className="position-absolute custom-pointer"
          >
            {!state.password.visible && (
              <span>
                <i className="fas fa-solid fa-eye"></i>
              </span>
            )}
            {state.password.visible && (
              <span>
                <i className="fas fa-solid fa-eye-slash"></i>
              </span>
            )}
          </PasswordEye>

          <CSSTransition
            in={state.password.hasErrors}
            timeout={280}
            classNames="liveValidateMessage"
            unmountOnExit
          >
            <div className="alert alert-danger p-2 small liveValidateMessage">
              {state.password.message}
            </div>
          </CSSTransition>
        </Form.Group>
      )}
      {isInputVisible.rePassword && (
        <Form.Group
          className="mb-3 position-relative"
          controlId="repeat-password-register"
        >
          <Form.Control
            onChange={(e: $TSFixMe) => dispatch({
              type: 'rePasswordImmediately',
              value: e.target.value,
            })
            }
            name="rePassword"
            type={state.rePassword.visible ? 'text' : 'password'}
            placeholder="Repeat password"
          />
          <PasswordEye
            onClick={() => {
              dispatch({
                type: 'toggleRepasswordVisible',
              });
            }}
            className="position-absolute custom-pointer"
          >
            {!state.rePassword.visible && (
              <span>
                <i className="fas fa-solid fa-eye"></i>
              </span>
            )}
            {state.rePassword.visible && (
              <span>
                <i className="fas fa-solid fa-eye-slash"></i>
              </span>
            )}
          </PasswordEye>
          <CSSTransition
            in={state.rePassword.hasErrors}
            timeout={280}
            classNames="liveValidateMessage"
            unmountOnExit
          >
            <div className="alert alert-danger p-2 small liveValidateMessage">
              {state.rePassword.message}
            </div>
          </CSSTransition>
        </Form.Group>
      )}
    </Form>
  </>;
}

const PasswordEye = styled.span`
  top: 7px;
  right: 11px;
`;

export default AccountInfoForm;
