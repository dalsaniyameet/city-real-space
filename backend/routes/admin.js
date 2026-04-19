const express  = require('express');
const router   = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const Property = require('../models/Property');
const Blog     = require('../models/Blog');
const Inquiry  = require('../models/Inquiry');
const User     = require('../models/User');
const twilio   = require('twilio');

router.use(protect, adminOnly);

// ===== SERVICES HEALTH CHECK =====
router.get('/services-status', async (req, res) => {
  const results = {};
  const start = Date.now();

  // 1. MongoDB
  try {
    const mongoose = require('mongoose');
    const state = mongoose.connection.readyState;
    results.mongodb = {
      name: 'MongoDB',
      status: state === 1 ? 'online' : 'offline',
      detail: state === 1 ? 'Connected' : 'Disconnected (state: ' + state + ')',
      ms: Date.now() - start
    };
  } catch(e) {
    results.mongodb = { name: 'MongoDB', status: 'error', detail: e.message, ms: Date.now() - start };
  }

  // 2. Cloudinary
  try {
    const t = Date.now();
    const https = require('https');
    await new Promise((resolve, reject) => {
      const req2 = https.get('https://api.cloudinary.com/v1_1/' + (process.env.CLOUDINARY_CLOUD_NAME || 'dhqan0w6t') + '/ping', { timeout: 5000 }, (r) => {
        results.cloudinary = { name: 'Cloudinary', status: r.statusCode < 400 ? 'online' : 'error', detail: 'HTTP ' + r.statusCode, ms: Date.now() - t };
        resolve();
      });
      req2.on('error', (e) => { results.cloudinary = { name: 'Cloudinary', status: 'offline', detail: e.message, ms: Date.now() - t }; resolve(); });
      req2.on('timeout', () => { results.cloudinary = { name: 'Cloudinary', status: 'timeout', detail: 'Request timed out', ms: Date.now() - t }; req2.destroy(); resolve(); });
    });
  } catch(e) {
    results.cloudinary = { name: 'Cloudinary', status: 'error', detail: e.message, ms: Date.now() - start };
  }

  // 3. SMTP (Nodemailer)
  try {
    const t = Date.now();
    const nodemailer = require('nodemailer');
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      connectionTimeout: 5000, greetingTimeout: 5000
    });
    await transporter.verify();
    results.smtp = { name: 'SMTP Email', status: 'online', detail: process.env.SMTP_USER || 'Connected', ms: Date.now() - t };
  } catch(e) {
    results.smtp = { name: 'SMTP Email', status: 'offline', detail: e.message.substring(0, 80), ms: Date.now() - start };
  }

  // 4. Twilio WhatsApp
  try {
    const t = Date.now();
    if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
      results.twilio = { name: 'WhatsApp (Twilio)', status: 'warning', detail: 'Credentials not configured', ms: 0 };
    } else {
      const twilio = require('twilio');
      const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
      await client.api.accounts(process.env.TWILIO_ACCOUNT_SID).fetch();
      results.twilio = { name: 'WhatsApp (Twilio)', status: 'online', detail: 'Account active', ms: Date.now() - t };
    }
  } catch(e) {
    results.twilio = { name: 'WhatsApp (Twilio)', status: 'offline', detail: e.message.substring(0, 80), ms: Date.now() - start };
  }

  // 5. Google Analytics (just DNS check)
  try {
    const t = Date.now();
    const https = require('https');
    await new Promise((resolve) => {
      const req2 = https.get('https://www.google-analytics.com/collect', { timeout: 4000 }, (r) => {
        results.ga = { name: 'Google Analytics', status: 'online', detail: 'Reachable', ms: Date.now() - t };
        resolve();
      });
      req2.on('error', () => { results.ga = { name: 'Google Analytics', status: 'offline', detail: 'Unreachable', ms: Date.now() - t }; resolve(); });
      req2.on('timeout', () => { results.ga = { name: 'Google Analytics', status: 'timeout', detail: 'Timed out', ms: Date.now() - t }; req2.destroy(); resolve(); });
    });
  } catch(e) {
    results.ga = { name: 'Google Analytics', status: 'error', detail: e.message, ms: Date.now() - start };
  }

  // 6. Vercel / Server itself
  results.server = {
    name: 'API Server',
    status: 'online',
    detail: 'Node ' + process.version + ' | Uptime: ' + Math.floor(process.uptime()) + 's',
    ms: Date.now() - start
  };

  res.json({ success: true, services: results, checkedAt: new Date() });
});

