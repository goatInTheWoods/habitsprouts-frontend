import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import produce from 'immer';
import { useLoggedIn, useActions } from '../store';
import {
  axiosCreateHabit,
  axiosUpdateHabit,
} from '../services/HabitService';
import { useQueryClient, useMutation } from '@tanstack/react-query';

function HabitModal({ type, initialHabit, isOpen, closeModal }) {
  const loggedIn = useLoggedIn();
  const { addHabit, editHabit, closeConfirm } = useActions();
  const queryClient = useQueryClient();
  const [habit, setHabit] = useState(initialHabit);

  const createHabitMutation = useMutation({
    mutationFn: axiosCreateHabit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] });
    },
    onError: error => {
      console.error('Error creating habit:', error);
    },
  });

  const updateHabitMutation = useMutation({
    mutationFn: axiosUpdateHabit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] });
    },
    onError: error => {
      console.error('Error updating habit:', error);
    },
  });

  function handleInput({ target }) {
    setHabit(current =>
      produce(current, draft => {
        if (target.id === 'totalCount') {
          draft[target.id] = Number(target.value);
        } else if (target.id === 'isIncrementCount') {
          draft[target.id] = target.value === 'true'; // compare string and assign boolean
        } else {
          draft[target.id] = target.value;
        }
      })
    );
  }

  function handleClose() {
    setHabit(initialHabit);
    closeModal();
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const { id, ...habitRest } = habit;
    try {
      switch (type) {
        case 'add':
          if (!loggedIn) {
            addHabit({
              ...habit,
            });
          } else {
            await createHabitMutation.mutate(habitRest);
          }
          closeConfirm();
          break;

        case 'edit':
          if (!loggedIn) {
            editHabit(habit);
          } else {
            await updateHabitMutation.mutate({
              id,
              habitData: { ...habitRest },
            });
          }
          closeConfirm();
          break;

        default:
          break;
      }
    } catch (err) {
      console.log(err);
    }
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
          <Modal.Title>
            {type === 'add' ? 'Add a New Habit' : 'Edit The Habit'}
          </Modal.Title>
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
            <Row className="row-gap-3">
              <Form.Group
                className="pe-0"
                as={Col}
                xs={5}
                sm="auto"
                controlId="isIncrementCount"
              >
                <select
                  className="form-select"
                  id="isIncrementCount"
                  aria-label="Default select example"
                  onChange={handleInput}
                  defaultValue={habit?.isIncrementCount}
                >
                  <option defaultValue value="true">
                    + increase
                  </option>
                  <option value="false">- decrease </option>
                </select>
              </Form.Group>
              <Col
                as="span"
                className="d-flex align-items-center pe-0 "
                xs={7}
                sm="auto"
              >
                Starts from
              </Col>
              <Form.Group as={Col} sm={3} xs={6} controlId="unit">
                <Form.Control
                  type="text"
                  defaultValue={habit?.unit}
                  onChange={handleInput}
                />
              </Form.Group>
              <Form.Group
                as={Col}
                sm={3}
                xs={6}
                controlId="totalCount"
              >
                <Form.Control
                  type="number"
                  defaultValue={habit?.totalCount}
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
