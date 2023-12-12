import React, { useEffect, useState } from 'react';
import Page from './Page';
import HabitModal from './HabitModal';
import HabitItem from './HabitItem';
import WelcomeCard from './WelcomeCard';
import Plus from '../images/plus.svg';
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';
import {
  useLoggedIn,
  useHabits,
  useUserInfo,
  useActions,
} from '../store';
import { useQuery } from '@tanstack/react-query';
import { fetchHabits } from '../services/HabitService';
// import useSetupAxiosInterceptors from '../axiosConfig';

const HabitList = () => {
  // useSetupAxiosInterceptors();
  const { changeHabitOrder, setHabits } = useActions();
  const loggedIn = useLoggedIn();
  const habits = useHabits();
  const userInfo = useUserInfo();

  const { isLoading, isError, isSuccess, data, error } = useQuery({
    queryKey: ['habits'],
    queryFn: fetchHabits,
    enabled: loggedIn && !!userInfo.token,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [targetHabit, setTargetHabit] = useState(null);
  // state for drag & drop
  const [draggedItemId, setDraggedItemId] = useState(null);

  const initialHabit = {
    id: uuidv4(),
    title: '',
    isIncrementCount: true,
    unit: 'days',
    totalCount: 0,
  };

  function openModal(type) {
    setModalType(type);
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
  }

  function setUpEdit(id) {
    const target = habits.find(habit => {
      return habit.id === id;
    });
    setTargetHabit(target);
    openModal('edit');
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
    if (isSuccess && data) {
      setHabits(data);
    }
  }, [isSuccess, data, setHabits]);

  // if (isLoading) {
  //   return <span>Loading...</span>;
  // }

  // if (isError) {
  //   return <span>Error: {error.message}</span>;
  // }

  return (
    <Page title="HabitList" className="d-flex flex-column">
      {isModalOpen && (
        <HabitModal
          type={modalType}
          initialHabit={
            modalType === 'add' ? initialHabit : targetHabit
          }
          isOpen={isModalOpen}
          closeModal={closeModal}
        />
      )}
      <h1 className="text-primary">
        {userInfo?.username
          ? userInfo.username + `'s Habits`
          : 'My Habits'}
      </h1>
      <div className="d-flex flex-row-reverse mb-3 text-primary">
        <AddHabitButton onClick={() => openModal('add')}>
          <Plus />
        </AddHabitButton>
      </div>
      <div className="vstack gap-3">
        {habits && habits.length === 0 && (
          <WelcomeCard openModal={openModal} />
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
                <HabitItem habit={habit} setUpEdit={setUpEdit} />
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
