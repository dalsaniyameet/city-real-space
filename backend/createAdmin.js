// Run this ONCE to create admin:
// node createAdmin.js
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function createAdmin() {
  await mongoose.connect(process.env.MONGO_URI);

  // Delete all existing admins
  await User.deleteMany({ role: 'admin' });

  // Only admin - City Real Space
  await User.create({
    firstName: 'City',
    lastName:  'Admin',
    email:     'info@cityrealspace.com',
    phone:     '9825031247',
    password:  'CRS@Info#2026!',
    role:      'admin',
    city:      'Ahmedabad',
    isVerified: true
  });

  console.log('✅ Admin created!');
  console.log('   info@cityrealspace.com / CRS@Info#2026!');
  process.exit(0);
}

createAdmin().catch(err => { console.error(err); process.exit(1); });
