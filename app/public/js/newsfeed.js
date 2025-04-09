document.addEventListener('DOMContentLoaded', () => {
  // Select all delete buttons
  const deleteButtons = document.querySelectorAll('.delete-comment-button');

  deleteButtons.forEach(button => {
    button.addEventListener('click', async (event) => {
      const commentId = button.getAttribute('data-comment-id'); // Get the comment ID
      console.log('Delete button clicked for comment:', commentId);

      try {
        // UPDATED URL PATH - This was the problem
        const response = await fetch(`/add-comment/delete-comment/${commentId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          // Remove the comment from the DOM
          const commentItem = button.closest('.comment-item');
          commentItem.remove();
          console.log('Comment deleted successfully');
        } else {
          console.error('Failed to delete comment');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    });
  });
});