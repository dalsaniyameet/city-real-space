const fs = require('fs');
const base = 'c:/Users/meetd/Downloads/City Real Space/';

// 1. Fix titles (max 60 chars)
const titles = {
  'properties.html': 'Properties in Ahmedabad | Buy, Sell & Rent | City Real Space',
  'new-launch.html': 'New Launch Projects Ahmedabad 2025 | City Real Space',
  'buy.html':        'Buy Property in Ahmedabad | Flats & Villas | City Real Space',
  'rent.html':       'Rent Property in Ahmedabad | Flats for Rent | City Real Space',
  'blog.html':       'Real Estate Blog Ahmedabad | Tips & News | City Real Space',
};

// 2. Fix blog meta description (missing)
const blogDesc = 'Read latest real estate news, property tips and market insights for Ahmedabad. Expert advice on buying, selling and renting properties in Gujarat.';

// 3. Fix image alt tags per page
const altFixes = {
  'index.html': [
    ['alt=""', 'alt="City Real Space - Real Estate Ahmedabad"', 1],
    ['alt="City Real Space"', 'alt="City Real Space Logo - Trusted Real Estate Company Ahmedabad"', 1],
    ['alt="CRS"', 'alt="City Real Space Live Chat"', 1],
    ['alt="Visiting Card"', 'alt="City Real Space Visiting Card - Contact Amit Parmani"', 1],
    ['alt="City Real Space"', 'alt="City Real Space Office Banner Ahmedabad"', 2],
  ],
  'properties.html': [
    ['alt=""', 'alt="Properties for Sale and Rent in Ahmedabad | City Real Space"', 1],
  ],
  'blog.html': [
    ['alt=""', 'alt="City Real Space Real Estate Blog"', 1],
  ],
  'about.html': [
    ['alt=""', 'alt="City Real Space Team Ahmedabad"', 1],
  ],
  'contact.html': [
    ['alt=""', 'alt="Contact City Real Space Ahmedabad"', 1],
  ],
};

// Fix titles
for (const [file, newTitle] of Object.entries(titles)) {
  const fp = base + file;
  let c = fs.readFileSync(fp, 'utf8');
  c = c.replace(/<title>.*?<\/title>/, `<title>${newTitle}</title>`);
  fs.writeFileSync(fp, c);
  console.log(`Title fixed (${newTitle.length} chars): ${file}`);
}

// Fix blog description
const blogPath = base + 'blog.html';
let blog = fs.readFileSync(blogPath, 'utf8');
if (!blog.includes('name="description"')) {
  blog = blog.replace('<link rel="canonical"', `<meta name="description" content="${blogDesc}"/>\n  <link rel="canonical"`);
  fs.writeFileSync(blogPath, blog);
  console.log('Blog description added');
}

// Fix empty alt tags on all pages
const allPages = ['index.html','properties.html','blog.html','about.html','contact.html','buy.html','rent.html','new-launch.html','property-detail.html','blog-detail.html'];
for (const file of allPages) {
  const fp = base + file;
  let c = fs.readFileSync(fp, 'utf8');
  const before = (c.match(/alt=""/g) || []).length;
  // Replace generic empty alts with descriptive ones based on context
  c = c.replace(/(<img[^>]*src="[^"]*logo[^"]*"[^>]*)alt=""/gi, '$1alt="City Real Space Logo"');
  c = c.replace(/(<img[^>]*src="[^"]*banner[^"]*"[^>]*)alt=""/gi, '$1alt="City Real Space Ahmedabad Real Estate Banner"');
  c = c.replace(/(<img[^>]*src="[^"]*agent[^"]*"[^>]*)alt=""/gi, '$1alt="City Real Space Property Agent Ahmedabad"');
  c = c.replace(/(<img[^>]*src="[^"]*prop_[^"]*"[^>]*)alt=""/gi, '$1alt="Property for Sale in Ahmedabad | City Real Space"');
  c = c.replace(/(<img[^>]*src="[^"]*visiting[^"]*"[^>]*)alt=""/gi, '$1alt="City Real Space Visiting Card"');
  c = c.replace(/(<img[^>]*src="[^"]*unsplash[^"]*"[^>]*)alt=""/gi, '$1alt="Real Estate Property Ahmedabad"');
  // Remaining empty alts
  c = c.replace(/alt=""\s/g, 'alt="City Real Space Property" ');
  const after = (c.match(/alt=""/g) || []).length;
  fs.writeFileSync(fp, c);
  console.log(`Alt tags fixed in ${file}: ${before} empty → ${after} remaining`);
}

console.log('\nAll done!');
