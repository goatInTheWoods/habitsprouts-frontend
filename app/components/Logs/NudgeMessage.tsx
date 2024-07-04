import React from 'react';
import LogItem from '@/components/Logs/LogItem';
import styled from 'styled-components';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';

const NudgeMessage = () => {
  const exampleLogs = [
    {
      habit: {
        id: '1',
        currentCount: 5,
        title: 'Running',
        unit: 'days',
      },
      id: '1',
      visibility: 'public' as 'public',
      date: new Date('2024-01-23').toString(),
      content: '<p>Now I can run 30 minutes without stopping!</p>',
    },
    {
      habit: {
        id: '2',
        currentCount: 1,
        title: 'Running',
        unit: 'days',
      },
      id: '2',
      visibility: 'public' as 'public',
      date: new Date('2024-01-07').toString(),
      content: "<p>I've just started running. Feels good!</p>",
    },
  ];

  return (
    <div className="position-relative w-100 h-100">
      <Overlay>
        <span className="text-light fw-bold fs-4">
          Sign up for free and leave your first log
        </span>
        <Link to="/login">
          <Button className="pe-auto" variant="primary">
            Sign up
          </Button>
        </Link>
      </Overlay>
      <div className="pe-non w-100 h-100 opacity-25 vstack gap-3 no-scrollbar">
        {exampleLogs.map((log, i) => (
          <LogItem key={i} log={log} />
        ))}
      </div>
    </div>
  );
};

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(
    0,
    0,
    0,
    0.2
  ); // Darker overlay for better visibility
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 10px;
  z-index: 10; // Ensure it's above the LogItem
`;

export default NudgeMessage;
