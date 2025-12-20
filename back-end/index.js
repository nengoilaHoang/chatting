import dotenv from 'dotenv';
import Database from './ultil/pgConnection.js';
import http from 'http';
import { Server } from 'socket.io';
import express from 'express';
import cors from 'cors';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const pgConnection = new Database();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json());

//routes import here
import accountRoute from './routes/account.route.js';
const accountRouter = new accountRoute().router;
app.use('/api/accounts', accountRouter);

// Khởi tạo Socket.io
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5137",
    methods: ['GET', 'POST']
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