router.post('/send-wa', async (req, res) => {
  try {
    const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    await client.messages.create({
      from: process.env.TWILIO_WA_FROM,
      to:   process.env.CITY_WA_NUMBER,
      body: req.body.message
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// STATS
router.get('/stats', async (req, res) => {
  try {
    const Contact = require('../models/Contact');
    const [totalProps, pendingProps, approvedProps, totalUsers, totalInquiries, newInquiries, totalBlogs, latestInquiry, newContacts, latestContact, totalReqs, newReqs] = await Promise.all([
      Property.countDocuments(),
      Property.countDocuments({ isApproved: false }),
      Property.countDocuments({ isApproved: true }),
      User.countDocuments({ role: { $ne: 'admin' } }),
      Inquiry.countDocuments({ lookingFor: { $ne: 'Post Requirement' } }),
      Inquiry.countDocuments({ status: 'new', lookingFor: { $ne: 'Post Requirement' } }),
      Blog.countDocuments(),
      Inquiry.findOne({ lookingFor: { $ne: 'Post Requirement' } }).sort({ createdAt: -1 }).select('createdAt name phone'),
      require('../models/Contact').countDocuments({ status: 'new' }),
      require('../models/Contact').findOne().sort({ createdAt: -1 }).select('createdAt name phone'),
      Inquiry.countDocuments({ lookingFor: 'Post Requirement' }),
      Inquiry.countDocuments({ lookingFor: 'Post Requirement', status: 'new' })
    ]);
    res.json({ success: true, stats: { totalProps, pendingProps, approvedProps, totalUsers, totalInquiries, newInquiries, totalBlogs, latestInquiry, newContacts, latestContact, totalReqs, newReqs } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// USER SUBMITTED PROPERTIES
router.get('/user-properties', async (req, res) => {
  try {
    const properties = await Property.find({ postedBy: { $exists: true, $ne: null } })
      .populate('postedBy', 'firstName lastName email phone')
      .sort({ createdAt: -1 });
    res.json({ success: true, properties });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PROPERTIES
router.get('/properties', async (req, res) => {
  try {
    const { status, category, featured } = req.query;
    const query = {};
    if (status === 'pending')  query.isApproved = false;
    if (status === 'approved') query.isApproved = true;
    if (category) query.category = category;
    if (featured === 'true') query.isFeatured = true;
    const properties = await Property.find(query).sort({ createdAt: -1 });
    res.json({ success: true, properties });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/properties', async (req, res) => {
  try {
    const property = await Property.create({ ...req.body, postedBy: req.user._id, isApproved: true });
    res.status(201).json({ success: true, property });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put('/properties/:id/approve', async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(
      req.params.id,
      { isApproved: true, isRejected: false, rejectedReason: '' },
      { new: true }
    ).populate('postedBy', 'firstName phone');
    // WA notify user
    if (property && property.postedBy && property.postedBy.phone) {
      try {
        const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
        await client.messages.create({
          from: process.env.TWILIO_WA_FROM,
          to: 'whatsapp:+91' + property.postedBy.phone,
          body: '✅ *Property Approved – City Real Space*\n\nNamaste ' + (property.postedBy.firstName || '') + ' ji!\n\nAapki property *"' + property.title + '"* approve ho gayi hai aur ab website pe live hai.\n\n🌐 cityrealspace.com\n📞 +91 97235 50764'
        });
      } catch(e) { console.error('WA notify error:', e.message); }
    }
    res.json({ success: true, property });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put('/properties/:id/reject', async (req, res) => {
  try {
    const { reason } = req.body;
    const property = await Property.findByIdAndUpdate(
      req.params.id,
      { isApproved: false, isRejected: true, rejectedReason: reason || 'Does not meet listing standards' },
      { new: true }
    ).populate('postedBy', 'firstName phone');
    // WA notify user
    if (property && property.postedBy && property.postedBy.phone) {
      try {
        const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
        await client.messages.create({
          from: process.env.TWILIO_WA_FROM,
          to: 'whatsapp:+91' + property.postedBy.phone,
          body: '❌ *Property Rejected – City Real Space*\n\nNamaste ' + (property.postedBy.firstName || '') + ' ji,\n\nAapki property *"' + property.title + '"* approve nahi ho payi.\n\n📋 *Reason:* ' + (reason || 'Does not meet listing standards') + '\n\nKripya details update karke dobara submit karein.\n📞 Help: +91 97235 50764'
        });
      } catch(e) { console.error('WA notify error:', e.message); }
    }
    res.json({ success: true, property });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put('/properties/:id', async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, property });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete('/properties/:id', async (req, res) => {
  try {
    await Property.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Property deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// BLOGS
router.get('/blogs', async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json({ success: true, blogs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/blogs', async (req, res) => {
  try {
    const blog = new Blog(req.body);
    await blog.save();
    res.status(201).json({ success: true, blog });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put('/blogs/:id', async (req, res) => {
  try {
    const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, blog });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete('/blogs/:id', async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Blog deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// INQUIRIES (Post Requirement exclude)
router.get('/inquiries', async (req, res) => {
  try {
    const inquiries = await Inquiry.find({ lookingFor: { $ne: 'Post Requirement' } }).sort({ createdAt: -1 });
    res.json({ success: true, inquiries });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// REQUIREMENTS
router.get('/requirements', async (req, res) => {
  try {
    const requirements = await Inquiry.find({ lookingFor: 'Post Requirement' }).sort({ createdAt: -1 });
    res.json({ success: true, inquiries: requirements });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put('/inquiries/:id/status', async (req, res) => {
  try {
    const inquiry = await Inquiry.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.json({ success: true, inquiry });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete('/inquiries/:id', async (req, res) => {
  try {
    await Inquiry.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Inquiry deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// USERS
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: 'admin' } }).select('-password').sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete('/users/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
