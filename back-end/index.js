const http = require('http');
const express = require('express');
const cors = require('cors');
require('dotenv').config(); // Load biến môi trường

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Route test
app.get('/', (req, res) => {
  res.send('Server is running!');
});

// Chạy server
app.listen(PORT, () => {
  console.log(`Server đang chạy tại: http://localhost:${PORT}`);
});