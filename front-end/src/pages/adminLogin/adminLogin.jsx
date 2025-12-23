import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './adminLogin.css';
import { authService } from '../../services/authService';

const AdminLoginPage = () => {
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
        setError(''); // Xóa lỗi khi user nhập lại
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const data = await authService.adminLogin(credentials);
            if (data?.adminAccount) {
                localStorage.setItem('adminProfile', JSON.stringify(data.adminAccount));
            }
            navigate('/admin/dashboard');
        } catch (error) {
            setError(error.message ?? 'Đăng nhập thất bại. Vui lòng thử lại.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-admin-login-container">
            <div className="p-admin-login-card">
                
                {/* Header: Logo & Title */}
                <div className="p-admin-login-header">
                    <div className="p-admin-login-logo-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                            <path d="M8 11h8"/>
                            <path d="M12 15V7"/>
                        </svg>
                    </div>
                    <h1 className="p-admin-login-title">Administrator</h1>
                    <p className="p-admin-login-subtitle">Đăng nhập vào hệ thống quản trị SecureChat</p>
                </div>

                {/* Form */}
                <form onSubmit={handleLogin} className="p-admin-login-form">
                    
                    {error && <div className="p-admin-login-alert">{error}</div>}

                    <div className="p-admin-login-group">
                        <label htmlFor="email">Email quản trị</label>
                        <input 
                            type="email" 
                            id="email" 
                            name="email"
                            placeholder="admin@domain.com"
                            value={credentials.email}
                            onChange={handleChange}
                            autoFocus
                            required
                        />
                    </div>

                    <div className="p-admin-login-group">
                        <label htmlFor="password">Mật khẩu</label>
                        <input 
                            type="password" 
                            id="password" 
                            name="password"
                            placeholder="••••••••••••"
                            value={credentials.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button 
                        type="submit" 
                        className={`p-admin-login-btn ${isLoading ? 'loading' : ''}`}
                        disabled={isLoading}
                    >
                        {isLoading ? <span className="p-admin-loader"></span> : 'Truy cập Dashboard'}
                    </button>
                </form>

                {/* Footer link */}
                <div className="p-admin-login-footer">
                    <span onClick={() => navigate('/')}>← Quay lại trang người dùng</span>
                </div>
            </div>
        </div>
    );
};

export default AdminLoginPage;