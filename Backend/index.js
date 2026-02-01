require('dotenv').config(); // 1. Always load config FIRST
const express = require('express');
const http = require('http'); // <--- Missing Import
const { Server } = require('socket.io'); // <--- Missing Import
const cors = require('cors'); // <--- Recommended for API
const connectDB = require('./configs/dbConnection');
const errHandler = require('./middlewares/errorHandler'); // Check spelling: 'errorHandler', not 'erroHandler'
const socketSetup = require('./sockets/gameManager');
const userRoutes = require('./routes/user');

// Initialize App
const app = express();
const server = http.createServer(app); // Wrap Express in HTTP server
const PORT = process.env.PORT || 5000;

// Connect to DB
connectDB();

// Middleware
app.use(cors()); // <--- Allow React to talk to API
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Socket.io Setup
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Allow React Frontend
    methods: ["GET", "POST"]
  }
});

// Pass 'io' to your Game Manager
socketSetup(io);

// Routes
app.use('/api/auth', userRoutes);

// Error Handler (Must be last)
app.use(errHandler);

// Start Server
// CRITICAL: Only use server.listen (Not app.listen)
server.listen(PORT, () => {
  console.log(`🚀 PulseIQ Server running on port ${PORT}`);
});