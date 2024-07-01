export interface Habit {
  id: string;
  title: string;
  totalCount: number;
  isIncrementCount: boolean;
  unit: string;
  completionDates?: string[];
  orderIndex?: number;
  createdAt?: string;
  updatedAt?: string;
  currentStreak?: number;
  bestStreak?: number;
}
