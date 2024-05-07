import React, { useState, useEffect } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';

function LogFilter({ habitList, filter, setFilter }) {
  const [title, setTitle] = useState('All');

  function handleSelect(key, event) {
    const selectedItemKey = event.target.getAttribute('data-key');
    setFilter(selectedItemKey);
  }

  useEffect(() => {
    const currentHabit = habitList?.find(
      habit => habit.habitId === filter
    );
    setTitle(currentHabit ? currentHabit.title : 'All');
  }, [filter]);

  return (
    <Dropdown onSelect={handleSelect}>
      <Dropdown.Toggle
        id="dropdown-basic-button"
        variant={'secondary'}
        size="sm"
        drop="down"
      >
        {title}
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown.Item data-key={null}>All</Dropdown.Item>
        {habitList &&
          habitList.map((habit, i) => {
            return (
              <Dropdown.Item data-key={habit.habitId} key={i}>
                {habit.title}
              </Dropdown.Item>
            );
          })}
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default LogFilter;
