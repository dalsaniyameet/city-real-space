const express   = require('express');
const cors      = require('cors');
const dotenv    = require('dotenv');
const path      = require('path');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(cors({ origin: '*', credentials: false }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', "default-src * 'unsafe-inline' 'unsafe-eval' data: blob:");
  next();
});

// Serve frontend static files
app.use(express.static(path.join(__dirname, '../')));
// Serve admin panel
app.use('/admin', express.static(path.join(__dirname, '../admin')));
// Serve uploaded images
app.use('/images', express.static(path.join(__dirname, '../images')));

// Routes
app.use('/api/auth',       require('./routes/auth'));
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

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
