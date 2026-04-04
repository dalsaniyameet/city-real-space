const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  firstName:  { type: String, required: true, trim: true },
  lastName:   { type: String, required: true, trim: true },
  email:      { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone:      { type: String, required: true, trim: true },
  password:   { type: String, required: true, minlength: 6 },
  role:       { type: String, enum: ['buyer', 'seller', 'agent', 'builder', 'investor', 'admin', 'user', 'owner'], default: 'buyer' },
  city:       { type: String, default: '' },
  isVerified: { type: Boolean, default: false },
  resetOTP:       { type: String },
  resetOTPExpire: { type: Date },
  savedProperties: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Property' }],
  loginSessions: [{ token: String, expiresAt: Date }],
  createdAt:  { type: Date, default: Date.now }
});

// Hash password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
