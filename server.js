const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const moment = require('moment');

// Create an Express application
const app = express();

// Create an HTTP server
const server = http.createServer(app);

// Attach Socket.io to the server
const io = socketIo(server, {
  cors: {
    origin: "*",  // Allow all origins
    methods: ["GET", "POST"]
  }
});

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Store messages in an array
let messages = [];

// Handle incoming socket connections
io.on('connection', (socket) => {
  console.log('New user connected');

  // Send existing messages to the client
  socket.emit('initialMessages', messages);

  // Listen for incoming messages
  socket.on('chatMessage', (data) => {
    console.log('Received chatMessage:', data); // Log received messages
    const message = {
      username: data.username,
      message: data.message,
      timestamp: moment().format('h:mm a'), // Use consistent timestamp format
    };

    messages.push(message);
    io.emit('chatMessage', message); // Broadcast the message to all connected clients
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Start the server on the specified port
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
