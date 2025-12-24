import dotenv from 'dotenv';
import Database from './ultil/pgConnection.js';
import http from 'http';
import { Server } from 'socket.io';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import jwt from 'jsonwebtoken';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const pgConnection = new Database();
const server = http.createServer(app);

const allowedOrigins = (process.env.CLIENT_URLS || 'http://localhost:5137,http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, origin);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}));
app.use(express.json());
app.use(cookieParser());

//routes import here
import accountRoute from './routes/account.route.js';
import adminAccountRoute from './routes/adminAccount.route.js';
import chatBoxRoute from './routes/chatBox.route.js';
import messageRoute from './routes/message.route.js';
const accountRouter = new accountRoute().router;
const adminAccountRouter = new adminAccountRoute().router;
const chatBoxRouter = new chatBoxRoute().router;
const messageRouter = new messageRoute().router;

app.use('/api/accounts', accountRouter);
app.use('/api/admins', adminAccountRouter);
app.use('/api/chatboxes', chatBoxRouter);
app.use('/api/messages', messageRouter);

// Khởi tạo Socket.io
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true,
  }
});
app.set('io', io);

io.use((socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) {
    return next(new Error('Authentication error'));
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.data.user = decoded;
    return next();
  } catch (error) {
    return next(new Error('Authentication error'));
  }
});

io.on('connection', (socket) => {
  const userId = socket.data.user?.id;
  if (userId) {
    socket.join(`user:${userId}`);
  }

  socket.on('join_chat', (chatBoxId) => {
    if (chatBoxId) {
      socket.join(`chat:${chatBoxId}`);
    }
  });

  socket.on('leave_chat', (chatBoxId) => {
    if (chatBoxId) {
      socket.leave(`chat:${chatBoxId}`);
    }
  });

  socket.on('disconnect', () => {
    // Optional: track disconnects
  });
});

// routes
app.get('/', (req, res) => {
  res.send('Server is running!');
});

// Chạy server
server.listen(PORT, () => {
  console.log(`Server đang chạy tại: http://localhost:${PORT}`);
});