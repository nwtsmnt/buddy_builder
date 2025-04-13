const WebSocket = require('ws');

// Create a WebSocket server
const wss = new WebSocket.Server({ host: '0.0.0.0', port: 8080 }); // Bind to 0.0.0.0 for Docker compatibility

const clients = new Map(); // Map to store connected clients and their user IDs

wss.on('connection', (ws) => {
  console.log('New client connected');

  // Handle incoming messages
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);

      if (data.type === 'register') {
        // Register the client with their user ID
        clients.set(ws, data.userId);
        console.log(`User ${data.userId} registered`);
      } else if (data.type === 'sendMessage') {
        const { receiverId, message } = data;

        // Broadcast the message to the receiver
        clients.forEach((userId, client) => {
          if (userId === receiverId && client.readyState === WebSocket.OPEN) {
            client.send(
              JSON.stringify({
                type: 'newMessage',
                senderId: clients.get(ws),
                message,
                senderAvatar: '/images/default-avatar.png', // Replace with actual avatar if available
                timestamp: new Date().toISOString(),
              })
            );
          }
        });
      }
    } catch (error) {
      console.error('Error handling message:', error);
    }
  });

  // Handle client disconnection
  ws.on('close', () => {
    console.log('Client disconnected');
    clients.delete(ws);
  });
});

console.log('WebSocket server is running on ws://0.0.0.0:8080');
