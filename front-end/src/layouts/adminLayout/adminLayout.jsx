import React from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import './adminLayout.css';
import { authService } from '../../services/authService';

const AdminLayout = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await authService.logout();
        } catch (error) {
            console.warn('Admin logout request failed', error);
        } finally {
            if (typeof window !== 'undefined') {
                ['adminToken', 'adminProfile', 'accessToken', 'refreshToken', 'userProfile', 'displayName'].forEach((key) => {
                    localStorage.removeItem(key);
                    sessionStorage.removeItem(key);
                });
            }
            navigate('/admin/login', { replace: true });
        }
    };

    return (
        <div className="l-admin-container">
            {/* --- NAVBAR --- */}
            <header className="l-admin-navbar">
                <div className="l-admin-navbar-inner">
                    {/* Logo Area */}
                    <Link to="/admin/dashboard" className="l-admin-logo">
                        <div className="l-admin-logo-icon">
                            {/* Icon Shield bảo mật */}
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                                <path d="M8 11h8"/>
                                <path d="M12 15V7"/>
                            </svg>
                        </div>
                        <div className="l-admin-brand">
                            <span className="l-admin-brand-name">SecureChat</span>
                            <span className="l-admin-badge">Administrator</span>
                        </div>
                    </Link>

                    {/* Logout Button (Góc phải) */}
                    <button className="l-admin-logout-btn" onClick={handleLogout} title="Đăng xuất">
                        <span className="l-admin-logout-text">Đăng xuất</span>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                            <polyline points="16 17 21 12 16 7"></polyline>
                            <line x1="21" y1="12" x2="9" y2="12"></line>
                        </svg>
                    </button>
                </div>
            </header>

            {/* --- MAIN CONTENT --- */}
            <main className="l-admin-content">
                {/* Nơi hiển thị các trang con (Dashboard, User Manager...) */}
                <Outlet />
            </main>

            {/* --- FOOTER --- */}
            <footer className="l-admin-footer">
                <p>© 2025 SecureChat System. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default AdminLayout;