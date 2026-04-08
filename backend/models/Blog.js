const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title:     { type: String, required: true, trim: true },
  slug:      { type: String, unique: true },
  category:  { type: String, default: 'Market Insight' },
  content:   { type: String, default: '' },
  excerpt:   { type: String, default: '' },
  image:     { type: String, default: '' },
  author:    { type: String, default: 'CRS Team' },
  metaTitle:       { type: String, default: '' },
  metaDescription: { type: String, default: '' },
  isPublished: { type: Boolean, default: false },
  isFeatured:  { type: Boolean, default: false },
  views:     { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

blogSchema.pre('save', function (next) {
  if (!this.slug) {
    this.slug = this.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now();
  }
  next();
});

module.exports = mongoose.model('Blog', blogSchema);
