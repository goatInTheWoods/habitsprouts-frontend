import React from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Check from '../images/check.svg';
import Dots from '../images/dots.svg';
import styled from 'styled-components';
import { useActions } from '../store';

const HabitItem = ({ habit, onClickTitle, setUpEdit }) => {
  const { editHabit, deleteHabit } = useActions();
  function handleCount() {
    editHabit({
      ...habit,
      totalCount:
        habit.isIncrementCount === true
          ? habit.totalCount + 1
          : habit.totalCount - 1,
    });
  }

  function handleDelete(id) {
    deleteHabit(id);
  }

  return (
    <Container className="d-flex align-items-center px-3 py-2 w-100 position-relative">
      <CountButton className="me-lg-3 " onClick={handleCount}>
        <Check />
      </CountButton>

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

      <DropdownButton
        className="position-absolute top-0 end-0"
        variant="-"
        id="dropdown-basic-button"
        title={<Dots />}
        size="sm"
      >
        <Dropdown.Item
          as="button"
          onClick={() => {
            setUpEdit(habit.id);
          }}
        >
          Edit
        </Dropdown.Item>
        <Dropdown.Item
          as="button"
          onClick={() => handleDelete(habit.id)}
        >
          Delete
        </Dropdown.Item>
      </DropdownButton>
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

const CountButton = styled.button`
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 50%;
  background-color: #f0ff97;
  border-style: none;
  filter: drop-shadow(2px 3px 9px rgba(122, 122, 122, 0.08));
`;

export default HabitItem;
