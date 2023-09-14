const { requireAuth, requireAnon, unsetAuthToken } = require("../helpers/auth")
const { User } = require('../models');

const express = require('express');
const router = express.Router();

router.get('/login', requireAnon, (req, res) => {
    res.render('login');
});

// Login route
router.post('/login', (req, res) => {

    const { email, password } = req.body;
    
    User.authenticate(email, password, res)

    .then(user => {

        req.session.regenerate((err) => {

            if (err) {
                return next(err);
            }

            req.session.userId = user.id;
            res.redirect('/home');

        });

    })

    .catch(msg => {

        res.render('login', {
            messageClass: 'alert-danger',
            message: msg,
        });
        
    });
});

router.get('/logout', requireAuth, (req, res) => {

    req.session.bgColor = 'linear-gradient(#590098, #83008B,#D01D9B,#461783,#850050)'; // Reset the background color
    req.session.userId = undefined;

    req.session.destroy((err) => {

        if (err) {
            console.error('Error destroying session:', err);
        }

        unsetAuthToken(req, res);
        res.redirect('/login');
    });

});

router.get('/signup', (req, res) => {
    res.render('signup');
});

router.post('/signup', (req, res) => {

    User.new(req.body)

        .then(_ => {

            res.render('login', {
                messageClass: 'alert-success',
                message: 'Registration Complete. Please login to continue.'
            })

        }).catch(msg => { 

            res.render('signup', {
                messageClass: 'alert-danger',
                message: msg
            }) 

        })
});

router.get('/resetmdp', (req, res) => {
    res.render('resetmdp');
});

// Here, create a router.post to send an email using OAuth

module.exports = router;
