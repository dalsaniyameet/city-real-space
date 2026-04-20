const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  title:       { type: String, required: true, trim: true },
  slug:        { type: String, default: '' },
  description: { type: String, default: '' },
  price:       { type: Number, required: true },
  priceLabel:  { type: String, default: '' }, // e.g. "₹1.2 Cr"
  type:        { type: String, enum: ['apartment', 'villa', 'plot', 'office', 'shop', 'showroom', 'warehouse', 'rowhouse', 'bungalow', 'factory', 'coworking', 'industrial_land'], required: true },
  category:    { type: String, enum: ['residential', 'commercial'], default: 'residential' },
  status:      { type: String, enum: ['for-sale', 'for-rent', 'new-launch', 'sold', 'rented'], default: 'for-sale' },
  location: {
    area:    { type: String, required: true },
    city:    { type: String, default: 'Ahmedabad' },
    state:   { type: String, default: 'Gujarat' },
    pincode: { type: String, default: '' },
    lat:     { type: Number, default: null },
    lng:     { type: Number, default: null }
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
  videoUrl:  { type: String, default: '' },
  floorPlan: { type: String, default: '' },
  facing:    { type: String, default: '' },
  ageOfProperty: { type: String, default: '' },
  pricePerSqft:  { type: Number, default: 0 },
  isRERA:    { type: Boolean, default: false },
  reraNo:    { type: String, default: '' },
  isFeatured:{ type: Boolean, default: false },
  isApproved: { type: Boolean, default: false },
  isRejected: { type: Boolean, default: false },
  rejectedReason: { type: String, default: '' },
  views:          { type: Number, default: 0 },
  recentContacts:  { type: Number, default: 0 },
  lastContactReset:{ type: Date, default: Date.now },
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
propertySchema.index({ slug: 1 });

// Slug generator
function generateSlug(type, status, id) {
  const base = (type + '-' + status)
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-');
  return base + '-' + String(id).slice(-8);
}
propertySchema.statics.generateSlug = generateSlug;

module.exports = mongoose.model('Property', propertySchema);
