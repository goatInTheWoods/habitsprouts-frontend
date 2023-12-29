import React from 'react';
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
import { axiosFetchSingleHabit } from '@/services/HabitService';
import { DayPicker } from 'react-day-picker';

function HabitStatisticsModal({ habitId, isOpen, closeModal }) {
  const { isLoading, isError, isSuccess, data, error } = useQuery({
    queryKey: ['singleHabit'],
    queryFn: () => axiosFetchSingleHabit(habitId),
  });

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
                <span className="text-primary opacity-50">days</span>
              </Stack>
            </StatContainer>
            <StatContainer xs={8}>
              <div className="w-100 h-100 d-flex flex-column align-items-center justify-content-between px-3 py-2">
                <div className="w-100 d-flex justify-content-between">
                  <span className="text-color-greenGrey">
                    Current Streak
                  </span>
                  {data && <span>{data.streakCount}</span>}
                </div>
                <div className="w-100 d-flex justify-content-between">
                  <span className="text-color-greenGrey">
                    Best Streak
                  </span>
                  {data && <span>{data.bestStreakCount}</span>}
                </div>
              </div>
            </StatContainer>
          </Row>

          <Row>
            <StatContainer>
              <div className="w-100 d-flex flex-column px-3 pb-1">
                <div className="text-center fw-bold pb-2 text-color-greenGrey">
                  Times completed
                </div>
                <div className="w-100 d-flex justify-content-between">
                  <span className="text-color-greenGrey">
                    This month
                  </span>
                  {data && <span>{data.streakCount}</span>}
                </div>
                <div className="w-100 d-flex justify-content-between">
                  <span className="text-color-greenGrey">
                    this year
                  </span>
                  {data && <span>{data.streakCount}</span>}
                </div>
              </div>
            </StatContainer>
          </Row>
        </div>
        <hr />
        <DayPickerWrapper>
          <DayPicker />
        </DayPickerWrapper>
      </Modal.Body>
    </StyledModal>
  );
}

const StyledModal = styled(Modal)`
  .modal-dialog {
    display: flex; // Enable flex layout
    justify-content: center; // Center horizontally
    align-items: center; // Center vertically
    margin: auto; // Auto margin for centering

    height: 100%; // Full height
    padding: 0; // Remove padding
    max-width: none; // Remove max-width

    @media (min-width: 576px) {
      // Adjust for small devices
      max-width: 500px; // Set a max-width for small devices
    }

    @media (min-width: 768px) {
      // Adjust for medium devices
      max-width: 720px; // Set a max-width for medium devices
    }

    @media (min-width: 992px) {
      // Adjust for large devices
      max-width: 920px; // Set a max-width for large devices
    }

    @media (min-width: 1200px) {
      // Adjust for extra large devices
      max-width: 1140px; // Set a max-width for extra large devices
    }
  }

  .modal-content {
    border-radius: 26px 26px 0px 0px;
    background: #fff;
    box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.09);
    width: 100%; // Full width
    max-height: 100%; // Full height
    overflow-y: auto; // Scroll if content is large
  }

  .modal-header,
  .modal-body,
  .modal-footer {
    padding: 16px;
    margin: 0 20px;
  }

  .text-color-greenGrey {
    color: #71764f;
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
`;

export default HabitStatisticsModal;
