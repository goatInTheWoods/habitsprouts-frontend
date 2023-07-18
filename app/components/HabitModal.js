import React, { useState, useContext } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import produce from 'immer';
import DispatchContext from '../DispatchContext';

function HabitModal({ type, initialHabit, isOpen, closeModal }) {
  const appDispatch = useContext(DispatchContext);
  const [habit, setHabit] = useState(initialHabit);

  function handleInput({ target }) {
    setHabit(
      produce(draft => {
        draft[target.id] =
          target.id === 'countFrom'
            ? Number(target.value)
            : target.value;
      })
    );
  }

  function handleClose() {
    setHabit(initialHabit);
    closeModal();
  }

  function handleSubmit(e) {
    e.preventDefault();
    appDispatch({
      type: `habits/${type}`,
      payload: habit,
    });
    handleClose();
  }

  function handleKeyPress(event) {
    if (event.key === 'Enter') {
      handleSubmit(event);
    }
  }

  return (
    <>
      <Modal
        show={isOpen}
        onHide={handleClose}
        backdrop="static"
        centered
        onKeyPress={handleKeyPress}
      >
        <Modal.Header closeButton>
          <Modal.Title>Add a New Habit</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="title">
              <Form.Label>
                What habit are you trying to build?
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Journaling"
                onChange={handleInput}
                autoFocus
                required
                defaultValue={habit?.title}
              />
            </Form.Group>
            <Row>
              <Form.Group as={Col} controlId="direction">
                <select
                  className="form-select"
                  id="direction"
                  aria-label="Default select example"
                  onChange={handleInput}
                  defaultValue={habit?.direction}
                >
                  <option defaultValue value="increase">
                    increase
                  </option>
                  <option value="decrease">decrease</option>
                </select>
              </Form.Group>
              <Col xs="auto">Starts from</Col>
              <Form.Group as={Col} sm={3} controlId="unit">
                <Form.Control
                  type="text"
                  defaultValue={habit?.unit}
                  onChange={handleInput}
                />
              </Form.Group>
              <Form.Group as={Col} sm={2} controlId="countFrom">
                <Form.Control
                  type="text"
                  defaultValue={habit?.countFrom}
                  onChange={handleInput}
                />
              </Form.Group>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button
            type="submit"
            variant="primary"
            onClick={handleSubmit}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default HabitModal;
