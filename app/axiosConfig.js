import Axios from 'axios';
import { history } from './history';
import { useStore } from './store';

const logout = useStore.getState().actions.logout;
const useInfo = useStore.getState().userInfo;

Axios.defaults.baseURL = process.env.BACKENDURL;
Axios.interceptors.request.use(
  config => {
    const token = useInfo.token;
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

Axios.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    // Any status codes that falls outside the range of 2xx will come here
    if (error.response && error.response.status === 401) {
      // Redirect user to login page
      // navigate('/');
      logout();
      history.push('/login?from=401');
    }

    // You can also throw the error so that you can handle it in the components
    // if needed or you can just return a Promise.reject(error) here.
    return Promise.reject(error);
  }
);
