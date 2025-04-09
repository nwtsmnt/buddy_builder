// Function to fetch all users
async function fetchAndDisplayUsers() {
    try {
        console.log('Fetching users from /api/users');
        const response = await fetch('/api/users');
        
        if (!response.ok) {
            console.error('Failed to fetch users:', response.status, response.statusText);
            return;
        }

        const users = await response.json();
        console.log('Received users from API:', users);

        // Target the people-grid element that already exists in the template
        const peopleGrid = document.querySelector('.people-grid');
        if (!peopleGrid) {
            console.error('Element with class "people-grid" not found in the DOM.');
            return;
        }

        // Clear existing content
        peopleGrid.innerHTML = '';

        // If no users are found
        if (!users || users.length === 0) {
            peopleGrid.innerHTML = `
                <div class="no-users" style="text-align: center; padding: 30px; color: #666;">
                    <i class="fas fa-users" style="font-size: 48px; margin-bottom: 15px; color: #ccc;"></i>
                    <h3>No Users Found</h3>
                    <p>There are no other users in the database yet.</p>
                </div>`;
            return;
        }

        // Create user cards for each user in the database
        for (const user of users) {
            // Get connection status for each user
            const connectionStatus = await getConnectionStatus(user.id);
            
            // Create user card with consistent styling
            const userCard = document.createElement('div');
            userCard.className = 'person-card';
            
            // Define the connection button based on status
            let connectionBtn = '';
            
            if (connectionStatus.status === 'none') {
                connectionBtn = `
                    <button class="connect-btn" data-user-id="${user.id}">
                        <i class="fas fa-plus"></i>
                        <span>Connect</span>
                    </button>
                `;
            } else if (connectionStatus.status === 'pending') {
                if (connectionStatus.isRequester) {
                    connectionBtn = `
                        <button class="connect-btn pending" disabled>
                            <i class="fas fa-clock"></i>
                            <span>Pending</span>
                        </button>
                    `;
                } else {
                    connectionBtn = `
                        <div class="request-actions">
                            <button class="accept-btn" data-user-id="${user.id}">
                                <i class="fas fa-check"></i>
                                <span>Accept</span>
                            </button>
                            <button class="reject-btn" data-user-id="${user.id}">
                                <i class="fas fa-times"></i>
                                <span>Reject</span>
                            </button>
                        </div>
                    `;
                }
            } else if (connectionStatus.status === 'accepted') {
                connectionBtn = `
                    <button class="connect-btn connected" disabled>
                        <i class="fas fa-check"></i>
                        <span>Connected</span>
                    </button>
                `;
            } else if (connectionStatus.status === 'rejected') {
                connectionBtn = `
                    <button class="connect-btn" data-user-id="${user.id}">
                        <i class="fas fa-plus"></i>
                        <span>Connect</span>
                    </button>
                `;
            }
            
            userCard.innerHTML = `
                <div class="person-avatar">
                    <img src="${user.avatar_url || '/images/default-avatar.png'}" alt="${user.name}">
                </div>
                <h3 class="person-name">${user.name}</h3>
                <div class="person-footer">
                    <div class="person-actions">
                        ${connectionBtn}
                    </div>
                </div>
            `;
            
            peopleGrid.appendChild(userCard);
        }

        // Add event listeners to connection buttons
        document.querySelectorAll('.connect-btn:not([disabled])').forEach(button => {
            button.addEventListener('click', function() {
                const userId = this.getAttribute('data-user-id');
                sendConnectionRequest(userId);
            });
        });
        
        // Add event listeners to accept/reject buttons
        document.querySelectorAll('.accept-btn').forEach(button => {
            button.addEventListener('click', function() {
                const userId = this.getAttribute('data-user-id');
                respondToConnectionRequest(userId, 'accept');
            });
        });
        
        document.querySelectorAll('.reject-btn').forEach(button => {
            button.addEventListener('click', function() {
                const userId = this.getAttribute('data-user-id');
                respondToConnectionRequest(userId, 'reject');
            });
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        
        // Show error message in the UI
        const peopleGrid = document.querySelector('.people-grid');
        if (peopleGrid) {
            peopleGrid.innerHTML = `
                <div class="error-message" style="text-align: center; padding: 30px; color: #d9534f;">
                    <i class="fas fa-exclamation-triangle" style="font-size: 48px; margin-bottom: 15px;"></i>
                    <h3>Error Loading Users</h3>
                    <p>There was a problem fetching users from the database.</p>
                </div>`;
        }
    }
}

// Function to get connection status between current user and another user
async function getConnectionStatus(userId) {
    try {
        const response = await fetch(`/api/connection-status/${userId}`);
        if (!response.ok) {
            console.error('Failed to fetch connection status:', response.status);
            return { status: 'none' };
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching connection status:', error);
        return { status: 'none' };
    }
}

// Function to send a connection request
async function sendConnectionRequest(recipientId) {
    try {
        const response = await fetch('/api/connections', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ recipientId })
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            console.error('Failed to send connection request:', errorData);
            alert('Failed to send connection request: ' + (errorData.error || 'Unknown error'));
            return;
        }
        
        alert('Connection request sent!');
        // Refresh the user list to show updated status
        fetchAndDisplayUsers();
    } catch (error) {
        console.error('Error sending connection request:', error);
        alert('Error sending connection request. Please try again.');
    }
}

// Function to respond to a connection request (accept/reject)
async function respondToConnectionRequest(requesterId, action) {
    try {
        const response = await fetch(`/api/connections/${requesterId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ action })
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            console.error(`Failed to ${action} connection request:`, errorData);
            alert(`Failed to ${action} connection request: ` + (errorData.error || 'Unknown error'));
            return;
        }
        
        alert(`Connection request ${action}ed!`);
        // Refresh the user list to show updated status
        fetchAndDisplayUsers();
        
        // If we're on the "Pending Requests" tab, refresh that view as well
        if (document.querySelector('.tab.active').textContent.trim() === 'Pending Requests') {
            loadPendingRequests();
        }
    } catch (error) {
        console.error(`Error ${action}ing connection request:`, error);
        alert(`Error ${action}ing connection request. Please try again.`);
    }
}

// Function to load user's connections
async function loadConnections() {
    try {
        const response = await fetch('/api/connections');
        if (!response.ok) {
            console.error('Failed to fetch connections:', response.status);
            return;
        }
        
        const connections = await response.json();
        console.log('User connections:', connections);
        
        const peopleGrid = document.querySelector('.people-grid');
        if (!peopleGrid) {
            console.error('Element with class "people-grid" not found in the DOM.');
            return;
        }
        
        // Clear existing content
        peopleGrid.innerHTML = '';
        
        // If no connections found
        if (!connections || connections.length === 0) {
            peopleGrid.innerHTML = `
                <div class="no-connections" style="text-align: center; padding: 30px; color: #666;">
                    <i class="fas fa-user-friends" style="font-size: 48px; margin-bottom: 15px; color: #ccc;"></i>
                    <h3>No Connections Yet</h3>
                    <p>You haven't connected with anyone yet. Start by connecting with other users!</p>
                </div>`;
            return;
        }
        
        // Create cards for each connection
        connections.forEach(connection => {
            const connectionCard = document.createElement('div');
            connectionCard.className = 'person-card';
            
            connectionCard.innerHTML = `
                <div class="person-avatar">
                    <img src="${connection.connection_avatar || '/images/default-avatar.png'}" alt="${connection.connection_name}">
                </div>
                <h3 class="person-name">${connection.connection_name}</h3>
                <div class="person-footer">
                    <div class="person-actions">
                        <button class="message-btn" data-user-id="${connection.connection_user_id}">
                            <i class="fas fa-comment"></i>
                            <span>Message</span>
                        </button>
                    </div>
                </div>
            `;
            
            peopleGrid.appendChild(connectionCard);
        });
        
        // Add event listeners to message buttons
        document.querySelectorAll('.message-btn').forEach(button => {
            button.addEventListener('click', function() {
                const userId = this.getAttribute('data-user-id');
                window.location.href = `/chat?user=${userId}`; // Redirect to chat page with receiverId
            });
        });
    } catch (error) {
        console.error('Error loading connections:', error);
    }
}

// Function to load pending connection requests
async function loadPendingRequests() {
    try {
        console.log('Fetching pending connection requests');
        
        // Show loading indicator
        const peopleGrid = document.querySelector('.people-grid');
        peopleGrid.innerHTML = `
            <div class="loading-indicator" style="text-align: center; padding: 30px;">
                <i class="fas fa-spinner fa-spin" style="font-size: 32px; color: #666;"></i>
                <p>Loading pending requests...</p>
            </div>`;
            
        const response = await fetch('/api/connections/pending');
        if (!response.ok) {
            throw new Error(`Failed to fetch pending requests: ${response.status}`);
        }
        
        const pendingRequests = await response.json();
        console.log('Pending requests:', pendingRequests);
        
        // Clear loading indicator
        peopleGrid.innerHTML = '';
        
        // If no pending requests found
        if (!pendingRequests || pendingRequests.length === 0) {
            peopleGrid.innerHTML = `
                <div class="no-requests" style="text-align: center; padding: 30px; color: #666;">
                    <i class="fas fa-clock" style="font-size: 48px; margin-bottom: 15px; color: #ccc;"></i>
                    <h3>No Pending Requests</h3>
                    <p>You don't have any pending connection requests.</p>
                </div>`;
            return;
        }
        
        // Create cards for each pending request
        pendingRequests.forEach(request => {
            const requestCard = document.createElement('div');
            requestCard.className = 'person-card';
            
            requestCard.innerHTML = `
                <div class="person-avatar">
                    <img src="${request.requester_avatar || '/images/default-avatar.png'}" alt="${request.requester_name}">
                </div>
                <h3 class="person-name">${request.requester_name}</h3>
                <div class="person-footer">
                    <div class="request-actions">
                        <button class="accept-btn" data-user-id="${request.requester_id}">
                            <i class="fas fa-check"></i>
                            <span>Accept</span>
                        </button>
                        <button class="reject-btn" data-user-id="${request.requester_id}">
                            <i class="fas fa-times"></i>
                            <span>Reject</span>
                        </button>
                    </div>
                </div>
            `;
            
            peopleGrid.appendChild(requestCard);
        });
        
        // Add event listeners to accept/reject buttons
        document.querySelectorAll('.accept-btn').forEach(button => {
            button.addEventListener('click', function() {
                const userId = this.getAttribute('data-user-id');
                respondToConnectionRequest(userId, 'accept');
            });
        });
        
        document.querySelectorAll('.reject-btn').forEach(button => {
            button.addEventListener('click', function() {
                const userId = this.getAttribute('data-user-id');
                respondToConnectionRequest(userId, 'reject');
            });
        });
    } catch (error) {
        console.error('Error loading pending requests:', error);
        const peopleGrid = document.querySelector('.people-grid');
        peopleGrid.innerHTML = `
            <div class="error-message" style="text-align: center; padding: 30px; color: #d9534f;">
                <i class="fas fa-exclamation-triangle" style="font-size: 48px; margin-bottom: 15px;"></i>
                <h3>Error Loading Requests</h3>
                <p>There was a problem fetching your connection requests.</p>
            </div>`;
    }
}

// Function to respond to a connection request (accept/reject)
async function respondToConnectionRequest(userId, action) {
    try {
        console.log(`${action}ing connection request from user ID: ${userId}`);
        
        const response = await fetch(`/api/connections/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ action }) // 'accept' or 'reject'
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            console.error(`Failed to ${action} connection request:`, errorData);
            alert(`Failed to ${action} connection request: ` + (errorData.error || 'Unknown error'));
            return;
        }
        
        // Show success message
        alert(`Connection request ${action}ed successfully`);
        
        // Reload pending requests to update the UI
        loadPendingRequests();
    } catch (error) {
        console.error(`Error ${action}ing connection request:`, error);
        alert(`Error ${action}ing connection request. Please try again.`);
    }
}

