import React from 'react';
import { useRecoilValue } from 'recoil';
import { Navigate } from 'react-router-dom';
import { authState } from '../Store/State';

const ProtectedRoute = ({ children }) => {
  const auth = useRecoilValue(authState);

  return auth.user ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
