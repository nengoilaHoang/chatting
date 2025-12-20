import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import AuthLayout from './layouts/authLayout/authLayout';
import IntroductionPage from './components/homeComponents/introduction/introduction';
import LoginPage from './pages/login/login';
import RegisterPage from './pages/register/register';
import MainLayout from './layouts/mainLayout/mainLayout';
import ChattingPage from './pages/chatting/chatting';

const ProfilePage = () => <h2>Thông tin cá nhân</h2>;
const NotFoundPage = () => <h2>404 - Không tìm thấy trang</h2>;

const ProtectedRoute = () => {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/" element={<IntroductionPage />} /> 
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        <Route element={<MainLayout />}>
          <Route path="/chatting" element={<ChattingPage />} /> 
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;