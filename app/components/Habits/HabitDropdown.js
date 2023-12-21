import React from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dots from '../../images/dots.svg';

const HabitDropdown = ({ onEditClick, onDeleteClick }) => {
  return (
    <DropdownButton
      className="position-absolute top-0 end-0"
      variant="-"
      id="dropdown-basic-button"
      title={<Dots />}
      size="sm"
    >
      <Dropdown.Item as="button" onClick={onEditClick}>
        Edit
      </Dropdown.Item>
      <Dropdown.Item as="button" onClick={onDeleteClick}>
        Delete
      </Dropdown.Item>
    </DropdownButton>
  );
};

export default HabitDropdown;