// Attach event listeners when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, fetching users');
    
    // Initially load all users
    fetchAndDisplayUsers();
    
    // Tab switching functionality
    document.querySelectorAll('.category-tabs .tab').forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            document.querySelectorAll('.category-tabs .tab').forEach(t => {
                t.classList.remove('active');
            });
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Load appropriate content based on tab
            const tabText = this.textContent.trim();
            console.log(`Switching to tab: ${tabText}`);
            
            if (tabText === 'All People') {
                fetchAndDisplayUsers();
            } else if (tabText === 'Your Connections') {
                loadConnections();
            } else if (tabText === 'Pending Requests') {
                loadPendingRequests(); // This will show who sent you requests
            } else if (tabText === 'Recommended') {
                // Future implementation
                const peopleGrid = document.querySelector('.people-grid');
                peopleGrid.innerHTML = `
                    <div class="coming-soon" style="text-align: center; padding: 30px; color: #666;">
                        <i class="fas fa-tools" style="font-size: 48px; margin-bottom: 15px; color: #ccc;"></i>
                        <h3>Coming Soon</h3>
                        <p>Recommendation features are under development.</p>
                    </div>`;
            }
        });
    });
    
    // Add a specific event listener for the Pending Requests tab
    const pendingRequestsTab = document.querySelector('.tab.pending-requests-tab');
    if (pendingRequestsTab) {
        pendingRequestsTab.addEventListener('click', function() {
            loadPendingRequests();
        });
    }
});
