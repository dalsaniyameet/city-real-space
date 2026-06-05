const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name:        { type: String, required: true, trim: true },
  developer:   { type: String, default: 'City Real Space', trim: true },
  location:    { type: String, required: true, trim: true },
  category:    { type: String, enum: ['commercial', 'residential'], default: 'residential' },
  rera:        { type: String, default: '' },
  price:       { type: String, default: 'On Request' },
  priceUnit:   { type: String, default: '' },
  image:       { type: String, default: '' },
  images:      [String],
  tags:        [String],
  phone:       { type: String, default: '9825031247' },
  whatsappMsg: { type: String, default: '' },
  description: { type: String, default: '' },
  highlights:  [String],
  amenities:   [String],
  configs:     [String],
  floorPlans:  [{
    config:  { type: String },
    area:    { type: String },
    price:   { type: String }
  }],
  nearbyPlaces: [{
    name:     { type: String },
    distance: { type: String },
    type:     { type: String, default: 'other' }
  }],
  area:        { type: String, default: '' },
  possession:  { type: String, default: '' },
  totalUnits:  { type: String, default: '' },
  videoUrl:    { type: String, default: '' },
  slug:        { type: String, default: '', unique: true, sparse: true },
  isActive:    { type: Boolean, default: true },
  createdAt:   { type: Date, default: Date.now }
});

module.exports = mongoose.model('Project', projectSchema);
