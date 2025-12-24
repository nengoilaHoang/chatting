import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Chatbox from '../../components/chatComponents/chatbox/chatbox.jsx';
import User from '../../components/chatComponents/user/user.jsx';
import './chatting.css';
import { accountService } from '../../services/accountService';
import { chatBoxService } from '../../services/chatBoxService';
import { messageService } from '../../services/messageService';

const MIN_SEARCH_LENGTH = 2;
const SEARCH_DELAY = 500;

const buildAvatarFromName = (name) => `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'SecureChat')}&background=007AFF&color=fff`;

const getStoredProfile = () => {
    if (typeof window === 'undefined') {
        return null;
    }
    try {
        const raw = localStorage.getItem('userProfile');
        return raw ? JSON.parse(raw) : null;
    } catch (error) {
        return null;
    }
};

class ChatBoxModel {
    constructor(data = {}) {
        this.id = data.id;
        this.name = data.name ?? data.partnerDisplayName ?? data.partnerEmail ?? 'Cuộc trò chuyện';
        this.type = data.type ?? 'private';
        this.avatar = data.avatar ?? data.partnerAvatar ?? buildAvatarFromName(this.name);
        this.lastMessage = data.lastMessage ?? '';
        this.unread = data.unread ?? 0;
        this.partnerId = data.partnerId ?? null;
        this.partnerDisplayName = data.partnerDisplayName ?? null;
        this.partnerEmail = data.partnerEmail ?? null;
        this.updatedAt = data.updatedAt ?? '';
        this.createdAt = data.createdAt ?? '';
    }
}

