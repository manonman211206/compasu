// server/index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json()); // Allows us to parse JSON payloads

// Bind HTTP server to Express, then bind Socket.io to the HTTP server
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Vite's default port
    methods: ["GET", "POST"]
  }
});

// Real-time connection handler
io.on('connection', (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("send_message", (data) => {
    console.log("Message received on server:",  data);
    
  socket.broadcast.emit("receive_message", data); 
  });// Broadcast to all other clients
    
  // Example: Listen for a campus location update
  socket.on('update_location', (data) => {
    // Broadcast location to friends
    socket.broadcast.emit('friend_moved', data); 
  });

  socket.on('disconnect', () => {
    console.log('User Disconnected', socket.id);
  });
});

// Connect to MongoDB (You'll need a free cluster from MongoDB Atlas)

console.log("Connecting to:", process.env.MONGO_URI);

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Database Connected"))
  .catch((err) => console.log(err));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});