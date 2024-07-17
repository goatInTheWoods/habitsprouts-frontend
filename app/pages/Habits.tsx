import React, { useEffect, useState } from 'react';
import Page from '@/components/common/Page';
import HabitInfoModal from '@/components/Habits/HabitInfoModal';
import HabitStatisticsModal from '@/components/Habits/HabitStatisticsModal';
import HabitItem from '@/components/Habits/HabitItem';
import WelcomeCard from '@/components/Habits/WelcomeCard';
import Spinner from 'react-bootstrap/Spinner';
import { ReactComponent as Plus } from '../images/plus.svg';
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
  axiosUpdateHabitOrder,
} from '@/services/HabitService';
import { Habit } from '@/types/habit';
import {
  DndContext,
  closestCenter,
  MouseSensor,
  TouchSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  DragOverlay,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import DragOverlayHabitItem from '@/components/Habits/DragOverlayHabitItem';

const Habits = () => {
  const { setHabits, openAlert } = useActions();
  const loggedIn = useLoggedIn();
  const habits = useHabits();
  const userInfo = useUserInfo();
  const [allowedToFetch, setAllowedToFetch] = useState(false);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      // Require the mouse to move by 10 pixels before activating
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(TouchSensor, {
      // Press delay of 250ms, with tolerance of 5px of movement
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const initialHabit = {
    id: uuidv4(),
    title: '',
    isIncrementCount: true,
    unit: 'days',
    totalCount: 0,
  };
  const [activeItem, setActiveItem] = useState<Habit>(initialHabit);

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
  const [modalType, setModalType] = useState<'add' | 'edit' | null>(
    null
  );
  const [selectedHabit, setSelectedHabit] =
    useState<Habit>(initialHabit);

  function openInfoModal(type: 'add' | 'edit') {
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

  function editSelectedItem(id: string) {
    const target = habits.find((habit: Habit) => {
      return habit.id === id;
    });

    if (!target) {
      openAlert({
        type: 'warning',
        text: 'Habit not found. Please try again.',
      });
      return;
    }
    setSelectedHabit(target);
    openInfoModal('edit');
  }

  function handleStatModal(id: string) {
    const target = habits.find((habit: Habit) => {
      return habit.id === id;
    });

    if (!target) {
      openAlert({
        type: 'warning',
        text: 'Habit not found. Please try again.',
      });
      return;
    }
    setSelectedHabit(target);
    openStatModal();
  }

  function handleDragStart(event: DragStartEvent) {
    const { active } = event;
    setActiveItem(
      habits.find(habit => habit.id === active.id) || initialHabit
    );
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeIndex = habits.findIndex(
      item => item.id === active.id
    );
    const overIndex = habits.findIndex(item => item.id === over.id);

    if (activeIndex === -1 || overIndex === -1) {
      return;
    }

    if (activeIndex !== overIndex) {
      const newHabits = arrayMove<Habit>(
        habits,
        activeIndex,
        overIndex
      );
      setHabits(newHabits);
    }

    if (loggedIn) {
      const activeItem = habits.find(item => item.id === active.id);
      const overItem = habits.find(item => item.id === over.id);

      if (!activeItem?.orderIndex || !overItem?.orderIndex) {
        return;
      }

      await updateHabitOrderMutation.mutate({
        id: active.id,
        indices: {
          oldOrderIndex: activeItem.orderIndex,
          newOrderIndex: overItem.orderIndex,
        },
      });
    }
  }

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
          habitId={selectedHabit?.id}
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
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={habits}
            strategy={verticalListSortingStrategy}
          >
            {habits &&
              habits.map((habit: Habit) => {
                return (
                  <HabitItem
                    key={habit.id}
                    habit={habit}
                    onClickTitle={() => handleStatModal(habit.id)}
                    editSelectedItem={editSelectedItem}
                  />
                );
              })}
          </SortableContext>
          <DragOverlay>
            {activeItem ? (
              <DragOverlayHabitItem isDragging>
                <HabitItem key={activeItem.id} habit={activeItem} />
              </DragOverlayHabitItem>
            ) : null}
          </DragOverlay>
        </DndContext>
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

export default Habits;
