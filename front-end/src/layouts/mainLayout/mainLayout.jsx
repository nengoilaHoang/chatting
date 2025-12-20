import { Outlet, Link } from 'react-router-dom';
import './mainLayout.css';

export default function MainLayout() {
    return (
        <div className="mainlayout-container">
            {/* --- HEADER --- */}
            <header className="mainlayout-header">
                <div className="mainlayout-header-inner">
                    {/* Logo bên trái */}
                    <Link to="/" className="mainlayout-logo-area">
                        <div className="mainlayout-logo-icon">
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2C6.48 2 2 6.48 2 12C2 13.85 2.5 15.55 3.35 17L2.5 21.5L7.5 20.5C8.8 21.45 10.35 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z" fill="#007AFF"/>
                                <path d="M8 12C8 12.55 7.55 13 7 13C6.45 13 6 12.55 6 12C6 11.45 6.45 11 7 11C7.55 11 8 11.45 8 12Z" fill="white"/>
                                <path d="M13 12C13 12.55 12.55 13 12 13C11.45 13 11 12.55 11 12C11 11.45 11.45 11 12 11C12.55 11 13 11.45 13 12Z" fill="white"/>
                                <path d="M18 12C18 12.55 17.55 13 17 13C16.45 13 16 12.55 16 12C16 11.45 16.45 11 17 11C17.55 11 18 11.45 18 12Z" fill="white"/>
                            </svg>
                        </div>
                        <span className="mainlayout-logo-text">SecureChat</span>
                    </Link>

                    {/* Nút bấm bên phải */}
                    <div className="mainlayout-main-actions">
                        <span className="mainlayout-logo-text">Xin Chào DisplayName</span>
                    </div>
                </div>
            </header>

            {/* --- CONTENT --- */}
            <main className="mainlayout-content">
                <Outlet />
            </main>

            {/* --- FOOTER --- */}
            <footer className="mainlayout-footer">
                <div className="mainlayout-footer-content">
                    <p>&copy; 2025 SecurityChat. Kết nối an toàn mọi khoảnh khắc.</p>
                    <div className="mainlayout-footer-links">
                        <a href="#">Bảo mật</a>
                        <a href="#">Điều khoản</a>
                        <a href="#">Trợ giúp</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}