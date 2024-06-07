import axios from 'axios';

export const axiosCreateUser = async userData => {
  const { data } = await axios.post('/users', userData);
  return data;
};

export const axiosLogInUser = async userData => {
  const { data } = await axios.post('/users/login', userData);
  return data;
};

export const axiosGoogleLogInUser = async userData => {
  const { data } = await axios.post('/users/login/google', userData);
  return data;
};
