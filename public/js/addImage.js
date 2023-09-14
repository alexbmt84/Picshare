// Attach event handler to all input elements of type 'file' for when the user selects a file
$("input[type='file']").change(function() {

    // 'this' refers to the file input element that triggered the event
    var input = this; 

    // Check if the file input contains files
    if (input.files && input.files[0]) {

        // Create a new FileReader object. This object lets web applications asynchronously read the contents of files.
        var reader = new FileReader();

        // Attach an onload event handler to the FileReader.
        // This event triggers when file reading has completed
        reader.onload = function(e) {

            // Create a new Image object
            var img = new Image();

            // Attach an onload event handler to the Image object.
            // This event triggers when the image has completely loaded
            img.onload = function() {

                // Set the source of the '#preview' img element to the data URL of the loaded file
                // and make it visible by changing its display property to 'block'
                $('#preview').attr('src', e.target.result).css('display', 'block');

            };

            // Set the source of the Image object to the data URL of the file
            img.src = reader.result;

        };

        // Start reading the file. When finished, the result attribute contains a data:URL representing the file's data.
        reader.readAsDataURL(input.files[0]);
    }

});
