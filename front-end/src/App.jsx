import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import AuthLayout from './layouts/authLayout/authLayout';
import IntroductionPage from './components/homeComponents/introduction/introduction';
import LoginPage from './pages/login/login';
import RegisterPage from './pages/register/register';
import MainLayout from './layouts/mainLayout/mainLayout';
import ChattingPage from './pages/chatting/chatting';
import AdminLoginPage from './pages/adminLogin/adminLogin';
import AdminLayout from './layouts/adminLayout/adminLayout';
import AdminDashboardPage from './pages/dashBoard/dashBoard';

const ProfilePage = () => <h2>Thông tin cá nhân</h2>;
const NotFoundPage = () => <h2>404 - Không tìm thấy trang</h2>;

const hasUserSession = () => {
  if (typeof window === 'undefined') {
    return false;
  }

  return Boolean(localStorage.getItem('userProfile'));
};

const hasAdminSession = () => {
  if (typeof window === 'undefined') {
    return false;
  }

  return Boolean(localStorage.getItem('adminProfile'));
};

const ProtectedRoute = ({ guard, redirectTo = '/login' }) => {
  const isAllowed = typeof guard === 'function' ? guard() : Boolean(guard);
  if (!isAllowed) {
    return <Navigate to={redirectTo} replace />;
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
          <Route path="/admin/login" element={<AdminLoginPage />} />
        </Route>

        <Route element={<ProtectedRoute guard={hasUserSession} redirectTo="/login" />}>
          <Route element={<MainLayout />}>
            <Route path="/chatting" element={<ChattingPage />} /> 
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute guard={hasAdminSession} redirectTo="/admin/login" />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;