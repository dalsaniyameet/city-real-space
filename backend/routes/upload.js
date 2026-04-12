const express = require('express');
const router  = express.Router();
const multer  = require('multer');
const path    = require('path');
const { protect, adminOnly } = require('../middleware/auth');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, path.join(__dirname, '../../images'));
  },
  filename: function(req, file, cb) {
    const ext = path.extname(file.originalname) || '.jpg';
    cb(null, 'prop_' + Date.now() + '_' + Math.floor(Math.random() * 10000) + ext);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: function(req, file, cb) {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only images allowed'));
  }
});

// POST /api/upload — any logged in user can upload
router.post('/', protect, upload.single('file'), function(req, res) {
  if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
  const url = '/images/' + req.file.filename;
  const baseUrl = (process.env.NODE_ENV === 'production')
    ? 'https://city-real-space.vercel.app'
    : 'http://localhost:5000';
  res.json({ success: true, url, fullUrl: baseUrl + url });
});

module.exports = router;
