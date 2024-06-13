import React, { useEffect, useState } from 'react';
import Page from '@/components/common/Page';
import HabitInfoModal from '@/components/Habits/HabitInfoModal';
import HabitStatisticsModal from '@/components/Habits/HabitStatisticsModal';
import HabitItem from '@/components/Habits/HabitItem';
import WelcomeCard from '@/components/Habits/WelcomeCard';
import Spinner from 'react-bootstrap/Spinner';
import Plus from '../../images/plus.svg';
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';
import {
  useLoggedIn,
  useHabits,
  useUserInfo,
  useActions,
} from '@/store/store';
import {
  useQuery,
  useQueryClient,
  useMutation,
  useMutationState,
} from '@tanstack/react-query';
import {
  axiosFetchHabits,
  axiosUpdateHabit,
  axiosUpdateHabitOrder,
} from '@/services/HabitService';

const HabitList = () => {
  const { changeHabitOrder, setHabits } = useActions();
  const loggedIn = useLoggedIn();
  const habits = useHabits();
  const userInfo = useUserInfo();
  const [allowedToFetch, setAllowedToFetch] = useState(false);
  const [isConfettiVisible, setIsConfettiVisible] = useState(false);

  const queryClient = useQueryClient();
  const { isLoading, isError, isSuccess, data, error } = useQuery({
    queryKey: ['habits'],
    queryFn: axiosFetchHabits,
    enabled: allowedToFetch,
    refetchOnWindowFocus: true,
  });

  const pendingCreateHabit = useMutationState({
    filters: { mutationKey: ['createHabit'], status: 'pending' },
    select: mutation => mutation.state.variables,
  });

  const updateHabitOrderMutation = useMutation({
    mutationFn: axiosUpdateHabitOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] });
    },
    onError: error => {
      console.error('Error updating habit indices:', error);
    },
  });

  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [isStatModalOpen, setIsStatModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [selectedHabit, setSelectedHabit] = useState(null);
  // state for drag & drop
  const [movedItem, setMovedItem] = useState(null);

  const initialHabit = {
    id: uuidv4(),
    title: '',
    isIncrementCount: true,
    unit: 'days',
    totalCount: 0,
    dailyCountLimit: 1,
  };

  function openInfoModal(type) {
    setModalType(type);
    setIsInfoModalOpen(true);
  }

  function closeInfoModal() {
    setIsInfoModalOpen(false);
  }

  function openStatModal() {
    setIsStatModalOpen(true);
  }

  function closeStatModal() {
    setIsStatModalOpen(false);
  }

  function editSelectedItem(id) {
    const target = habits.find(habit => {
      return habit.id === id;
    });
    setSelectedHabit(target);
    openInfoModal('edit');
  }

  function handleStatModal(id) {
    const target = habits.find(habit => {
      return habit.id === id;
    });
    setSelectedHabit(target);
    openStatModal();
  }

  const handleDrop = async (event, targetOrderHabit) => {
    event.preventDefault();
    if (loggedIn) {
      await updateHabitOrderMutation.mutate({
        id: movedItem.id,
        indices: {
          oldOrderIndex: movedItem.orderIndex,
          newOrderIndex: targetOrderHabit.orderIndex,
        },
      });
    } else {
      const fromIdx = habits?.findIndex(
        habit => habit.id === movedItem.id
      );
      const toIdx = habits?.findIndex(
        habit => habit.id === targetOrderHabit.id
      );
      if (fromIdx !== -1 && toIdx !== -1) {
        changeHabitOrder(fromIdx, toIdx);
      }
    }
    setMovedItem(null);
  };

  const handleDragOver = event => {
    event.preventDefault();
  };

  const handleDragStart = (event, habit) => {
    setMovedItem(habit);
  };

  useEffect(() => {
    if (loggedIn && userInfo.token) {
      setAllowedToFetch(true);
    }
  }, [loggedIn, userInfo.token]);

  useEffect(() => {
    if (isSuccess && data) {
      setHabits(data);
    }
  }, [isSuccess, data, setHabits]);

  if (isError) {
    return <span>Error: {error.message}</span>;
  }

  return (
    <Page title="HabitList" className="d-flex flex-column">
      {isInfoModalOpen && (
        <HabitInfoModal
          type={modalType}
          initialHabit={
            modalType === 'add' ? initialHabit : selectedHabit
          }
          isOpen={isInfoModalOpen}
          closeModal={closeInfoModal}
        />
      )}
      {isStatModalOpen && (
        <HabitStatisticsModal
          habitId={selectedHabit.id}
          isOpen={isStatModalOpen}
          closeModal={closeStatModal}
        />
      )}
      <AddHabitContainer>
        <AddHabitButton onClick={() => openInfoModal('add')}>
          <Plus />
        </AddHabitButton>
      </AddHabitContainer>
      <HabitContainer className="vstack gap-3 no-scrollbar">
        {habits && habits.length === 0 && (
          <WelcomeCard openModal={openInfoModal} />
        )}
        {(isLoading || pendingCreateHabit.length > 0) && (
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
        {habits &&
          habits.map(habit => {
            return (
              <div
                key={habit.id}
                draggable={true}
                onDragStart={event => handleDragStart(event, habit)}
                onDrop={event => {
                  handleDrop(event, habit);
                }}
                onDragOver={handleDragOver}
              >
                <HabitItem
                  habit={habit}
                  onClickTitle={() => handleStatModal(habit.id)}
                  editSelectedItem={editSelectedItem}
                />
              </div>
            );
          })}
      </HabitContainer>
    </Page>
  );
};

const AddHabitContainer = styled.div`
  margin-bottom: 1rem;
  text-align: right;
  position: sticky;
  top: 0;
  z-index: 1000;
  background-color: #fbfbfb;
`;

const AddHabitButton = styled.button`
  all: unset;
  cursor: pointer;
`;

const HabitContainer = styled.div`
  max-height: calc(100vh - 22vh);
  padding-bottom: 22vh;
  overflow-y: auto;
  overflow-anchor: none;
`;

export default HabitList;
