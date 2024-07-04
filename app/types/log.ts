export interface HabitDetail {
  id: string;
  currentCount: number;
  title: string;
  unit: string;
}

export interface Log {
  id: string;
  content: string;
  date: string;
  habit: HabitDetail;
  visibility: 'private' | 'public' | 'neighbors_only';
  createdAt?: Date;
  updatedAt?: Date;
}
