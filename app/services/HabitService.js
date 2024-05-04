import axios from 'axios';

export const axiosFetchHabits = async () => {
  const { data } = await axios.get('/habits');
  return data;
};

export const axiosFetchSingleHabit = async habitId => {
  const { data } = await axios.get(`/habits/${habitId}`);
  return data;
};

export const axiosFetchHabitList = async () => {
  const { data } = await axios.get('/habits/list');
  return data;
};

export const axiosCreateHabit = async habitData => {
  const { data } = await axios.post('/habit', habitData);
  return data;
};

export const axiosUpdateHabit = async ({ id, habitData }) => {
  const { data } = await axios.patch(`/habits/${id}`, habitData);
  return data;
};

export const axiosUpdateHabitOrder = async ({ id, indices }) => {
  console.log(id);
  const { data } = await axios.patch(`/habits/order/${id}`, indices);
  return data;
};

export const axiosCountHabit = async id => {
  const { data } = await axios.patch(`/habits/count/${id}`);
  return data;
};

export const axiosDeleteHabit = async id => {
  const { data } = await axios.delete(`/habits/${id}`);
  return data;
};
