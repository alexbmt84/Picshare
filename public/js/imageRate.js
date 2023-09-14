// Rate an image funtion on image page, if user isn't connected, it will display a popup...

// Ensure Popper is loaded

// Voir homePopup

if (typeof Popper === 'undefined') {

    throw new Error('Popper.js is required');

}

const container = document.getElementById("image-box");

const stars = container.querySelectorAll(".rating__star");
const result = container.querySelector(".rating__result");
const imageId = container.dataset.imageId;

executeRating(stars, result, imageId, container);

function executeRating(stars, result, imageId, container) {

    const starClassActive = "rating__star fas fa-star";
    const starClassUnactive = "rating__star far fa-star";

    let rating = 0;

    const tooltips = [];

    stars.forEach((star, index) => {
    
        // Create tooltip
        const tooltip = document.createElement('div');
        tooltip.setAttribute('role', 'tooltip');
        tooltip.style.visibility = 'hidden';
        tooltip.style.position = 'absolute';
        tooltip.style.backgroundColor = '#333';
        tooltip.style.color = '#fff';
        tooltip.style.padding = '10px';
        tooltip.style.borderRadius = '5px';
        tooltip.style.fontSize = '15px';
        
        // Create arrow
        const arrow = document.createElement('div');
        arrow.setAttribute('id', 'arrow');
        arrow.setAttribute('data-popper-arrow', '');
        arrow.style.position = 'absolute';
        arrow.style.width = '0';
        arrow.style.height = '0';
        arrow.style.borderStyle = 'solid';
        arrow.style.borderWidth = '0 4px 4px 4px';
        arrow.style.borderColor = 'transparent transparent #333 transparent';  // #333 is your tooltip background color
        
        // Append tooltip to the container
        container.appendChild(tooltip);
        
        // Append the arrow to the tooltip
        tooltip.appendChild(arrow);
        tooltips.push(tooltip);
            
        star.addEventListener("click", () => {

            rating = index + 1; // Assuming the first star corresponds to a rating of 1
                    
            // Update the stars based on the new rating
            stars.forEach((s, i) => {

                if (i < rating) {
                    s.className = starClassActive;
                } else {
                    s.className = starClassUnactive;
                }

            });
        
            printRatingResult(result, rating);

            // Get user ID
            const userId = document.body.dataset.userId;

            if (!userId) {
            
                const formBlur = document.createElement('div');
                formBlur.classList.add('formBlur');
        
                const body = document.querySelector("body");
                body.appendChild(formBlur);
                                
                const form = document.createElement('form');
                form.action = '/login';
                form.method = 'post';
                form.classList.add('login-form');
        
                form.innerHTML = `
            
                    <i id="closebtn" class='bx bx-x bx-md bx-spin-hover' style="cursor:pointer;animation-duration: 0.5s; animation-iteration-count:1;"></i>
                    <img src="/images/logo2.png" width="50px" style="display:block; margin:auto;">
            
                    <h2 id="titlepopup" style"margin: 40px">Login</h2>
                        
                    <div class="form-group">
                    <label for="email">Email</label>
                    <input type="email" id="emailpopup" name="email" required>
                    </div>
            
                    <div class="form-group">
                    <label for="password">Password</label>
                    <input type="password" id="passwordpopup" name="password" required>
                    </div>
        
                    <button id="follow" type="submit">Log In</button>
                `;
    
                form.style.minWidth = '600px';
                form.style.margin = '0 auto';
                form.style.padding = '20px';
                form.style.border = '1px solid #ccc';
        
                form.addEventListener('submit', (e) => {
                    // Handle form submission logic here
                });
        
                formBlur.appendChild(form);
                
                // Add an event listener to the close button
                const closeBtn = form.querySelector('#closebtn');

                closeBtn.addEventListener('click', () => {

                    formBlur.style.display = 'none'; // Remove the pop-up when the close button is clicked
                    form.style.display = 'none';
                });

                return;
            }

            updateRating(imageId, rating);
        });

        star.addEventListener("mouseover", () => {

            const voteCount = star.dataset.voteCount;
            tooltip.innerText = `Nombre de votes reçus : ${voteCount}`;
            tooltip.style.visibility = 'visible';
    
            // Create a popper instance
            const popperInstance = Popper.createPopper(star, tooltip, {

                placement: 'bottom',
                modifiers: [
                    {
                        name: 'arrow',
                        options: {
                            element: arrow, // use our arrow element
                        },
                    },
                ],
            });

        });

        star.addEventListener("mouseout", () => {
            tooltip.style.visibility = 'hidden';
        });

    });

}

function printRatingResult(result, num = 0) {
    return;
}

function updateRating(imageId, rating) {
    
    if (typeof imageId === 'undefined' || typeof rating === 'undefined') {

        console.error('Invalid arguments:', imageId, rating);

        return;
    }

    // Get user ID
    const userId = document.body.dataset.userId;

    if (!userId) {

        return;

    }
    
    fetch('/save-rating', {

        method: 'POST',
        headers: {'Content-Type': 'application/json',},
        body: JSON.stringify({ imageId: imageId, rating: rating, userId: userId }),

    })

    .then((response) => {

        return response.json();

    })

    .then((data) => {

        if (!data.success) {

        } else {

            // Mémoriser la position de défilement actuelle
            const scrollX = window.scrollX;
            const scrollY = window.scrollY;

            // Recharger la page
            location.reload();
            
            // Déplacer la fenêtre à la position précédente après le rechargement de la page
            window.scrollTo(scrollX, scrollY);
                    
        }
    })

    .catch((error) => {
        console.error('Error:', error);
    });

}
