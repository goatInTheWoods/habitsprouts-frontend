import React, { useRef, useState, useEffect } from 'react';
import styled from 'styled-components';
import { format, isValid, parse } from 'date-fns';
import { DayPicker } from 'react-day-picker';
import { usePopper } from 'react-popper';

function DatePickerDialog({ selectedDate, setSelectedDate }) {
  const [inputValue, setInputValue] = useState('');
  const [isPopperOpen, setIsPopperOpen] = useState(false);

  const popperRef = useRef(null);
  const [popperElement, setPopperElement] = useState(null);

  const popper = usePopper(popperRef.current, popperElement, {
    placement: 'bottom-start',
  });

  const openPopper = () => {
    setIsPopperOpen(true);
  };

  const closePopper = () => {
    setIsPopperOpen(false);
  };

  const handleInputChange = e => {
    const date = e.currentTarget.value;

    if (isValid(new Date(date))) {
      const parsedDate = new Date(date);
      setInputValue(date);
      setSelectedDate(parsedDate);
    } else {
      setSelectedDate(undefined);
    }
  };

  const handleDaySelect = date => {
    setSelectedDate(date);
    if (date) {
      setInputValue(format(date, 'y-MM-dd'));
      closePopper();
    } else {
      setInputValue('');
    }
  };

  useEffect(() => {
    const handleClickOutside = event => {
      if (
        popperRef.current &&
        !popperRef.current.contains(event.target) &&
        popperElement &&
        !popperElement.contains(event.target)
      ) {
        closePopper();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () =>
      document.removeEventListener('mousedown', handleClickOutside);
  }, [popperElement]);

  return (
    <div>
      <div ref={popperRef}>
        <DateInputContainer
          type="date"
          placeholder={format(new Date(selectedDate), 'y-MM-dd')}
          value={inputValue}
          onChange={handleInputChange}
          onClick={openPopper}
          readOnly
        />
      </div>
      {isPopperOpen && (
        <div
          tabIndex={-1}
          style={{
            ...popper.styles.popper,
            zIndex: 1000,
          }}
          className="dialog-sheet"
          {...popper.attributes.popper}
          ref={setPopperElement}
          role="dialog"
          aria-label="DayPicker calendar"
        >
          <DayPicker
            initialFocus={isPopperOpen}
            mode="single"
            defaultMonth={selectedDate}
            selected={selectedDate}
            onSelect={handleDaySelect}
            className="rdp-small"
          />
        </div>
      )}
    </div>
  );
}

const DateInputContainer = styled.input`
  width: 100px;
  all: unset;
  background: #fbfbfb;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.03);
  padding: 6px 0;
  border-radius: 20px;
  color: #71764f;
  text-align: center;
  cursor: pointer;

  &:hover {
    background: #ebebeb;
  }

  &::placeholder {
    color: #71764f;
  }
`;

export default DatePickerDialog;
