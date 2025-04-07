const db = require('../models/db');

// Get chat messages between two users
exports.getMessages = async (req, res) => {
  try {
    const userId = req.session.userId;
    const otherUserId = req.params.userId;

    console.log(`Fetching messages between user ${userId} and user ${otherUserId}`);

    // Updated query to include both sender and receiver avatars
    const messagesResult = await db.query(
      `SELECT 
          m.*, 
          sender.avatar_url AS sender_avatar, 
          receiver.avatar_url AS receiver_avatar
       FROM Messages m
       JOIN Users sender ON m.sender_id = sender.id
       JOIN Users receiver ON m.receiver_id = receiver.id
       WHERE (m.sender_id = ? AND m.receiver_id = ?)
          OR (m.sender_id = ? AND m.receiver_id = ?)
       ORDER BY m.created_at ASC`,
      [userId, otherUserId, otherUserId, userId]
    );

    // Handle different result structures
    const messages = Array.isArray(messagesResult) ? messagesResult : 
                     (messagesResult.length ? messagesResult : []);

    console.log('Fetched messages:', messages);

    if (!messages || messages.length === 0) {
      console.log('No messages found');
      return res.json([]);
    }

    res.json(messages);
  } catch (err) {
    console.error('Error fetching messages:', err);
    res.status(500).send('Error fetching messages.');
  }
};

// Send a new message
exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, message } = req.body;
    const senderId = req.session.userId;

    console.log(`Sending message from user ${senderId} to user ${receiverId}`);
    console.log('Message content:', message);

    // Insert the new message into the database
    const result = await db.query(
      'INSERT INTO Messages (sender_id, receiver_id, message, created_at) VALUES (?, ?, ?, NOW())',
      [senderId, receiverId, message]
    );

    const insertId = result.insertId || (result[0] && result[0].insertId);
    console.log('Message inserted with ID:', insertId);

    if (!insertId) {
      throw new Error('Failed to get insertId from database result');
    }

    // Fetch the newly created message with both avatars
    const newMessageResult = await db.query(
      `SELECT 
          m.*, 
          sender.avatar_url AS sender_avatar, 
          receiver.avatar_url AS receiver_avatar
       FROM Messages m
       JOIN Users sender ON m.sender_id = sender.id
       JOIN Users receiver ON m.receiver_id = receiver.id
       WHERE m.id = ?`,
      [insertId]
    );

    const newMessage = Array.isArray(newMessageResult) ? newMessageResult[0] : 
                      (newMessageResult.length ? newMessageResult[0] : newMessageResult);

    console.log('New message sent:', newMessage);
    res.status(201).json(newMessage);
  } catch (err) {
    console.error('Error sending message:', err);
    res.status(500).send('Error sending message.');
  }
};

// Fetch all users for conversations (excluding the logged-in user)
exports.getConversations = async (req, res) => {
  try {
    const userId = req.session.userId; // Logged-in user

    console.log(`Fetching conversations for user ${userId}`); // Log the logged-in user ID

    // Fetch users with whom the logged-in user has exchanged messages
    const [users] = await db.query(
      `SELECT DISTINCT 
          u.id, u.name, u.avatar_url,
          (SELECT message FROM Messages 
           WHERE (sender_id = ? AND receiver_id = u.id) OR (sender_id = u.id AND receiver_id = ?)
           ORDER BY created_at DESC LIMIT 1) as last_message
       FROM Users u
       JOIN Messages m ON (m.sender_id = u.id AND m.receiver_id = ?)
                      OR (m.sender_id = ? AND m.receiver_id = u.id)
       WHERE u.id != ?
       ORDER BY (SELECT created_at FROM Messages 
                 WHERE (sender_id = ? AND receiver_id = u.id) OR (sender_id = u.id AND receiver_id = ?)
                 ORDER BY created_at DESC LIMIT 1) DESC`,
      [userId, userId, userId, userId, userId, userId, userId]
    );

    console.log('Fetched conversations:', users); // Log the fetched conversations

    res.json(users);
  } catch (err) {
    console.error('Error fetching conversations:', err); // Log the error
    res.status(500).send('Error fetching conversations.');
  }
};

// Start a new conversation
exports.startConversation = async (req, res) => {
  try {
    const { userId } = req.body;
    const loggedInUserId = req.session.userId;

    console.log(`Starting conversation between users ${loggedInUserId} and ${userId}`);

    // Check if a conversation already exists
    const result = await db.query(
      'SELECT * FROM Messages WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)',
      [loggedInUserId, userId, userId, loggedInUserId]
    );

    console.log('Existing conversation result:', result);
    
    // Check if there are any existing messages
    // This handles both array results and single object results
    const hasExistingMessages = result && 
      ((Array.isArray(result) && result.length > 0) || 
       (!Array.isArray(result) && Object.keys(result).length > 0));

    if (hasExistingMessages) {
      console.log('Conversation already exists');
      return res.status(200).json({ message: 'Conversation already exists.' });
    }

    // Create an initial system message to mark the conversation start
    const insertResult = await db.query(
      'INSERT INTO Messages (sender_id, receiver_id, message, is_system_message, created_at) VALUES (?, ?, ?, ?, NOW())',
      [loggedInUserId, userId, 'Conversation started', 1]
    );

    console.log('New conversation created with message ID:', 
      insertResult.insertId || (insertResult[0] && insertResult[0].insertId));
    
    res.status(201).json({ message: 'Conversation started.' });
  } catch (err) {
    console.error('Error starting conversation:', err);
    res.status(500).json({ error: 'Error starting conversation.' });
  }
};