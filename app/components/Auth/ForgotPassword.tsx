import React, { useState } from 'react';
import Page from '../common/Page';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import axios from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState();
  const [errorMsg, setErrorMsg] = useState();
  const [onSendingSuccess, setOnSendingSuccess] = useState(false);
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const response = await axios.post(
        '/users/request-reset-password',
        {
          email,
        }
      );

      if (response.status === 200) {
        setOnSendingSuccess(true);
      }
    } catch (e) {
      setErrorMsg(e.message);
    }
  }

  return (
    <Page title="Forgot Password">
      {!onSendingSuccess && (
        <>
          <h2>Forgot Password?</h2>
          <p className="mb-4">
            Enter your email and we'll send you a link to get back
            into your account.
          </p>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                defaultValue={email}
                onChange={e => {
                  setEmail(e.target.value);
                }}
              />
              <Form.Text className="text-danger">
                {errorMsg}
              </Form.Text>
            </Form.Group>

            <Button variant="primary" type="submit">
              Request a reset link
            </Button>
          </Form>
        </>
      )}
      {onSendingSuccess && (
        <div className="text-center">
          <h2>Check your email</h2>
          <p className="mb-4 ">
            {`We have sent a password reset link to ${email}`}
          </p>
        </div>
      )}
    </Page>
  );
};

export default ForgotPassword;
