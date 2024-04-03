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
        document.location.replace('/');
      } else {
        alert('Failed to create post');
      }
    }
}

const postForm = document.querySelector('.new-post-form')

if (postForm) {
    postForm.addEventListener('submit', newPostHandler);
}

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

const commentForm = document.querySelector('.new-comment-form')

if (commentForm) {
    commentForm.addEventListener('submit', newCommentHandler);
}


function autoResize(textarea) {
  textarea.style.height = 'auto'; // Temporarily shrink textarea to get scroll height
  textarea.style.height = textarea.scrollHeight + 'px'; // Set textarea height to scroll height
}

// Select textarea and add event listener
const textarea = document.querySelector('.new-comment-form #body');
textarea.addEventListener('input', () => autoResize(textarea));

// Call function initially to resize on page load
autoResize(textarea);