import React, { useEffect, useState } from 'react';
import Page from './Page';
import HabitModal from './HabitModal';
import HabitItem from './HabitItem';
import Plus from '../images/plus.svg';
import styled from 'styled-components';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { useHabits, useUserInfo, useActions } from '../store';

const HabitList = () => {
  const { changeHabitOrder } = useActions();
  const habits = useHabits();
  const userInfo = useUserInfo();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [targetHabit, setTargetHabit] = useState(null);
  // state for drag & drop
  const [draggedItemId, setDraggedItemId] = useState(null);

  useEffect(() => {
    async function fetchHabits() {
      try {
        const response = await axios.get('/habits');
        console.log(response);
      } catch (e) {
        console.log('Failed to get habits.');
      }
    }

    fetchHabits();
  }, []);

  const initialHabit = {
    id: uuidv4(),
    title: '',
    isIncrementCount: true,
    unit: 'days',
    count: 0,
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

  const WelcomeCard = () => {
    return (
      <Container>
        <Card border="light" className="text-center">
          <Card.Header
            as="p"
            className="bg-light fs-5 text-secondary"
          >
            Welcome to the Marathon!
          </Card.Header>
          <Card.Body>
            <Card.Text>
              I know making a habit is not easy. You are not alone.
              Start this race by creating a new habit card and
              tracking your achievements. You'll be amazed at how far
              you can go. Let's get started!
            </Card.Text>
            <Button
              className="text-white"
              variant="primary"
              onClick={() => openModal('add')}
            >
              Create New Habit
            </Button>
          </Card.Body>
        </Card>
      </Container>
    );
  };

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
        {useHabits()?.length === 0 && <WelcomeCard />}
        {useHabits()?.map(habit => {
          return (
            <div
              key={habit.id}
              draggable={true}
              onDragStart={event => handleDragStart(event, habit.id)}
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

const Container = styled.div`
  background: #fff;
  box-shadow: 0px 6px 8px 0px rgba(0, 0, 0, 0.1);
  font-size: 14px;
`;

export default HabitList;
