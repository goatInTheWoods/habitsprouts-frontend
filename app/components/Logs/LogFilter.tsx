import React, { useState, useEffect } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import { HabitDetail } from '@/types/log';

interface LogFilterProps {
  habitFilterList: HabitDetail[];
  filter: string;
  setFilter: React.Dispatch<React.SetStateAction<string>>;
}

function LogFilter({
  habitFilterList,
  filter,
  setFilter,
}: LogFilterProps) {
  const [title, setTitle] = useState('All');

  function handleSelect(
    eventKey: string | null,
    e: React.SyntheticEvent<unknown>
  ) {
    const selectedItemKey =
      (e.target as HTMLElement).getAttribute('data-key') || '';
    setFilter(selectedItemKey);
  }

  useEffect(() => {
    const currentHabit = habitFilterList?.find(
      (habit: HabitDetail) => habit.id === filter
    );
    setTitle(currentHabit ? currentHabit.title : 'All');
  }, [filter]);

  return (
    <Dropdown onSelect={handleSelect}>
      <Dropdown.Toggle
        id="dropdown-basic-button"
        variant={'secondary'}
        size="sm"
      >
        {title}
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown.Item data-key={null}>All</Dropdown.Item>
        {habitFilterList &&
          habitFilterList.map((habit: HabitDetail, i: number) => {
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
