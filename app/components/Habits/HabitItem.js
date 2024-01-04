import React from 'react';
import styled from 'styled-components';
import { useLoggedIn, useActions } from '@/store/store';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import {
  axiosDeleteHabit,
  axiosCountHabit,
} from '@/services/HabitService';
import HabitCountButton from '@/components/Habits/HaibtCountButton';
import HabitDropdown from '@/components/Habits/HabitDropdown';
import { getUserTimeZone } from '@/utils/util';

const HabitItem = ({ habit, onClickTitle, editSelectedItem }) => {
  const loggedIn = useLoggedIn();
  const {
    editHabit,
    deleteHabit,
    openConfirm,
    closeConfirm,
    openAlert,
  } = useActions();
  const queryClient = useQueryClient();

  const deleteHabitMutation = useMutation({
    mutationFn: axiosDeleteHabit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] });
    },
    onError: error => {
      console.error('Error creating habit:', error);
    },
  });

  const updateHabitMutation = useMutation({
    mutationFn: axiosCountHabit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] });
    },
    onError: error => {
      console.error('Error updating habit:', error);
      openAlert({
        type: 'danger',
        text: 'Something went wrong, counting failed. Try agian.',
      });
    },
  });

  async function handleCount() {
    if (!loggedIn) {
      return editHabit({
        ...habit,
        totalCount:
          habit.isIncrementCount === true
            ? habit.totalCount + 1
            : habit.totalCount - 1,
      });
    }
    await updateHabitMutation.mutate(habit.id);
  }

  async function handleDelete(id) {
    if (!loggedIn) {
      deleteHabit(id);
    } else {
      await deleteHabitMutation.mutate(id);
    }
    closeConfirm();
  }

  function handleDeleteConfirm(id) {
    openConfirm({
      title: 'Delete Your Habit',
      content: `
            <p>Are you sure you want to delete this habit?</p>
        `,
      submitBtnText: 'Delete this habit',
      submitFn: () => handleDelete(id),
    });
  }

  return (
    <Container className="d-flex align-items-center px-3 py-2 w-100 position-relative">
      <HabitCountButton onClick={handleCount} />

      <div
        className="d-flex flex-column flex-grow-1 text-center mx-4 custom-pointer"
        onClick={onClickTitle}
      >
        <span className="fw-semibold fs-3">{habit.title}</span>
        <span>
          {habit.isIncrementCount === true
            ? `${habit.totalCount} ${habit.unit}!`
            : `${habit.totalCount} ${habit.unit} to go!`}
        </span>
      </div>
      <HabitDropdown
        onEditClick={() => {
          editSelectedItem(habit.id);
        }}
        onDeleteClick={() => {
          handleDeleteConfirm(habit.id);
        }}
      />
    </Container>
  );
};

const Container = styled.div`
  border-radius: 26px;
  background: #fff;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.04);

  .dropdown-toggle::after {
    display: none;
  }
`;

export default HabitItem;
