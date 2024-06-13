import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import produce from 'immer';
import { useLoggedIn, useActions } from '@/store/store';
import {
  axiosCreateHabit,
  axiosUpdateHabit,
} from '@/services/HabitService';
import { useQueryClient, useMutation } from '@tanstack/react-query';

function HabitInfoModal({
  type,
  initialHabit,
  isOpen,
  closeModal,
}: $TSFixMe) {
  const loggedIn = useLoggedIn();
  const { addHabit, editHabit, closeConfirm } = useActions();
  const queryClient = useQueryClient();
  const [habit, setHabit] = useState(initialHabit);

  const createHabitMutation = useMutation({
    mutationKey: ['createHabit'],
    mutationFn: axiosCreateHabit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] });
    },
    onError: (error: $TSFixMe) => {
      console.error('Error creating habit:', error);
    },
  });

  const updateHabitMutation = useMutation({
    mutationFn: axiosUpdateHabit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] });
    },
    onError: (error: $TSFixMe) => {
      console.error('Error updating habit:', error);
    },
  });

  function handleInput({ target }: $TSFixMe) {
    setHabit((current: $TSFixMe) =>
      produce(current, (draft: $TSFixMe) => {
        if (
          target.id === 'totalCount' ||
          target.id === 'dailyCountLimit'
        ) {
          let inputValue = Number(target.value);
          if (inputValue < 0) {
            inputValue = 0; // Set to 0 if negative
          }
          draft[target.id] = inputValue;
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

  async function handleSubmit(e: $TSFixMe) {
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

  function handleKeyPress(event: $TSFixMe) {
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
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            onClick={handleSubmit}
          >
            <i className="bi bi-check"></i>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default HabitInfoModal;
