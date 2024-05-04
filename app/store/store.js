// store.js
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { persist } from 'zustand/middleware';
import { devtools } from 'zustand/middleware';
import { subscribeWithSelector } from 'zustand/middleware';

export const useStore = create(
  devtools(
    subscribeWithSelector(
      persist(
        immer((set, get) => ({
          loggedIn: false,
          userInfo: {
            token: null,
            username: null,
            avatar: null,
          },
          alertStatus: {
            isOn: false,
            type: 'success',
            text: null,
          },
          confirmStatus: {
            isOn: false,
            isLoading: false,
            title: null,
            content: null,
            submitBtnText: 'confirm',
            submitFn: null,
          },
          habits: [],
          actions: {
            login: data => {
              set(state => {
                state.userInfo = {
                  token: data?.token,
                  username: data?.username,
                  avatar: data?.avatar,
                };
                state.loggedIn = !!data?.token;
              });
            },
            logout: () => {
              set(state => {
                state.loggedIn = false;
                state.userInfo = {
                  token: null,
                  username: null,
                  avatar: null,
                };
                state.habits = [];
              });
            },
            openAlert: ({ type, text }) => {
              set(state => {
                state.alertStatus.type = type;
                state.alertStatus.text = text;
                state.alertStatus.isOn = true;
              });
            },
            closeAlert: () =>
              set(state => {
                state.alertStatus.isOn = false;
              }),
            openConfirm: ({
              title,
              content,
              submitBtnText,
              submitFn,
            }) => {
              set(state => {
                state.confirmStatus.title = title;
                state.confirmStatus.content = content;
                state.confirmStatus.submitBtnText = submitBtnText;
                state.confirmStatus.submitFn = submitFn;
                state.confirmStatus.isOn = true;
              });
            },
            closeConfirm: () =>
              set(state => {
                state.confirmStatus.isOn = false;
                state.confirmStatus.title = null;
                state.confirmStatus.content = null;
                state.confirmStatus.submitBtnText = 'confirm';
                state.confirmStatus.submitFn = null;
              }),
            setHabits: habits =>
              set(state => {
                state.habits = habits;
              }),
            addHabit: habit =>
              set(state => {
                state.habits.push(habit);
              }),
            editHabit: updatedHabit =>
              set(state => {
                const habitIndex = state.habits.findIndex(
                  habit => habit.id === updatedHabit.id
                );
                if (habitIndex !== -1) {
                  state.habits[habitIndex] = updatedHabit;
                }
              }),
            deleteHabit: habitId =>
              set(state => {
                const habitIndex = state.habits.findIndex(
                  habit => habit.id === habitId
                );
                if (habitIndex !== -1) {
                  state.habits.splice(habitIndex, 1);
                }
              }),
            changeHabitOrder: (fromId, toId) =>
              set(state => {
                const habits = [...state.habits];
                const [movedHabit] = habits.splice(fromId, 1);
                habits.splice(toId, 0, movedHabit);
                return { ...state, habits };
              }),
          },
        })),
        {
          name: 'habitcount-storage',
          partialize: state => ({
            userInfo: state.userInfo,
            habits: state.habits,
          }),
        }
      )
    )
  )
);

export const useLoggedIn = () =>
  useStore(state => Boolean(state.userInfo.token));
export const useAlertStatus = () =>
  useStore(state => state.alertStatus);
export const useConfirmStatus = () =>
  useStore(state => state.confirmStatus);
export const useUserInfo = () => useStore(state => state.userInfo);
export const useHabits = () => useStore(state => state.habits);
export const useActions = () => useStore(state => state.actions);
