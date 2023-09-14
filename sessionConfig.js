const session = require('express-session');

const sessionConfig = session({

    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { 
        //secure: process.env.NODE_ENV === 'production', // HTTPS needed...
        maxAge: 24 * 60 * 60 * 1000,  // 24 hours
        httpOnly: true,
        sameSite: 'strict'  // Helps against CSRF attacks
    },

    // Clear userId from the session if it is null or undefined
    // Before saving the session data
    beforeSave: (req, session) => {

        if (!session.userId) {
            delete session.userId;

        }

    }

});

module.exports = sessionConfig;
