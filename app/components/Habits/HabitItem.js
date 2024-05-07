import React from 'react';
import styled from 'styled-components';
import { useLoggedIn, useActions } from '@/store/store';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import {
  axiosDeleteHabit,
  axiosCountHabit,
} from '@/services/HabitService';
import HabitCountButton from '@/components/Habits/HaibtCountButton';
import ItemDropdown from '@/components/common/ItemDropdown';
import Spinner from 'react-bootstrap/Spinner';
import { getUserTimeZone, isEqualDay } from '@/utils/util';

const HabitItem = ({
  habit,
  onClickTitle,
  editSelectedItem,
  isFetching,
}) => {
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
            : habit.totalCount > 0
            ? habit.totalCount - 1
            : habit.totalCount,
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

  function isCompletedToday() {
    const Dateslength = habit?.completionDates?.length;

    if (Dateslength) {
      const lastDay = new Date(
        habit.completionDates[Dateslength - 1]
      );
      const today = new Date();
      return isEqualDay(lastDay, today);
    } else {
      return false;
    }
  }

  return (
    <Container className="d-flex align-items-center px-3 py-2 w-100 position-relative">
      <HabitCountButton
        isCompletedToday={isCompletedToday()}
        onClick={handleCount}
      />

      <div
        className="d-flex flex-column flex-grow-1 text-center mx-4 custom-pointer"
        onClick={onClickTitle}
      >
        <span className="fw-semibold fs-3">{habit.title}</span>
        <div>
          {isFetching ? (
            <Spinner
              as="span"
              animation="grow"
              varient="light"
              size="sm"
              role="status"
              aria-hidden="true"
            />
          ) : (
            <HabitTotalCount>
              {habit.isIncrementCount
                ? `${habit.totalCount} ${habit.unit}!`
                : `${habit.totalCount} ${habit.unit} to go!`}
            </HabitTotalCount>
          )}
        </div>
      </div>
      <ItemDropdown
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

const HabitTotalCount = styled.span`
  padding: 2px 4px;
  font-style: italic;
  font-weight: 400;
  font-size: 16px;
  line-height: 19px;
  color: #799183;
  background: rgba(211, 235, 206, 0.44);
`;

export default HabitItem;
