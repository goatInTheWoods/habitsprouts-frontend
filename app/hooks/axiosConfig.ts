import { useEffect } from 'react';
import Axios from 'axios';
import { useStore } from '@/store/store';
import { getUserTimeZone } from '@/utils/dateUtil';

Axios.defaults.baseURL = process.env.BACKENDURL;

const useSetupAxiosInterceptors = (navigateTo: $TSFixMe) => {
  const loggedIn = useStore((state: $TSFixMe) => state.loggedIn);
  const userInfo = useStore((state: $TSFixMe) => state.userInfo);
  const logout = useStore((state: $TSFixMe) => state.actions.logout);

  useEffect(() => {
    const requestInterceptor = Axios.interceptors.request.use(
      (config: $TSFixMe) => {
        if (userInfo.token) {
          config.headers[
            'Authorization'
          ] = `Bearer ${userInfo.token}`;
        }

        if (config.url && config.url.startsWith('/habits')) {
          config.headers['User-Time-Zone'] = getUserTimeZone();
        }

        return config;
      },
      (error: $TSFixMe) => {
        return Promise.reject(error);
      }
    );

    const responseInterceptor = Axios.interceptors.response.use(
      (response: $TSFixMe) => response,
      (error: $TSFixMe) => {
        if (error.response && error.response.status === 401) {
          if (loggedIn) {
            logout();
          }
          navigateTo('/login?from=401');
        }

        return Promise.reject(error);
      }
    );

    return () => {
      Axios.interceptors.request.eject(requestInterceptor);
      Axios.interceptors.response.eject(responseInterceptor);
    };
  }, [userInfo.token, loggedIn, logout, navigateTo]);

  return;
};

export default useSetupAxiosInterceptors;
