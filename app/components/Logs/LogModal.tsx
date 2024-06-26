import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Modal from 'react-bootstrap/Modal';
import { ReactComponent as X } from '../../images/x.svg';
import Button from 'react-bootstrap/Button';
import Stack from 'react-bootstrap/Stack';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import TipTapEditor from '@/components/Logs/TipTapEditor';
import DatePickerInput from '@/components/Logs/DatePickerInput';
import LogModalDropDownHabits from '@/components/Logs/LogModalDropDownHabits';
import {
  axiosCreateLog,
  axiosUpdateLog,
} from '@/services/LogService';
import { useLoggedIn, useActions } from '@/store/store';
import { useQueryClient, useMutation } from '@tanstack/react-query';

const LogModal = ({
  isOpen,
  closeModal,
  habitList,
  selectedLog,
}: $TSFixMe) => {
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
    onError: (error: $TSFixMe) => {
      console.error('Error creating log:', error);
    },
  });

  const updateLogMutation = useMutation({
    mutationFn: axiosUpdateLog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['logs'] });
    },
    onError: (error: $TSFixMe) => {
      console.error('Error updating log:', error);
    },
  });

  const handleSubmit = async (e: $TSFixMe) => {
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
              // @ts-expect-error TS(2339) FIXME: Property 'totalCount' does not exist on type 'neve... Remove this comment to see the full error message
              currentCount: selectedHabit.totalCount,
              // @ts-expect-error TS(2339) FIXME: Property 'id' does not exist on type 'never'.
              id: selectedHabit.id,
              // @ts-expect-error TS(2339) FIXME: Property 'title' does not exist on type 'never'.
              title: selectedHabit.title,
              // @ts-expect-error TS(2339) FIXME: Property 'unit' does not exist on type 'never'.
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
        (habit: $TSFixMe) => habit.id === selectedLog.habit.id
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
          <Row className="mb-3">
            <Form.Group as={Col} xs={6} controlId="formDate">
              <DatePickerInput
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
              />
            </Form.Group>

            <Form.Group as={Col} xs={6} controlId="formFilter">
              <LogModalDropDownHabits
                selectedHabit={selectedHabit}
                habitList={habitList}
                setSelectedHabit={setSelectedHabit}
                // className="w-100"
              />
            </Form.Group>
          </Row>

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

export default LogModal;
