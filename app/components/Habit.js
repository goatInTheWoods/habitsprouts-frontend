import React, { useState } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Check from '../images/check.svg';
import Dots from '../images/dots.svg';
import styled from 'styled-components';

const Habit = () => {
  const [count, setCount] = useState(0);

  function handleCount() {
    setCount(count + 1);
  }

  return (
    <Container className="d-flex align-items-center px-3 py-2 w-100 position-relative">
      <Button className="me-lg-3" onClick={handleCount}>
        <Check />
      </Button>

      <div className="d-flex flex-column flex-grow-1 text-center">
        <span className="fw-semibold fs-3">Running</span>
        <span>for {count} days!</span>
      </div>

      <DropdownButton
        className="position-absolute top-0 end-0"
        variant="-"
        id="dropdown-basic-button"
        title={<Dots />}
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
  border-radius: 26px;
  background: #fff;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.04);

  .dropdown-toggle::after {
    display: none;
  }
`;

const Button = styled.button`
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  background-color: #f0ff97;
  border-style: none;
  filter: drop-shadow(2px 3px 9px rgba(122, 122, 122, 0.08));
`;

export default Habit;
