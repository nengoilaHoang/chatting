import { useEffect } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import './authLayout.css';
import MainLayout from '../mainLayout/mainLayout';

export default function AuthLayout() {
    const navigate = useNavigate();

    // Kiểm tra nếu đã đăng nhập thì chuyển về trang chính
    useEffect(() => {
        const userProfile = localStorage.getItem('userProfile');
        const adminProfile = localStorage.getItem('adminProfile');
        
        if (userProfile) {
            navigate('/chatting', { replace: true });
        } else if (adminProfile) {
            navigate('/admin/dashboard', { replace: true });
        }
    }, [navigate]);

    // Nếu đã đăng nhập, render MainLayout thay vì AuthLayout
    const userProfile = localStorage.getItem('userProfile');
    const adminProfile = localStorage.getItem('adminProfile');
    
    if (userProfile || adminProfile) {
        return <MainLayout />;
    }

    return (
        <div className="authlayout-container">
            {/* --- HEADER --- */}
            <header className="authlayout-header">
                <div className="authlayout-header-inner">
                    {/* Logo bên trái */}
                    <Link to="/" className="authlayout-logo-area">
                        <div className="authlayout-logo-icon">
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2C6.48 2 2 6.48 2 12C2 13.85 2.5 15.55 3.35 17L2.5 21.5L7.5 20.5C8.8 21.45 10.35 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z" fill="#007AFF"/>
                                <path d="M8 12C8 12.55 7.55 13 7 13C6.45 13 6 12.55 6 12C6 11.45 6.45 11 7 11C7.55 11 8 11.45 8 12Z" fill="white"/>
                                <path d="M13 12C13 12.55 12.55 13 12 13C11.45 13 11 12.55 11 12C11 11.45 11.45 11 12 11C12.55 11 13 11.45 13 12Z" fill="white"/>
                                <path d="M18 12C18 12.55 17.55 13 17 13C16.45 13 16 12.55 16 12C16 11.45 16.45 11 17 11C17.55 11 18 11.45 18 12Z" fill="white"/>
                            </svg>
                        </div>
                        <span className="authlayout-logo-text">SecureChat</span>
                    </Link>

                    {/* Nút bấm bên phải */}
                    <div className="authlayout-auth-actions">
                        <Link to="/login" className="btn btn-ghost">Đăng nhập</Link>
                        <Link to="/register" className="btn btn-primary">Đăng ký ngay</Link>
                    </div>
                </div>
            </header>

            {/* --- CONTENT --- */}
            <main className="authlayout-content">
                <Outlet />
            </main>

            {/* --- FOOTER --- */}
            <footer className="authlayout-footer">
                <div className="authlayout-footer-content">
                    <p>&copy; 2025 SecurityChat. Kết nối an toàn mọi khoảnh khắc.</p>
                    <div className="authlayout-footer-links">
                        <a href="#">Bảo mật</a>
                        <a href="#">Điều khoản</a>
                        <a href="#">Trợ giúp</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}