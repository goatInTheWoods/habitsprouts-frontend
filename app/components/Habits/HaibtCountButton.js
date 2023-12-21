import React from 'react';
import styled from 'styled-components';
import Check from '../../images/check.svg';

const HabitCountButton = ({ onClick }) => {
  return (
    <CountButtonContainer className="me-lg-3 " onClick={onClick}>
      <Check />
    </CountButtonContainer>
  );
};

const CountButtonContainer = styled.button`
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 50%;
  background-color: #f0ff97;
  border-style: none;
  filter: drop-shadow(2px 3px 9px rgba(122, 122, 122, 0.08));
`;

export default HabitCountButton;
