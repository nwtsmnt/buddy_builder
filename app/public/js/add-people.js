// Fetch and display all users when the page loads
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
        users.forEach(user => {
            // Create user card with consistent styling
            const userCard = document.createElement('div');
            userCard.className = 'person-card';
            
            userCard.innerHTML = `
                <div class="person-avatar">
                    <img src="${user.avatar_url || '/images/default-avatar.png'}" alt="${user.name}">
                </div>
                <h3 class="person-name">${user.name}</h3>
                <div class="person-footer">
                    <div class="person-actions">
                        <button class="connect-btn" data-user-id="${user.id}">
                            <i class="fas fa-plus"></i>
                            <span>Connect</span>
                        </button>
                    </div>
                </div>
            `;
            
            peopleGrid.appendChild(userCard);
        });

        // Add event listeners to connect buttons
        document.querySelectorAll('.connect-btn').forEach(button => {
            button.addEventListener('click', function() {
                const userId = this.getAttribute('data-user-id');
                connectWithUser(userId);
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

// Function to handle connecting with a user
async function connectWithUser(userId) {
    try {
        console.log(`Connecting with user ID: ${userId}`);
        // Here you would implement the actual connection logic
        // For now, just show an alert
        alert(`Connection request sent!`);
    } catch (error) {
        console.error('Error connecting with user:', error);
    }
}

// Attach event listeners when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, fetching users');
    fetchAndDisplayUsers();
});
