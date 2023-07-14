import React from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';

function AddHabitModal({ isOpen, closeModal }) {
  return (
    <>
      <Modal show={isOpen} onHide={closeModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add a New Habit</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlInput1"
            >
              <Form.Label>
                What habit are you trying to build?
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Journaling"
                autoFocus
              />
            </Form.Group>
            <Form.Group className="d-flex align-items-center gap-2">
              <select
                className="form-select"
                aria-label="Default select example"
              >
                <option defaultValue>Increase</option>
                <option value="1">Decrease</option>
              </select>
              <span>Start from</span>
              <Form.Control type="text" value="Days" />
              <Form.Control type="text" value="0" />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Close
          </Button>
          <Button variant="primary" onClick={closeModal}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default AddHabitModal;
