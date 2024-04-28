import React from 'react';
import styled from 'styled-components';
import Check from '../../images/check.svg';
import Smile from '../../images/smile.svg';

const HabitCountButton = ({ isCompletedToday, onClick }) => {
  return (
    <CountButtonContainer
      iscompletedtoday={isCompletedToday}
      className="me-lg-3 "
      onClick={onClick}
    >
      {!isCompletedToday && <Check />}
      {isCompletedToday && <Smile />}
    </CountButtonContainer>
  );
};

const CountButtonContainer = styled.button`
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 50%;
  background-color: #f0ff97;

  background-color: ${props =>
    props.iscompletedtoday ? '#f0ff97' : 'rgba(243, 255, 168, 0.35)'};
  border-style: none;
  filter: drop-shadow(2px 3px 9px rgba(122, 122, 122, 0.08));
`;

export default HabitCountButton;
