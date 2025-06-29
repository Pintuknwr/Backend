

import multer from 'multer';
import path from 'path';
import fs from 'fs';


// Set up storage configuration
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "./public/temp");
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }
});

export const upload = multer({ storage });