const ChatPage = () => {
    const navigate = useNavigate();
    const [currentUser] = useState(() => getStoredProfile());
    const [tab, setTab] = useState('chat');
    const [searchText, setSearchText] = useState('');
    const [chatBoxes, setChatBoxes] = useState([]);
    const [chatError, setChatError] = useState('');
    const [isLoadingChats, setIsLoadingChats] = useState(false);
    const [selectedChat, setSelectedChat] = useState(null);
    const [messagesByChatId, setMessagesByChatId] = useState({});
    const [isMessagesLoading, setIsMessagesLoading] = useState(false);
    const [messagesError, setMessagesError] = useState('');
    const [messageInput, setMessageInput] = useState('');
    const [isSendingMessage, setIsSendingMessage] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [searchError, setSearchError] = useState('');
    const [isStartingChat, setIsStartingChat] = useState(false);
    const searchTimeoutRef = useRef(null);

    useEffect(() => {
        if (!currentUser?.id) {
            navigate('/login');
        }
    }, [currentUser, navigate]);

    useEffect(() => {
        if (!currentUser?.id) {
            setChatBoxes([]);
            return;
        }
        let isMounted = true;
        setIsLoadingChats(true);
        setChatError('');
        chatBoxService.getAll(currentUser.id)
            .then((data) => {
                if (!isMounted) return;
                const mapped = (data?.chatBoxes ?? []).map((chat) => new ChatBoxModel(chat));
                setChatBoxes(mapped);
            })
            .catch((error) => {
                if (!isMounted) return;
                setChatError(error.message ?? 'Không thể tải danh sách chat');
            })
            .finally(() => {
                if (isMounted) {
                    setIsLoadingChats(false);
                }
            });

        return () => {
            isMounted = false;
        };
    }, [currentUser?.id]);

    useEffect(() => {
        if (!selectedChat && chatBoxes.length > 0) {
            setSelectedChat(chatBoxes[0]);
        }
    }, [chatBoxes, selectedChat]);

    useEffect(() => {
        if (tab !== 'user') {
            setIsSearching(false);
            setSearchResults([]);
            setSearchError('');
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
                searchTimeoutRef.current = null;
            }
            return;
        }

        const trimmed = searchText.trim();
        if (trimmed.length < MIN_SEARCH_LENGTH) {
            setIsSearching(false);
            setSearchResults([]);
            setSearchError('');
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
                searchTimeoutRef.current = null;
            }
            return;
        }

        setIsSearching(true);
        setSearchError('');
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        const timeoutId = setTimeout(() => {
            accountService.searchAccounts(trimmed, currentUser?.id)
                .then((data) => {
                    setSearchResults(data?.accounts ?? []);
                })
                .catch((error) => {
                    setSearchError(error.message ?? 'Không thể tìm kiếm người dùng');
                })
                .finally(() => {
                    setIsSearching(false);
                });
        }, SEARCH_DELAY);

        searchTimeoutRef.current = timeoutId;

        return () => {
            clearTimeout(timeoutId);
            if (searchTimeoutRef.current === timeoutId) {
                searchTimeoutRef.current = null;
            }
        };
    }, [searchText, tab, currentUser?.id]);

    const ensureChatModel = (chat) => {
        if (!chat) return null;
        return chat instanceof ChatBoxModel ? chat : new ChatBoxModel(chat);
    };

    const upsertChatBox = (chat) => {
        const normalized = ensureChatModel(chat);
        if (!normalized?.id) {
            return null;
        }
        setChatBoxes((prev) => {
            const filtered = prev.filter((item) => item.id !== normalized.id);
            return [normalized, ...filtered];
        });
        return normalized;
    };

    const fetchMessages = useCallback(async (chatBoxId) => {
        if (!chatBoxId) {
            return;
        }
        setIsMessagesLoading(true);
        setMessagesError('');
        try {
            const data = await messageService.getByChatBox(chatBoxId, { limit: 50 });
            const normalizedMessages = (data?.messages ?? []).map((msg) => ({
                id: msg.id,
                chatBoxId: msg.chatBoxId,
                senderId: msg.senderId,
                content: msg.content,
                createdAt: msg.createdAt,
            }));
            setMessagesByChatId((prev) => ({
                ...prev,
                [chatBoxId]: normalizedMessages,
            }));
        } catch (error) {
            setMessagesError(error.message ?? 'Không thể tải tin nhắn');
        } finally {
            setIsMessagesLoading(false);
        }
    }, []);

    useEffect(() => {
        if (selectedChat?.id && !messagesByChatId[selectedChat.id]) {
            fetchMessages(selectedChat.id);
        }
    }, [selectedChat?.id, messagesByChatId, fetchMessages]);

    const filteredChats = useMemo(() => {
        if (tab !== 'chat') {
            return chatBoxes;
        }
        const keyword = searchText.trim().toLowerCase();
        if (!keyword) {
            return chatBoxes;
        }
        return chatBoxes.filter((chat) => (chat.name || '').toLowerCase().includes(keyword));
    }, [chatBoxes, tab, searchText]);

    const currentMessages = selectedChat?.id ? (messagesByChatId[selectedChat.id] ?? []) : [];

    const handleSelectChat = (chat) => {
        const normalized = ensureChatModel(chat);
        setSelectedChat(normalized);
        if (normalized?.id && !messagesByChatId[normalized.id]) {
            fetchMessages(normalized.id);
        }
    };

    const handleUserSelect = async (user) => {
        if (!currentUser?.id || !user?.id) {
            return;
        }
        setIsStartingChat(true);
        setSearchError('');
        try {
            const data = await chatBoxService.startDirectChat(currentUser.id, user.id);
            const normalizedChat = upsertChatBox(data?.chatBox ?? {
                id: data?.chatBoxId,
                type: 'private',
                partnerId: user.id,
                partnerDisplayName: user.displayName,
                partnerEmail: user.email,
                partnerAvatar: user.avatar,
            });
            if (normalizedChat) {
                setSelectedChat(normalizedChat);
                if (!messagesByChatId[normalizedChat.id]) {
                    await fetchMessages(normalizedChat.id);
                }
            }
            setTab('chat');
            setSearchResults([]);
            setSearchText('');
        } catch (error) {
            setSearchError(error.message ?? 'Không thể mở cuộc trò chuyện');
        } finally {
            setIsStartingChat(false);
        }
    };

    const handleSendMessage = async () => {
        const trimmed = messageInput.trim();
        if (!trimmed || !selectedChat?.id || !currentUser?.id) {
            return;
        }

        setIsSendingMessage(true);
        setMessagesError('');
        try {
            const payload = {
                chatBoxId: selectedChat.id,
                senderId: currentUser.id,
                content: trimmed,
            };
            if (selectedChat.type === 'private' && selectedChat.partnerId) {
                payload.receiverId = selectedChat.partnerId;
            }

            const data = await messageService.sendMessage(payload);
            let targetChat = selectedChat;
            if (data?.chatBox) {
                const normalized = upsertChatBox(data.chatBox);
                if (normalized) {
                    targetChat = normalized;
                    setSelectedChat(normalized);
                }
            } else {
                const updated = upsertChatBox({ ...selectedChat, updatedAt: data?.message?.createdAt });
                if (updated) {
                    targetChat = updated;
                    setSelectedChat(updated);
                }
            }

            const newMessage = data?.message ?? {
                id: Date.now(),
                chatBoxId: targetChat.id,
                senderId: currentUser.id,
                content: trimmed,
                createdAt: new Date().toISOString(),
            };
            setMessagesByChatId((prev) => {
                const existing = prev[targetChat.id] ?? [];
                return {
                    ...prev,
                    [targetChat.id]: [...existing, newMessage],
                };
            });
            setMessageInput('');
        } catch (error) {
            setMessagesError(error.message ?? 'Không thể gửi tin nhắn');
        } finally {
            setIsSendingMessage(false);
        }
    };

    const renderChatList = () => {
        if (isLoadingChats) {
            return <p className="p-chatting-list-title">Đang tải hội thoại...</p>;
        }
        if (chatError) {
            return <p className="p-chatting-list-title">{chatError}</p>;
        }
        if (filteredChats.length === 0) {
            return <p className="p-chatting-list-title">Chưa có cuộc trò chuyện nào</p>;
        }
        return filteredChats.map((chat) => (
            <Chatbox
                key={chat.id}
                {...chat}
                lastMessage={chat.lastMessage || 'Bắt đầu trò chuyện'}
                unreadCount={chat.unread}
                updatedAt={chat.updatedAt}
                isActive={selectedChat?.id === chat.id}
                onClick={() => handleSelectChat(chat)}
            />
        ));
    };

    const renderUserSearch = () => {
        if (isSearching) {
            return <p className="p-chatting-list-title">Đang tìm kiếm...</p>;
        }
        if (searchError) {
            return <p className="p-chatting-list-title">{searchError}</p>;
        }
        if (searchText.trim().length < MIN_SEARCH_LENGTH) {
            return <p className="p-chatting-list-title">Nhập tối thiểu {MIN_SEARCH_LENGTH} ký tự để tìm kiếm</p>;
        }
        if (searchResults.length === 0) {
            return <p className="p-chatting-list-title">Không tìm thấy người dùng phù hợp</p>;
        }
        return searchResults.map((user) => (
            <User
                key={user.id}
                avatar={user.avatar}
                displayName={user.displayName || user.email}
                subtitle={user.email}
                isOnline={false}
                onClick={() => handleUserSelect(user)}
            />
        ));
    };

    const handleMessageInputKeyDown = (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <div className="p-chatting-container">
            <aside className="p-chatting-leftbar">
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
                            disabled={isStartingChat}
                        >
                            Mọi người
                        </button>
                    </div>
                </div>

                <div className="p-chatting-leftbar-content custom-scroll">
                    <div className="p-chatting-list-group">
                        {tab === 'chat' ? renderChatList() : renderUserSearch()}
                    </div>
                </div>
            </aside>

            <main className="p-chatting-window">
                {selectedChat ? (
                    <>
                        <header className="p-chatting-window-header">
                            <div className="p-chatting-window-info">
                                <img src={selectedChat.avatar} alt="avatar" className="p-chatting-window-avatar" />
                                <div>
                                    <h3 className="p-chatting-window-name">{selectedChat.name}</h3>
                                    <span className="p-chatting-window-status">
                                        {selectedChat.type === 'group' ? 'Nhóm trò chuyện' : 'Trò chuyện riêng tư'}
                                    </span>
                                </div>
                            </div>
                        </header>

                        <div className="p-chatting-window-messages custom-scroll">
                            {isMessagesLoading && (
                                <p className="p-chatting-list-title">Đang tải tin nhắn...</p>
                            )}
                            {messagesError && (
                                <p className="p-chatting-list-title">{messagesError}</p>
                            )}
                            {currentMessages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`p-chatting-message-row ${msg.senderId === currentUser?.id ? 'p-chatting-row-me' : 'p-chatting-row-other'}`}
                                >
                                    {msg.senderId !== currentUser?.id && (
                                        <img src={selectedChat.avatar} alt="avatar" className="p-chatting-msg-avatar" />
                                    )}
                                    <div className="p-chatting-message-bubble">
                                        <p>{msg.content}</p>
                                        <span className="p-chatting-message-time">{msg.createdAt}</span>
                                    </div>
                                </div>
                            ))}
                            {!isMessagesLoading && currentMessages.length === 0 && (
                                <p className="p-chatting-list-title">Hãy bắt đầu cuộc trò chuyện đầu tiên</p>
                            )}
                        </div>

                        <div className="p-chatting-input-area">
                            <button className="p-chatting-attach-btn" disabled>
                                📎
                            </button>
                            <input
                                type="text"
                                className="p-chatting-input"
                                placeholder="Nhập tin nhắn..."
                                value={messageInput}
                                onChange={(e) => setMessageInput(e.target.value)}
                                onKeyDown={handleMessageInputKeyDown}
                                disabled={isSendingMessage}
                            />
                            <button
                                className="p-chatting-send-btn"
                                onClick={handleSendMessage}
                                disabled={isSendingMessage || !messageInput.trim()}
                            >
                                {isSendingMessage ? '...' : '➤'}
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="p-chatting-empty-state">
                        <div className="p-chatting-empty-img">🚀</div>
                        <h2>Chào mừng đến với SecureChat</h2>
                        <p>Chọn hoặc tìm kiếm một người để bắt đầu trò chuyện.</p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default ChatPage;