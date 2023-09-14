
function deleteImage(imageId) { 

    fetch(`/image/${imageId}`, { 

        method: 'DELETE', // Using method delete...
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ imageId })

    })

    .then(response => { // If we have a response...

        if (response.ok) { // If response is ok...

            // image is correctly sent to the route...
            // Refresh the page to update the UI
            
            window.location.href = '/myImg';

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
