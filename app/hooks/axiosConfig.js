import { useEffect } from 'react';
import Axios from 'axios';
import { useStore } from '@/store/store';

Axios.defaults.baseURL = process.env.BACKENDURL;

const useSetupAxiosInterceptors = navigateTo => {
  const userInfo = useStore(state => state.userInfo);
  const logout = useStore(state => state.actions.logout);

  useEffect(() => {
    const requestInterceptor = Axios.interceptors.request.use(
      config => {
        if (userInfo.token) {
          config.headers[
            'Authorization'
          ] = `Bearer ${userInfo.token}`;
        }
        return config;
      },
      error => {
        return Promise.reject(error);
      }
    );

    const responseInterceptor = Axios.interceptors.response.use(
      response => response,
      error => {
        if (error.response && error.response.status === 401) {
          logout();
          navigateTo('/login?from=401');
        }
        return Promise.reject(error);
      }
    );

    return () => {
      Axios.interceptors.request.eject(requestInterceptor);
      Axios.interceptors.response.eject(responseInterceptor);
    };
  }, [userInfo.token, logout]);
};

export default useSetupAxiosInterceptors;
