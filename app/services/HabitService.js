import axios from 'axios';

export const fetchHabits = async () => {
  const { data } = await axios.get('/habits');
  return data;
};

export const createHabit = async habitData => {
  const { data } = await axios.post('/habit', habitData);
  return data;
};

export const updateHabit = async (id, habitData) => {
  const { data } = await axios.patch(`/habits/${id}`, habitData);
  return data;
};

export const deleteHabit = async (id, habitData) => {
  const { data } = await axios.delete(`/habits/${id}`, habitData);
  return data;
};
