const express         = require('express');
const cors            = require('cors');
const dotenv          = require('dotenv');
const path            = require('path');
const cookieParser    = require('cookie-parser');
const rateLimit       = require('express-rate-limit');
const helmet          = require('helmet');
const connectDB       = require('./config/db');

dotenv.config();
connectDB();

const app = express();

// ===== SECURITY HEADERS =====
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));

// ===== RATE LIMITING =====
const rateLimitHandler = (req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(429).json({ success: false, message: 'Too many requests. Please try again after 15 minutes.' });
  }
  res.status(429).sendFile(path.join(__dirname, '../429.html'));
};

// Global — har IP se max 500 req/15 min
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  handler: rateLimitHandler,
  standardHeaders: true,
  legacyHeaders: false
}));

// Auth routes — strict limit (login/register brute force rokne ke liye)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  handler: rateLimitHandler
});

// OTP verify — sabse strict (brute force attack rokne ke liye)
// 10 attempts / 15 min per IP — iske baad block
const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  handler: rateLimitHandler,
  standardHeaders: true,
  legacyHeaders: false
});

// ===== CORS =====
const allowedOrigins = [
  'http://localhost:5000',
  'http://localhost:3000',
  'http://127.0.0.1:5000',
  'https://cityrealspace.com',
  'https://www.cityrealspace.com',
  'https://city-real-space.onrender.com'
];
app.use(cors({
  origin: function(origin, callback) {
    // No origin = same-origin / server-to-server / curl — allow karo
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    // CORS block — 403 JSON, 500 nahi
    return callback(null, false);
  },
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// ===== INPUT SANITIZATION — NoSQL injection rokta hai =====
// express-mongo-sanitize v2 Express 5 ke saath compatible nahi hai (req.query read-only)
// Manual sanitization — sirf req.body sanitize karo
function sanitizeObject(obj) {
  if (!obj || typeof obj !== 'object') return;
  Object.keys(obj).forEach(key => {
    if (key.startsWith('$') || key.includes('.')) {
      console.warn(`⚠️  Blocked suspicious key: ${key}`);
      delete obj[key];
    } else if (typeof obj[key] === 'object') {
      sanitizeObject(obj[key]);
    }
  });
}
app.use((req, res, next) => {
  if (req.body) sanitizeObject(req.body);
  next();
});


app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', "default-src * 'unsafe-inline' 'unsafe-eval' data: blob: filesystem:");
  res.setHeader('X-Content-Type-Options', 'nosniff');
  next();
});

const FRONTEND = process.env.NODE_ENV === 'production'
  ? path.join(__dirname, '../')
  : path.join(__dirname, '../');

// Serve frontend static files
app.use(express.static(FRONTEND));
// Serve uploaded images
app.use('/images', express.static(path.join(FRONTEND, 'images')));

// Admin panel — login.html & assets freely accessible, index.html needs valid admin JWT
app.use('/admin', async (req, res, next) => {
  if (req.path === '/login.html' || req.path === '/style.css' || req.path === '/script.js') {
    return next();
  }
  if (req.path === '/' || req.path === '/index.html' || req.path === '') {
    const token = req.cookies && req.cookies.adminToken;
    if (!token) return res.redirect('/admin/login.html');
    try {
      const jwt = require('jsonwebtoken');
      const User = require('./models/User');
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (decoded.role !== 'admin') return res.redirect('/admin/login.html');
      // Single session check — token DB mein hona chahiye
      const user = await User.findById(decoded.id).select('loginSessions role');
      const validSession = user && user.loginSessions.some(s => s.token === token && new Date(s.expiresAt) > new Date());
      if (!validSession) return res.redirect('/admin/login.html');
      return next();
    } catch {
      return res.redirect('/admin/login.html');
    }
  }
  next();
});
app.use('/admin', express.static(path.join(FRONTEND, 'admin')));

// Routes
app.use('/api/auth',       authLimiter, require('./routes/auth'));
app.use('/api/properties', require('./routes/properties'));
app.use('/api/inquiry',    require('./routes/inquiry'));
app.use('/api/contact',    require('./routes/contact'));
app.use('/api/admin',      require('./routes/admin'));
app.use('/api/blogs',      require('./routes/blogs'));
app.use('/api/upload',     require('./routes/upload'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'City Real Space API is running', time: new Date() });
});

// 404 handler — API requests ko JSON, baaki sab ko 404.html
app.use((req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ success: false, message: 'Route not found' });
  }
  res.status(404).sendFile(path.join(FRONTEND, '404.html'));
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

module.exports = app;
