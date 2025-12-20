import React from 'react';
import './chatbox.css';

const ChatBoxItem = ({ 
    avatar, 
    name, 
    lastMessage, 
    unreadCount, 
    isActive, 
    onClick 
}) => {
    return (
        <div 
            className={`c-chatbox-wrapper ${isActive ? 'c-chatbox-active' : ''}`} 
            onClick={onClick}
        >
            {/* Phần Avatar */}
            <div className="c-chatbox-avatar-area">
                <img 
                    src={avatar || "https://via.placeholder.com/150"} 
                    alt={name} 
                    className="c-chatbox-img" 
                />
                {/* Dấu chấm xanh online (Trang trí cho vui) */}
                <span className="c-chatbox-status-dot"></span>
            </div>

            {/* Phần Tên và Tin nhắn cuối */}
            <div className="c-chatbox-info">
                <h4 className="c-chatbox-name">{name}</h4>
                <p className="c-chatbox-preview">
                    {/* Cắt bớt nếu tin nhắn quá dài */}
                    {lastMessage?.length > 25 ? lastMessage.substring(0, 25) + '...' : lastMessage}
                </p>
            </div>

            {/* Phần Thông báo (Badge) */}
            <div className="c-chatbox-meta">
                {/* Thời gian giả lập, sau này truyền props vào */}
                <span className="c-chatbox-time">12:30</span>
                
                {unreadCount > 0 && (
                    <div className="c-chatbox-badge">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatBoxItem;