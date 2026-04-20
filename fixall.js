const fs = require('fs');

// ===== about.html =====
let ab = fs.readFileSync('about.html', 'utf8');
ab = ab.replace(/font-size:1rem;">[^<]{1,10}<\/div>(\s*<div style="display:inline-flex[^>]*>)[^<]{1,10}Founder/,
  'font-size:1rem;"><i class="fa-solid fa-crown" style="color:#FFC107;"></i></div>$1<i class="fa-solid fa-star"></i> Founder');
fs.writeFileSync('about.html', ab, 'utf8');
console.log('about.html done');

// ===== admin/index.html =====
let ad = fs.readFileSync('admin/index.html', 'utf8');

const fixes = [
  // Dashboard spans
  [/>[^<]{1,8}Hot Picks<\/span>/g, '><i class="fa-solid fa-fire"></i> Hot Picks</span>'],
  [/>[^<]{1,8}Apartments<\/span>/g, '><i class="fa-solid fa-house"></i> Apartments</span>'],
  [/>[^<]{1,8}Offices<\/span>/g, '><i class="fa-solid fa-building"></i> Offices</span>'],
  // Requirements button
  [/>[^<]{1,8}Requirements<\/button>/g, '><i class="fa-solid fa-bell"></i> Requirements</button>'],
  // optgroup
  [/label="[^"]{1,8}Residential"/g, 'label="Residential"'],
  [/label="[^"]{1,8}Commercial"/g, 'label="Commercial"'],
  // options
  [/>[^<]{1,8}Apartment \/ Flat<\/option>/g, '>Apartment / Flat</option>'],
  [/>[^<]{1,8}Villa<\/option>/g, '>Villa</option>'],
  [/>[^<]{1,8}Bungalow \/ Independent House<\/option>/g, '>Bungalow / Independent House</option>'],
  [/>[^<]{1,8}Row House \/ Duplex<\/option>/g, '>Row House / Duplex</option>'],
  [/>[^<]{1,8}Residential Plot<\/option>/g, '>Residential Plot</option>'],
  [/>[^<]{1,8}Office Space<\/option>/g, '>Office Space</option>'],
  [/>[^<]{1,8}Shop<\/option>/g, '>Shop</option>'],
  [/>[^<]{1,8}Showroom<\/option>/g, '>Showroom</option>'],
  [/>[^<]{1,8}Warehouse<\/option>/g, '>Warehouse</option>'],
  [/>[^<]{1,8}Factory<\/option>/g, '>Factory</option>'],
  [/>[^<]{1,8}Co-working Space<\/option>/g, '>Co-working Space</option>'],
  [/>[^<]{1,8}Industrial Land<\/option>/g, '>Industrial Land</option>'],
  // labels
  [/>[^<]{1,8}Building \/ Society \/ Project<\/label>/g, '><i class="fa-solid fa-city"></i> Building / Society / Project</label>'],
  [/>[^<]{1,8}Seats \/ Cabins<\/label>/g, '><i class="fa-solid fa-chair"></i> Seats / Cabins</label>'],
  [/>[^<]{1,8}BHK \/ Configuration<\/label>/g, '><i class="fa-solid fa-bed"></i> BHK / Configuration</label>'],
  [/>[^<]{1,8}Bedrooms<\/label>/g, '><i class="fa-solid fa-bed"></i> Bedrooms</label>'],
  [/>[^<]{1,8}Bathrooms<\/label>/g, '><i class="fa-solid fa-shower"></i> Bathrooms</label>'],
  [/>[^<]{1,8}Balconies<\/label>/g, '><i class="fa-solid fa-door-open"></i> Balconies</label>'],
  [/>[^<]{1,8}Carpet Area \(sq\.ft\)<\/label>/g, '><i class="fa-solid fa-ruler-combined"></i> Carpet Area (sq.ft)</label>'],
  [/id="pSqftLabel">[^<]{1,8}Super Built-up Area \(sq\.ft\)<\/label>/g, 'id="pSqftLabel"><i class="fa-solid fa-ruler-combined"></i> Super Built-up Area (sq.ft)</label>'],
  [/>[^<]{1,8}Floor No\.<\/label>/g, '><i class="fa-solid fa-building"></i> Floor No.</label>'],
  [/>[^<]{1,8}Total Floors<\/label>/g, '><i class="fa-solid fa-layer-group"></i> Total Floors</label>'],
  [/>[^<]{1,8}Lift<\/label>/g, '><i class="fa-solid fa-elevator"></i> Lift</label>'],
  [/>[^<]{1,8}Parking<\/label>/g, '><i class="fa-solid fa-car"></i> Parking</label>'],
  [/>[^<]{1,8}Facing<\/label>/g, '><i class="fa-solid fa-compass"></i> Facing</label>'],
  [/>[^<]{1,8}Ownership<\/label>/g, '><i class="fa-solid fa-file-contract"></i> Ownership</label>'],
  [/>[^<]{1,8}Furnishing Status<\/label>/g, '><i class="fa-solid fa-couch"></i> Furnishing Status</label>'],
  [/>[^<]{1,8}Property Age<\/label>/g, '><i class="fa-solid fa-calendar"></i> Property Age</label>'],
  [/>[^<]{1,8}Age of Property<\/label>/g, '><i class="fa-solid fa-calendar"></i> Age of Property</label>'],
  [/>[^<]{1,8}Security<\/label>/g, '><i class="fa-solid fa-shield-halved"></i> Security</label>'],
  [/>[^<]{1,8}CCTV<\/label>/g, '><i class="fa-solid fa-video"></i> CCTV</label>'],
  [/>[^<]{1,8}Water Supply<\/label>/g, '><i class="fa-solid fa-droplet"></i> Water Supply</label>'],
  [/>[^<]{1,8}Garden \/ Park<\/label>/g, '><i class="fa-solid fa-leaf"></i> Garden / Park</label>'],
  [/>[^<]{1,8}Gym \/ Pool \/ Club<\/label>/g, '><i class="fa-solid fa-dumbbell"></i> Gym / Pool / Club</label>'],
  [/>[^<]{1,8}Available From<\/label>/g, '><i class="fa-solid fa-calendar-days"></i> Available From</label>'],
  [/>[^<]{1,8}Suitable For<\/label>/g, '><i class="fa-solid fa-bullseye"></i> Suitable For</label>'],
  [/>[^<]{1,8}All Inclusive<\/label>/g, '><i class="fa-solid fa-indian-rupee-sign"></i> All Inclusive</label>'],
  [/>[^<]{1,8}Price Negotiable<\/label>/g, '><i class="fa-solid fa-handshake"></i> Price Negotiable</label>'],
  [/>[^<]{1,8}Tax &amp; Govt Charges<\/label>/g, '><i class="fa-solid fa-landmark"></i> Tax &amp; Govt Charges</label>'],
  [/>[^<]{1,8}Booking Amount \(&#8377;\)<\/label>/g, '><i class="fa-solid fa-credit-card"></i> Booking Amount (&#8377;)</label>'],
  [/>[^<]{1,8}Maintenance \(Monthly &#8377;\)<\/label>/g, '><i class="fa-solid fa-wrench"></i> Maintenance (Monthly &#8377;)</label>'],
  [/>[^<]{1,8}Annual Dues \(&#8377;\)<\/label>/g, '><i class="fa-solid fa-calendar-check"></i> Annual Dues (&#8377;)</label>'],
  [/>[^<]{1,8}Membership Charge \(&#8377;\)<\/label>/g, '><i class="fa-solid fa-medal"></i> Membership Charge (&#8377;)</label>'],
  // spans
  [/>[^<]{1,8}Covered<\/span>/g, '><i class="fa-solid fa-warehouse"></i> Covered</span>'],
  [/>[^<]{1,8}Open<\/span>/g, '><i class="fa-solid fa-tree"></i> Open</span>'],
  // divs
  [/>[^<]{1,8}Key Amenities<\/div>/g, '><i class="fa-solid fa-star"></i> Key Amenities</div>'],
  [/>[^<]{1,8}Furnishing Includes<\/div>/g, '><i class="fa-solid fa-screwdriver-wrench"></i> Furnishing Includes</div>'],
  // furn items
  [/\/> [^<]{1,8}Lights<\/label>/g, '/> <i class="fa-solid fa-lightbulb"></i> Lights</label>'],
  [/\/> [^<]{1,8}Fans<\/label>/g, '/> <i class="fa-solid fa-fan"></i> Fans</label>'],
  [/\/> [^<]{1,8}AC<\/label>/g, '/> <i class="fa-solid fa-snowflake"></i> AC</label>'],
  [/\/> [^<]{1,8}Beds<\/label>/g, '/> <i class="fa-solid fa-bed"></i> Beds</label>'],
  [/\/> [^<]{1,8}Wardrobe<\/label>/g, '/> <i class="fa-solid fa-shirt"></i> Wardrobe</label>'],
  [/\/> [^<]{1,8}Sofa<\/label>/g, '/> <i class="fa-solid fa-couch"></i> Sofa</label>'],
  [/\/> [^<]{1,8}Dining Table<\/label>/g, '/> <i class="fa-solid fa-utensils"></i> Dining Table</label>'],
  [/\/> [^<]{1,8}Modular Kitchen<\/label>/g, '/> <i class="fa-solid fa-kitchen-set"></i> Modular Kitchen</label>'],
  [/\/> [^<]{1,8}Chimney<\/label>/g, '/> <i class="fa-solid fa-wind"></i> Chimney</label>'],
  [/\/> [^<]{1,8}Fridge<\/label>/g, '/> <i class="fa-solid fa-temperature-low"></i> Fridge</label>'],
  [/\/> [^<]{1,8}Washing Machine<\/label>/g, '/> <i class="fa-solid fa-soap"></i> Washing Machine</label>'],
  [/\/> [^<]{1,8}Geyser<\/label>/g, '/> <i class="fa-solid fa-shower"></i> Geyser</label>'],
];

fixes.forEach(([rx, rep]) => { ad = ad.replace(rx, rep); });

fs.writeFileSync('admin/index.html', ad, 'utf8');
console.log('admin/index.html done');
console.log('ALL DONE');
