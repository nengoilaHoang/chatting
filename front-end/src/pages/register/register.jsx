import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './register.css';
import { authService } from '../../services/authService';

const RegisterPage = () => {
    const navigate = useNavigate();

    // State quản lý form
    const [formData, setFormData] = useState({
        displayName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Kiểm tra nếu đã đăng nhập thì redirect về home
    useEffect(() => {
        const userProfile = localStorage.getItem('userProfile');
        if (userProfile) {
            navigate('/', { replace: true });
        }
    }, [navigate]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        });
        // Xóa lỗi khi người dùng bắt đầu sửa
        if (error) setError('');
    };

    const persistSession = (account) => {
        if (!account || typeof window === 'undefined') {
            return;
        }

        localStorage.setItem('userProfile', JSON.stringify(account));
        const fallbackName = account.displayName ?? account.email ?? account.fullName;
        if (fallbackName) {
            localStorage.setItem('displayName', fallbackName);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        
        // 1. Validate phía Client (Cực quan trọng cho UX)
        if (formData.password !== formData.confirmPassword) {
            setError("Mật khẩu nhập lại không khớp!");
            return;
        }

        if (formData.password.length < 6) {
            setError("Mật khẩu phải có ít nhất 6 ký tự!");
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            await authService.register({
                displayName: formData.displayName,
                email: formData.email,
                password: formData.password,
            });

            const autoLoginResponse = await authService.login({
                email: formData.email,
                password: formData.password,
            });

            if (autoLoginResponse?.token) {
                localStorage.setItem('accessToken', autoLoginResponse.token);
                localStorage.setItem('aesKey', autoLoginResponse.aesKey);
            }
            if (autoLoginResponse?.account) {
                persistSession(autoLoginResponse.account);
            }

            navigate('/chatting', { replace: true }); 
        } catch (err) {
            setError(err.message ?? "Đăng ký thất bại. Vui lòng thử lại.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-register-container">
            {/* Bong bóng trang trí (Animation nền) */}
            <div className="p-register-bubble p-register-bubble-1"></div>
            <div className="p-register-bubble p-register-bubble-2"></div>

            <div className="p-register-card">
                {/* CỘT TRÁI: Branding Section */}
                <div className="p-register-brand">
                    <div className="p-register-brand-content">
                        <h2 className="p-register-logo">SecureChat</h2>
                        <h1>Bắt đầu hành trình<br/>bảo mật của bạn.</h1>
                        <p>
                            Tham gia cùng hàng triệu người dùng. 
                            Nơi tin nhắn của bạn được mã hóa an toàn và riêng tư tuyệt đối.
                        </p>
                        
                        {/* Hình minh họa khiên bảo mật */}
                        <div className="p-register-illustration">
                            <div className="p-register-shield-icon">🛡️</div>
                            <div className="p-register-lock-icon">🔒</div>
                        </div>
                    </div>
                </div>

                {/* CỘT PHẢI: Form Section */}
                <div className="p-register-form-wrapper">
                    <div className="p-register-header">
                        <h2>Tạo tài khoản</h2>
                        <p>Hoàn toàn miễn phí và bảo mật.</p>
                    </div>

                    <form className="p-register-form" onSubmit={handleRegister}>
                        
                        {/* Hiển thị lỗi nếu có */}
                        {error && <div className="p-register-error">{error}</div>}

                        {/* Tên hiển thị */}
                        <div className="p-register-group">
                            <label htmlFor="displayName">Tên hiển thị</label>
                            <input 
                                type="text" 
                                id="displayName" 
                                placeholder="Ví dụ: Tuan Dev"
                                value={formData.displayName}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Email */}
                        <div className="p-register-group">
                            <label htmlFor="email">Email</label>
                            <input 
                                type="email" 
                                id="email" 
                                placeholder="name@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Password */}
                        <div className="p-register-row">
                            <div className="p-register-group">
                                <label htmlFor="password">Mật khẩu</label>
                                <input 
                                    type="password" 
                                    id="password" 
                                    placeholder="••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="p-register-group">
                                <label htmlFor="confirmPassword">Nhập lại</label>
                                <input 
                                    type="password" 
                                    id="confirmPassword" 
                                    placeholder="••••••"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button 
                            type="submit" 
                            className={`p-register-btn ${isLoading ? 'loading' : ''}`}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Đang tạo tài khoản...' : 'Đăng ký ngay'}
                        </button>
                    </form>

                    <div className="p-register-footer">
                        <p>Đã có tài khoản? <Link to="/login">Đăng nhập</Link></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;