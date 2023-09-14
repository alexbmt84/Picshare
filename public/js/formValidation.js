// Email validation function...

function validateEmail(str) { // Take a string as argument (email)...

    var components = str.split("@"); // We split the email with "@"...

    if (components.length != 2) { // If we don't have to components after email splitted...

        return false; // Invalid email...

    }

    var domain = components[1].split("."); // We extract the domain... ()

    if (domain.length != 2 || domain[1].length < 2) { // If domain is != 2 and domain[1] < 2 (.com, .fr, .io...)

        return false; // Invalid email

    }

    return true; // If we pass all the conditions, then email is validet and we return true...

}

