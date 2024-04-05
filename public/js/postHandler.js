// Logic to handle new post form submission
const newPostHandler = async (event) => {
    event.preventDefault();
  
    const title = document.querySelector('#title').value.trim();
    const body = document.querySelector('#body').value.trim();

    console.log(title, body);
  
    if (title && body) {
      const response = await fetch('/api/users/post', {
        method: 'POST',
        body: JSON.stringify({ 
            title, 
            body,
            date: new Date()
         }),
        headers: { 'Content-Type': 'application/json' },
      });

        console.log(response);
        console.log(response.status, await response.text());
  
      if (response.ok) {
        document.location.replace('/dashboard');
      } else {
        alert('Failed to create post');
      }
    }
}

const postForm = document.querySelector('.new-post-form');
// Only add event listener if the form exists
if (postForm) {
    postForm.addEventListener('submit', newPostHandler);
}

// Logic to handle new comment form submission
const newCommentHandler = async (event) => {
    event.preventDefault();

    const urlParts = window.location.pathname.split('/');
    const id = urlParts[urlParts.length - 1];
  
    const body = document.querySelector('#body').value.trim();
  
    if (body) {
      const response = await fetch(`/api/users/comments/${id}`, {
        method: 'POST',
        body: JSON.stringify({ 
            body, 
            date: new Date()
         }),
        headers: { 'Content-Type': 'application/json' },
      });
  
      if (response.ok) {
        document.location.replace(`/post/${id}`);
      } else {
        console.log(response);
        console.log(response.status, await response.text());
        alert('Failed to create comment');
      }
    }
};

const commentForm = document.querySelector('.new-comment-form');
// Only add event listener if the form exists
if (commentForm) {
    commentForm.addEventListener('submit', newCommentHandler);
}

// Logic to handle post update form submission
const updatePostHandler = async (event) => {
    event.preventDefault();
  
    const urlParts = window.location.pathname.split('/');
    const id = urlParts[urlParts.length - 1];
  
    const title = document.querySelector('#title').value.trim();
    const body = document.querySelector('#body').value.trim();
  
    if (title && body) {
      const response = await fetch(`/api/users/post/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ title, body }),
        headers: { 'Content-Type': 'application/json' },
      });
  
      if (response.ok) {
        document.location.replace('/dashboard');
      } else {
        alert('Failed to update post');
      }
    }
};

const updatePostBtn = document.querySelector('.edit-btn');
// Only add event listener if the button exists
if (updatePostBtn) {
    updatePostBtn.addEventListener('click', updatePostHandler);
}

// Logic to handle post deletion
const deletePostHandler = async (event) => {
    event.preventDefault();
  
    const urlParts = window.location.pathname.split('/');
    const id = urlParts[urlParts.length - 1];
  
    const response = await fetch(`/api/users/post/${id}`, {
      method: 'DELETE',
    });
  
    if (response.ok) {
      document.location.replace('/dashboard');
    } else {
      alert('Failed to delete post');
    }
};

const deletePostBtn = document.querySelector('.delete-btn');
// Only add event listener if the button exists
if (deletePostBtn) {
    deletePostBtn.addEventListener('click', deletePostHandler);
}


function autoResize(textarea) {
  textarea.style.height = 'auto'; // Temporarily shrink textarea to get scroll height
  textarea.style.height = textarea.scrollHeight + 'px'; // Set textarea height to scroll height
}

// Select textarea and add event listener
const commentArea = document.querySelector('.new-comment-form #body');
if (commentArea) {
    commentArea.addEventListener('input', () => autoResize(commentArea));
    autoResize(commentArea);
}

const postArea = document.querySelector('.new-post-form #body');
if (postArea) {
    postArea.addEventListener('input', () => autoResize(postArea));
    autoResize(postArea);
}