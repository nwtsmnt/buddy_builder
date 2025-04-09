const db = require('./db');

// Create connections table if it doesn't exist
async function createConnectionsTable() {
    const sql = `
    CREATE TABLE IF NOT EXISTS Connections (
        id INT AUTO_INCREMENT PRIMARY KEY,
        requester_id INT NOT NULL,
        recipient_id INT NOT NULL,
        status ENUM('pending', 'accepted', 'rejected') DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (requester_id) REFERENCES Users(id) ON DELETE CASCADE,
        FOREIGN KEY (recipient_id) REFERENCES Users(id) ON DELETE CASCADE,
        UNIQUE KEY unique_connection (requester_id, recipient_id)
    )`;
    
    try {
        await db.query(sql);
        console.log('Connections table created or already exists');
    } catch (error) {
        console.error('Error creating connections table:', error);
    }
}

module.exports = { createConnectionsTable };
