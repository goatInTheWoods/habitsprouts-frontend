import React, { useRef, useState, useEffect } from 'react';
import styled from 'styled-components';
import { format, isValid, parse } from 'date-fns';
import { DayPicker } from 'react-day-picker';
import { usePopper } from 'react-popper';

interface DatePickerDialogProps {
  selectedDate: Date | undefined;
  setSelectedDate: React.Dispatch<
    React.SetStateAction<Date | undefined>
  >;
}

function DatePickerDialog({
  selectedDate,
  setSelectedDate,
}: DatePickerDialogProps) {
  const [inputValue, setInputValue] = useState('');
  const [isPopperOpen, setIsPopperOpen] = useState(false);

  const popperRef = useRef<HTMLDivElement>(null);
  const [popperElement, setPopperElement] =
    useState<HTMLElement | null>(null);

  const popper = usePopper(popperRef.current, popperElement, {
    placement: 'bottom-start',
  });

  const openPopper = () => {
    setIsPopperOpen(true);
  };

  const closePopper = () => {
    setIsPopperOpen(false);
  };

  const handleInputChange = (
    e: React.FormEvent<HTMLInputElement>
  ) => {
    const date = selectedDate
      ? parse(e.currentTarget.value, 'y-MM-dd', selectedDate)
      : undefined;

    if (isValid(date)) {
      setInputValue(e.currentTarget.value);
    }
    setSelectedDate(date);
  };

  const handleDaySelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      setInputValue(format(date, 'y-MM-dd'));
      closePopper();
    } else {
      setInputValue('');
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        popperRef.current &&
        !popperRef.current.contains(target) &&
        popperElement &&
        !popperElement.contains(target)
      ) {
        closePopper();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () =>
      document.removeEventListener('mousedown', handleClickOutside);
  }, [popperElement]);

  return (
    <>
      <div ref={popperRef}>
        <DateInputContainer
          type="text"
          placeholder={
            selectedDate
              ? format(new Date(selectedDate), 'y-MM-dd')
              : 'Wrong Date'
          }
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
            disabled={{
              after: new Date(),
            }}
            className="rdp-small"
          />
        </div>
      )}
    </>
  );
}

const DateInputContainer = styled.input`
  width: 100%;
  background: #fbfbfb;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.03);
  padding: 6px 0;
  border: none;
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
