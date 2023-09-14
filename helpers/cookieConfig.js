const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { getSessionUser } = require("./auth");

// Register middlewares
module.exports = function(app) {
    app.use(bodyParser.urlencoded({ extended: true })); // parse POST data
    app.use(cookieParser('secret'));
    app.use(getSessionUser);
}