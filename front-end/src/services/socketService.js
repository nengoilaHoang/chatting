import io from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
  }
  // Sửa hàm connect để nhận Token
  connect(token) {
    // Nếu đã có kết nối rồi thì không tạo lại
    if (this.socket) return;
    // Lúc này mới thực sự kết nối
    this.socket = io(import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000', {
      auth: {
        token: token 
      },
      // Tắt chế độ tự động kết nối nếu cần thiết (thường mặc định là true)
      autoConnect: true 
    });
    this.socket.on('connect', () => {
      console.log('✅ Đã kết nối Socket với ID:', this.socket.id);
    });
    this.socket.on('connect_error', (err) => {
      console.error('❌ Lỗi kết nối Socket:', err.message);
    });
  }
  // Các hàm khác giữ nguyên
  joinRoom(chatBoxId) {
    if (this.socket) this.socket.emit('join_room', chatBoxId);
  }
  sendMessage(data) {
    if (this.socket) this.socket.emit('send_message', data);
  }
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      console.log('🔌 Đã ngắt kết nối Socket');
    }
  }
}
export default new SocketService();