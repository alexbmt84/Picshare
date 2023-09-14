const express = require('express');
const exphbs = require('express-handlebars');
const { hbsHelpers } = require('./views');
require('../handlebars-helpers'); 
const path = require('path');


module.exports = function(app) {
    // Set up view engine
    const hbs = exphbs.create({
        extname: '.hbs',
        helpers: hbsHelpers,
    })

    app.engine('hbs', hbs.engine);
    app.set('views', path.join(__dirname, '../views'));
    app.set('view engine', 'hbs');


    // Specify from which directory to serve static files
    app.use(express.static('public'));
    app.use('/js', express.static(path.join(__dirname, 'public/js')));
    app.use('/images', express.static(path.join(__dirname, 'public/images'), {
        setHeaders: function (res, path, stat) {
            res.set('Cache-Control', 'public, max-age=31557600') // 1 year
        }
    }))
    
  }