// Auth Configuration

const crypto = require('crypto');
const fs = require('fs');

const TOKENSFILE = ".cookies";
const authTokens = {};

// we load cookies from the disk, though in production we'd likely store them in the DB or redis
// the below syntax is a function that's executed once when the module is required
// the function can't be called elsewhere (since it's enclosed in a local scope) but giving it a name documents what it does
(function loadTokensFromDisk() {
    fs.open(TOKENSFILE, 'a+', function (err, file) {
        if (err) {
            console.error("Error accessing tokens file", TOKENSFILE);
            return;
        }
        fs.readFile(TOKENSFILE, "utf-8", (err, res) => {
            const lines = res.split("\n").filter(line => { if (line != '') return line }); // REPASSER SUR CA
            for (let line of lines) {
                const tokenString = line.split(":");
                authTokens[tokenString[0]] = parseInt(tokenString[1]);
            }
        })
    })
})();

const writeTokenToDisk = (token, user_id) => {
    const tokenString = token + ":" + user_id.toString() + "\n";

    fs.appendFile(TOKENSFILE, tokenString, err => {
        if (err) {
            console.log("Error writing to tokens file", TOKENSFILE);
        }
    })
}

const deleteTokenFromDisk = (token) => {
    fs.readFile(TOKENSFILE, "utf-8", (err, res) => {
        if (err) {
            console.log("Error reading tokens file", TOKENSFILE);
        }
        else {
            const data = res.split("\n").filter(line => { if (!line.startsWith(token)) return line });
            fs.writeFile(TOKENSFILE, data.join("\n"), err => {
                if (err) {
                    console.log("Error writing to tokens file", TOKENSFILE);
                }
            })
        }
    })
}

const generateAuthToken = () => {
    return crypto.randomBytes(30).toString('hex');
}

module.exports = {

    setAuthToken: (userId, res) => {
        const authToken = generateAuthToken() + userId;

        writeTokenToDisk(authToken, userId);
        authTokens[authToken] = userId;
        res.cookie('AuthToken', authToken);
    },

    unsetAuthToken: (req, res) => {
        const authToken = req.cookies['AuthToken'];

        deleteTokenFromDisk(authToken);
        delete authTokens[authToken];
        res.clearCookie('AuthToken');
    },

    getSessionUser: (req, res, next) => {
        const authToken = req.cookies['AuthToken'];

        req.user = authTokens[authToken];
        res.locals.user = req.user;     // to retrieve the user in the template
        next();
    },

    // if there is an active user, we proceed to the next middleware function in the
    // the application’s request-response cycle.
    // if there is no active user, we immediately respond with a redirect 
    // (preventing all other middleware functions from being executed)
    requireAuth: (req, res, next) => {
        if (req.user) {
            next();
        } else {
            res.redirect("/login");
        }
    },

    requireAnon: (req, res, next) => {
        if (req.user) {
            res.redirect("/");
        } else {
            next();
        }
    },

    getHashedPassword: (password) => {
        const sha256 = crypto.createHash('sha256');
        const hash = sha256.update(password).digest('base64');
        return hash;
    }

}
