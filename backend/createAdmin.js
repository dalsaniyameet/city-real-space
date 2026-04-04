// Run this ONCE to create admin user:
// node createAdmin.js

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function createAdmin() {
  await mongoose.connect(process.env.MONGO_URI);

  await User.deleteMany({ role: 'admin' });

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

  console.log('✅ Admin created!');
  console.log('   Email:    patelshriji72@gmail.com');
  console.log('   Password: CRS@Meet#2026!');
  process.exit(0);
}

createAdmin().catch(err => { console.error(err); process.exit(1); });
