const newPostHandler = async (event) => {
    event.preventDefault();
  
    const title = document.querySelector('#title').value.trim();
    const body = document.querySelector('#body').value.trim();

    console.log(title, body);
  
    if (title && body) {
      const response = await fetch('/api/users/posts', {
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

document
    .querySelector('.new-post-form')
    .addEventListener('submit', newPostHandler);