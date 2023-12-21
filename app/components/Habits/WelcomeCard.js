import React from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import styled from 'styled-components';

const WelcomeCard = ({ openModal }) => {
  return (
    <Container>
      <Card border="light" className="text-center">
        <Card.Header as="p" className="bg-light fs-5 text-secondary">
          Welcome to the Marathon!
        </Card.Header>
        <Card.Body>
          <Card.Text>
            I know making a habit is not easy. You are not alone.
            Start this race by creating a new habit card and tracking
            your achievements. You'll be amazed at how far you can go.
            Let's get started!
          </Card.Text>
          <Button
            className="text-white"
            variant="primary"
            onClick={() => openModal('add')}
          >
            Create New Habit
          </Button>
        </Card.Body>
      </Card>
    </Container>
  );
};

const Container = styled.div`
  background: #fff;
  box-shadow: 0px 6px 8px 0px rgba(0, 0, 0, 0.1);
  font-size: 14px;
`;

export default WelcomeCard;
