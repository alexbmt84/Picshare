// Follow an user funtion...

function followUser(idUser) { // We pass user's id we want to follow...

    fetch(`/follow/${idUser}`, { // Try to connect to follow/:id route...

        method: 'POST', // Using POST method...
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ idUser })

    })

    .then(response => { // We got a response...

        if (response.ok) { // Response is ok...

            // Refresh the page to update the UI
            location.reload();

        } else { // Error while sending the data to the route...
            // Handle follow error
        }

    })

    .catch(error => { // Error while trying to connect to the route..

        // Optimize error message
        console.log(error);
        // Handle follow error
        
    });

}