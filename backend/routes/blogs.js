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

// GET /sitemap-blogs.xml — dynamic blog sitemap for Google
router.get('/sitemap', async (req, res) => {
  try {
    const blogs = await Blog.find({ isPublished: true }).select('slug createdAt').sort({ createdAt: -1 });
    const base = 'https://cityrealspace.com';
    const urls = blogs.map(b =>
      `  <url><loc>${base}/blog/${b.slug}</loc><lastmod>${new Date(b.createdAt).toISOString().split('T')[0]}</lastmod><priority>0.8</priority><changefreq>monthly</changefreq></url>`
    ).join('\n');
    res.setHeader('Content-Type', 'application/xml');
    res.send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`);
  } catch (err) {
    res.status(500).send('');
  }
});

// GET /api/blogs/:slug — single blog
router.get('/:slug', async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug, isPublished: true });
    if (!blog) return res.status(404).json({ success: false, message: 'Blog not found' });
    if (req.query.countView === '1') {
      await Blog.findByIdAndUpdate(blog._id, { $inc: { views: 1 } });
      blog.views += 1;
    }
    res.json({ success: true, blog });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
