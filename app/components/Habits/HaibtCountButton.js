import React, { useState } from 'react';
import styled, { keyframes, css } from 'styled-components';
import Check from '../../images/check.svg';
import Smile from '../../images/smile.svg';

const HabitCountButton = ({ isCompletedToday, onClick }) => {
  const [isSpinning, setIsSpinning] = useState(false);

  const handleClick = () => {
    setIsSpinning(true);
    onClick();
    setTimeout(() => setIsSpinning(false), 1000);
  };

  return (
    <CountButtonContainer
      iscompletedtoday={isCompletedToday}
      className="me-lg-3 "
      onClick={handleClick}
      isspinning={isSpinning}
    >
      {!isCompletedToday && <Check />}
      {isCompletedToday && <Smile />}
    </CountButtonContainer>
  );
};

const spin = keyframes`
  0% {
    transform: perspective(500px) rotateY(0deg);
  }
  100% {
    transform: perspective(500px) rotateY(360deg);
  }
`;

const spinStyles = css`
  ${spin} 1s linear
`;

const CountButtonContainer = styled.button`
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 50%;
  background-color: #f0ff97;

  background-color: ${props =>
    props.iscompletedtoday ? '#f0ff97' : 'rgba(243, 255, 168, 0.35)'};
  border-style: none;
  filter: drop-shadow(2px 3px 9px rgba(122, 122, 122, 0.08));
  animation: ${({ isspinning }) =>
    isspinning ? spinStyles : 'none'};
`;

export default HabitCountButton;
