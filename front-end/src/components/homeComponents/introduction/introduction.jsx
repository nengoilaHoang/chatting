import React from 'react';
import { Link } from 'react-router-dom';
import './introduction.css';

const IntroductionPage = () => {
  return (
    <div className="c-introduction-container">
      
      {/* --- HERO SECTION: Lời chào thân thiện --- */}
      <section className="c-introduction-hero">
        <h1 className="c-introduction-title">
          <span className="c-introduction-highlight">SecureChat</span>
        </h1>
        <p className="c-introduction-subtitle">
          Nền tảng nhắn tin vui tươi, kết nối bạn bè, nhưng cực kỳ nghiêm túc về bảo mật. 
          <br />Dự án báo cáo môn học An Toàn Thông Tin.
        </p>
        <div className="c-introduction-actions">
            <Link to="/login" className="c-introduction-btn c-introduction-btn-primary">
                Bắt đầu ngay
            </Link>
            <a href="#security-features" className="c-introduction-btn c-introduction-btn-ghost">
                Tìm hiểu công nghệ
            </a>
        </div>
      </section>

      {/* --- SECURITY SECTION: Phần nội dung chính báo cáo --- */}
      <section id="security-features" className="c-introduction-features">
        <h2 className="c-introduction-heading">Lớp giáp bảo vệ (Defense Layer)</h2>
        <p className="c-introduction-desc">
          Chúng tôi áp dụng các tiêu chuẩn OWASP để đảm bảo dữ liệu của bạn an toàn tuyệt đối.
        </p>

        <div className="c-introduction-grid">
            
            {/* Card 1: SQL Injection */}
            <div className="c-introduction-card">
                <div className="c-introduction-icon">🛡️</div>
                <h3>Chống SQL Injection</h3>
                <p>
                    Sử dụng <strong>Knex.js (Query Builder)</strong> để tham số hóa truy vấn. Mọi dữ liệu đầu vào đều được validate chặt chẽ, ngăn chặn kẻ tấn công chèn mã độc vào Database.
                </p>
            </div>

            {/* Card 2: XSS */}
            <div className="c-introduction-card">
                <div className="c-introduction-icon">🧹</div>
                <h3>Chống XSS (Cross-Site Scripting)</h3>
                <p>
                    React tự động <strong>Escape</strong> các ký tự nguy hiểm khi hiển thị. Dữ liệu đầu vào được kiểm tra để đảm bảo không có script độc hại nào chạy trên trình duyệt của bạn.
                </p>
            </div>

            {/* Card 3: CSRF & CORS */}
            <div className="c-introduction-card">
                <div className="c-introduction-icon">🚧</div>
                <h3>Chống CSRF & CORS</h3>
                <p>
                    Thiết lập chính sách <strong>CORS</strong> nghiêm ngặt, chỉ cho phép Client tin cậy kết nối. Cơ chế Same-Origin Policy (SOP) giúp ngăn chặn giả mạo yêu cầu từ trang web lạ.
                </p>
            </div>

            {/* Card 4: JWT Auth */}
            <div className="c-introduction-card">
                <div className="c-introduction-icon">🆔</div>
                <h3>Xác thực JWT</h3>
                <p>
                    Sử dụng <strong>JSON Web Token</strong> để xác thực (Authentication) và phân quyền (Authorization). Token được ký bí mật, đảm bảo danh tính người dùng không bị giả mạo.
                </p>
            </div>

            {/* Card 5: Password Hashing */}
            <div className="c-introduction-card">
                <div className="c-introduction-icon">🔑</div>
                <h3>Mật khẩu Bcrypt</h3>
                <p>
                    Mật khẩu của bạn không bao giờ lưu dưới dạng văn bản thuần. Chúng tôi dùng thuật toán <strong>Bcrypt</strong> để băm mật khẩu với Salt, chống lại tấn công Rainbow Table.
                </p>
            </div>

            {/* Card 6: Encryption */}
            <div className="c-introduction-card">
                <div className="c-introduction-icon">🔐</div>
                <h3>Mã hóa AES</h3>
                <p>
                    Các thông tin nhạy cảm được mã hóa bằng thuật toán <strong>AES</strong> chuẩn quân đội trước khi lưu trữ hoặc truyền tải, đảm bảo tính bảo mật (Confidentiality).
                </p>
            </div>

        </div>
      </section>

      {/* --- FOOTER SECTION --- */}
      <footer className="c-introduction-footer">
        <p>Được phát triển với ❤️ và ☕ bởi Team ATTT.</p>
      </footer>
    </div>
  );
};

export default IntroductionPage;