const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  title:       { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  price:       { type: Number, required: true },
  priceLabel:  { type: String, default: '' }, // e.g. "₹1.2 Cr"
  type:        { type: String, enum: ['apartment', 'villa', 'plot', 'office', 'shop', 'warehouse', 'rowhouse', 'bungalow'], required: true },
  category:    { type: String, enum: ['residential', 'commercial'], default: 'residential' },
  status:      { type: String, enum: ['for-sale', 'for-rent', 'new-launch', 'sold', 'rented'], default: 'for-sale' },
  location: {
    area:    { type: String, required: true },
    city:    { type: String, default: 'Ahmedabad' },
    state:   { type: String, default: 'Gujarat' },
    pincode: { type: String, default: '' }
  },
  specs: {
    beds:  { type: Number, default: 0 },
    baths: { type: Number, default: 0 },
    sqft:  { type: Number, default: 0 },
    floors:{ type: Number, default: 1 }
  },
  images:    [{ type: String }],
  amenities: [{ type: String }],
  extraDetails: {
    balconies:   { type: Number, default: 0 },
    floor:       { type: String, default: '' },
    totalFloors: { type: String, default: '' },
    furnished:   { type: String, default: '' },
    possession:  { type: String, default: 'Ready to Move' },
    project:     { type: String, default: '' },
    tokenAmount: { type: String, default: '' },
    postedAs:    { type: String, default: '' }
  },
  isRERA:    { type: Boolean, default: false },
  reraNo:    { type: String, default: '' },
  isFeatured:{ type: Boolean, default: false },
  isApproved: { type: Boolean, default: false },
  views:     { type: Number, default: 0 },
  agent: {
    name:  { type: String, default: '' },
    phone: { type: String, default: '' },
    initials: { type: String, default: '' }
  },
  postedBy:  { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

// Text search index
propertySchema.index({ title: 'text', 'location.area': 'text', 'location.city': 'text' });

module.exports = mongoose.model('Property', propertySchema);
