// seed-trp.js — Run: node seed-trp.js
// TRP Mall — The Retail Park ka poora data DB mein insert karta hai

require('dotenv').config();
const mongoose = require('mongoose');
const Project  = require('./models/Project');

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ MongoDB connected');

  // Pehle check karo — already hai toh update, nahi toh create
  const existing = await Project.findOne({ slug: 'trp-mall-the-retail-park' });

  const data = {
    name:        'TRP Mall — The Retail Park',
    slug:        'trp-mall-the-retail-park',
    developer:   'City Real Space',
    category:    'commercial',
    location:    'Bopal – Ghuma BRTS Road, Central Bopal, Ahmedabad – 380058',
    rera:        'AG/GJ/AHMEDABAD/AHMEDABAD CITY/AA04965/010429R1',
    price:       'On Request',
    priceUnit:   'Contact for best deal',
    possession:  'Ready to Move',
    totalUnits:  '',
    area:        'Varies by unit',
    phone:       '9825031247',

    configs: [
      'Retail Shops',
      'Food Court Units',
      'Showroom Spaces',
      'Kiosk / Cart Spaces'
    ],

    floorPlans: [
      { config: 'Retail Shop (Ground)',   area: '200 – 500 sq.ft',  price: 'On Request' },
      { config: 'Retail Shop (Upper)',    area: '300 – 800 sq.ft',  price: 'On Request' },
      { config: 'Food Court Unit',        area: '150 – 400 sq.ft',  price: 'On Request' },
      { config: 'Showroom / Anchor',      area: '1000+ sq.ft',      price: 'On Request' }
    ],

    highlights: [
      'Prime Location — Bopal BRTS Road',
      'AC Mall Infrastructure',
      'High Footfall Area',
      'BRTS Connectivity — Direct Access',
      'Dedicated Parking for 200+ Vehicles',
      'Power Backup — 100%',
      'CCTV Surveillance',
      'Fire Safety Certified',
      'Food Court & Entertainment Zone',
      'Vaastu Compliant Design'
    ],

    amenities: [
      'Retail Shops',
      'Food Court',
      'Parking',
      'AC Mall',
      'Shopping',
      'Dining',
      'Entertainment',
      'BRTS Connectivity',
      'Lift',
      'Security',
      'CCTV',
      'Power Backup',
      'Fire Safety',
      'WiFi Zone'
    ],

    nearbyPlaces: [
      { name: 'Bopal BRTS Bus Stop',      distance: '50 m',    type: 'metro'    },
      { name: 'Central Bopal Main Road',   distance: '100 m',   type: 'highway'  },
      { name: 'Bopal Underpass',           distance: '300 m',   type: 'highway'  },
      { name: 'Top Schools (DPS, Euro)',   distance: '1 km',    type: 'school'   },
      { name: 'Apollo & Sterling Hospital',distance: '3 km',    type: 'hospital' },
      { name: 'AlphaOne Mall',             distance: '6 km',    type: 'mall'     },
      { name: 'Sardar Patel Airport',      distance: '20 km',   type: 'airport'  }
    ],

    description: `TRP Mall — The Retail Park is Ahmedabad's most strategically located commercial destination, situated on the prime Bopal–Ghuma BRTS Road in Central Bopal. 

With direct BRTS connectivity, massive daily footfall, and a fully air-conditioned mall infrastructure, TRP Mall offers unmatched visibility and business potential for retail shops, food court units, showrooms, and kiosk spaces.

Key advantages include 100% power backup, dedicated multi-level parking for 200+ vehicles, high-speed elevators, fire NOC certification, and 24×7 CCTV security. The project is RERA registered and Vaastu compliant.

Whether you are looking for a premium retail shop, a food court stall, or a large showroom space, TRP Mall provides the perfect commercial environment with modern amenities and unbeatable location advantage in Bopal, Ahmedabad.

Contact City Real Space today for unit availability, pricing, and site visit booking.`,

    image:     '',   // Admin se upload karein
    images:    [],
    videoUrl:  '',

    tags:        ['Commercial', 'Mall', 'Bopal', 'Retail Shop', 'Food Court', 'BRTS', 'Ahmedabad', 'Investment'],
    whatsappMsg: 'Hi, I am interested in TRP Mall — The Retail Park, Bopal Ahmedabad. Please share unit details and pricing.',
    isActive:    true
  };

  if (existing) {
    await Project.findByIdAndUpdate(existing._id, data);
    console.log('✅ TRP Mall project UPDATED in DB');
  } else {
    await Project.create(data);
    console.log('✅ TRP Mall project INSERTED in DB');
  }

  console.log('🔗 Live URL: https://www.cityrealspace.com/project/trp-mall-the-retail-park');
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch(e => { console.error('❌ Error:', e.message); process.exit(1); });
