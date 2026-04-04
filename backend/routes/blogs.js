const express = require('express');
const router  = express.Router();
const Blog    = require('../models/Blog');

// GET /api/blogs — public, published only
router.get('/', async (req, res) => {
  try {
    const { category, limit = 10, page = 1 } = req.query;
    const query = { isPublished: true };
    if (category) query.category = category;
    const total = await Blog.countDocuments(query);
    const blogs = await Blog.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .select('-content');
    res.json({ success: true, total, blogs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/blogs/:slug — single blog
router.get('/:slug', async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug, isPublished: true });
    if (!blog) return res.status(404).json({ success: false, message: 'Blog not found' });
    blog.views += 1;
    await blog.save();
    res.json({ success: true, blog });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
