const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
require('dotenv').config();

const db = require('./config/db');

// Import Match Routes
const matchRoutes = require('./routes/matchRoutes');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

app.use(cors());
app.use(express.json());

// Daftarkan API routes & passing Socket.io
app.use('/api/matches', matchRoutes(io));

io.on('connection', (socket) => {
  console.log(`[Socket] Client connected: ${socket.id}`);

  socket.on('disconnect', () => {
    console.log(`[Socket] Client disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, async () => {
  try {
    await db.query('SELECT 1');
    console.log(`[Server] Running on http://localhost:${PORT}`);
    console.log('[Database] Connected successfully to MySQL');
  } catch (err) {
    console.error('[Database] Connection failed:', err.message);
  }
});