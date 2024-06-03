import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import AccountInfoForm from '@/components/Auth/AccountInfoForm';
import Spinner from 'react-bootstrap/Spinner';
import { useActions } from '@/store/store';
import { useMutation } from '@tanstack/react-query';
import { axiosCreateUser } from '@/services/UserService';

function Signup({ isOpen, close }) {
  const { login, openAlert } = useActions();
  const navigate = useNavigate();

  const createUserMutation = useMutation({
    mutationFn: axiosCreateUser,
    onSuccess: data => {
      close();
      navigate('/');
      login(data);
      openAlert({
        type: 'success',
        text: 'Congrats! Welcome to your new account.',
      });
    },
    onError: error => {
      console.error('Sign Up error:', error);
      openAlert({
        type: 'danger',
        text: 'Something went wrong. Failed to Sign up.',
      });
    },
  });

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
    setTriggerValidation(prev => !prev);
  }

  useEffect(() => {
    if (accountInfo.isAllInfoClear) {
      createUserMutation.mutate({
        username: accountInfo.username,
        email: accountInfo.email,
        password: accountInfo.password,
      });
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
              Welcome to HabitSprouts! Our service is completely free,
              so once you sign up, you're good to go!
            </p>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AccountInfoForm
            isInputVisible={{
              username: true,
              email: true,
              password: true,
              rePassword: true,
            }}
            accountInfo={accountInfo}
            onAccountInfoUpdate={handleAccountInfoUpdate}
            triggerValidation={triggerValidation}
            autoFocusInput="username"
          />
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-center">
          <div className="d-grid col-12">
            <Button variant="primary" onClick={handleSubmit}>
              {createUserMutation.isPending ? (
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
              ) : (
                'Sign Up'
              )}
            </Button>
            <span className="text-center text-danger">
              {createUserMutation.isError &&
                'Failed to Sign up. Try again.'}
            </span>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Signup;
