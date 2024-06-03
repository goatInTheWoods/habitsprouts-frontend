import React from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import styled from 'styled-components';

const LogModalDropDownHabits = ({
  selectedHabit,
  habitList,
  setSelectedHabit,
}) => {
  const handleSelectedHabit = habit => {
    setSelectedHabit(habit);
  };

  return (
    <DropDownBtn
      id="dropdown-basic-button"
      variant={'secondary'}
      drop="down"
      title={
        <>
          {selectedHabit ? (
            <>
              <span className="px-2 me-2 text-color-greenGrey bg-lightGreen fst-italic fw-lighter">
                {selectedHabit?.totalCount} {selectedHabit?.unit}
              </span>{' '}
              <span>{selectedHabit.title}</span>
            </>
          ) : (
            'Pick a Habit'
          )}
        </>
      }
    >
      {habitList &&
        habitList.map(habit => {
          return (
            <Dropdown.Item
              className="d-flex justify-content-between"
              key={habit.id}
              onClick={() => handleSelectedHabit(habit)}
            >
              <span className="px-2 text-color-greenGrey bg-lightGreen">
                {habit.totalCount} {habit.unit}
              </span>
              <span>{habit.title}</span>
            </Dropdown.Item>
          );
        })}
    </DropDownBtn>
  );
};

const DropDownBtn = styled(DropdownButton)`
  & > button {
    width: 100%;
  }

  .dropdown-toggle {
    background: #fbfbfb !important;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.03);
    border: none;
    border-radius: 20px;
    color: #71764f !important;
    text-align: center;
    overflow: hidden;
    cursor: pointer;

    &:hover,
    &:focus {
      background: #ebebeb !important;
    }
  }

  .dropdown-menu {
    font-style: italic;
    font-weight: 400;
    font-size: 11px;
    line-height: 13px;
    color: #71764f;
  }
`;

export default LogModalDropDownHabits;
