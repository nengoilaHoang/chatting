import React, { useState, useEffect, useRef } from 'react';
import Chatbox from '../../components/chatComponents/chatbox/chatbox.jsx';
import User from '../../components/chatComponents/user/user.jsx';
import './chatting.css';

// --- 1. MODEL DEFINITION ---
class ChatBoxModel {
    constructor({ id, name, type, avatar, lastMessage, unread, createdAt, updatedAt }) {
        this.id = id;
        this.name = name;
        this.type = type; // 'group' | 'private'
        this.avatar = avatar;
        this.lastMessage = lastMessage;
        this.unread = unread;
        this.createdAt = new Date(createdAt).toLocaleDateString();
        this.updatedAt = new Date(updatedAt).toLocaleDateString();
    }
}

// --- 2. UPDATED MOCK DATA ---
const RAW_CHATS = [
    { id: 1, name: "Team An Toàn Thông Tin", type: "group", avatar: "https://ui-avatars.com/api/?name=Team+A&background=007AFF&color=fff", lastMessage: "Mọi người nộp báo cáo chưa?", unread: 5, createdAt: "2023-01-01", updatedAt: "2023-10-24" },
    { id: 2, name: "Crush 🥰", type: "private", avatar: "https://i.pravatar.cc/150?img=5", lastMessage: "Tối nay rảnh không đi cafe?", unread: 1, createdAt: "2023-05-12", updatedAt: "2023-10-24" },
    { id: 3, name: "Hội code dạo", type: "group", avatar: "https://ui-avatars.com/api/?name=Code+Dao&background=FF9500&color=fff", lastMessage: "Bug này lạ quá anh em ơi", unread: 0, createdAt: "2023-03-10", updatedAt: "2023-10-23" },
    { id: 4, name: "Sếp Tùng", type: "private", avatar: "https://i.pravatar.cc/150?img=11", lastMessage: "Deadline đẩy lên sớm nhé", unread: 0, createdAt: "2023-08-20", updatedAt: "2023-10-23" },
    { id: 5, name: "Nhóm đi phượt", type: "group", avatar: "https://i.pravatar.cc/150?img=60", lastMessage: "Chốt Đà Lạt nhé", unread: 2, createdAt: "2023-09-01", updatedAt: "2023-10-22" },
    { id: 6, name: "Nhóm đi phượt", type: "group", avatar: "https://i.pravatar.cc/150?img=60", lastMessage: "Chốt Đà Lạt nhé", unread: 2, createdAt: "2023-09-01", updatedAt: "2023-10-22" },
    { id: 7, name: "Nhóm đi phượt", type: "group", avatar: "https://i.pravatar.cc/150?img=60", lastMessage: "Chốt Đà Lạt nhé", unread: 2, createdAt: "2023-09-01", updatedAt: "2023-10-22" },
    { id: 8, name: "Nhóm đi phượt", type: "group", avatar: "https://i.pravatar.cc/150?img=60", lastMessage: "Chốt Đà Lạt nhé", unread: 2, createdAt: "2023-09-01", updatedAt: "2023-10-22" },
    { id: 9, name: "Nhóm đi phượt", type: "group", avatar: "https://i.pravatar.cc/150?img=60", lastMessage: "Chốt Đà Lạt nhé", unread: 2, createdAt: "2023-09-01", updatedAt: "2023-10-22" },
];

const MOCK_CHATS = RAW_CHATS.map(data => new ChatBoxModel(data));

const MOCK_USERS = [
    { id: 101, displayName: "Nguyễn Văn A", avatar: "https://i.pravatar.cc/150?img=12", isOnline: true },
    { id: 102, displayName: "Trần Thị B", avatar: "https://i.pravatar.cc/150?img=9", isOnline: true },
    { id: 103, displayName: "Lê Văn C", avatar: "https://i.pravatar.cc/150?img=3", isOnline: false },
    { id: 104, displayName: "Hacker Mũ Trắng", avatar: "https://i.pravatar.cc/150?img=68", isOnline: true },
];

const MOCK_MESSAGES = [
    { id: 1, senderId: 'me', content: "Alo, nghe rõ không bạn ơi?", time: "10:00", type: "text" },
    { id: 2, senderId: 'other', content: "Nghe rõ nha, web xịn thế!", time: "10:01", type: "text" },
    { id: 3, senderId: 'other', content: "Giao diện này nhìn Playful thực sự lun á 😍", time: "10:02", type: "text" },
    { id: 4, senderId: 'me', content: "Hehe, đang làm đồ án ATTT mà lị.", time: "10:03", type: "text" },
    { id: 5, senderId: 'me', content: "Có mã hóa End-to-End các kiểu đà điểu.", time: "10:03", type: "text" },
];

