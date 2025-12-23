import dotenv from 'dotenv';
import Database from './ultil/pgConnection.js';
import http from 'http';
import { Server } from 'socket.io';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
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

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);
});

// routes
app.get('/', (req, res) => {
  res.send('Server is running!');
});

// Chạy server
app.listen(PORT, () => {
  console.log(`Server đang chạy tại: http://localhost:${PORT}`);
});