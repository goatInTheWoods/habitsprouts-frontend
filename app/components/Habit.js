import React, { useState } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import styled from 'styled-components';

const Habit = () => {
  const [count, setCount] = useState(0);

  function handleCount() {
    setCount(count + 1);
  }

  return (
    <Container className="d-flex align-items-center px-3 py-2 w-100 position-relative">
      <Button onClick={handleCount}>{count}</Button>
      <div className="flex-grow-1 text-center fs-3">Running</div>
      <DropdownButton
        className="position-absolute top-0 end-0"
        variant="-"
        id="dropdown-basic-button"
        title={<i className="fas fa-solid fa-bars"></i>}
        size="sm"
      >
        <Dropdown.Item as="button" href="#/action-1">
          Action
        </Dropdown.Item>
        <Dropdown.Item as="button" href="#/action-2">
          Another action
        </Dropdown.Item>
        <Dropdown.Item as="button" href="#/action-3">
          Something else
        </Dropdown.Item>
      </DropdownButton>
    </Container>
  );
};

const Container = styled.div`
  border-radius: 16px;
  background: #fff;

  .dropdown-toggle::after {
    display: none;
  }
`;

const Button = styled.button`
  width: 5rem;
  height: 5rem;
  border-radius: 50%;
  border-color: #f0ff97;
  background-color: #c6e700;
  border-width: 5px;
  border-style: solid;
  margin-right: 3rem;
`;
export default Habit;
