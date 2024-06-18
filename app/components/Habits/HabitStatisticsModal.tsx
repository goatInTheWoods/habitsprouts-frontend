import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
// @ts-expect-error TS(2307) FIXME: Cannot find module '../../images/x.svg' or its cor... Remove this comment to see the full error message
import X from '../../images/x.svg';
import Button from 'react-bootstrap/Button';
import Stack from 'react-bootstrap/Stack';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Spinner from 'react-bootstrap/Spinner';
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
import { useLoggedIn, useUserInfo } from '@/store/store';

function HabitStatisticsModal({
  habitId,
  isOpen,
  closeModal,
}: $TSFixMe) {
  const loggedIn = useLoggedIn();
  const userInfo = useUserInfo();
  const [days, setDays] = useState([]);
  const [allowedToFetch, setAllowedToFetch] = useState(false);
  const queryClient = useQueryClient();

  const { isLoading, isError, isSuccess, data, error } = useQuery({
    queryKey: ['singleHabit'],
    queryFn: () => axiosFetchSingleHabit(habitId),
    enabled: allowedToFetch,
  });

  const updateCompleteDate = useMutation({
    mutationFn: axiosUpdateHabit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['singleHabit'] });
      queryClient.invalidateQueries({ queryKey: ['habits'] });
    },
    onError: (error: $TSFixMe) => {
      console.error('Error updating habit:', error);
    },
  });

  const handleDayClick = (date: $TSFixMe) => {
    updateCompleteDate.mutate({
      id: habitId,
      habitData: {
        ...data,
        selectedDate: date,
      },
    });
  };

  useEffect(() => {
    if (loggedIn && userInfo.token) {
      setAllowedToFetch(true);
    }
  }, [loggedIn, userInfo.token]);

  useEffect(() => {
    if (isSuccess && data) {
      const dateObjects = data.completionDates.map(
        (dateString: $TSFixMe) => new Date(dateString)
      );
      setDays(dateObjects);
    }
  }, [data, isSuccess]);

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
          {loggedIn && (
            <div className="d-flex justify-content-between">
              {data && <Modal.Title>{data.title}</Modal.Title>}
              <Link
                to={`/logs?filter=${encodeURIComponent(habitId)}`}
              >
                <Button variant="secondary" size="sm">
                  <i className="fas fa-solid fa-arrow-right"></i>{' '}
                  <span className="ps-1">Go to logs</span>
                </Button>
              </Link>
            </div>
          )}
        </Stack>
      </Modal.Header>
      <Modal.Body
        className={`no-scrollbar ${
          !loggedIn ? 'disabled-modal' : ''
        }`}
      >
        {isLoading && (
          <div className="d-flex justify-content-center">
            <Spinner
              animation="border"
              variant="primary"
              role="status"
            >
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        )}
        {!loggedIn && (
          <div className="overlay z-3 vstack gap-2">
            <span className="fw-bold">
              Sign up for free and start managing your habits with
              detailed statistics!
            </span>
            <Link to="/login">
              <Button className="pe-auto" variant="primary">
                Sign up
              </Button>
            </Link>
          </div>
        )}
        <div className="container-lg px-4">
          <Row className="justify-content-between align-items-stretch mb-3">
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
                    {data?.timesCompleted?.month ?? ''}
                  </span>
                </div>
                <div className="w-100 d-flex justify-content-between">
                  <span className="text-color-greenGrey">
                    This year
                  </span>
                  <span className="fw-bold">
                    {data?.timesCompleted?.year ?? ''}
                  </span>
                </div>
              </div>
            </StatContainer>
          </Row>
        </div>
        <hr />
        <span>
          Edit your completions by clicking the date of the calender!
        </span>
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

  .disabled-modal {
    position: relative;
    opacity: 0.5;
    pointer-events: none; /* Disables mouse events like clicking */
  }

  .disabled-modal .overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(0, 0, 0, 0.5); /* Semi-transparent overlay */
    color: white;
    font-size: 20px;
    text-align: center;
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
