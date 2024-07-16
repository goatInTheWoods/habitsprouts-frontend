// store.js
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { persist, devtools } from 'zustand/middleware';
import { State } from '../types/globalTypes';

export const useStore = create<State>()(
  devtools(
    persist(
      immer(set => ({
        loggedIn: false,

        userInfo: {
          token: null,
          username: null,
          avatar: null,
          authBy: null,
        },

        alertStatus: {
          isOn: false,
          type: 'success',
          text: null,
        },

        confirmStatus: {
          isOn: false,
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
                token: data?.token ?? null,
                username: data?.username ?? null,
                avatar: data?.avatar ?? null,
                authBy: data?.authBy || 'email',
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
                authBy: null,
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
);

export const useLoggedIn = () =>
  useStore((state: State) => Boolean(state.userInfo.token));
export const useAlertStatus = () =>
  useStore((state: State) => state.alertStatus);
export const useConfirmStatus = () =>
  useStore((state: State) => state.confirmStatus);
export const useUserInfo = () =>
  useStore((state: State) => state.userInfo);
export const useHabits = () =>
  useStore((state: State) => state.habits);
export const useActions = () =>
  useStore((state: State) => state.actions);
