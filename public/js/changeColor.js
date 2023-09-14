function changeColor() {

    let colorCode = document.getElementById('colorInput').value; 

    if (isValidHexCode(colorCode)) {

        // Instead of directly changing the sessionStorage and the body background... 
        // We send the color code to the server
        fetch('/changeColor', {
            method: 'POST',
            headers: {'Content-Type': 'application/json',},
            body: JSON.stringify({ colorCode }),

        }).then((response) => {

            if (response.ok) {

                // If the server accepted the color code, we can change the body background
                document.body.style.background = colorCode;

            } else {

                alert('Something went wrong. Please try again.');

            }

        }).catch((error) => {

            alert('Something went wrong. Please try again.');

        });

    } else {

        alert('Invalid color code. Please enter a valid hex color code.');

    }
}


function logout() {

    // Send a request to the logout route
    fetch('/logout', {
        method: 'GET',
    })
    
    .then((response) => {

        if (response.ok) {

            // If the server handled the logout successfully, reset the background color
            document.body.style.background = 'linear-gradient(#590098, #83008B,#D01D9B,#461783,#850050)';
        
        } else {

            alert('Something went wrong. Please try again.');

        }

    }).catch((error) => {

        alert('Something went wrong. Please try again.');

    });

}


const logoutBtn = document.getElementById('logout'); // Take the navbar's logout button id
const logoutSide = document.getElementById('logoutSide') // Take the sidebar's logout button id

// Add an event listener for each of them on click and execute the logout function...
logoutBtn.addEventListener("click", () => {
    logout();
});

logoutSide.addEventListener("click", () => {
    logout();
})

// Check if correct hex function...
function isValidHexCode(colorCode) { // We pass the code as argument...
    return /^#([0-9a-fA-F]{6})$/i.test(colorCode); // We test the code with a Regex...
}