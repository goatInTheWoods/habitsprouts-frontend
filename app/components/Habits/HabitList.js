import React, { useEffect, useState } from 'react';
import Page from '@/components/common/Page';
import HabitInfoModal from '@/components/Habits/HabitInfoModal';
import HabitStatisticsModal from '@/components/Habits/HabitStatisticsModal';
import HabitItem from '@/components/Habits/HabitItem';
import WelcomeCard from '@/components/Habits/WelcomeCard';
import Plus from '../../images/plus.svg';
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';
import {
  useLoggedIn,
  useHabitsCount,
  useHabits,
  useUserInfo,
  useActions,
} from '@/store/store';
import {
  useQuery,
  useQueryClient,
  useMutation,
} from '@tanstack/react-query';
import {
  axiosFetchHabits,
  axiosUpdateHabit,
} from '@/services/HabitService';

const HabitList = () => {
  const { changeHabitOrder, setHabits } = useActions();
  const loggedIn = useLoggedIn();
  const habits = useHabits();
  const habitsCount = useHabitsCount();
  const userInfo = useUserInfo();
  const [allowedToFetch, setAllowedToFetch] = useState(false);

  const queryClient = useQueryClient();
  const { isLoading, isError, isSuccess, data, error } = useQuery({
    queryKey: ['habits'],
    queryFn: axiosFetchHabits,
    enabled: allowedToFetch,
    refetchOnWindowFocus: true,
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

  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [isStatModalOpen, setIsStatModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [selectedHabit, setSelctedHabit] = useState(null);
  // state for drag & drop
  const [draggedItemId, setDraggedItemId] = useState(null);

  const initialHabit = {
    id: uuidv4(),
    title: '',
    isIncrementCount: true,
    unit: 'days',
    totalCount: 0,
    dailyCountLimit: 1,
    orderIndex: habitsCount,
  };

  function openInfoModal(type) {
    setModalType(type);
    setIsInfoModalOpen(true);
  }

  function closeInfoModal() {
    setIsInfoModalOpen(false);
  }

  function openStatModal() {
    setIsStatModalOpen(true);
  }

  function closeStatModal() {
    setIsStatModalOpen(false);
  }

  function editSelectedItem(id) {
    const target = habits.find(habit => {
      return habit.id === id;
    });
    setSelctedHabit(target);
    openInfoModal('edit');
  }

  function handleStatModal(id) {
    const target = habits.find(habit => {
      return habit.id === id;
    });
    setSelctedHabit(target);
    openStatModal();
  }

  const handleDrop = (event, habitId) => {
    event.preventDefault();
    const droppedItemId = habitId;

    const droppedIndex = habits?.findIndex(
      habit => habit.id === droppedItemId
    );
    const draggedIndex = habits?.findIndex(
      habit => habit.id === draggedItemId
    );

    if (droppedIndex !== -1 && draggedIndex !== -1) {
      changeHabitOrder(draggedIndex, droppedIndex);
    }
    setDraggedItemId(null);
  };

  const handleDragOver = event => {
    event.preventDefault();
  };

  const handleDragStart = (event, habitId) => {
    setDraggedItemId(habitId);
  };

  useEffect(() => {
    if (loggedIn && userInfo.token) {
      setAllowedToFetch(true);
    }
  }, [loggedIn, userInfo.token]);

  useEffect(() => {
    if (isSuccess && data) {
      setHabits(data);
    }
  }, [isSuccess, data, setHabits]);

  if (isLoading) {
    return <span>Loading...</span>;
  }

  if (isError) {
    return <span>Error: {error.message}</span>;
  }

  return (
    <Page title="HabitList" className="d-flex flex-column">
      {isInfoModalOpen && (
        <HabitInfoModal
          type={modalType}
          initialHabit={
            modalType === 'add' ? initialHabit : selectedHabit
          }
          isOpen={isInfoModalOpen}
          closeModal={closeInfoModal}
        />
      )}
      {isStatModalOpen && (
        <HabitStatisticsModal
          habitId={selectedHabit.id}
          isOpen={isStatModalOpen}
          closeModal={closeStatModal}
        />
      )}
      {/* <h1 className="text-primary">
        {userInfo?.username
          ? userInfo.username + `'s Habits`
          : 'My Habits'}
      </h1> */}
      <div className="d-flex flex-row-reverse mb-3 text-primary">
        <AddHabitButton onClick={() => openInfoModal('add')}>
          <Plus />
        </AddHabitButton>
      </div>
      <div className="vstack gap-3">
        {habits && habits.length === 0 && (
          <WelcomeCard openModal={openInfoModal} />
        )}

        {habits &&
          habits.map(habit => {
            return (
              <div
                key={habit.id}
                draggable={true}
                onDragStart={event =>
                  handleDragStart(event, habit.id)
                }
                onDrop={event => {
                  handleDrop(event, habit.id);
                }}
                onDragOver={handleDragOver}
              >
                <HabitItem
                  habit={habit}
                  onClickTitle={() => handleStatModal(habit.id)}
                  editSelectedItem={editSelectedItem}
                />
              </div>
            );
          })}
      </div>
    </Page>
  );
};

const AddHabitButton = styled.button`
  all: unset;
`;

export default HabitList;
