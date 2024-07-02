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
import { Habit } from '@/types/habit';

interface HabitInfoModalProps {
  type: 'add' | 'edit' | null;
  initialHabit: Habit;
  isOpen: boolean;
  closeModal: () => void;
}

function HabitInfoModal({
  type,
  initialHabit,
  isOpen,
  closeModal,
}: HabitInfoModalProps) {
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

  function handleClose() {
    setHabit(initialHabit);
    closeModal();
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
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

  function handleKeyPress(
    event: React.KeyboardEvent<HTMLDivElement>
  ) {
    if (event.key === 'Enter') {
      handleSubmit(
        event as unknown as React.FormEvent<HTMLFormElement>
      );
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
          <Button type="submit" variant="primary">
            <i className="bi bi-check"></i>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default HabitInfoModal;
