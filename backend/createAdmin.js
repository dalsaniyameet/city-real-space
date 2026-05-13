// Run this ONCE to create admin:
// node createAdmin.js
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function createAdmin() {
  await mongoose.connect(process.env.MONGO_URI);

  // Delete all existing admins
  await User.deleteMany({ role: 'admin' });

  // Admin 1 - City Real Space
  await User.create({
    firstName: 'City',
    lastName:  'Admin',
    email:     'info@cityrealspace.com',
    phone:     '9825031247',
    password:  'CRS@1247.',
    role:      'admin',
    city:      'Ahmedabad',
    isVerified: true
  });

  // Admin 2 - Patel Shriji
  await User.create({
    firstName: 'Patel',
    lastName:  'Shriji',
    email:     'patelshriji72@gmail.com',
    phone:     '',
    password:  'CRS@1247',
    role:      'admin',
    city:      'Ahmedabad',
    isVerified: true
  });

  console.log('✅ Admins created!');
  console.log('   info@cityrealspace.com / CRS@1247.');
  console.log('   patelshriji72@gmail.com / CRS@1247');
  process.exit(0);
}

createAdmin().catch(err => { console.error(err); process.exit(1); });
