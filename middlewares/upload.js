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

// Handle multiple file uploads
const multipleUpload = upload.fields([
  { name: 'cityImage', maxCount: 1 },
  { name: 'thumbnail', maxCount: 3 },
]);

module.exports = multipleUpload;