import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
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

  const handleInput = ({
    target,
  }: React.ChangeEvent<HTMLInputElement>) => {
    setHabit(current => ({
      ...current,
      title: target.value,
    }));
  };

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
    <Modal
      show={isOpen}
      onHide={handleClose}
      backdrop="static"
      centered
      onKeyPress={handleKeyPress}
    >
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>
            {type === 'add' ? 'Add a New Habit' : 'Edit The Habit'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
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
      </Form>
    </Modal>
  );
}

export default HabitInfoModal;
