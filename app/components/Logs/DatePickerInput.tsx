import React, { useRef, useState, useEffect } from 'react';
import styled from 'styled-components';
import { format, isValid, parse } from 'date-fns';
import { DayPicker } from 'react-day-picker';
import { usePopper } from 'react-popper';

function DatePickerDialog({
  selectedDate,
  setSelectedDate
}: $TSFixMe) {
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

  const handleInputChange = (e: $TSFixMe) => {
    const date = parse(
      e.currentTarget.value,
      'y-MM-dd',
      selectedDate
    );

    if (isValid(date)) {
      setInputValue(e.currentTarget.value);
      setSelectedDate(date);
    } else {
      setSelectedDate(undefined);
    }
  };

  const handleDaySelect = (date: $TSFixMe) => {
    setSelectedDate(date);
    if (date) {
      setInputValue(format(date, 'y-MM-dd'));
      closePopper();
    } else {
      setInputValue('');
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: $TSFixMe) => {
      if (
        popperRef.current &&
        // @ts-expect-error TS(2339) FIXME: Property 'contains' does not exist on type 'never'... Remove this comment to see the full error message
        !popperRef.current.contains(event.target) &&
        popperElement &&
        // @ts-expect-error TS(2339) FIXME: Property 'contains' does not exist on type 'never'... Remove this comment to see the full error message
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
    <>
      <div ref={popperRef}>
        <DateInputContainer
          type="text"
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
          // @ts-expect-error TS(2322) FIXME: Type 'Dispatch<SetStateAction<null>>' is not assig... Remove this comment to see the full error message
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
            // @ts-expect-error TS(2322) FIXME: Type '{ initialFocus: true; mode: "single"; defaul... Remove this comment to see the full error message
            disabledDays={{
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
