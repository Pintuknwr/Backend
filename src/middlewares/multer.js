import multer from 'multer';
import path from 'path';

// Set up storage configuration for multer
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './public/temp'); // Specify the destination folder for uploaded files
    },
    filename: function(req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname)); // Create a unique filename
    }
});

export const upload = multer({ storage: storage });

