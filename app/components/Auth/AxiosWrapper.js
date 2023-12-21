import React from 'react';
import { useNavigate } from 'react-router-dom';
import useSetupAxiosInterceptors from '@/hooks/axiosConfig';

const AxiosWrapper = ({ children }) => {
  const navigateTo = useNavigate();
  useSetupAxiosInterceptors(navigateTo);

  return <>{children}</>;
};

export default AxiosWrapper;
