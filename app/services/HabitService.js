import axios from 'axios';

export const axiosFetchHabits = async () => {
  const { data } = await axios.get('/habits');
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

export const axiosDeleteHabit = async id => {
  const { data } = await axios.delete(`/habits/${id}`);
  return data;
};
