import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';

const LoginPage = () => <h2>Trang Đăng Nhập</h2>;
const RegisterPage = () => <h2>Trang Đăng Ký</h2>;
const ChatPage = () => <h2>Giao diện Chat Chính</h2>;
const ProfilePage = () => <h2>Thông tin cá nhân</h2>;
const NotFoundPage = () => <h2>404 - Không tìm thấy trang</h2>;

const AuthLayout = () => {
  return (
    <div className="auth-container" style={{ display: 'flex', justifyContent: 'center', height: '100vh', alignItems: 'center', background: '#f0f2f5' }}>
      <div className="auth-box" style={{ padding: 20, background: 'white', borderRadius: 8 }}>
        {/* <Outlet /> là nơi các trang con (Login/Register) sẽ hiện ra */}
        <Outlet /> 
      </div>
    </div>
  );
};

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
          <Route path="/" element={<ChatPage />} /> 
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