const ChatPage = () => {
    const [tab, setTab] = useState('chat');
    const [searchText, setSearchText] = useState('');
    const [selectedChat, setSelectedChat] = useState(null);
    const [messageInput, setMessageInput] = useState('');
    
    // State cho Dropdown Setting
    const [showGroupSettings, setShowGroupSettings] = useState(false);
    const dropdownRef = useRef(null);

    // Xử lý click outside để đóng dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowGroupSettings(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Reset dropdown khi đổi chat
    useEffect(() => {
        setShowGroupSettings(false);
    }, [selectedChat]);

    const filteredChats = MOCK_CHATS.filter(c => c.name.toLowerCase().includes(searchText.toLowerCase()));
    const filteredUsers = MOCK_USERS.filter(u => u.displayName.toLowerCase().includes(searchText.toLowerCase()));

    const handleSettingClick = () => {
        if (selectedChat?.type === 'group') {
            setShowGroupSettings(!showGroupSettings);
        } else {
            alert("Thông tin cá nhân: " + selectedChat.name);
        }
    };

    return (
        <div className="p-chatting-container">
            
            {/* --- LEFT BAR --- */}
            <aside className="p-chatting-leftbar">
                {/* Header Search & Tabs */}
                <div className="p-chatting-leftbar-header">
                    <div className="p-chatting-search-wrapper">
                        <span className="p-chatting-search-icon">🔍</span>
                        <input 
                            type="text" 
                            className="p-chatting-search-input" 
                            placeholder="Tìm kiếm..." 
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                        />
                    </div>

                    <div className="p-chatting-tabs-wrapper">
                        <button 
                            className={`p-chatting-tab-btn ${tab === 'chat' ? 'active' : ''}`}
                            onClick={() => setTab('chat')}
                        >
                            Tin nhắn
                        </button>
                        <button 
                            className={`p-chatting-tab-btn ${tab === 'user' ? 'active' : ''}`}
                            onClick={() => setTab('user')}
                        >
                            Mọi người
                        </button>
                    </div>
                </div>

                {/* List Content */}
                <div className="p-chatting-leftbar-content custom-scroll">
                    {tab === 'chat' ? (
                        <div className="p-chatting-list-group">
                            {filteredChats.map(chat => (
                                <Chatbox
                                    key={chat.id}
                                    {...chat} 
                                    lastMessage={chat.lastMessage}
                                    unreadCount={chat.unread}
                                    isActive={selectedChat?.id === chat.id}
                                    onClick={() => setSelectedChat(chat)}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="p-chatting-list-group">
                            <h5 className="p-chatting-list-title">Kết quả tìm kiếm</h5>
                            {filteredUsers.map(user => (
                                <User 
                                    key={user.id}
                                    {...user}
                                    onClick={() => alert(`Đã chọn user: ${user.displayName}`)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </aside>


            {/* --- RIGHT BAR --- */}
            <main className="p-chatting-window">
                {selectedChat ? (
                    <>
                        {/* Chat Header */}
                        <header className="p-chatting-window-header">
                            <div className="p-chatting-window-info">
                                <img src={selectedChat.avatar} alt="" className="p-chatting-window-avatar" />
                                <div>
                                    <h3 className="p-chatting-window-name">{selectedChat.name}</h3>
                                    <span className="p-chatting-window-status">
                                        {selectedChat.type === 'group' ? 'Nhóm trò chuyện' : 'Đang hoạt động'}
                                    </span>
                                </div>
                            </div>

                            <div className="p-chatting-window-actions" ref={dropdownRef}>
                                <button className="p-chatting-icon-btn">📞</button>
                                <button className="p-chatting-icon-btn">📹</button>
                                
                                {/* Nút Info / Setting */}
                                <button 
                                    className="p-chatting-icon-btn" 
                                    onClick={handleSettingClick}
                                >
                                    ℹ️
                                </button>

                                {/* DROPDOWN MENU CHO GROUP */}
                                {showGroupSettings && selectedChat.type === 'group' && (
                                    <div className="p-chatting-dropdown">
                                        <div className="p-chatting-dropdown-item">
                                            ✏️ Đổi tên nhóm
                                        </div>
                                        <div className="p-chatting-dropdown-item">
                                            🖼️ Đổi ảnh nhóm
                                        </div>
                                        <div className="p-chatting-dropdown-item">
                                            👥 Xem thành viên
                                        </div>
                                        <div className="p-chatting-dropdown-item">
                                            ➕ Thêm thành viên
                                        </div>
                                        <div className="p-chatting-dropdown-item danger">
                                            🚪 Rời nhóm
                                        </div>
                                    </div>
                                )}
                            </div>
                        </header>

                        {/* Message List */}
                        <div className="p-chatting-window-messages custom-scroll">
                            {MOCK_MESSAGES.map((msg) => (
                                <div 
                                    key={msg.id} 
                                    className={`p-chatting-message-row ${msg.senderId === 'me' ? 'p-chatting-row-me' : 'p-chatting-row-other'}`}
                                >
                                    {msg.senderId !== 'me' && (
                                        <img src={selectedChat.avatar} alt="avatar" className="p-chatting-msg-avatar" />
                                    )}
                                    
                                    <div className="p-chatting-message-bubble">
                                        <p>{msg.content}</p>
                                        <span className="p-chatting-message-time">{msg.time}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Input Area */}
                        <div className="p-chatting-input-area">
                            <button className="p-chatting-attach-btn">📎</button>
                            <input 
                                type="text" 
                                className="p-chatting-input" 
                                placeholder="Nhập tin nhắn..." 
                                value={messageInput}
                                onChange={(e) => setMessageInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && alert("Gửi: " + messageInput)}
                            />
                            <button className="p-chatting-send-btn">➤</button>
                        </div>
                    </>
                ) : (
                    /* Empty State */
                    <div className="p-chatting-empty-state">
                        <div className="p-chatting-empty-img">🚀</div>
                        <h2>Chào mừng đến với SecureChat</h2>
                        <p>Chọn một cuộc trò chuyện để bắt đầu kết nối an toàn.</p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default ChatPage;