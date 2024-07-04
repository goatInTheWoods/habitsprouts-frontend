import React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useConfirmStatus, useActions } from '@/store/store';

function ConfirmationModal() {
  const confirmStatus = useConfirmStatus();
  const { closeConfirm } = useActions();

  function handleClose() {
    closeConfirm();
  }

  return (
    <>
      <Modal show={confirmStatus.isOn} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>{confirmStatus.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body
          dangerouslySetInnerHTML={{
            __html: confirmStatus.content || '',
          }}
        />
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() =>
              confirmStatus.submitFn && confirmStatus.submitFn()
            }
          >
            {confirmStatus.submitBtnText}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ConfirmationModal;
