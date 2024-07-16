import React from 'react';
import styled from 'styled-components';
import { useLoggedIn, useActions } from '@/store/store';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import {
  axiosDeleteHabit,
  axiosCountHabit,
} from '@/services/HabitService';
import HabitCountButton from '@/components/Habits/HabitCountButton';
import ItemDropdown from '@/components/common/ItemDropdown';
import Spinner from 'react-bootstrap/Spinner';
import { isEqualDay } from '@/utils/dateUtil';
import { Habit } from '@/types/habit';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface HabitItemProps {
  habit: Habit;
  onClickTitle: () => void;
  editSelectedItem: (id: string) => void;
}

const HabitItem = ({
  habit,
  onClickTitle,
  editSelectedItem,
}: HabitItemProps) => {
  const loggedIn = useLoggedIn();
  const {
    editHabit,
    deleteHabit,
    openConfirm,
    closeConfirm,
    openAlert,
  } = useActions();

  const queryClient = useQueryClient();
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: habit.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

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
      queryClient.refetchQueries({
        queryKey: ['habits'],
      });
    },
    onError: error => {
      console.error('Error updating habit:', error);
      openAlert({
        type: 'danger',
        text: 'Something went wrong, counting failed. Try again.',
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

  async function handleDelete(id: string) {
    if (!loggedIn) {
      deleteHabit(id);
    } else {
      await deleteHabitMutation.mutate(id);
    }
    closeConfirm();
  }

  function handleDeleteConfirm(id: string) {
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
    const datesLength = habit?.completionDates?.length ?? 0;
    if (datesLength) {
      const lastDateString =
        habit?.completionDates?.[datesLength - 1] ?? '';
      const lastDay = new Date(lastDateString);
      const today = new Date();
      return isEqualDay(lastDay, today);
    } else {
      return false;
    }
  }

  return (
    <Container
      className="d-flex align-items-center px-3 py-2 w-100 position-relative"
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
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
          {updateHabitMutation.isPending ? (
            <Spinner
              as="span"
              animation="grow"
              variant="light"
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
