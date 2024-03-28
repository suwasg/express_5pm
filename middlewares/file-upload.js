const multer = require('multer');
const fs = require('fs-extra'); // Import fs-extra for extended file system operations
const path = require('path');

// Define destination and filename functions separately for better readability and maintainability
const destination = async (req, file, cb) => {
    const fileDestination = 'uploads/images/';

    try {
        // Use fs-extra to ensure directory existence and create if it doesn't exist
        await fs.ensureDir(fileDestination);
        cb(null, fileDestination);
    } catch (err) {
        cb(err); // Pass any errors to multer callback
    }
};

const filename = (req, file, cb) => {
    const filenameWithoutExt = path.basename(file.originalname, path.extname(file.originalname));
    const ext = path.extname(file.originalname);
    cb(null, `${filenameWithoutExt}_${Date.now()}${ext}`);
};

const imageFilter = (req, file, cb) => {
    const allowedExtensions = /\.(jpg|png|jpeg|svg|jfif|gif|webp)$/i; // List of allowed extensions
    const isValidExtension = allowedExtensions.test(file.originalname);
    
    if (isValidExtension) {
        cb(null, true); // Accept the file
    } else {
        cb(new Error('Invalid file type. Allowed extensions: jpg, png, jpeg, svg, jfif, gif'), false); // Reject the file
    }
};

const storage = multer.diskStorage({
    destination: destination,
    filename: filename
});

const upload = multer({
    storage: storage,
    fileFilter: imageFilter,
    limits: {
        fileSize: 3000000 // 3mb
    },
    multiple:true
});

module.exports = upload;