import React, { useEffect, useContext, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Page from './Page';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import AccountInfoForm from './AccountInfoForm';
import DispatchContext from '../DispatchContext';

const ResetPassword = () => {
  const appDispatch = useContext(DispatchContext);
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const token = params.get('token');
  const isInputVisible = {
    username: false,
    email: false,
    password: true,
    rePassword: true,
  };

  const [accountInfo, setAccountInfo] = useState({
    token: token,
    password: '',
    isAllInfoClear: false,
  });

  const [triggerValidation, setTriggerValidation] = useState(false);
  const [onResetFailure, setOnResetFailure] = useState(false);
  const failureMessage =
    'Your password reset attempt has failed. Contact our customer service.';

  function handleAccountInfoUpdate(updatedInfo) {
    setAccountInfo(prevState => ({
      ...prevState,
      ...updatedInfo,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setTriggerValidation(!triggerValidation);
  }

  async function fetchRegister(ourRequest) {
    try {
      const response = await axios.post(
        '/users/reset-password',
        {
          token: accountInfo.token,
          newPassword: accountInfo.password,
        },
        { cancelToken: ourRequest.token }
      );
      if (response.data) {
        navigate('/');
        appDispatch({ type: 'login', data: response.data });
        appDispatch({
          type: 'alert/open',
          payload: {
            type: 'success',
            text: 'Congrats! Your password has successfully reset and logged in.',
          },
        });
      }
    } catch (e) {
      setOnResetFailure(true);
      appDispatch({
        type: 'alert/open',
        payload: {
          type: 'danger',
          text: 'Failed to login.',
        },
      });
    }
  }

  useEffect(() => {
    if (accountInfo.isAllInfoClear) {
      const ourRequest = axios.CancelToken.source();

      fetchRegister(ourRequest);

      return () => {
        ourRequest.cancel();
      };
    }
  }, [accountInfo.isAllInfoClear]);

  function handleKeyPress(event) {
    if (event.key === 'Enter') {
      handleSubmit(event);
    }
  }

  return (
    <Page onKeyPress={handleKeyPress} title="Reset Password">
      <h2>Reset Your Password</h2>
      {isInputVisible && accountInfo && (
        <AccountInfoForm
          isInputVisible={isInputVisible}
          accountInfo={accountInfo}
          onAccountInfoUpdate={handleAccountInfoUpdate}
          triggerValidation={triggerValidation}
          autoFocusInput="password"
        />
      )}

      <p className="text-danger">
        {onResetFailure && failureMessage}
      </p>

      <Button variant="primary" onClick={handleSubmit}>
        Change Password
      </Button>
    </Page>
  );
};

export default ResetPassword;
