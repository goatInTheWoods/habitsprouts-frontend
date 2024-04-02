import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import styled from 'styled-components';
import X from '../../images/x.svg';
import Button from 'react-bootstrap/Button';
import Stack from 'react-bootstrap/Stack';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import {
  useQuery,
  useQueryClient,
  useMutation,
} from '@tanstack/react-query';
import {
  axiosFetchSingleHabit,
  axiosUpdateHabit,
} from '@/services/HabitService';
import { DayPicker } from 'react-day-picker';
import { getUserTimeZone, convertTimezone } from '@/utils/util';

function HabitStatisticsModal({ habitId, isOpen, closeModal }) {
  const [days, setDays] = useState([]);
  const queryClient = useQueryClient();
  const { isLoading, isError, isSuccess, data, error } = useQuery({
    queryKey: ['singleHabit'],
    queryFn: () => axiosFetchSingleHabit(habitId),
  });

  const updateCompleteDate = useMutation({
    mutationFn: axiosUpdateHabit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['singleHabit'] });
      queryClient.invalidateQueries({ queryKey: ['habits'] });
    },
    onError: error => {
      console.error('Error updating habit:', error);
    },
  });

  const handleDayClick = date => {
    updateCompleteDate.mutate({
      id: habitId,
      habitData: {
        ...data,
        selectedDate: date,
      },
    });
  };

  useEffect(() => {
    if (isSuccess && data) {
      const dateObjects = data.completionDates.map(
        dateString => new Date(dateString)
      );
      setDays(dateObjects);
    }
  }, [data, isSuccess]);

  if (isLoading) {
    return <span>Loading...</span>;
  }

  if (isError) {
    return <span>Error: {error.message}</span>;
  }

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
          <div className="d-flex justify-content-between">
            {data && <Modal.Title>{data.title}</Modal.Title>}
            <Button variant="secondary" size="sm">
              <i className="fas fa-solid fa-arrow-right"></i>{' '}
              <span className="ps-1">Go to logs</span>
            </Button>
          </div>
        </Stack>
      </Modal.Header>
      <Modal.Body>
        {' '}
        <div className="container-lg px-4">
          <Row className="col-gap justify-content-between align-items-stretch mb-3">
            <StatContainer xs={3}>
              <Stack gap={0} className="text-center">
                <span className="fw-bold text-color-greenGrey">
                  total
                </span>
                {data && (
                  <span className="fw-bold fs-5">
                    {data.totalCount}
                  </span>
                )}
                <span className="text-color-greenGrey opacity-50">
                  days
                </span>
              </Stack>
            </StatContainer>
            <StatContainer xs={8}>
              <div className="w-100 h-100 d-flex flex-column align-items-center justify-content-between px-3 py-2">
                <div className="w-100 d-flex justify-content-between">
                  <span className="text-color-greenGrey">
                    Current Streak
                  </span>
                  {data && (
                    <span className="fw-bold">
                      {data.currentStreak}
                    </span>
                  )}
                </div>
                <div className="w-100 d-flex justify-content-between">
                  <span className="text-color-greenGrey">
                    Best Streak
                  </span>
                  {data && (
                    <span className="fw-bold">{data.bestStreak}</span>
                  )}
                </div>
              </div>
            </StatContainer>
          </Row>

          <Row>
            <StatContainer>
              <div className="w-100 d-flex flex-column px-3 pb-1">
                <div className="text-center fw-bold pb-2">
                  <span className="p-1 text-color-greenGrey bg-lightGreen">
                    Times completed
                  </span>
                </div>
                <div className="w-100 d-flex justify-content-between">
                  <span className="text-color-greenGrey">
                    This month
                  </span>
                  <span className="fw-bold">
                    {data?.timesCompleted?.month ?? 'N/A'}
                  </span>
                </div>
                <div className="w-100 d-flex justify-content-between">
                  <span className="text-color-greenGrey">
                    This year
                  </span>
                  <span className="fw-bold">
                    {data?.timesCompleted?.year ?? 'N/A'}
                  </span>
                </div>
              </div>
            </StatContainer>
          </Row>
        </div>
        <hr />
        <DayPickerWrapper>
          <DayPicker
            mode="multiple"
            selected={days}
            onDayClick={handleDayClick}
            modifiersClassNames={{
              selected: 'my-selected',
            }}
          />
        </DayPickerWrapper>
      </Modal.Body>
    </StyledModal>
  );
}

const StyledModal = styled(Modal)`
  .modal-dialog {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: auto;

    height: 100%;
    padding: 44px 0 0 0;
    max-width: none;

    @media (min-width: 576px) {
      max-width: 500px;
    }

    @media (min-width: 768px) {
      max-width: 720px;
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

  .modal-header,
  .modal-body,
  .modal-footer {
    padding: 16px;
    margin: 0 20px;
  }
`;

const CloseButton = styled.button`
  all: unset;
`;

const StatContainer = styled(Col)`
  display: flex;
  align-items: center;
  padding: 0.25rem 0 0.25rem 0;
  border-radius: 20px;
  background: #fbfbfb;
  box-shadow: 0px 5px 9px 0px rgba(0, 0, 0, 0.05);
`;

const DayPickerWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  .my-selected {
    color: red;
  }
`;

export default HabitStatisticsModal;
