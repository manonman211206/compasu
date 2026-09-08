const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// CORS (must be before routes & security to handle OPTIONS preflight)
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

// Body Parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cookieParser());

// Security & Utility Middleware
const securityMiddleware = require('./src/middleware/security');
const errorHandler = require('./src/middleware/errorHandler');
const { apiLimiter } = require('./src/middleware/rateLimiter');
const logger = require('./src/utils/logger');

securityMiddleware(app);

// Rate Limiting
app.use('/api/', apiLimiter);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => logger.info('MongoDB Connected'))
  .catch((err) => logger.error('MongoDB Connection Error: ' + err.message));

// API Routes v1
app.use('/api/v1/auth', require('./src/routes/v1/authRoutes'));
app.use('/api/v1/friends', require('./src/routes/v1/friendRoutes'));
app.use('/api/v1/chat', require('./src/routes/v1/chatRoutes'));
app.use('/api/v1/location', require('./src/routes/v1/locationRoutes'));
app.use('/api/v1/notifications', require('./src/routes/v1/notificationRoutes'));
app.use('/api/v1/settings', require('./src/routes/v1/settingsRoutes'));

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Socket.IO Real-time Handlers
const onlineUsers = new Map();

io.on('connection', (socket) => {
  logger.info(`User connected: ${socket.id}`);

  socket.on('register_user', (userId) => {
    onlineUsers.set(userId, socket.id);
    io.emit('user_online', { userId, socketId: socket.id });
    logger.info(`User registered: ${userId}`);
  });

  // Chat Events
  socket.on('send_message', async (data) => {
    const { senderId, recipientId, content, messageId } = data;

    const message = {
      id: messageId,
      senderId,
      recipientId,
      content,
      timestamp: new Date(),
      isRead: false,
    };

    const recipientSocketId = onlineUsers.get(recipientId);
    if (recipientSocketId) {
      io.to(recipientSocketId).emit('receive_message', message);
    }

    socket.emit('message_sent', { messageId, status: 'delivered' });
    logger.info(`Message sent from ${senderId} to ${recipientId}`);
  });

  socket.on('typing', (data) => {
    const { senderId, recipientId } = data;
    const recipientSocketId = onlineUsers.get(recipientId);
    if (recipientSocketId) {
      io.to(recipientSocketId).emit('user_typing', { senderId });
    }
  });

  socket.on('stop_typing', (data) => {
    const { senderId, recipientId } = data;
    const recipientSocketId = onlineUsers.get(recipientId);
    if (recipientSocketId) {
      io.to(recipientSocketId).emit('user_stop_typing', { senderId });
    }
  });

  socket.on('message_read', (data) => {
    const { senderId, recipientId, messageId } = data;
    const senderSocketId = onlineUsers.get(senderId);
    if (senderSocketId) {
      io.to(senderSocketId).emit('message_read_receipt', {
        messageId,
        recipientId,
      });
    }
  });

  // Location Events
  socket.on('update_location', async (data) => {
    const { userId, latitude, longitude, accuracy } = data;

    io.emit('friend_location_update', {
      userId,
      latitude,
      longitude,
      accuracy,
      timestamp: new Date(),
    });

    logger.info(`Location updated for user ${userId}`);
  });

  // Meeting Point Events
  socket.on('set_meeting_point', (data) => {
    io.emit('meeting_point_set', {
      ...data,
      timestamp: new Date(),
    });
    logger.info(`Meeting point broadcast: [${data.latitude}, ${data.longitude}] by ${data.createdBy?.username || data.userId || 'User'}`);
  });

  socket.on('clear_meeting_point', (data) => {
    io.emit('meeting_point_cleared', {
      ...data,
      timestamp: new Date(),
    });
    logger.info(`Meeting point cleared broadcast by ${data?.userId || 'User'}`);
  });

  // Friend Request & Notification Events
  socket.on('send_friend_request', (data) => {
    const { senderId, recipientId, senderName } = data;
    const recipientSocketId = onlineUsers.get(recipientId);
    if (recipientSocketId) {
      io.to(recipientSocketId).emit('friend_request_received', {
        senderId,
        senderName,
        timestamp: new Date(),
      });
    }
  });

  socket.on('accept_friend_request', (data) => {
    const { senderId, recipientId, recipientName } = data;
    const senderSocketId = onlineUsers.get(senderId);
    if (senderSocketId) {
      io.to(senderSocketId).emit('friend_request_accepted', {
        recipientId,
        recipientName,
        timestamp: new Date(),
      });
    }
  });

  // Disconnect
  socket.on('disconnect', () => {
    let disconnectedUserId = null;
    for (const [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        disconnectedUserId = userId;
        onlineUsers.delete(userId);
        break;
      }
    }

    if (disconnectedUserId) {
      io.emit('user_offline', { userId: disconnectedUserId });
      logger.info(`User disconnected: ${disconnectedUserId}`);
    }
  });

  socket.on('error', (error) => {
    logger.error(`Socket error: ${error}`);
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    statusCode: 404,
  });
});

// Global Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
});