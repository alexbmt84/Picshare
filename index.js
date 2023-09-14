// Server config
const express = require('express');
const dotenv = require('dotenv');
const app = express();
const path = require('path');

// Déterminez le nom du fichier .env basé sur l'environnement actuel
const envFile = path.join(__dirname, `./.env.${process.env.NODE_ENV || 'development'}`);

dotenv.config({ path: envFile });

const port = process.env.PORT || 3000;

const neutral = `\x1b[0m`;
const purple = `\x1b[48;5;232m\x1b[1m\x1b[38;2;131;0;139m`;
const purpleblink = `\x1b[1m\x1b[5m\x1b[38;2;208;29;155m`;

// Get routes
const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');

// Session config
const sessionConfig = require('./sessionConfig');
app.use(sessionConfig);

// Views config
const viewConfig = require('./helpers/viewConfig');
viewConfig(app);

// Cookie config
const registerConfig = require('./helpers/cookieConfig');
registerConfig(app);

// Default and saving background color in session...
app.use((req, res, next) => {

    res.locals.bgColor = req.session.bgColor || 'linear-gradient(#590098, #83008B,#D01D9B,#461783,#850050)';
    next();
  
});

// Register routes
app.use('/', indexRouter);
app.use('/', authRouter);

app.listen(port, 'cpasdrole', () => {
    console.log(`\n${purple} Server is running on ${purpleblink}http://cpasdrole:${port} ${neutral}`);
});