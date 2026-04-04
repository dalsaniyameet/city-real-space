const express  = require('express');
const router   = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const Property = require('../models/Property');
const Blog     = require('../models/Blog');
const Inquiry  = require('../models/Inquiry');
const User     = require('../models/User');
const twilio   = require('twilio');

router.use(protect, adminOnly);

// SEND WHATSAPP
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
    const { status } = req.query;
    const query = status === 'pending' ? { isApproved: false } : status === 'approved' ? { isApproved: true } : {};
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
    const property = await Property.findByIdAndUpdate(req.params.id, { isApproved: true }, { new: true });
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
