import React from 'react';
import { useNavigate } from 'react-router-dom';
import useSetupAxiosInterceptors from '@/hooks/axiosConfig';

// useNavigate can only be used inside router,
// so I make this wrapper to use useNavigate in axios interceptor.
function AxiosWrapper({
  children
}: $TSFixMe) {
  const navigateTo = useNavigate();
  useSetupAxiosInterceptors(navigateTo);

  return <>{children}</>;
}

export default AxiosWrapper;
