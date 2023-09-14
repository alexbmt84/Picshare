// We select image boxes that have ".image-box" classes...
const ratingContainers = document.querySelectorAll(".image-box");
let userId = document.body.dataset.userId;

// For each of them as "container"...
ratingContainers.forEach((container) => {

    let imageId = container.dataset.imageId; // We get the image id...

    let stars = container.querySelectorAll(".rating__star");
    let result = container.querySelector(".rating__result");
    stars.forEach(star => {

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

        // Mouseover event
        star.addEventListener("mouseover", () => {

            let voteCount = star.dataset.voteCount;
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

        // Mouseout event
        star.addEventListener("mouseout", () => {
            tooltip.style.visibility = 'hidden';
        });

        // Click event
        star.addEventListener('click', async (event) => {

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
            
                    <h2 id="titlepopup" style="margin:40px !important">Login</h2>
                        
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


            let rating = event.target.getAttribute("data-star-value");

            // Sending POST request to the server to save the rating
            let response = await fetch('/save-rating', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ imageId: imageId, rating: rating, userId: userId }),
            });

            let resData = await response.json();

            if (resData.success) {
                // update the UI
                let averageRating = parseFloat(resData.average);
                result.textContent = averageRating.toFixed(1);
                
                let newRating = Math.round(averageRating);
            
                stars.forEach((star, index) => {
            
                    if (index < newRating) {
                        star.classList.remove("far");
                        star.classList.add("fas");
                    } else {
                        star.classList.remove("fas");
                        star.classList.add("far");
                    }
            
                    // Get the updated vote count and update the data attribute and tooltip content
                    let updatedVoteCount = resData.voteCount; // This should be returned from your server
                    star.dataset.voteCount = updatedVoteCount;
                    tooltip.innerText = `Nombre de votes reçus : ${updatedVoteCount}`;
            
                });
            
            } else {
                console.log('Error in saving the rating:', resData.error);
            }

        });

    });

});
