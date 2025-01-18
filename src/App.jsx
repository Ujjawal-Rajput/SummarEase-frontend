import React, { Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './Components/Login';
import Signup from './Components/Signup';
import ProtectedRoute from './Components/ProtectedRoute';
import { RecoilRoot } from 'recoil';
import NewChatPage from './Components/NewChatPage';

// Lazy load the Dashboard component
const Home = React.lazy(() => import('./Components/Home'));

const App = () => {
  return (
    <RecoilRoot>
      <BrowserRouter>
        <Suspense fallback={<div>Loading...</div>}></Suspense>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<ProtectedRoute><NewChatPage /></ProtectedRoute>} />
          <Route path="/c/:session_id" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </RecoilRoot>
  );
};

export default App;
