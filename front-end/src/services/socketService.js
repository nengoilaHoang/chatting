import io from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

class SocketService {
  constructor() {
    this.socket = null;
    this.pendingListeners = [];
    this.currentToken = null;
  }

  connect(token) {
    if (!token) {
      console.warn('Missing token. Cannot establish socket connection.');
      return null;
    }

    if (this.socket) {
      if (this.currentToken === token) {
        return this.socket;
      }
      this.disconnect();
    }

    this.currentToken = token;
    this.socket = io(SOCKET_URL, {
      auth: { token },
      withCredentials: true,
      autoConnect: true,
    });

    this.socket.on('connect', () => {
      console.log('✅ Đã kết nối Socket với ID:', this.socket.id);
    });

    this.socket.on('connect_error', (err) => {
      console.error('❌ Lỗi kết nối Socket:', err.message);
    });

    this.pendingListeners.forEach(({ event, handler }) => {
      this.socket.on(event, handler);
    });

    return this.socket;
  }

  on(event, handler) {
    if (!event || typeof handler !== 'function') {
      return;
    }

    const listener = { event, handler };
    const exists = this.pendingListeners.some(
      (item) => item.event === event && item.handler === handler,
    );
    if (!exists) {
      this.pendingListeners.push(listener);
    }

    if (this.socket) {
      this.socket.on(event, handler);
    }
  }

  off(event, handler) {
    if (!event || typeof handler !== 'function') {
      return;
    }

    this.pendingListeners = this.pendingListeners.filter(
      (item) => item.event !== event || item.handler !== handler,
    );

    if (this.socket) {
      this.socket.off(event, handler);
    }
  }

  joinChat(chatBoxId) {
    if (this.socket && chatBoxId) {
      this.socket.emit('join_chat', chatBoxId);
    }
  }

  leaveChat(chatBoxId) {
    if (this.socket && chatBoxId) {
      this.socket.emit('leave_chat', chatBoxId);
    }
  }

  sendMessage(data) {
    if (this.socket) {
      this.socket.emit('send_message', data);
    }
  }

  isConnected() {
    return Boolean(this.socket && this.socket.connected);
  }

  disconnect() {
    if (this.socket) {
      this.socket.removeAllListeners();
      this.socket.disconnect();
      this.socket = null;
      console.log('🔌 Đã ngắt kết nối Socket');
    }
    this.currentToken = null;
  }
}

export default new SocketService();