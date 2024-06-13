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
            authBy: null,
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
            login: (data: $TSFixMe) => {
              set((state: $TSFixMe) => {
                state.userInfo = {
                  token: data?.token,
                  username: data?.username,
                  avatar: data?.avatar,
                  authBy: data?.authBy || 'email',
                };
                state.loggedIn = !!data?.token;
              });
            },
            logout: () => {
              set((state: $TSFixMe) => {
                state.loggedIn = false;
                state.userInfo = {
                  token: null,
                  username: null,
                  avatar: null,
                };
                state.habits = [];
              });
            },
            openAlert: ({
              type,
              text
            }: $TSFixMe) => {
              set((state: $TSFixMe) => {
                state.alertStatus.type = type;
                state.alertStatus.text = text;
                state.alertStatus.isOn = true;
              });
            },
            closeAlert: () =>
              set((state: $TSFixMe) => {
                state.alertStatus.isOn = false;
              }),
            openConfirm: ({
              title,
              content,
              submitBtnText,
              submitFn
            }: $TSFixMe) => {
              set((state: $TSFixMe) => {
                state.confirmStatus.title = title;
                state.confirmStatus.content = content;
                state.confirmStatus.submitBtnText = submitBtnText;
                state.confirmStatus.submitFn = submitFn;
                state.confirmStatus.isOn = true;
              });
            },
            closeConfirm: () =>
              set((state: $TSFixMe) => {
                state.confirmStatus.isOn = false;
                state.confirmStatus.title = null;
                state.confirmStatus.content = null;
                state.confirmStatus.submitBtnText = 'confirm';
                state.confirmStatus.submitFn = null;
              }),
            setHabits: (habits: $TSFixMe) => set((state: $TSFixMe) => {
              state.habits = habits;
            }),
            addHabit: (habit: $TSFixMe) => set((state: $TSFixMe) => {
              state.habits.push(habit);
            }),
            editHabit: (updatedHabit: $TSFixMe) => set((state: $TSFixMe) => {
              const habitIndex = state.habits.findIndex(
                (habit: $TSFixMe) => habit.id === updatedHabit.id
              );
              if (habitIndex !== -1) {
                state.habits[habitIndex] = updatedHabit;
              }
            }),
            deleteHabit: (habitId: $TSFixMe) => set((state: $TSFixMe) => {
              const habitIndex = state.habits.findIndex(
                (habit: $TSFixMe) => habit.id === habitId
              );
              if (habitIndex !== -1) {
                state.habits.splice(habitIndex, 1);
              }
            }),
            changeHabitOrder: (fromId: $TSFixMe, toId: $TSFixMe) =>
              set((state: $TSFixMe) => {
                const habits = [...state.habits];
                const [movedHabit] = habits.splice(fromId, 1);
                habits.splice(toId, 0, movedHabit);
                return { ...state, habits };
              }),
          }
        })),
        {
          name: 'habitcount-storage',
          partialize: (state: $TSFixMe) => ({
            userInfo: state.userInfo,
            habits: state.habits
          }),
        }
      )
    )
  )
);

export const useLoggedIn = () =>
  useStore((state: $TSFixMe) => Boolean(state.userInfo.token));
export const useAlertStatus = () =>
  useStore((state: $TSFixMe) => state.alertStatus);
export const useConfirmStatus = () =>
  useStore((state: $TSFixMe) => state.confirmStatus);
export const useUserInfo = () => useStore((state: $TSFixMe) => state.userInfo);
export const useHabits = () => useStore((state: $TSFixMe) => state.habits);
export const useActions = () => useStore((state: $TSFixMe) => state.actions);
