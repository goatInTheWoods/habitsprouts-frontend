import Axios from 'axios';

Axios.defaults.baseURL = process.env.BACKENDURL;
Axios.interceptors.request.use(
  config => {
    const token = localStorage.getItem('habitCountToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);
