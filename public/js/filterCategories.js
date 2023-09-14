// Filter categories function...

document.addEventListener('DOMContentLoaded', function() { // We load the DOM content...

  const categoryCheckboxes = document.querySelectorAll('.category-checkbox'); // Select checkboxes...
  const imageContainers = document.querySelectorAll('.image-box'); // Select image's boxes...

  categoryCheckboxes.forEach(function(checkbox) { // We pass the checkboxes as arguments...

    // Attach event listener to the checkbox element
    // The function will be executed each time the checkbox's state changes (checked or unchecked)
    checkbox.addEventListener('change', function() { 

      // Create an array from all checkboxes (Array.from(categoryCheckboxes))
      // Filter the array to only include checked checkboxes
      // Map the array to create a new array of the values of the checked checkboxes
      const selectedCategories = Array.from(categoryCheckboxes) 

        .filter(function(checkbox) {
          return checkbox.checked;
        })
        
        .map(function(checkbox) {
          return checkbox.value;
        });

      // Loop through each image container...
      imageContainers.forEach(function(container) {

        // Get the category assigned to this container (data-category attribute)
        const category = container.getAttribute('data-category');

        // If no categories are selected, or if the category of this container is included in the selected categories...
        if (selectedCategories.length === 0 || selectedCategories.includes(category)) {
          
          // Make this container visible
          container.style.display = 'flex';

        } else {

          // Hide this container
          container.style.display = 'none';

        }

      });

    });


  });

});