// Run this ONCE to create admin users:
// node createAdmin.js

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function createAdmin() {
  await mongoose.connect(process.env.MONGO_URI);

  // Delete existing admins
  await User.deleteMany({ role: 'admin' });

  // Admin 1 — Shriji
  await User.create({
    firstName: 'Shriji',
    lastName: 'Patel',
    email: 'patelshriji72@gmail.com',
    phone: '9825012824',
    password: 'CRS@Meet#2026!',
    role: 'admin',
    city: 'Ahmedabad',
    isVerified: true
  });

  // Admin 2 — City Real Space (info@)
  await User.create({
    firstName: 'City',
    lastName: 'Admin',
    email: 'info@cityrealspace.com',
    phone: '9825031247',
    password: 'CRS@Info#2026!',
    role: 'admin',
    city: 'Ahmedabad',
    isVerified: true
  });

  console.log('✅ Admins created!');
  console.log('   1. patelshriji72@gmail.com  / CRS@Meet#2026!');
  console.log('   2. info@cityrealspace.com   / CRS@Info#2026!');
  process.exit(0);
}

createAdmin().catch(err => { console.error(err); process.exit(1); });
