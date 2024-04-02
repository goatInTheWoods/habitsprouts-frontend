import React, { useState } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';

function LogFilter({ habitList, setFilter }) {
  const [title, setTitle] = useState('All');

  function handleSelect(key, event) {
    const selectedItemKey = event.target.getAttribute('data-key');

    setFilter(selectedItemKey);
    setTitle(event.target.getAttribute('data-title'));
  }

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
        <Dropdown.Item data-key={null} data-title="All">
          All
        </Dropdown.Item>
        {habitList &&
          habitList.map((habit, i) => {
            return (
              <Dropdown.Item
                data-title={habit.title}
                data-key={habit.id}
                key={i}
              >
                {habit.title}
              </Dropdown.Item>
            );
          })}
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default LogFilter;
