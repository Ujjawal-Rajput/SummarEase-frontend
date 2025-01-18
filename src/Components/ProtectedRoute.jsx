import React from 'react';
import { useRecoilValue } from 'recoil';
import { Navigate, useNavigate } from 'react-router-dom';
import { authState } from '../Store/State';

const ProtectedRoute = ({ children }) => {
  const auth = useRecoilValue(authState);
  const navigate = useNavigate();
  console.log(auth)

  return auth.user ? children : navigate("/login");
};

export default ProtectedRoute;
