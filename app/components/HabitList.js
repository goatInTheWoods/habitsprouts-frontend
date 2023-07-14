import React, { useState } from 'react';
import Page from './Page';
import AddHabitModal from './AddHabitModal';
import Habit from './Habit';
import Plus from '../images/plus.svg';
import styled from 'styled-components';

const HabitList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  function openAddHabitModal() {
    setIsModalOpen(true);
  }

  function closeAddHabitModal() {
    setIsModalOpen(false);
  }

  return (
    <Page title="HabitList" className="d-flex flex-column">
      <AddHabitModal
        isOpen={isModalOpen}
        closeModal={closeAddHabitModal}
      />

      {/* <AddHabitModal closeModal={closeAddHabitModal} /> */}
      <h1 className="text-primary">Habits</h1>
      <div className="d-flex flex-row-reverse mb-3 text-primary">
        <AddHabitButton onClick={openAddHabitModal}>
          <Plus />
        </AddHabitButton>
      </div>
      <div className="d-flex flex-column align-items-center gap-3">
        <Habit />
        <Habit />
      </div>
    </Page>
  );
};

const AddHabitButton = styled.button`
  all: unset;
`;

export default HabitList;
