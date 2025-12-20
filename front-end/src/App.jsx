import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import AuthLayout from './layouts/authLayout';
import IntroductionPage from './components/homeComponents/introduction/introduction';
import LoginPage from './pages/login/login';
import RegisterPage from './pages/register/register';

const ChatPage = () => <h2>Giao diện Chat Chính</h2>;
const ProfilePage = () => <h2>Thông tin cá nhân</h2>;
const NotFoundPage = () => <h2>404 - Không tìm thấy trang</h2>;

const MainLayout = () => {
  return (
    <div className="main-layout" style={{ display: 'flex', height: '100vh' }}>
      <aside style={{ width: 250, background: '#333', color: 'white' }}>
        Sidebar (Menu/List Chat)
      </aside>
      <main style={{ flex: 1, background: '#fff' }}>
        <header style={{ height: 60, borderBottom: '1px solid #ddd' }}>Header</header>
        <Outlet /> 
      </main>
    </div>
  );
};

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