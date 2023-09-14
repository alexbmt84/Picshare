// Unfollow an user function...

function unfollowUser(idUser) { // We pass the user we want to unfollow as argument...

    fetch(`/unfollow/${idUser}`, { // Tru to connect to /unfollow/:id route...

        method: 'POST', // We use the POST method...
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ idUser })

    })

    .then(response => { // Response...

        if (response.ok) { // If we got a cool response...

            // User unfollow request is sent to the route successfully...
            // Refresh the page to update the UI
            location.reload();

        } else { // If we didn't have a cool response...

            // User isn't unfollowed cause there was a problem with sending data to /unfollow/:id...
            // Optimize error message
        }

    })

    .catch(error => { // Error

        // User isn't unfollowed cause there was a problem with connecting to the route...

        // Handle follow error
        console.log(error); // Optimize error messages

    });
    
}