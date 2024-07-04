import axios from 'axios';

export const axiosCreateLog = async (logData: $TSFixMe) => {
  const { data } = await axios.post('/log', logData);
  return data;
};

export const axiosFetchLogs = async () => {
  const { data } = await axios.get('/logs');
  return data;
};

export const axiosUpdateLog = async ({
  id,
  logData
}: $TSFixMe) => {
  const { data } = await axios.patch(`/logs/${id}`, logData);
  return data;
};

export const axiosDeleteLog = async (id: $TSFixMe) => {
  const { data } = await axios.delete(`/logs/${id}`);
  return data;
};
