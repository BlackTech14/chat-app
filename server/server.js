const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

// Initialize Express App and Server
const app = express();
const server = http.createServer(app);

// Setup Socket.IO with CORS
const io = new Server(server, {
  cors: {
    origin: '*', // Replace '*' with your frontend domain for production
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());



let users = []; // Store all connected users

// Handle incoming socket connections
io.on('connection', (socket) => {
  console.log('A user connected: ', socket.id);

  // Listen for the user joining the chat
  socket.on('user:join', (user) => {
    // Add the user to the list of online users
    users.push({ ...user, socketId: socket.id, online: true });
    console.log(`${user.name} joined the chat`);

    // Broadcast updated users list
    io.emit('users', users);

    // Send a welcome message
    socket.emit('message', {
      id: Date.now().toString(),
      senderId: 'system',
      receiverId: user.id,
      content: 'Welcome to the chat!',
      timestamp: Date.now(),
    });
  });

  // Listen for user sending a message
  socket.on('message:send', (message) => {
    console.log('Received message:', message);

    // Broadcast the message to the target receiver
    const receiverSocket = users.find(user => user.id === message.receiverId)?.socketId;
    if (receiverSocket) {
      io.to(receiverSocket).emit('message', {
        ...message,
        timestamp: Date.now(),
      });
    }
  });

  // Handle user disconnecting
  socket.on('disconnect', () => {
    console.log('User disconnected: ', socket.id);

    // Remove the user from the list when they disconnect
    const disconnectedUser = users.find(user => user.socketId === socket.id);
    if (disconnectedUser) {
      users = users.filter(user => user.socketId !== socket.id);
      io.emit('users', users);
      console.log(`${disconnectedUser.name} left the chat`);
    }
  });

  // Handle user leaving the chat explicitly
  socket.on('user:leave', (userId) => {
    users = users.filter(user => user.id !== userId);
    io.emit('users', users);
    console.log(`User ${userId} left the chat`);
  });
});

// Set up a simple route for testing
app.get('/', (req, res) => {
  res.send('Chat Server is Running');
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
