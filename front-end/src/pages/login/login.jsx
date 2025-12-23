import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './login.css';
import { authService } from '../../services/authService';

const LoginPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const data = await authService.login({ email, password });
            if (data?.account) {
                localStorage.setItem('userProfile', JSON.stringify(data.account));
                if (data.account.displayName || data.account.email) {
                    localStorage.setItem('displayName', data.account.displayName ?? data.account.email);
                }
            }
            navigate('/');
        } catch (error) {
            setError(error.message ?? 'Đăng nhập thất bại. Vui lòng thử lại.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-login-container">
            {/* Bong bóng trang trí nền (Background Bubbles) */}
            <div className="p-login-bubble p-login-bubble-1"></div>
            <div className="p-login-bubble p-login-bubble-2"></div>
            <div className="p-login-bubble p-login-bubble-3"></div>

            <div className="p-login-card">
                {/* CỘT TRÁI: Welcome Section */}
                <div className="p-login-welcome">
                    <div className="p-login-welcome-content">
                        <h2 className="p-login-logo">SecureChat</h2>
                        <h1>Chào mừng<br/>bạn quay lại!</h1>
                        <p>Kết nối, chia sẻ và tận hưởng những cuộc trò chuyện thú vị ngay bây giờ.</p>
                        
                        {/* Hình minh họa đơn giản bằng CSS thuần */}
                        <div className="p-login-illustration">
                            <div className="p-login-chat-icon">👋</div>
                            <div className="p-login-chat-icon p-login-chat-icon-r">💬</div>
                        </div>
                    </div>
                </div>

                {/* CỘT PHẢI: Form Section */}
                <div className="p-login-form-wrapper">
                    <div className="p-login-header">
                        <h2>Đăng Nhập</h2>
                        <p>Vui lòng nhập thông tin của bạn</p>
                    </div>

                    <form className="p-login-form" onSubmit={handleLogin}>
                        {error && (
                            <div className="p-login-error">
                                {error}
                            </div>
                        )}
                        {/* Input Email */}
                        <div className="p-login-group">
                            <label htmlFor="email">Email</label>
                            <input 
                                type="email" 
                                id="email" 
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        {/* Input Password */}
                        <div className="p-login-group">
                            <label htmlFor="password">Mật khẩu</label>
                            <input 
                                type="password" 
                                id="password" 
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        {/* Quên mật khẩu */}
                        <div className="p-login-actions">
                            <div className="p-login-remember">
                                <input type="checkbox" id="remember" />
                                <label htmlFor="remember">Ghi nhớ tôi</label>
                            </div>
                            <Link to="/forgot-password">Quên mật khẩu?</Link>
                        </div>

                        {/* Submit Button */}
                        <button 
                            type="submit" 
                            className={`p-login-btn ${isLoading ? 'loading' : ''}`}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Đang xử lý...' : 'Đăng nhập'}
                        </button>
                    </form>

                    <div className="p-login-footer">
                        <p>Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;