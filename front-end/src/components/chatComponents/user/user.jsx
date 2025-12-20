import React from 'react';
import './user.css';

const UserItem = ({ avatar, displayName, onClick, isOnline }) => {
    return (
        <div className="c-user-wrapper" onClick={onClick}>
            {/* Avatar */}
            <div className="c-user-avatar-box">
                <img 
                    src={avatar || "https://via.placeholder.com/150"} 
                    alt={displayName} 
                    className="c-user-img" 
                />
            </div>

            {/* Tên hiển thị */}
            <div className="c-user-info">
                <h4 className="c-user-name">{displayName}</h4>
                {/* Trạng thái text */}
                <span className={`c-user-status ${isOnline ? 'online' : ''}`}>
                    {isOnline ? 'Đang hoạt động' : 'Ngoại tuyến'}
                </span>
            </div>

            {/* Nút hành động nhỏ (Ví dụ: Thêm bạn / Nhắn tin) */}
            <div className="c-user-action">
                <button className="c-user-btn-icon">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default UserItem;