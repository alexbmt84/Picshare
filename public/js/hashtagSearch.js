import { popup } from './popup.js';

function preventAccessIfNotLoggedIn(element, eventType) {

  element.addEventListener(eventType, (event) => {

    let userId = document.body.dataset.userId;
    
    if (!userId) {
      popup();
      event.preventDefault();
    }

  });

}

function addRatingFunctionality(container) {

  let imageId = container.dataset.imageId; 
  let userId = document.body.dataset.userId;
  let stars = container.querySelectorAll(".rating__star");
  let result = container.querySelector(".rating__result");

  // Prevent unlogged users from clicking on the image, title, or user profile
  let imageCard = container.querySelector('.image-card');
  let userContent = container.querySelector('.userContent');
  preventAccessIfNotLoggedIn(imageCard, 'click');
  preventAccessIfNotLoggedIn(userContent, 'click');


  stars.forEach((star) => {
    const tooltip = document.createElement("div");
    tooltip.setAttribute("role", "tooltip");
    tooltip.style.visibility = "hidden";
    tooltip.style.position = "absolute";
    tooltip.style.backgroundColor = "#333";
    tooltip.style.color = "#fff";
    tooltip.style.padding = "10px";
    tooltip.style.borderRadius = "5px";
    tooltip.style.fontSize = "15px";

    const arrow = document.createElement("div");
    arrow.setAttribute("id", "arrow");
    arrow.setAttribute("data-popper-arrow", "");
    arrow.style.position = "absolute";
    arrow.style.width = "0";
    arrow.style.height = "0";
    arrow.style.borderStyle = "solid";
    arrow.style.borderWidth = "0 4px 4px 4px";
    arrow.style.borderColor = "transparent transparent #333 transparent";

    container.appendChild(tooltip);
    tooltip.appendChild(arrow);

    star.addEventListener("mouseover", () => {

      let voteCount = star.dataset.voteCount;
      tooltip.innerText = `Nombre de votes reçus : ${voteCount}`;
      tooltip.style.visibility = "visible";

      const popperInstance = Popper.createPopper(star, tooltip, {
        placement: "bottom",
        modifiers: [
          {
            name: "arrow",
            options: {
              element: arrow,
            },
          },
        ],
      });
    });

    star.addEventListener("mouseout", () => {
      tooltip.style.visibility = "hidden";
    });

    star.addEventListener("click", async (event) => {
      
      if (!userId) {
        popup();
        event.preventDefault();

      } else {

        let rating = event.target.getAttribute("data-star-value");

        // Sending POST request to the server to save the rating
        let response = await fetch("/save-rating", {

          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            imageId: imageId,
            rating: rating,
            userId: userId,
          }),

        });

        let resData = await response.json();

        if (resData.success) {

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

            let updatedVoteCount = resData.voteCount; // This should be returned from your server
            star.dataset.voteCount = updatedVoteCount;
            tooltip.innerText = `Nombre de votes reçus : ${updatedVoteCount}`;

          });

        } else {
          console.log("Error in saving the rating:", resData.error);
        }

      }

    });

  });

}

function createImageHTML(image) {

  let imageHTML = `
    <div class="image-box" style="align-items:flex-start; margin: auto;" data-image-id="${image.id}" data-category="${image.categoryId}">
      
      <a class="image-card" href="/image/${image.id}">
      
        <h3 class="thumbnail-title text-white">${image.title}</h3>

          <div class="thumbnail-container">
            <img src="${image.path}" alt="${image.title}" class="thumbnail-image lozad">
          </div>

          <div style="margin:auto">
            <a class="userContent" href="/profile/${image.idUser}">
              <i class='bx bxs-user'></i><p class="usernameContent">${image.username}</p>
            </a>
          </div>

      </a>

    <div class="rating" style="margin:auto">
    
      <span class="rating__result" id="rating-result-${image.id}"></span>
  `;

  for (let i = 1; i <= 5; i++) {
    imageHTML += `<i class="rating__star ${image.average >= i ? "fas" : "far"} fa-star" data-star-value="${i}" data-vote-count="${image.voteCount}"></i>`;
  }

  imageHTML += `</div></div>`;

  let tempDiv = document.createElement("div");

  tempDiv.innerHTML = imageHTML.trim();
  let imageElement = tempDiv.firstElementChild;
  return imageElement;

}

let input = document.querySelector("#hashtagSearch");

input.addEventListener("keydown", async function (event) {

  if (event.key === "Enter") {

    event.preventDefault();
    let hashtag = input.value;

    if (hashtag.trim() !== "") {
      
      if (hashtag.startsWith("#")) {

        let encodedHashtag = encodeURIComponent(hashtag);
        let response = await fetch(`/search/${encodedHashtag}`);
        var newImagesWithRatings = await response.json();

      } else {

        let response = await fetch(`/search/${hashtag}`);
        var newImagesWithRatings = await response.json();
        
      }

      let imageContainer = document.querySelector(".imageRow");

      while (imageContainer.firstChild) {
        imageContainer.firstChild.remove();
      }

      newImagesWithRatings.forEach((image) => {

        let newImageElement = createImageHTML(image);
        imageContainer.appendChild(newImageElement);
        addRatingFunctionality(newImageElement);
        
      });

    } else {
      console.log("Le champ de recherche est vide.");
    }

  }
  
});
