const multer = require('multer');
const path = require('path');

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

const multipleUpload = upload.fields([
    { name: 'cityImage', maxCount: 1 }, // Expects a field named "cityImage"
    { name: 'thumbnail', maxCount: 3 }, // Expects a field named "thumbnail"
  ]);

module.exports = multipleUpload;