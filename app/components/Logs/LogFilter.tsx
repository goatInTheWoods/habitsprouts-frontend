import React, { useState, useEffect } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';

function LogFilter({
  habitList,
  filter,
  setFilter
}: $TSFixMe) {
  const [title, setTitle] = useState('All');

  function handleSelect(key: $TSFixMe, event: $TSFixMe) {
    const selectedItemKey = event.target.getAttribute('data-key');
    setFilter(selectedItemKey);
  }

  useEffect(() => {
    const currentHabit = habitList?.find(
      (habit: $TSFixMe) => habit.id === filter
    );
    setTitle(currentHabit ? currentHabit.title : 'All');
  }, [filter]);

  return (
    <Dropdown onSelect={handleSelect}>
      <Dropdown.Toggle
        id="dropdown-basic-button"
        variant={'secondary'}
        size="sm"
        // @ts-expect-error TS(2322) FIXME: Type '{ children: string; id: string; variant: str... Remove this comment to see the full error message
        drop="down"
      >
        {title}
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown.Item data-key={null}>All</Dropdown.Item>
        {habitList &&
          habitList.map((habit: $TSFixMe, i: $TSFixMe) => {
            return (
              <Dropdown.Item data-key={habit.id} key={i}>
                {habit.title}
              </Dropdown.Item>
            );
          })}
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default LogFilter;
