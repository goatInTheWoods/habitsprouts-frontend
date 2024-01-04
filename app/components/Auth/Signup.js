import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import AccountInfoForm from './AccountInfoForm';
import axios from 'axios';
import { useActions } from '../../store/store';

function Signup({ isOpen, close }) {
  const { login, openAlert } = useActions();
  const navigate = useNavigate();

  const isInputVisible = {
    username: true,
    email: true,
    password: true,
    rePassword: true,
  };

  const [accountInfo, setAccountInfo] = useState({
    username: '',
    email: '',
    password: '',
    isAllInfoClear: false,
  });

  const [triggerValidation, setTriggerValidation] = useState(false);

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
        '/users',
        {
          username: accountInfo.username,
          email: accountInfo.email,
          password: accountInfo.password,
        },
        { cancelToken: ourRequest.token }
      );
      if (response.data) {
        close();
        navigate('/');
        login(response.data);
        openAlert({
          type: 'success',
          text: 'Congrats! Welcome to your new account.',
        });
      }
    } catch (e) {
      openAlert({
        type: 'danger',
        text: 'Failed to Sign up.',
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
    <>
      <Modal
        show={isOpen}
        onHide={close}
        backdrop="static"
        centered
        onKeyPress={handleKeyPress}
        autoFocus={false}
      >
        <Modal.Header
          className="d-flex align-items-start"
          closeButton
        >
          <Modal.Title>
            <p>Sign Up</p>
            <p className="fs-6 fw-light lh-sm mb-0">
              Welcome to HabitCount! Our service is completely free,
              so once you sign up, you're good to go!
            </p>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {isInputVisible &&
            accountInfo &&
            handleAccountInfoUpdate && (
              <AccountInfoForm
                isInputVisible={isInputVisible}
                accountInfo={accountInfo}
                onAccountInfoUpdate={handleAccountInfoUpdate}
                triggerValidation={triggerValidation}
                autoFocusInput="username"
              />
            )}
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-center">
          <div className="d-grid col-12">
            <Button variant="primary" onClick={handleSubmit}>
              Sign Up
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Signup;
