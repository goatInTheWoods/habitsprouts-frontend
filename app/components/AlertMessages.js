import React from 'react';
import Alert from 'react-bootstrap/Alert';

function AlertMessages(props) {
  return (
    <Alert
      key={props.type}
      variant={props.type}
      className="custom-alert"
    >
      {props.text}
    </Alert>
  );
}

export default AlertMessages;
