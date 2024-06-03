import React, { useState } from 'react';
import styled, { keyframes, css } from 'styled-components';
import CheckImg from '../../images/check.png';
import SmileImg from '../../images/smile.png';

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
      className="me-lg-3"
      onClick={handleClick}
      isspinning={isSpinning}
    >
      {!isCompletedToday && <StyledCheck src={CheckImg} />}
      {isCompletedToday && <StyledSmile src={SmileImg} />}
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
  border-style: none;
  display: flex;
  align-items: center;
  justify-content: center;
  filter: drop-shadow(2px 3px 9px rgba(122, 122, 122, 0.08));
  animation: ${({ isspinning }) =>
    isspinning ? spinStyles : 'none'};
  background-color: ${({ iscompletedtoday }) =>
    iscompletedtoday ? '#f0ff97' : 'rgba(243, 255, 168, 0.35)'};
`;

const StyledCheck = styled.img`
  width: 2.7rem;
  height: 2.7rem;
  display: block;
`;

const StyledSmile = styled.img`
  width: 2.7rem;
  height: 2.7rem;
  display: block;
`;

export default HabitCountButton;
