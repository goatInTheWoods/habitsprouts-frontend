import axios from 'axios';

export const axiosCreateUser = async logData => {
  const { data } = await axios.post('/users', logData);
  return data;
};
