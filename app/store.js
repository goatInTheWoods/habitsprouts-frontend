// store.js
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { persist } from 'zustand/middleware';
import { devtools } from 'zustand/middleware';

export const useStore = create(
  devtools(
    persist(
      immer((set, get) => ({
        // Your initial state
        loggedIn: false,
        alertStatus: {
          isOn: false,
          type: 'success',
          text: null,
        },
        userInfo: {
          token: null,
          username: null,
          avatar: null,
        },
        isSearchOpen: false,
        isChatOpen: false,
        unreadChatCount: 0,
        habits: [],
        actions: {
          login: data => {
            set(state => {
              state.loggedIn = true;
              state.userInfo = {
                token: data?.token,
                username: data?.username,
                avatar: data?.avatar,
              };
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
          openSearch: () =>
            set(state => {
              state.isSearchOpen = true;
            }),
          closeSearch: () =>
            set(state => {
              state.isSearchOpen = false;
            }),
          toggleChat: () =>
            set(state => {
              state.isChatOpen = !state.isChatOpen;
            }),
          closeChat: () =>
            set(state => {
              state.isChatOpen = false;
            }),
          incrementUnreadChatCount: () =>
            set(state => {
              state.unreadChatCount++;
            }),
          clearUnreadChatCount: () =>
            set(state => {
              state.unreadChatCount = 0;
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
              const fromHabit = state.habits[fromId];
              state.habits.splice(fromId, 1);
              state.habits.splice(toId, 0, fromHabit);
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
  useStore(state => Boolean(state.userInfo.token));
export const useAlertStatus = () =>
  useStore(state => state.alertStatus);
export const useUserInfo = () => useStore(state => state.userInfo);
export const useHabits = () => useStore(state => state.habits);
export const useActions = () => useStore(state => state.actions);
