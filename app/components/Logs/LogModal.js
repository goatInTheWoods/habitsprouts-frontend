import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Modal from 'react-bootstrap/Modal';
import X from '../../images/x.svg';
import Button from 'react-bootstrap/Button';
import Stack from 'react-bootstrap/Stack';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import TipTapEditor from '@/components/Logs/TipTapEditor';
import DatePickerInput from '@/components/Logs/DatePickerInput';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import {
  axiosCreateLog,
  axiosUpdateLog,
} from '@/services/LogService';
import { useLoggedIn, useActions } from '@/store/store';
import { useQueryClient, useMutation } from '@tanstack/react-query';

const LogModal = ({ isOpen, closeModal, habitList, selectedLog }) => {
  const loggedIn = useLoggedIn();
  const { openAlert } = useActions();
  const [selectedHabit, setSelectedHabit] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [alertMessage, setAlertMessage] = useState('');
  const [content, setContent] = useState('');
  const queryClient = useQueryClient();

  const createLogMutation = useMutation({
    mutationFn: axiosCreateLog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['logs'] });
    },
    onError: error => {
      console.error('Error creating log:', error);
    },
  });

  const updateLogMutation = useMutation({
    mutationFn: axiosUpdateLog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['logs'] });
    },
    onError: error => {
      console.error('Error updating log:', error);
    },
  });

  const hadleSelectedHabit = habit => {
    setSelectedHabit(habit);
  };

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      if (!selectedDate) {
        return setAlertMessage(
          'Date is not valid. Please select a date from the calendar.'
        );
      }

      if (!selectedHabit) {
        return setAlertMessage('Please pick a habit.');
      }

      if (!content) {
        return setAlertMessage('Content is empty.');
      }
      if (selectedLog) {
        await updateLogMutation.mutate({
          id: selectedLog.id,
          logData: {
            date: selectedDate,
            habit: {
              currentCount: selectedHabit.totalCount,
              id: selectedHabit.id,
              title: selectedHabit.title,
              unit: selectedHabit.unit,
            },
            content,
          },
        });
      } else {
        const log = {
          date: selectedDate,
          habit: selectedHabit,
          content,
        };
        await createLogMutation.mutate(log);
      }
      closeModal();
      setAlertMessage('');
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (isOpen && selectedLog && habitList) {
      const habit = habitList.find(
        habit => habit.id === selectedLog.habit.id
      );
      setSelectedHabit(habit);
      setSelectedDate(new Date(selectedLog.date));
      setContent(selectedLog.content);
    }
  }, [isOpen, selectedLog, habitList]);

  return (
    <StyledModal
      show={isOpen}
      onHide={closeModal}
      fullscreen={true}
      dialogClassName="modal-center"
    >
      <Modal.Header>
        <Stack gap={3}>
          <div className="d-flex justify-content-end">
            <CloseButton onClick={closeModal}>
              <X />
            </CloseButton>
          </div>
          <div className="d-flex justify-content-between"></div>
        </Stack>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          {/* <Row className="mb-3"> */}
          <Form.Group controlId="formDate">
            <DatePickerInput
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
            />
          </Form.Group>

          <Form.Group controlId="formFilter">
            <DropDownBtn
              id="dropdown-basic-button"
              variant={'secondary'}
              size="sm"
              drop="down"
              title={
                <>
                  {selectedHabit ? (
                    <>
                      <span className="flex-shrink-1 px-2 me-3 text-color-greenGrey bg-lightGreen fst-italic fw-lighter">
                        {selectedHabit?.totalCount}{' '}
                        {selectedHabit?.unit}
                      </span>{' '}
                      <span>{selectedHabit.title}</span>
                    </>
                  ) : (
                    'Pick a Habit'
                  )}
                </>
              }
            >
              {habitList &&
                habitList.map(habit => {
                  return (
                    <Dropdown.Item
                      className="d-flex justify-content-between"
                      key={habit.id}
                      onClick={() => hadleSelectedHabit(habit)}
                    >
                      <span className="px-2 text-color-greenGrey bg-lightGreen">
                        {habit.totalCount} {habit.unit}
                      </span>
                      <span>{habit.title}</span>
                    </Dropdown.Item>
                  );
                })}
            </DropDownBtn>
          </Form.Group>
          {/* </Row> */}

          <Form.Group controlId="formBasicEditor">
            <TipTapEditor content={content} setContent={setContent} />
          </Form.Group>
          <div className="mt-3 d-flex justify-content-end align-items-center">
            <span className="text-danger me-3">{alertMessage}</span>
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </StyledModal>
  );
};

const StyledModal = styled(Modal)`
  .modal-dialog {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: auto;

    height: 100%;
    padding: 40% 0 0 0;
    max-width: none;

    @media (min-width: 576px) {
      max-width: 500px;
    }

    @media (min-width: 768px) {
      max-width: 720px;
    }

    @media (min-width: 992px) {
      padding: 20% 0 0 0;
    }
  }

  .modal-content {
    border-radius: 26px 26px 0px 0px;
    background: #fff;
    box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.09);
    width: 100%;
    max-height: 100%;
    overflow-y: auto;
  }

  .modal-header {
    padding: 16px 16px 0 16px;
    margin: 0 20px;
  }

  .modal-body,
  .modal-footer {
    padding: 16px;
    margin: 0 20px;
  }
`;

const CloseButton = styled.button`
  all: unset;
`;

const DropDownBtn = styled(DropdownButton)`
  & > button {
    width: 100% !important;
  }

  .dropdown-toggle {
    all: unset;
    background: #fbfbfb !important;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.03);
    padding: 6px 0;
    border-radius: 20px;
    color: #71764f !important;
    text-align: center;
    cursor: pointer;

    &:hover,
    &:focus {
      background: #ebebeb !important;
    }
  }

  .dropdown-menu {
    font-style: italic;
    font-weight: 400;
    font-size: 11px;
    line-height: 13px;
    color: #71764f;
  }
`;

export default LogModal;
