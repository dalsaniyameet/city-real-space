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

// ===== TRUST PROXY — Vercel/Render ke liye zaroori =====
app.set('trust proxy', 1);

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
  legacyHeaders: false,
  keyGenerator: (req) => req.ip || req.headers['x-forwarded-for']?.split(',')[0] || 'unknown'
}));

// Auth routes — strict limit
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  handler: rateLimitHandler,
  keyGenerator: (req) => req.ip || req.headers['x-forwarded-for']?.split(',')[0] || 'unknown'
});

// OTP verify — sabse strict
const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  handler: rateLimitHandler,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.ip || req.headers['x-forwarded-for']?.split(',')[0] || 'unknown'
});

// ===== CORS =====
const allowedOrigins = [
  'http://localhost:5000',
  'http://localhost:3000',
  'http://127.0.0.1:5000',
  'https://cityrealspace.com',
  'https://www.cityrealspace.com',
  'https://city-real-space.onrender.com',
  'https://city-real-space.vercel.app',
  'https://www.city-real-space.vercel.app'
];
app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
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

// Sitemap — dynamic, includes all approved property URLs
// NOTE: Must be before express.static to prevent static file from intercepting
app.get('/sitemap.xml', async (req, res) => {
  res.setHeader('Content-Type', 'application/xml');
  res.setHeader('Cache-Control', 'public, max-age=3600'); // 1 hour cache
  try {
    const Property = require('./models/Property');
    // Approved properties — slug ho ya na ho, dono include karo
    const properties = await Property.find({ isApproved: true })
      .select('slug location createdAt updatedAt type status')
      .lean();

    const base = 'https://www.cityrealspace.com';

    const staticUrls = [
      { loc: '/', priority: '1.0', changefreq: 'daily' },
      { loc: '/properties', priority: '0.9', changefreq: 'daily' },
      { loc: '/buy', priority: '0.9', changefreq: 'daily' },
      { loc: '/rent', priority: '0.9', changefreq: 'daily' },
      { loc: '/new-launch', priority: '0.8', changefreq: 'daily' },
      { loc: '/resale', priority: '0.8', changefreq: 'daily' },
      { loc: '/land', priority: '0.7', changefreq: 'daily' },
      { loc: '/prelease', priority: '0.7', changefreq: 'daily' },
      { loc: '/blog', priority: '0.8', changefreq: 'daily' },
      { loc: '/about', priority: '0.7', changefreq: 'weekly' },
      { loc: '/contact', priority: '0.7', changefreq: 'weekly' },
      { loc: '/post-property', priority: '0.8', changefreq: 'daily' },
      { loc: '/faq', priority: '0.6', changefreq: 'weekly' },
      { loc: '/careers', priority: '0.5', changefreq: 'weekly' },
      { loc: '/privacy', priority: '0.4', changefreq: 'yearly' },
      { loc: '/terms', priority: '0.4', changefreq: 'yearly' },

    ];

    const staticXml = staticUrls.map(u =>
      `  <url><loc>${base}${u.loc}</loc><priority>${u.priority}</priority><changefreq>${u.changefreq}</changefreq></url>`
    ).join('\n');

    const propXml = properties.map(p => {
      const city = (p.location?.city || 'ahmedabad').toLowerCase().replace(/\s+/g, '-');
      const area = (p.location?.area || 'gujarat').toLowerCase().replace(/\s+/g, '-');
      const lastmod = (p.updatedAt || p.createdAt) ? (p.updatedAt || p.createdAt).toISOString().split('T')[0] : '';
      // Slug ho to SEO URL, warna ID-based URL
      const propLoc = p.slug
        ? `${base}/property/${city}/${area}/${p.slug}`
        : `${base}/property-detail?id=${p._id}`;
      return `  <url><loc>${propLoc}</loc><priority>0.8</priority><changefreq>weekly</changefreq>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}</url>`;
    }).join('\n');

    res.send(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${staticXml}\n${propXml}\n</urlset>`);
  } catch (err) {
    console.error('Sitemap error:', err);
    res.send(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://www.cityrealspace.com/</loc></url></urlset>`);
  }
});

// Robots.txt
app.get('/robots.txt', (req, res) => {
  res.setHeader('Content-Type', 'text/plain');
  res.sendFile(path.join(__dirname, '../robots.txt'));
});

// Google Search Console verification
app.get('/google5N74CYScjt-N-OmxhcBkgdSd4ly-4FYBC0S82nxXFBk.html', (req, res) => {
  res.send('google-site-verification: google5N74CYScjt-N-OmxhcBkgdSd4ly-4FYBC0S82nxXFBk.html');
});

// Frontend path — Vercel pe __dirname = /var/task/backend, so go up one level
const FRONTEND = path.join(__dirname, '../');

// Serve frontend static files
app.use(express.static(FRONTEND, { index: 'index.html' }));
// Serve uploaded images
app.use('/images', express.static(path.join(FRONTEND, 'images')));

// Root — explicitly serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(FRONTEND, 'index.html'));
});

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

// SEO-friendly property URLs — /property/:city/:area/:slug
app.get('/property/:city/:area/:slug', (req, res) => {
  res.sendFile(path.join(FRONTEND, 'property-detail.html'));
});
app.get('/property/:slug', (req, res) => {
  res.sendFile(path.join(FRONTEND, 'property-detail.html'));
});

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
