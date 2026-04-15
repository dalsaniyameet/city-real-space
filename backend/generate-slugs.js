require('dotenv').config();
const mongoose = require('mongoose');
const Property = require('./models/Property');

function generateSlug(type, status, id) {
  const base = (type + '-' + status)
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-');
  return base + '-' + String(id).slice(-8);
}

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  const properties = await Property.find({});
  console.log(`Total properties: ${properties.length}`);

  let count = 0;
  for (const p of properties) {
    const slug = generateSlug(p.type, p.status, p._id);
    await Property.findByIdAndUpdate(p._id, { slug });
    console.log(`✓ ${p.title} → ${slug}`);
    count++;
  }

  console.log(`\nDone! Slugs generated for ${count} properties.`);
  process.exit(0);
}

run().catch(err => { console.error(err); process.exit(1); });
