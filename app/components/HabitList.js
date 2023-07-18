import React, { useContext, useState } from 'react';
import Page from './Page';
import HabitModal from './HabitModal';
import Habit from './Habit';
import Plus from '../images/plus.svg';
import styled from 'styled-components';
import StateContext from '../StateContext';

import { v4 as uuidv4 } from 'uuid';

const HabitList = () => {
  const appState = useContext(StateContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [targetHabit, setTargetHabit] = useState(null);

  const initialHabit = {
    id: uuidv4(),
    title: '',
    direction: 'increase',
    unit: 'days',
    countFrom: 0,
  };

  function openModal(type) {
    setModalType(type);
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
  }

  function toggleEditHabitModal(id) {
    const target = appState.habits.find(habit => {
      return habit.id == id;
    });
    setTargetHabit(target);
    console.log(targetHabit);
    setModalType('edit');
    openModal('edit');
    // setIsEditModalOpen(!isEditModalOpen);
  }

  function foo() {
    console.log(1);
  }

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
      <h1 className="text-primary">Habits</h1>
      <div className="d-flex flex-row-reverse mb-3 text-primary">
        <AddHabitButton onClick={() => openModal('add')}>
          <Plus />
        </AddHabitButton>
      </div>
      <div className="d-flex flex-column align-items-center gap-3">
        {appState.habits.map(habit => {
          return (
            <Habit
              key={habit.id}
              habit={habit}
              onClickTitle={foo}
              toggleEditModal={toggleEditHabitModal}
            />
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
