const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema({
  name:         { type: String, required: true, trim: true },
  phone:        { type: String, required: true, trim: true },
  email:        { type: String, default: '', trim: true },
  propertyName: { type: String, default: '' },
  propertyType: { type: String, default: '' },
  interestedIn: { type: String, default: '' },
  lookingFor:   { type: String, default: '' },
  city:         { type: String, default: '' },
  budget:       { type: String, default: '' },
  area:         { type: String, default: '' },
  message:      { type: String, default: '' },
  refId:        { type: String, unique: true },
  status:       { type: String, enum: ['new', 'contacted', 'closed'], default: 'new' },
  createdAt:    { type: Date, default: Date.now }
});

// Auto generate refId
inquirySchema.pre('save', function (next) {
  if (!this.refId) {
    this.refId = 'CRS-' + Math.floor(100000 + Math.random() * 900000);
  }
  next();
});

module.exports = mongoose.model('Inquiry', inquirySchema);
