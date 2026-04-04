const express  = require('express');
const router   = express.Router();
const Property = require('../models/Property');
const { protect, adminOnly } = require('../middleware/auth');

// GET /api/properties — with filters
router.get('/', async (req, res) => {
  try {
    const { category, type, status, city, area, minPrice, maxPrice, minSqft, maxSqft, beds, furnishing, possession, search, featured, page = 1, limit = 12 } = req.query;
    const query = { isApproved: true };

    if (category)   query.category = category;
    if (type)       query.type = type;
    if (status)     query.status = status;
    if (city)       query['location.city'] = new RegExp(city, 'i');
    if (area)       query['location.area'] = new RegExp(area, 'i');
    if (beds)       query['specs.beds'] = Number(beds);
    if (featured)   query.isFeatured = true;
    if (furnishing) query['extraDetails.furnished'] = new RegExp(furnishing, 'i');
    if (possession) query['extraDetails.possession'] = new RegExp(possession, 'i');
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (minSqft || maxSqft) {
      query['specs.sqft'] = {};
      if (minSqft) query['specs.sqft'].$gte = Number(minSqft);
      if (maxSqft) query['specs.sqft'].$lte = Number(maxSqft);
    }
    if (search) query.$text = { $search: search };

    const total = await Property.countDocuments(query);
    const properties = await Property.find(query)
      .sort({ isFeatured: -1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ success: true, total, page: Number(page), pages: Math.ceil(total / limit), properties });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/properties/trending — top 6 featured
router.get('/trending', async (req, res) => {
  try {
    const properties = await Property.find({ isFeatured: true, isApproved: true }).sort({ views: -1 }).limit(6);
    res.json({ success: true, properties });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/properties/residential
router.get('/residential', async (req, res) => {
  try {
    const properties = await Property.find({ category: 'residential', isApproved: true }).sort({ createdAt: -1 }).limit(8);
    res.json({ success: true, properties });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/properties/commercial
router.get('/commercial', async (req, res) => {
  try {
    const properties = await Property.find({ category: 'commercial', isApproved: true }).sort({ createdAt: -1 }).limit(8);
    res.json({ success: true, properties });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/properties/:id
router.get('/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ success: false, message: 'Property not found' });
    property.views += 1;
    await property.save();
    res.json({ success: true, property });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/properties/user-post — logged in user post (pending approval)
router.post('/user-post', protect, async (req, res) => {
  try {
    const property = await Property.create({
      ...req.body,
      isApproved: false,
      postedBy: req.user._id
    });
    res.status(201).json({ success: true, property });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/properties — admin only
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const property = await Property.create({ ...req.body, postedBy: req.user._id });
    res.status(201).json({ success: true, property });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/properties/:id — admin only
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!property) return res.status(404).json({ success: false, message: 'Property not found' });
    res.json({ success: true, property });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/properties/:id — admin only
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const property = await Property.findByIdAndDelete(req.params.id);
    if (!property) return res.status(404).json({ success: false, message: 'Property not found' });
    res.json({ success: true, message: 'Property deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/properties/:id/save — save to favorites
router.post('/:id/save', protect, async (req, res) => {
  try {
    const User = require('../models/User');
    const user = await User.findById(req.user._id);
    const propId = req.params.id;
    const idx = user.savedProperties.indexOf(propId);
    if (idx === -1) user.savedProperties.push(propId);
    else user.savedProperties.splice(idx, 1);
    await user.save();
    res.json({ success: true, saved: idx === -1, savedProperties: user.savedProperties });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
