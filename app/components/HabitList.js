import React, { useContext, useState } from 'react';
import Page from './Page';
import HabitModal from './HabitModal';
import Habit from './Habit';
import Plus from '../images/plus.svg';
import styled from 'styled-components';
import StateContext from '../StateContext';
import DispatchContext from '../DispatchContext';
import { v4 as uuidv4 } from 'uuid';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

const HabitList = () => {
  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);
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
    const target = appState.habits.find(habit => {
      return habit.id === id;
    });
    setTargetHabit(target);
    openModal('edit');
  }

  function foo() {
    console.log(1);
  }

  const handleDrop = (event, habitId) => {
    event.preventDefault();
    const droppedItemId = habitId;

    const droppedIndex = appState.habits.findIndex(
      habit => habit.id === droppedItemId
    );
    const draggedIndex = appState.habits.findIndex(
      habit => habit.id === draggedItemId
    );

    if (droppedIndex !== -1 && draggedIndex !== -1) {
      const newHabits = [...appState.habits];
      newHabits.splice(draggedIndex, 1); // Remove dragged item from the list
      newHabits.splice(
        droppedIndex,
        0,
        appState.habits[draggedIndex]
      ); // Insert dragged item at the dropped index

      appDispatch({
        type: 'habits/changeOrder',
        payload: {
          fromId: draggedIndex,
          toId: droppedIndex,
        },
      });
    }
    setDraggedItemId(null);
  };

  const handleDragOver = event => {
    event.preventDefault();
  };

  const handleDragStart = (event, habitId) => {
    setDraggedItemId(habitId);
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
        {appState?.user?.username
          ? appState.user.username + `'s Habits`
          : 'My Habits'}
      </h1>
      <div className="d-flex flex-row-reverse mb-3 text-primary">
        <AddHabitButton onClick={() => openModal('add')}>
          <Plus />
        </AddHabitButton>
      </div>
      <div className="vstack gap-3">
        {appState.habits.length === 0 && (
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
                  I know making a habit is not easy. You are not
                  alone. Start this race by creating a new habit card
                  and tracking your achievements. You'll be amazed at
                  how far you can go. Let's get started!
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
        )}
        {appState.habits.map(habit => {
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
              <Habit
                habit={habit}
                onClickTitle={foo}
                setUpEdit={setUpEdit}
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

const Container = styled.div`
  background: #fff;
  box-shadow: 0px 6px 8px 0px rgba(0, 0, 0, 0.1);
  font-size: 14px;
`;

export default HabitList;
