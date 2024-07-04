import { Habit } from './habit';
export interface UserInfo {
  token: string | null;
  username: string | null;
  avatar: string | null;
  authBy: 'email' | 'google' | null;
}

export interface AlertStatus {
  isOn: boolean;
  type: 'success' | 'danger' | 'info' | 'warning';
  text: string | null;
}

export interface ConfirmStatus {
  isOn: boolean;
  title: string | null;
  content: string | null;
  submitBtnText: string;
  submitFn: (() => void) | null;
}

export interface Actions {
  login: (data: Partial<UserInfo>) => void;
  logout: () => void;
  openAlert: (params: Pick<AlertStatus, 'type' | 'text'>) => void;
  closeAlert: () => void;
  openConfirm: (
    params: Pick<
      ConfirmStatus,
      'title' | 'content' | 'submitBtnText' | 'submitFn'
    >
  ) => void;
  closeConfirm: () => void;
  setHabits: (habits: Habit[]) => void;
  addHabit: (habit: Habit) => void;
  editHabit: (updatedHabit: Habit) => void;
  deleteHabit: (habitId: string) => void;
  // changeHabitOrder: (fromIndex: number, toIndex: number) => void;
}

export interface State {
  loggedIn: boolean;
  userInfo: UserInfo;
  alertStatus: AlertStatus;
  confirmStatus: ConfirmStatus;
  habits: Habit[];
  actions: Actions;
}
