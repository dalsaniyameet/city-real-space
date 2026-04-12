const express    = require('express');
const router     = express.Router();
const multer     = require('multer');
const cloudinary = require('cloudinary').v2;
const { protect } = require('../middleware/auth');

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Memory storage — file buffer Cloudinary ko bhejo, disk pe nahi
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: function(req, file, cb) {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only images allowed'));
  }
});

// POST /api/upload
router.post('/', protect, upload.single('file'), async function(req, res) {
  if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });

  try {
    // Buffer ko Cloudinary pe upload karo
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'cityrealspace', resource_type: 'image' },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(req.file.buffer);
    });

    res.json({
      success: true,
      url: result.secure_url,
      fullUrl: result.secure_url
    });
  } catch (err) {
    console.error('Cloudinary upload error:', err.message);
    res.status(500).json({ success: false, message: 'Image upload failed: ' + err.message });
  }
});

module.exports = router;
