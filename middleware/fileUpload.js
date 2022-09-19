const path = require("path");
const fs  = require("fs");
const multer = require("multer");

const fileFilter = (req, file, callback) => {
    if (file.mimetype.startsWith("image")) {
        callback(null, true);
    } else {
        callback("Upload files in an image format", false);
    }
}

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        const dirPath = path.resolve("uploads");
        if (!fs.existsSync(dirPath)){
            fs.mkdirSync(dirPath);
        }
        callback(null, dirPath);
    },
    filename: (req, file, callback) => {
        callback(null, `${Date.now()}-${file.fieldname}-${file.originalname}`);
    }
});

module.exports = multer({ storage, fileFilter });


