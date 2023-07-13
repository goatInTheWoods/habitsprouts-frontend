import React from 'react';
import Page from './Page';
import Habit from './Habit';
import Plus from '../images/plus.svg';

const HabitList = () => {
  return (
    <Page title="HabitList" className="d-flex flex-column">
      <h1 className="text-primary">Habits</h1>
      <span className="d-flex flex-row-reverse mb-3 text-primary">
        <Plus />
      </span>
      <div className="d-flex flex-column align-items-center gap-3">
        <Habit />
        <Habit />
      </div>
    </Page>
  );
};

// const Span = styled.span.attrs((props) => ({
//   `color:` {primary}
// }))`

export default HabitList;
