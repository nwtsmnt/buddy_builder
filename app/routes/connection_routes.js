const express = require('express');
const router = express.Router();
const db = require('../models/db');

// Get connection status between current user and another user
router.get('/api/connection-status/:userId', async (req, res) => {
    try {
        const currentUserId = parseInt(req.session.userId);
        const otherUserId = parseInt(req.params.userId);
        
        // Check if there's any connection between the two users
        const connections = await db.query(
            `SELECT * FROM Connections 
             WHERE (requester_id = ? AND recipient_id = ?) 
             OR (requester_id = ? AND recipient_id = ?)`,
            [currentUserId, otherUserId, otherUserId, currentUserId]
        );
        
        if (!connections || connections.length === 0) {
            return res.json({ status: 'none' });
        }
        
        const connection = connections[0];
        let statusInfo = { status: connection.status };
        
        // Add information about who sent the request
        if (connection.status === 'pending') {
            statusInfo.isRequester = connection.requester_id === currentUserId;
        }
        
        res.json(statusInfo);
    } catch (error) {
        console.error('Error checking connection status:', error);
        res.status(500).json({ error: 'Failed to check connection status' });
    }
});

// Send a connection request
router.post('/api/connections', async (req, res) => {
    try {
        const requesterId = parseInt(req.session.userId);
        const recipientId = parseInt(req.body.recipientId);
        
        if (!requesterId || !recipientId) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        
        // Check if a connection already exists
        const existingConnection = await db.query(
            `SELECT * FROM Connections 
             WHERE (requester_id = ? AND recipient_id = ?) 
             OR (requester_id = ? AND recipient_id = ?)`,
            [requesterId, recipientId, recipientId, requesterId]
        );
        
        if (existingConnection && existingConnection.length > 0) {
            return res.status(400).json({ 
                error: 'Connection already exists',
                status: existingConnection[0].status
            });
        }
        
        // Create the connection request
        await db.query(
            'INSERT INTO Connections (requester_id, recipient_id, status) VALUES (?, ?, "pending")',
            [requesterId, recipientId]
        );
        
        res.status(201).json({ message: 'Connection request sent' });
    } catch (error) {
        console.error('Error sending connection request:', error);
        res.status(500).json({ error: 'Failed to send connection request' });
    }
});

// Accept or reject a connection request
router.put('/api/connections/:userId', async (req, res) => {
    try {
        const currentUserId = parseInt(req.session.userId);
        const requesterId = parseInt(req.params.userId);
        const { action } = req.body; // 'accept' or 'reject'
        
        if (!action || (action !== 'accept' && action !== 'reject')) {
            return res.status(400).json({ error: 'Invalid action' });
        }
        
        // Find the pending connection request
        const connectionRequest = await db.query(
            `SELECT * FROM Connections 
             WHERE requester_id = ? AND recipient_id = ? AND status = 'pending'`,
            [requesterId, currentUserId]
        );
        
        if (!connectionRequest || connectionRequest.length === 0) {
            return res.status(404).json({ error: 'Connection request not found' });
        }
        
        // Update the connection status
        const newStatus = action === 'accept' ? 'accepted' : 'rejected';
        await db.query(
            `UPDATE Connections SET status = ? WHERE requester_id = ? AND recipient_id = ?`,
            [newStatus, requesterId, currentUserId]
        );
        
        res.json({ message: `Connection request ${action}ed` });
    } catch (error) {
        console.error(`Error ${req.body.action}ing connection request:`, error);
        res.status(500).json({ error: `Failed to ${req.body.action} connection request` });
    }
});

// Get all connections for the current user
router.get('/api/connections', async (req, res) => {
    try {
        const userId = parseInt(req.session.userId);
        
        // Get all accepted connections
        const connections = await db.query(
            `SELECT c.*, 
             requester.id as connection_user_id, 
             requester.name as connection_name, 
             requester.avatar_url as connection_avatar 
             FROM Connections c
             JOIN Users requester ON requester.id = c.requester_id
             WHERE c.recipient_id = ? AND c.status = 'accepted'
             UNION
             SELECT c.*, 
             recipient.id as connection_user_id, 
             recipient.name as connection_name, 
             recipient.avatar_url as connection_avatar
             FROM Connections c
             JOIN Users recipient ON recipient.id = c.recipient_id
             WHERE c.requester_id = ? AND c.status = 'accepted'`,
            [userId, userId]
        );
        
        res.json(connections);
    } catch (error) {
        console.error('Error fetching connections:', error);
        res.status(500).json({ error: 'Failed to fetch connections' });
    }
});

// Get pending connection requests for the current user
router.get('/api/connections/pending', async (req, res) => {
    try {
        const userId = parseInt(req.session.userId);
        
        // Get pending connection requests sent to the current user
        const pendingRequests = await db.query(
            `SELECT c.*, 
             u.name as requester_name, 
             u.avatar_url as requester_avatar 
             FROM Connections c
             JOIN Users u ON u.id = c.requester_id
             WHERE c.recipient_id = ? AND c.status = 'pending'`,
            [userId]
        );
        
        res.json(pendingRequests);
    } catch (error) {
        console.error('Error fetching pending connection requests:', error);
        res.status(500).json({ error: 'Failed to fetch pending connection requests' });
    }
});

module.exports = router;
