import React, { useState } from 'react';
import Chatbox from '../../components/chatComponents/chatbox/chatbox.jsx';
import User from '../../components/chatComponents/user/user.jsx';
import './chatting.css';

const MOCK_CHATS = [
  { id: 1, name: "Team An Toàn Thông Tin", avatar: "https://ui-avatars.com/api/?name=Team+A&background=007AFF&color=fff", lastMessage: "Mọi người nộp báo cáo chưa?", unread: 5, time: "10:30" },
  { id: 2, name: "Crush 🥰", avatar: "https://i.pravatar.cc/150?img=5", lastMessage: "Tối nay rảnh không đi cafe?", unread: 1, time: "09:15" },
  { id: 3, name: "Hội code dạo", avatar: "https://ui-avatars.com/api/?name=Code+Dao&background=FF9500&color=fff", lastMessage: "Bug này lạ quá anh em ơi", unread: 0, time: "Hôm qua" },
  { id: 4, name: "Sếp Tùng", avatar: "https://i.pravatar.cc/150?img=11", lastMessage: "Deadline đẩy lên sớm nhé", unread: 0, time: "Hôm qua" },
  { id: 5, name: "Nhóm đi phượt", avatar: "https://i.pravatar.cc/150?img=60", lastMessage: "Chốt Đà Lạt nhé", unread: 2, time: "12/10" },
  { id: 6, name: "Bạn thân", avatar: "https://i.pravatar.cc/150?img=32", lastMessage: "Mày xem cái này chưa haha", unread: 0, time: "11/10" },
  { id: 7, name: "Gia đình", avatar: "https://ui-avatars.com/api/?name=Family&background=34C759&color=fff", lastMessage: "Về ăn cơm con ơi", unread: 0, time: "10/10" },
];
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
    const [tab, setTab] = useState('chat'); // 'chat' hoặc 'user'
    const [searchText, setSearchText] = useState('');
    const [selectedChat, setSelectedChat] = useState(null);
    const [messageInput, setMessageInput] = useState('');

    // Lọc dữ liệu theo Search Text
    const filteredChats = MOCK_CHATS.filter(c => c.name.toLowerCase().includes(searchText.toLowerCase()));
    const filteredUsers = MOCK_USERS.filter(u => u.displayName.toLowerCase().includes(searchText.toLowerCase()));

    return (
        <div className="p-chatting-container">
            
            {/* --- LEFT BAR: Sidebar --- */}
            <aside className="p-chatting-leftbar">
                
                {/* 1. Header Search & Tabs */}
                <div className="p-chatting-leftbar-header">
                    {/* Search Box */}
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

                    {/* Tabs Switcher */}
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

                {/* 2. List Content (Scrollable) */}
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


            {/* --- RIGHT BAR: Chat Window --- */}
            <main className="p-chatting-window">
                {selectedChat ? (
                    <>
                        {/* A. Chat Header */}
                        <header className="p-chatting-window-header">
                            <div className="p-chatting-window-info">
                                <img src={selectedChat.avatar} alt="" className="p-chatting-window-avatar" />
                                <div>
                                    <h3 className="p-chatting-window-name">{selectedChat.name}</h3>
                                    <span className="p-chatting-window-status">Đang hoạt động</span>
                                </div>
                            </div>
                        </header>

                        {/* B. Message List */}
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

                        {/* C. Input Area */}
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
                            <button className="p-chatting-send-btn">
                                ➤
                            </button>
                        </div>
                    </>
                ) : (
                    /* D. Empty State (Chưa chọn chat) */
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