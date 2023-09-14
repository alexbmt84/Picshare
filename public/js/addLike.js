// Add a like to a comment function...

function addLike(commentId) { // We pass the comment id as argument...

    fetch(`/like/${commentId}`, { // Try to connect to /like/:commentid route...

        method: 'POST', // Using method POST...
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ commentId })

    })

    .then(response => { // If we have a response...

        if (response.ok) { // If response is ok...

            // Comment is correctly sent to the route...
            // Refresh the page to update the UI
            location.reload();

        } else { // Cannot send data to the route...

            // Handle like error

        }

    })

    .catch(error => { // Error while trying to connect to the route...

        // Optimize error message
        console.log(error);
        // Handle like error

    });

}
  
  