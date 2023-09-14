// Function to read and display the image file selected by the user

function readURL(input) {

    // Check if input contains files
    if (input.files && input.files[0]) {

        // Create a new FileReader object. This object lets web applications asynchronously read the contents of files.
        var reader = new FileReader();

        // Event handler executed when the loading has been completed
        reader.onload = function(e) {

            // Set the background image of the .imagePreview element to the loaded file
            $('.imagePreview').css('background-image', 'url('+e.target.result +')');
            
            // Hide the .imagePreview element immediately
            $('.imagePreview').hide();
            
            // Gradually change the opacity from hidden to visible (fade in), over 650 milliseconds
            $('.imagePreview').fadeIn(650);

        }

        // Start reading the file. When finished, the result attribute contains a data:URL representing the file's data.
        reader.readAsDataURL(input.files[0]);

    }

}

// Event handler executed when the selected file has been changed
$("#imageUpload").change(function() {

    // Call the readURL function with the new selected file
    readURL(this);
    
});
