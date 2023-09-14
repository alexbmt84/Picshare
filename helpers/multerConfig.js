// Multer Configuration

const multer = require('multer');
const path = require('path');
const mime = require('mime-types');

// Multer Avatar config 
const avatarStorage = multer.diskStorage({

    destination: (req, file, cb) => {

        cb(null, 'public/users/avatars'); // Where we'll store avatars
    },

    filename: (req, file, cb) => {

        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extname = path.extname(file.originalname);
        const fileName = 'avatar_' + uniqueSuffix + extname;
        
        req.avatarPath = fileName; // Store the file name in the request object
        cb(null, fileName); // File name + prefixes...

    }

});

const avatarUpload = multer({

    storage: avatarStorage,
    limits: {
      fileSize: 2 * 1024 * 1024, // Limit to 2 MB (in bytes)
    },

    fileFilter: (req, file, cb) => {

        // Check the file type
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];
        const fileMimeType = mime.lookup(file.originalname);

        if (allowedMimeTypes.includes(fileMimeType)) {

        cb(null, true);

        } else {

            cb(new Error('Unsupported file type.'));

        }
    }

});

// Middleware multer to manage avatar upload
exports.avatarUpload = avatarUpload;

// Image storage config
const imageStorage = multer.diskStorage({

    destination : (req, file, cb) => {

        cb(null,"public/images")

    },

    filename: (req, file, cb) => {

        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extname = path.extname(file.originalname);
        const fileName = 'upload_' + uniqueSuffix + extname;
        req.avatarPath = fileName; // Store the file name in the request object
        cb(null, fileName); // Nom du fichier avatar avec le préfixe de chemin

    }

});

const imageUpload = multer({

    storage: imageStorage,
    limits: {
      fileSize: 2 * 1024 * 1024, // Limit to 2 MB (in bytes)
    },

    fileFilter: (req, file, cb) => {

        // Check the file type
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];
        const fileMimeType = mime.lookup(file.originalname);

        if (allowedMimeTypes.includes(fileMimeType)) {

        cb(null, true);

        } else {

            cb(new Error('Unsupported file type.'));

        }
    }

});

exports.imageUpload = imageUpload;
