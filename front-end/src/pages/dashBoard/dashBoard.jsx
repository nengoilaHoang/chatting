import React from 'react';
import './dardBoard.css';

// --- MOCK DATA (Dữ liệu giả lập 7 ngày gần nhất) ---
const WEEKLY_DATA = [
    { day: "T2", users: 12, messages: 340 },
    { day: "T3", users: 19, messages: 450 },
    { day: "T4", users: 8, messages: 210 },
    { day: "T5", users: 24, messages: 560 },
    { day: "T6", users: 15, messages: 380 },
    { day: "T7", users: 30, messages: 620 },
    { day: "CN", users: 42, messages: 890 },
];

const RECENT_USERS = [
    { id: 1, name: "Nguyễn Văn A", email: "vana@gmail.com", joined: "2 phút trước", status: "Active" },
    { id: 2, name: "Trần Thị B", email: "thib@yahoo.com", joined: "15 phút trước", status: "Active" },
    { id: 3, name: "Lê C", email: "lec@outlook.com", joined: "1 giờ trước", status: "Inactive" },
    { id: 4, name: "Phạm D", email: "phamd@gmail.com", joined: "3 giờ trước", status: "Active" },
];

const AdminDashboardPage = () => {
    // Tính tổng để làm số liệu tổng quan
    const totalUsersWeek = WEEKLY_DATA.reduce((acc, cur) => acc + cur.users, 0);
    const totalMessagesWeek = WEEKLY_DATA.reduce((acc, cur) => acc + cur.messages, 0);

    // Tìm giá trị lớn nhất để tính chiều cao cột biểu đồ (%)
    const maxUsers = Math.max(...WEEKLY_DATA.map(d => d.users));
    const maxMessages = Math.max(...WEEKLY_DATA.map(d => d.messages));

    return (
        <div className="p-dashboard-container">
            
            {/* 1. Header Section */}
            <header className="p-dashboard-header">
                <div>
                    <h1 className="p-dashboard-title">Tổng quan hệ thống</h1>
                    <p className="p-dashboard-subtitle">Báo cáo hoạt động tuần này (20/11 - 27/11)</p>
                </div>
                <button className="p-dashboard-btn-export">
                    Xuất báo cáo ⬇
                </button>
            </header>

            {/* 2. KPI Cards Section */}
            <div className="p-dashboard-stats-grid">
                {/* Card User */}
                <div className="p-dashboard-card">
                    <div className="p-dashboard-card-header">
                        <span className="p-dashboard-icon-box blue">👥</span>
                        <span className="p-dashboard-trend positive">↗ +12%</span>
                    </div>
                    <div className="p-dashboard-card-body">
                        <h3>{totalUsersWeek}</h3>
                        <p>Người dùng mới</p>
                    </div>
                </div>

                {/* Card Messages */}
                <div className="p-dashboard-card">
                    <div className="p-dashboard-card-header">
                        <span className="p-dashboard-icon-box green">💬</span>
                        <span className="p-dashboard-trend positive">↗ +5.4%</span>
                    </div>
                    <div className="p-dashboard-card-body">
                        <h3>{totalMessagesWeek.toLocaleString()}</h3>
                        <p>Tin nhắn mới</p>
                    </div>
                </div>

                {/* Card Server (Thêm vào cho layout cân đối 3 cột) */}
                <div className="p-dashboard-card">
                    <div className="p-dashboard-card-header">
                        <span className="p-dashboard-icon-box purple">⚡</span>
                        <span className="p-dashboard-trend stable">~ Ổn định</span>
                    </div>
                    <div className="p-dashboard-card-body">
                        <h3>99.9%</h3>
                        <p>Uptime Server</p>
                    </div>
                </div>
            </div>

            {/* 3. Charts Section (CSS Pure Chart) */}
            <div className="p-dashboard-charts-wrapper">
                {/* Biểu đồ User */}
                <div className="p-dashboard-chart-card">
                    <h4>Biểu đồ tăng trưởng người dùng</h4>
                    <div className="p-dashboard-bar-chart">
                        {WEEKLY_DATA.map((item, index) => (
                            <div key={index} className="p-dashboard-bar-group">
                                {/* Tooltip hiển thị số liệu khi hover */}
                                <div className="p-dashboard-bar-tooltip">{item.users} user</div>
                                <div 
                                    className="p-dashboard-bar blue-bar" 
                                    style={{ height: `${(item.users / maxUsers) * 100}%` }}
                                ></div>
                                <span className="p-dashboard-bar-label">{item.day}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Biểu đồ Message */}
                <div className="p-dashboard-chart-card">
                    <h4>Mật độ tin nhắn</h4>
                    <div className="p-dashboard-bar-chart">
                        {WEEKLY_DATA.map((item, index) => (
                            <div key={index} className="p-dashboard-bar-group">
                                <div className="p-dashboard-bar-tooltip">{item.messages} msg</div>
                                <div 
                                    className="p-dashboard-bar green-bar" 
                                    style={{ height: `${(item.messages / maxMessages) * 100}%` }}
                                ></div>
                                <span className="p-dashboard-bar-label">{item.day}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* 4. Recent Users Table */}
            <div className="p-dashboard-table-card">
                <h4>Thành viên mới tham gia</h4>
                <div className="p-dashboard-table-responsive">
                    <table className="p-dashboard-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Họ tên</th>
                                <th>Email</th>
                                <th>Thời gian</th>
                                <th>Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody>
                            {RECENT_USERS.map(user => (
                                <tr key={user.id}>
                                    <td>#{user.id}</td>
                                    <td className="fw-bold">{user.name}</td>
                                    <td>{user.email}</td>
                                    <td className="text-muted">{user.joined}</td>
                                    <td>
                                        <span className={`p-dashboard-badge ${user.status.toLowerCase()}`}>
                                            {user.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
};

export default AdminDashboardPage;