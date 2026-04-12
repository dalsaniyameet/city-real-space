// ===== AUTH STATE ===== v2
const API = (function() {
// ===== PRICE FORMAT FUNCTION (global) =====
function formatPrice(price, status) {
  if (!price) return 'Price on Request';
  if (status === 'for-rent') {
    if (price >= 100000) return '₹' + (price/100000).toFixed(price%100000===0?0:1)+'L/mo';
    if (price >= 1000)   return '₹' + Math.round(price/1000)+'K/mo';
    return '₹' + price.toLocaleString('en-IN')+'/mo';
  }
  if (price >= 10000000) return '₹' + (price/10000000).toFixed(price%10000000===0?0:2).replace(/\.?0+$/,'')+' Cr';
  if (price >= 100000)   return '₹' + (price/100000).toFixed(price%100000===0?0:2).replace(/\.?0+$/,'')+' L';
  if (price >= 1000)     return '₹' + Math.round(price/1000)+'K';
  return '₹' + price.toLocaleString('en-IN');
}
const API = (function() {
  if (window.location.protocol === 'file:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:5000/api';
  }
  return 'https://city-real-space.vercel.app/api';
})();

console.log('🌐 Main Site - API Endpoint:', API);

async function checkAuthState() {
  const raw   = localStorage.getItem('user');
  const token = localStorage.getItem('token');
  // Guard: agar 'undefined' string ya invalid JSON ho toh clear karo
  let user = null;
  try { user = raw && raw !== 'undefined' ? JSON.parse(raw) : null; }
  catch { localStorage.removeItem('user'); localStorage.removeItem('token'); }
  const loginBtn       = document.getElementById('loginBtn');
  const userMenu       = document.getElementById('userMenu');
  const userNameDisplay = document.getElementById('userNameDisplay');
  const postPropBtn    = document.getElementById('postPropBtn');
  if (user && token && loginBtn && userMenu) {
    // Verify token is still valid (user not deleted by admin)
    try {
      const res = await fetch(`${API}/auth/me`, { headers: { Authorization: 'Bearer ' + token } });
      if (!res.ok) { handleLogout(); return; }
    } catch { /* network error — keep logged in */ }
    loginBtn.style.display = 'none';
    userMenu.style.display = 'block';
    userNameDisplay.textContent = user.firstName || user.email.split('@')[0];
    if (postPropBtn) postPropBtn.style.display = 'inline-flex';
  }
}

function handleLogout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.reload();
}

const userMenuBtn = document.getElementById('userMenuBtn');
const userDropdown = document.getElementById('userDropdown');
if (userMenuBtn) {
  userMenuBtn.addEventListener('click', () => {
    userDropdown.style.display = userDropdown.style.display === 'none' ? 'block' : 'none';
  });
  document.addEventListener('click', e => {
    if (!userMenuBtn.contains(e.target)) userDropdown.style.display = 'none';
  });
}

checkAuthState();

// ===== STATIC FALLBACK DATA =====
const staticTrending = [
    { _id:'s1', img: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80', badge: 'For Sale', price: '₹1.2 Cr', loc: 'Bopal, Ahmedabad', title: 'Luxurious 3BHK Villa with Garden', beds: 3, baths: 2, sqft: '1850', agent: 'RK', agentName: 'Rahul K.' },
    { _id:'s2', img: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&q=80', badge: 'New Launch', badgeClass: 'new', price: '₹85 L', loc: 'Giftcity, Gandhinagar', title: 'Premium 2BHK Smart Apartment', beds: 2, baths: 2, sqft: '1200', agent: 'PS', agentName: 'Priya S.' },
  { _id:'s3', img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80', badge: 'For Sale', price: '₹2.5 Cr', loc: 'Prahlad Nagar, Ahmedabad', title: 'Ultra-Modern 4BHK Penthouse', beds: 4, baths: 3, sqft: '3200', agent: 'AM', agentName: 'Amit M.' },
  { _id:'s4', img: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&q=80', badge: 'For Rent', badgeClass: 'rent', price: '₹35K/mo', loc: 'Satellite, Ahmedabad', title: 'Spacious 3BHK Semi-Furnished Flat', beds: 3, baths: 2, sqft: '1650', agent: 'NK', agentName: 'Neha K.' },
  { _id:'s13', img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80', badge: 'For Sale', price: '₹2.8 Cr', loc: 'Prahlad Nagar, Ahmedabad', title: 'Premium Office Space – 3500 sqft', beds: null, baths: null, sqft: '3500', agent: 'RS', agentName: 'Raj S.', type: 'office' },
  { _id:'s5', img: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&q=80', badge: 'For Sale', price: '₹1.8 Cr', loc: 'Thaltej, Ahmedabad', title: 'Elegant 3BHK Row House', beds: 3, baths: 3, sqft: '2100', agent: 'VD', agentName: 'Vijay D.' },
  { _id:'s16', img: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=600&q=80', badge: 'New Launch', badgeClass: 'new', price: '₹1.5 Cr', loc: 'Giftcity, Gandhinagar', title: 'GIFT City Office Suite – 2200 sqft', beds: null, baths: null, sqft: '2200', agent: 'NV', agentName: 'Neel V.', type: 'office' },
  { _id:'s6', img: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=600&q=80', badge: 'New Launch', badgeClass: 'new', price: '₹65 L', loc: 'Memnagar, Ahmedabad', title: 'Affordable 2BHK Apartment', beds: 2, baths: 1, sqft: '980', agent: 'SJ', agentName: 'Sonal J.' }
];
const staticResidential = [
  { _id:'s7', img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80', badge: 'For Sale', price: '₹95 L', loc: 'Shela, Ahmedabad', title: 'Modern 3BHK Apartment Complex', beds: 3, baths: 2, sqft: '1550', agent: 'AK', agentName: 'Ankit K.' },
  { _id:'s8', img: 'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=600&q=80', badge: 'For Sale', price: '₹1.4 Cr', loc: 'Vastrapur, Ahmedabad', title: 'Luxury 4BHK Duplex Villa', beds: 4, baths: 4, sqft: '2800', agent: 'MR', agentName: 'Meera R.' },
  { _id:'s9', img: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&q=80', badge: 'For Rent', badgeClass: 'rent', price: '₹22K/mo', loc: 'Navrangpura, Ahmedabad', title: 'Cozy 2BHK Furnished Apartment', beds: 2, baths: 1, sqft: '1050', agent: 'DP', agentName: 'Dhruv P.' },
  { _id:'s10', img: 'https://images.unsplash.com/photo-1576941089067-2de3c901e126?w=600&q=80', badge: 'New Launch', badgeClass: 'new', price: '₹72 L', loc: 'Chandkheda, Ahmedabad', title: 'Affordable 2BHK Gated Society', beds: 2, baths: 2, sqft: '1100', agent: 'HB', agentName: 'Hiral B.' },
  { _id:'s11', img: 'https://images.unsplash.com/photo-1598228723793-52759bba239c?w=600&q=80', badge: 'For Sale', price: '₹3.2 Cr', loc: 'Bodakdev, Ahmedabad', title: 'Premium 5BHK Bungalow', beds: 5, baths: 5, sqft: '4500', agent: 'JM', agentName: 'Jay M.' }
];
const staticCommercial = [
  { _id:'s13', img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80', badge: 'For Sale', price: '₹2.8 Cr', loc: 'Prahlad Nagar, Ahmedabad', title: 'Premium Office Space – 3500 sqft', beds: null, baths: null, sqft: '3500', agent: 'RS', agentName: 'Raj S.', type: 'office' },
  { _id:'s14', img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&q=80', badge: 'For Rent', badgeClass: 'rent', price: '₹1.2L/mo', loc: 'SG Highway, Ahmedabad', title: 'Corporate Office Floor – 5000 sqft', beds: null, baths: null, sqft: '5000', agent: 'KP', agentName: 'Kiran P.', type: 'office' },
  { _id:'s15', img: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&q=80', badge: 'For Sale', price: '₹85 L', loc: 'CG Road, Ahmedabad', title: 'Retail Shop in Prime Location', beds: null, baths: null, sqft: '650', agent: 'BT', agentName: 'Bhavesh T.', type: 'shop' },
  { _id:'s16', img: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=600&q=80', badge: 'New Launch', badgeClass: 'new', price: '₹1.5 Cr', loc: 'Giftcity, Gandhinagar', title: 'GIFT City Office Suite – 2200 sqft', beds: null, baths: null, sqft: '2200', agent: 'NV', agentName: 'Neel V.', type: 'office' },
  { _id:'s12', img: 'https://images.unsplash.com/photo-1565793298595-6a879b1d9492?w=600&q=80', badge: 'For Rent', badgeClass: 'rent', price: '₹45K/mo', loc: 'Iscon, Ahmedabad', title: 'Showroom Space – 1800 sqft', beds: null, baths: null, sqft: '1800', agent: 'SM', agentName: 'Sanjay M.', type: 'shop' }
];

// ===== CONVERT DB PROPERTY TO CARD FORMAT =====
function dbToCard(p) {
  const statusMap = { 'for-sale': 'For Sale', 'for-rent': 'For Rent', 'new-launch': 'New Launch', 'sold': 'Sold', 'rented': 'Rented' };
  const badgeClassMap = { 'for-rent': 'rent', 'new-launch': 'new' };
  return {
    _id: p._id,
    img: p.images?.[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&q=80',
    images: p.images || [],
    badge: statusMap[p.status] || p.status,
    badgeClass: badgeClassMap[p.status] || '',
    price: formatPrice(p.price, p.status),
    loc: `${p.location?.area}, ${p.location?.city}`,
    title: p.title,
    beds: p.category === 'commercial' ? null : (p.specs?.beds || 0),
    baths: p.category === 'commercial' ? null : (p.specs?.baths || 0),
    sqft: String(p.specs?.sqft || 0),
    agent: p.agent?.initials || 'CRS',
    agentName: p.agent?.name || 'CRS Agent',
    type: p.type
  };
}

// ===== RENDER CARD =====
function createCard(p) {
  const specs = p.beds !== null && p.beds !== undefined
    ? `<div class="cs"><i class="fa-solid fa-bed"></i>${p.beds} Beds</div>
       <div class="cs"><i class="fa-solid fa-bath"></i>${p.baths} Baths</div>
       <div class="cs"><i class="fa-solid fa-vector-square"></i>${p.sqft} sqft</div>`
    : `<div class="cs"><i class="fa-solid fa-vector-square"></i>${p.sqft} sqft</div>
       <div class="cs"><i class="fa-solid fa-building"></i>${p.type || 'Commercial'}</div>`;

  const fallbacks = [
    'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&q=80',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80'
  ];
  const imgs = p.images && p.images.length > 1 ? p.images : [p.img || fallbacks[0], fallbacks[1], fallbacks[2]];
  const id = 'cs_' + Math.random().toString(36).substr(2, 8);

  const slides = imgs.map((src, i) =>
    `<div class="ci-slide${i===0?' active':''}"><img src="${src}" alt="${p.title}" loading="lazy"/></div>`
  ).join('');

  const dots = `<div class="ci-dots">${imgs.map((_,i) =>
    `<span class="ci-dot${i===0?' active':''}" onclick="ciGo('${id}',${i},event)"></span>`
  ).join('')}</div>`;

  const arrows =
    `<button class="ci-arr ci-prev" onclick="ciMove('${id}',-1,event)"><i class="fa-solid fa-chevron-left"></i></button>` +
    `<button class="ci-arr ci-next" onclick="ciMove('${id}',1,event)"><i class="fa-solid fa-chevron-right"></i></button>`;

  return `
    <div class="prop-card" onclick="window.location.href='property-detail.html?id=${p._id}'" style="cursor:pointer">
      <div class="card-img" id="${id}">
        ${slides}${arrows}${dots}
        <span class="card-badge ${p.badgeClass || ''}">${p.badge}</span>
        <button class="card-fav" onclick="toggleFav(this)"><i class="fa-regular fa-heart"></i></button>
        <div class="card-price"><span>${p.price}</span></div>
      </div>
      <div class="card-body">
        <div class="card-loc"><i class="fa-solid fa-location-dot"></i>${p.loc}</div>
        <div class="card-title">${p.title}</div>
        <div class="card-specs">${specs}</div>
        <div class="card-footer">
          <div class="card-agent">
            <div class="agent-av">${p.agent}</div>
            <span class="agent-name">${p.agentName}</span>
          </div>
          <button class="btn-offer" onclick="requireLoginForOffer(event,'${p.title.replace(/'/g,"&apos;")}','${p.loc.replace(/'/g,"&apos;")}')">Get Offer</button>
        </div>
      </div>
    </div>`;
}

// Card image slider functions
function ciMove(id, dir, e) {
  e.stopPropagation();
  const wrap = document.getElementById(id);
  const slides = wrap.querySelectorAll('.ci-slide');
  const dots = wrap.querySelectorAll('.ci-dot');
  let cur = [...slides].findIndex(s => s.classList.contains('active'));
  slides[cur].classList.remove('active');
  if (dots[cur]) dots[cur].classList.remove('active');
  cur = (cur + dir + slides.length) % slides.length;
  slides[cur].classList.add('active');
  if (dots[cur]) dots[cur].classList.add('active');
}
function ciGo(id, idx, e) {
  e.stopPropagation();
  const wrap = document.getElementById(id);
  wrap.querySelectorAll('.ci-slide').forEach((s,i) => s.classList.toggle('active', i===idx));
  wrap.querySelectorAll('.ci-dot').forEach((d,i) => d.classList.toggle('active', i===idx));
}

// ===== LOAD PROPERTIES FROM BACKEND (fallback to static) =====
async function loadAllProperties() {
  if (!document.getElementById('trendingGrid')) return;

  // Check URL params for search filters
  const params = new URLSearchParams(window.location.search);
  const hasFilter = params.toString().length > 0;

  if (hasFilter) {
    // Show filtered results in trending section
    const sectionHead = document.querySelector('#trending .section-head h2');
    if (sectionHead) sectionHead.innerHTML = 'Search <span class="yellow">Results</span>';
    try {
      const res = await fetch(`${API}/properties?${params.toString()}&limit=12`);
      const data = await res.json();
      const grid = document.getElementById('trendingGrid');
      if (data.success && data.properties.length) {
        grid.innerHTML = data.properties.map(p => createCard(dbToCard(p))).join('');
      } else {
        grid.innerHTML = '<div style="text-align:center;padding:40px;color:#888;grid-column:1/-1"><i class="fa-solid fa-building" style="font-size:2rem;margin-bottom:12px;display:block"></i><p>No properties found matching your search.</p></div>';
      }
    } catch {
      document.getElementById('trendingGrid').innerHTML = staticTrending.map(createCard).join('');
    }
    // Still load sliders
    try {
      const [r, c] = await Promise.all([
        fetch(`${API}/properties/residential`).then(r => r.json()),
        fetch(`${API}/properties/commercial`).then(r => r.json())
      ]);
      const residential = (r.success && r.properties.length) ? r.properties.map(dbToCard) : staticResidential;
      const commercial  = (c.success && c.properties.length) ? c.properties.map(dbToCard) : staticCommercial;
      const resPadded = residential.length < 4 ? [...residential, ...staticResidential].slice(0, Math.max(residential.length, 4)) : residential;
      const comPadded = commercial.length  < 4 ? [...commercial,  ...staticCommercial].slice(0,  Math.max(commercial.length,  4)) : commercial;
      document.getElementById('resSlider').innerHTML = resPadded.map(createCard).join('');
      document.getElementById('comSlider').innerHTML = comPadded.map(createCard).join('');
    } catch {
      document.getElementById('resSlider').innerHTML = staticResidential.map(createCard).join('');
      document.getElementById('comSlider').innerHTML = staticCommercial.map(createCard).join('');
    }
  } else {
    try {
      const [t, r, c] = await Promise.all([
        fetch(`${API}/properties/trending`).then(r => r.json()),
        fetch(`${API}/properties/residential`).then(r => r.json()),
        fetch(`${API}/properties/commercial`).then(r => r.json())
      ]);
      const trending    = (t.success && t.properties.length)    ? t.properties.map(dbToCard) : staticTrending;
      const residential = (r.success && r.properties.length)    ? r.properties.map(dbToCard) : staticResidential;
      const commercial  = (c.success && c.properties.length)    ? c.properties.map(dbToCard) : staticCommercial;
      document.getElementById('trendingGrid').innerHTML = trending.map(createCard).join('');
      // Pad sliders to at least 4 cards for smooth loop
      const resPadded = residential.length < 4 ? [...residential, ...staticResidential].slice(0, Math.max(residential.length, 4)) : residential;
      const comPadded = commercial.length < 4  ? [...commercial,  ...staticCommercial].slice(0,  Math.max(commercial.length,  4)) : commercial;
      document.getElementById('resSlider').innerHTML = resPadded.map(createCard).join('');
      document.getElementById('comSlider').innerHTML = comPadded.map(createCard).join('');
    } catch {
      document.getElementById('trendingGrid').innerHTML = staticTrending.map(createCard).join('');
      document.getElementById('resSlider').innerHTML    = staticResidential.map(createCard).join('');
      document.getElementById('comSlider').innerHTML    = staticCommercial.map(createCard).join('');
    }
  }
  initSlider('resSlider', 'resPrev', 'resNext');
  initSlider('comSlider', 'comPrev', 'comNext');
}

// ===== PROPERTY SLIDER (smooth infinite marquee) =====
function initSlider(sliderId, prevId, nextId) {
  const slider = document.getElementById(sliderId);

  // Duplicate cards for seamless loop
  const origCards = Array.from(slider.children);
  origCards.forEach(card => slider.appendChild(card.cloneNode(true)));

  const totalW = () => {
    const card = slider.querySelector('.prop-card');
    return (card.offsetWidth + 24) * origCards.length;
  };

  let offset = 0;
  let speed = 1.2; // px per frame
  let paused = false;
  let raf;

  function animate() {
    if (!paused) {
      offset += speed;
      if (offset >= totalW()) offset = 0;
      slider.style.transform = `translateX(${-offset}px)`;
    }
    raf = requestAnimationFrame(animate);
  }

  animate();

  // Pause on hover
  slider.parentElement.addEventListener('mouseenter', () => paused = true);
  slider.parentElement.addEventListener('mouseleave', () => paused = false);

  // Manual buttons — jump by one card width
  const cardW = () => slider.querySelector('.prop-card').offsetWidth + 24;
  document.getElementById(nextId).addEventListener('click', () => { offset = Math.min(offset + cardW(), totalW() - 1); });
  document.getElementById(prevId).addEventListener('click', () => { offset = Math.max(offset - cardW(), 0); });
}
loadAllProperties();

// ===== HOME PAGE BLOG POSTS =====
(async function loadHomePosts() {
  const grid = document.getElementById('homePostsGrid');
  if (!grid) return;
  try {
    const res = await fetch(`${API}/blogs?limit=4`);
    const data = await res.json();
    if (data.success && data.blogs.length) {
      grid.innerHTML = data.blogs.map((b, i) => {
        const featured = i === 0;
        const date = new Date(b.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' });
        const link = b.slug ? 'blog-detail.html?slug=' + b.slug : 'blog.html';
        return `<div class="post-card${featured ? ' featured' : ''}">
          <div class="post-img">
            <img src="${b.image || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80'}" alt="${b.title}" loading="lazy"/>
            <span class="post-cat">${b.category}</span>
          </div>
          <div class="post-body">
            <div class="post-meta"><i class="fa-regular fa-calendar"></i> ${date} &nbsp;|&nbsp; <i class="fa-regular fa-user"></i> ${b.author || 'CRS Team'}</div>
            <h3>${b.title}</h3>
            <p>${b.excerpt || ''}</p>
            <a href="${link}" class="post-link">Read More <i class="fa-solid fa-arrow-right"></i></a>
          </div>
        </div>`;
      }).join('');
    } else {
      grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:40px;color:#aaa;"><i class="fa-solid fa-newspaper" style="font-size:2rem;margin-bottom:12px;display:block"></i><p>No blog posts yet. Check back soon!</p></div>';
    }
  } catch(e) {
    grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:40px;color:#aaa;"><i class="fa-solid fa-newspaper" style="font-size:2rem;margin-bottom:12px;display:block"></i><p>No blog posts yet. Check back soon!</p></div>';
  }
})();

// ===== HERO BG SLIDER =====
const heroSlides = document.querySelectorAll('.hero-slide');
if (heroSlides.length > 0) {
  let heroCurrent = 0;
  setInterval(() => {
    heroSlides[heroCurrent].classList.remove('active');
    heroCurrent = (heroCurrent + 1) % heroSlides.length;
    heroSlides[heroCurrent].classList.add('active');
  }, 4000);
}

// ===== STATS COUNTER =====
function animateCounter(el, target, duration) {
  let start = 0;
  const step = target / (duration / 16);
  const timer = setInterval(() => {
    start += step;
    if (start >= target) { start = target; clearInterval(timer); }
    el.textContent = Math.floor(start).toLocaleString() + el.dataset.suffix;
  }, 16);
}

const statsObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      document.querySelectorAll('.snum').forEach(el => {
        animateCounter(el, el.dataset.target, 3500);
      });
      statsObserver.disconnect();
    }
  });
}, { threshold: 0.5 });

const statsEl = document.querySelector('.stats-bar') || document.querySelector('.stats-inner');
if (statsEl) statsObserver.observe(statsEl);

// ===== STICKY HEADER =====
window.addEventListener('scroll', () => {
  document.getElementById('header').classList.toggle('scrolled', window.scrollY > 50);
  document.getElementById('backTop').classList.toggle('show', window.scrollY > 400);
});

// ===== BACK TO TOP =====
if (document.getElementById('backTop')) document.getElementById('backTop').addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ===== HAMBURGER =====
if (document.getElementById('hamburger')) document.getElementById('hamburger').addEventListener('click', () => {
  const nav = document.getElementById('nav');
  const btn = document.getElementById('hamburger');
  const isOpen = nav.classList.toggle('open');
  btn.classList.toggle('active', isOpen);
  btn.innerHTML = isOpen
    ? '<i class="fa-solid fa-xmark"></i>'
    : '<i class="fa-solid fa-bars"></i>';
});

// ===== SEARCH TABS =====
const cityLocalities = {
  'Ahmedabad': {
    'Prahlad Nagar':   ['Prahlad Nagar Cross Road','Commerce Six Roads','Anand Nagar Cross Road','Satellite Road','100 Feet Road Prahlad Nagar'],
    'Satellite':       ['Satellite Main Road','Jodhpur Cross Road','Ambawadi','Nehru Nagar','Judges Bungalow Road'],
    'Bopal':           ['Bopal Chokdi','South Bopal','Ambli Bopal Road','Shilaj','Ghuma'],
    'Thaltej':         ['Thaltej Cross Road','SG Highway Thaltej','Sola Road','Science City Road'],
    'Memnagar':        ['Memnagar Fire Station','Gurukul Road','Drive In Road','Navrangpura'],
    'Vastrapur':       ['Vastrapur Lake','Vastrapur Cross Road','Judges Bungalow','Bodakdev'],
    'Bodakdev':        ['Bodakdev Cross Road','100 Feet Road Bodakdev','Sindhu Bhavan Road'],
    'Navrangpura':     ['CG Road','Navrangpura Cross Road','Swastik Cross Road','Panchvati'],
    'Chandkheda':      ['Chandkheda Gam','Sola Bhagwat','Visat Cross Road','Tragad'],
    'Shela':           ['Shela Village','Shela Chokdi','Ambli Road Shela'],
    'SG Highway':      ['Sola','Gota','Motera','Ranip','Sabarmati'],
    'CG Road':         ['Navrangpura','Ellisbridge','Paldi','Ambawadi'],
    'Iscon':           ['Iscon Cross Road','Iscon Ambli Road','Bopal Road'],
    'Giftcity':        ['GIFT City Block 1','GIFT City Block 2','GIFT City SEZ','Infocity Road']
  },
  'Gandhinagar': {
    'Giftcity':  ['GIFT City Block 1','GIFT City Block 2','GIFT City SEZ'],
    'Sector 1':  ['Sector 1A','Sector 1B','Sector 1C'],
    'Sector 5':  ['Sector 5A','Sector 5B'],
    'Sector 11': ['Sector 11A','Sector 11B'],
    'Sector 21': ['Sector 21A','Sector 21B'],
    'Infocity':  ['Infocity Road','Infocity Phase 1','Infocity Phase 2']
  },
  'Surat': {
    'Adajan':   ['Adajan Patia','Adajan Gam','Pal Adajan Road','Rander Road'],
    'Vesu':     ['Vesu Main Road','Vesu Canal Road','Bhatar Road'],
    'Pal':      ['Pal Gam','Pal Bhatha','Pal Char Rasta'],
    'Katargam': ['Katargam Darwaja','Ring Road Katargam','Udhna Magdalla Road'],
    'Udhna':    ['Udhna Darwaja','Udhna Magdalla Road','Surat Udhna'],
    'Althan':   ['Althan Gam','Althan Bhatha','Bhatar Althan Road']
  },
  'Vadodara': {
    'Alkapuri':       ['Alkapuri Society','RC Dutt Road','Productivity Road'],
    'Gotri':          ['Gotri Road','Gotri Vasna Road','Sama Savli Road'],
    'Waghodia Road':  ['Waghodia Chokdi','Waghodia GIDC','Vadodara Waghodia'],
    'Manjalpur':      ['Manjalpur Gam','Manjalpur Char Rasta','Old Padra Road'],
    'Fatehgunj':      ['Fatehgunj Main Road','Old Padra Road','Fatehgunj Society']
  },
  'Rajkot': {
    'Kalawad Road':        ['Kalawad Road Chokdi','Nana Mava Road','Mavdi Chowk'],
    'Mavdi':               ['Mavdi Main Road','Mavdi Plot','Mavdi Chowk'],
    'Raiya Road':          ['Raiya Chokdi','Raiya Telephone Exchange','Raiya Road Society'],
    'University Road':     ['University Road Chokdi','Yagnik Road','Tagore Road'],
    '150 Feet Ring Road':  ['150 Feet Ring Road Chokdi','Bhaktinagar','Aji GIDC']
  }
};

document.querySelectorAll('.stab').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.stab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    // Commercial tab pe type auto set
    const typeEl = document.getElementById('searchType');
    if (btn.dataset.status === 'commercial') {
      typeEl.innerHTML = '<option value="">Property Type</option><option value="office">Office Space</option><option value="shop">Shop / Showroom</option><option value="warehouse">Warehouse</option>';
    } else {
      typeEl.innerHTML = '<option value="">Property Type</option><option value="apartment">Apartment / Flat</option><option value="villa">Villa</option><option value="bungalow">Bungalow</option><option value="rowhouse">Row House</option><option value="plot">Plot / Land</option><option value="office">Office Space</option><option value="shop">Shop / Showroom</option><option value="warehouse">Warehouse</option>';
    }
  });
});

// City select → locality populate
const cityEl = document.getElementById('searchCity');
const localityEl = document.getElementById('searchLocality');
if (cityEl && localityEl) {
  cityEl.addEventListener('change', function() {
    const localities = Object.keys(cityLocalities[this.value] || {});
    localityEl.innerHTML = '<option value="">Select Locality</option>' +
      localities.map(l => '<option value="' + l + '">' + l + '</option>').join('');
  });
}

// Search button
const mainSearchBtn = document.getElementById('mainSearchBtn');
if (mainSearchBtn) {
  mainSearchBtn.addEventListener('click', function() {
    const activeTab = document.querySelector('.stab.active');
    const status   = activeTab ? activeTab.dataset.status : '';
    const city     = cityEl ? cityEl.value : '';
    const locality = localityEl ? localityEl.value : '';
    const type     = document.getElementById('searchType') ? document.getElementById('searchType').value : '';
    const budget   = document.getElementById('searchBudget') ? document.getElementById('searchBudget').value : '';
    const params   = new URLSearchParams();
    if (status && status !== 'commercial') params.set('status', status);
    if (status === 'commercial') params.set('category', 'commercial');
    if (city)     params.set('city', city);
    if (locality) params.set('area', locality);
    if (type)     params.set('type', type);
    if (budget) {
      const [min, max] = budget.split('-');
      if (min) params.set('minPrice', min);
      if (max) params.set('maxPrice', max);
    }
    window.location.href = 'properties.html?' + params.toString();
  });
}

// ===== GET OFFER MODAL =====
(function(){
  const overlay = document.createElement('div');
  overlay.id = 'offerOverlay';
  overlay.style.cssText = 'position:fixed;inset:0;z-index:3000;background:rgba(13,27,42,0.75);backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center;padding:20px;opacity:0;pointer-events:none;transition:opacity 0.25s';
  overlay.innerHTML = `
    <div style="background:#fff;border-radius:20px;width:100%;max-width:460px;overflow:hidden;box-shadow:0 32px 80px rgba(0,0,0,0.3);transform:translateY(24px) scale(0.97);transition:transform 0.25s;position:relative">
      <div style="background:linear-gradient(135deg,#0D1B2A,#1a3a5c);padding:24px 28px 20px;">
        <button onclick="document.getElementById('offerOverlay').classList.remove('open');document.getElementById('offerOverlay').style.opacity='0';document.getElementById('offerOverlay').style.pointerEvents='none'" style="position:absolute;top:14px;right:14px;width:32px;height:32px;border-radius:50%;border:none;background:rgba(255,255,255,0.15);color:#fff;font-size:0.9rem;cursor:pointer;display:flex;align-items:center;justify-content:center;"><i class="fa-solid fa-xmark"></i></button>
        <p style="color:rgba(255,255,255,0.6);font-size:0.75rem;font-weight:600;letter-spacing:1px;text-transform:uppercase;margin-bottom:6px">Get Best Offer On</p>
        <h3 id="offerPropTitle" style="color:#fff;font-size:1.1rem;font-weight:800;margin:0 0 4px;line-height:1.3">Property</h3>
        <p id="offerPropLoc" style="color:#FFC107;font-size:0.8rem;display:flex;align-items:center;gap:5px;margin:0"><i class="fa-solid fa-location-dot"></i> <span></span></p>
      </div>
      <div style="padding:24px 28px">
        <div style="display:flex;flex-direction:column;gap:12px;margin-bottom:16px">
          <div style="display:flex;align-items:center;gap:10px;border:1.5px solid #e0e0e0;border-radius:10px;padding:11px 14px">
            <i class="fa-solid fa-user" style="color:#E53935;font-size:0.85rem"></i>
            <input id="offerName" type="text" placeholder="Your Full Name *" style="flex:1;border:none;outline:none;font-family:Poppins,sans-serif;font-size:0.88rem;color:#333;background:transparent" required/>
          </div>
          <div style="display:flex;align-items:center;gap:10px;border:1.5px solid #e0e0e0;border-radius:10px;padding:11px 14px">
            <i class="fa-solid fa-phone" style="color:#E53935;font-size:0.85rem"></i>
            <span style="font-size:0.85rem;font-weight:600;color:#555;border-right:1px solid #e0e0e0;padding-right:10px">+91</span>
            <input id="offerPhone" type="tel" placeholder="Mobile Number *" maxlength="10" style="flex:1;border:none;outline:none;font-family:Poppins,sans-serif;font-size:0.88rem;color:#333;background:transparent" required/>
          </div>
          <div style="display:flex;align-items:center;gap:10px;border:1.5px solid #e0e0e0;border-radius:10px;padding:11px 14px">
            <i class="fa-solid fa-clock" style="color:#E53935;font-size:0.85rem"></i>
            <select id="offerTime" style="flex:1;border:none;outline:none;font-family:Poppins,sans-serif;font-size:0.88rem;color:#555;background:transparent;cursor:pointer">
              <option value="">Preferred Call Time (Optional)</option>
              <option>Morning (9AM – 12PM)</option>
              <option>Afternoon (12PM – 3PM)</option>
              <option>Evening (3PM – 7PM)</option>
              <option>Anytime</option>
            </select>
          </div>
        </div>
        <div style="display:flex;gap:10px">
          <button id="offerWaBtn" style="flex:1;background:#25D366;color:#fff;border:none;padding:13px;border-radius:10px;font-size:0.88rem;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;font-family:Poppins,sans-serif;transition:all 0.2s">
            <i class="fa-brands fa-whatsapp" style="font-size:1rem"></i> WhatsApp
          </button>
          <button id="offerCallBtn" style="flex:1;background:#E53935;color:#fff;border:none;padding:13px;border-radius:10px;font-size:0.88rem;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;font-family:Poppins,sans-serif;transition:all 0.2s">
            <i class="fa-solid fa-phone"></i> Request Call
          </button>
        </div>
        <p style="text-align:center;font-size:0.72rem;color:#aaa;margin-top:10px">🔒 Your details are safe. No spam calls.</p>
      </div>
    </div>`;
  document.body.appendChild(overlay);

  // Open on overlay click close
  overlay.addEventListener('click', function(e) {
    if (e.target === overlay) {
      overlay.style.opacity = '0';
      overlay.style.pointerEvents = 'none';
    }
  });

  // WhatsApp button
  document.getElementById('offerWaBtn').addEventListener('click', function() {
    const name  = document.getElementById('offerName').value.trim();
    const phone = document.getElementById('offerPhone').value.trim();
    const title = document.getElementById('offerPropTitle').textContent;
    const loc   = document.getElementById('offerPropLoc').querySelector('span').textContent;
    if (!name || !phone) { alert('Please enter your name and phone number.'); return; }
    const msg = encodeURIComponent('Hi, I am ' + name + ' (+91 ' + phone + '). I am interested in: ' + title + ' (' + loc + '). Please share the best offer.');
    window.open('https://wa.me/919377531247?text=' + msg, '_blank');
    overlay.style.opacity = '0';
    overlay.style.pointerEvents = 'none';
  });

  // Call back button
  document.getElementById('offerCallBtn').addEventListener('click', async function() {
    const name  = document.getElementById('offerName').value.trim();
    const phone = document.getElementById('offerPhone').value.trim();
    const title = document.getElementById('offerPropTitle').textContent;
    const loc   = document.getElementById('offerPropLoc').querySelector('span').textContent;
    if (!name || !phone) { alert('Please enter your name and phone number.'); return; }
    try {
      await fetch(`${API}/inquiry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, propertyName: title, propertyType: title, lookingFor: 'Get Offer', city: loc, message: 'Get Offer request for: ' + title + ' (' + loc + ')' })
      });
    } catch(e) {}
    overlay.style.opacity = '0';
    overlay.style.pointerEvents = 'none';
    // Show toast
    let t = document.querySelector('.auth-toast');
    if (!t) { t = document.createElement('div'); t.className = 'auth-toast'; document.body.appendChild(t); }
    t.innerHTML = '<i class="fa-solid fa-circle-check"></i> Callback request sent! We\'ll call you shortly.';
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 3500);
  });

  // Auto-fill if user logged in
  const u = JSON.parse(localStorage.getItem('user') || 'null');
  if (u) {
    if (u.firstName) document.getElementById('offerName').value = (u.firstName + ' ' + (u.lastName || '')).trim();
    if (u.phone)     document.getElementById('offerPhone').value = u.phone.replace('+91','').trim();
  }

  window.openOfferModal = function(title, loc) {
    document.getElementById('offerPropTitle').textContent = title;
    document.getElementById('offerPropLoc').querySelector('span').textContent = loc;
    overlay.style.opacity = '1';
    overlay.style.pointerEvents = 'all';
    overlay.querySelector('div').style.transform = 'translateY(0) scale(1)';
  };
})();

// ===== FAVORITES =====
let favCount = 0;
async function toggleFav(btn) {
  // Login check
  if (!localStorage.getItem('token')) {
    showLoginPrompt('Save properties to your favourites!');
    return;
  }
  const icon = btn.querySelector('i');
  const isActive = btn.classList.toggle('active');
  icon.className = isActive ? 'fa-solid fa-heart' : 'fa-regular fa-heart';
  favCount += isActive ? 1 : -1;
  const favEl = document.querySelector('.fav-count');
  if (favEl) favEl.textContent = favCount;
  const token = localStorage.getItem('token');
  const card = btn.closest('.prop-card');
  if (token && card) {
    const onclick = card.getAttribute('onclick') || '';
    const match = onclick.match(/property-detail\.html\?id=([^'"]+)/);
    if (match) {
      try {
        await fetch(`${API}/properties/` + match[1] + '/save', {
          method: 'POST',
          headers: { 'Authorization': 'Bearer ' + token }
        });
      } catch(e) {}
    }
  }
}

// ===== LOGIN REQUIRED HELPERS =====
function requireLoginForOffer(e, title, loc) {
  e.stopPropagation();
  openOfferModal(title, loc);
}

function showLoginPrompt(msg) {
  // Auth modal open karo register tab pe
  const overlay = document.getElementById('authOverlay');
  if (overlay) {
    overlay.classList.add('open');
    if (typeof switchTab === 'function') switchTab('register');
    // Toast message
    let t = document.querySelector('.auth-toast');
    if (!t) { t = document.createElement('div'); t.className = 'auth-toast'; document.body.appendChild(t); }
    t.style.background = '#1565c0';
    t.innerHTML = '<i class="fa-solid fa-user"></i> ' + (msg || 'Please login to continue.');
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 3000);
  }
}

// ===== GIFT POPUP =====
const giftPopup = document.getElementById('giftPopup');
if (document.getElementById('giftBtn')) {
  document.getElementById('giftBtn').addEventListener('click', () => giftPopup.classList.toggle('open'));
  document.getElementById('giftPopupClose').addEventListener('click', e => { e.stopPropagation(); giftPopup.classList.remove('open'); });
}

let totalSecs = 23 * 3600 + 59 * 60 + 47;
function updateCountdown() {
  const h = String(Math.floor(totalSecs / 3600)).padStart(2, '0');
  const m = String(Math.floor((totalSecs % 3600) / 60)).padStart(2, '0');
  const s = String(totalSecs % 60).padStart(2, '0');
  const el = document.getElementById('giftCountdown');
  if (el) el.textContent = h + ':' + m + ':' + s;
  if (totalSecs > 0) totalSecs--;
}
updateCountdown();
setInterval(updateCountdown, 1000);

// ===== REGISTER AUTO POPUP =====
let isRegistered = !!localStorage.getItem('token');

let autoCloseTimer = null;
let repeatTimer = null;

function isUserTyping() {
  const active = document.activeElement;
  return active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.tagName === 'SELECT');
}

function openRegisterPopup() {
  if (isRegistered) return;
  if (isUserTyping()) return;
  const overlay = document.getElementById('authOverlay');
  if (!overlay) return;
  overlay.classList.add('open');
  document.querySelectorAll('.atab').forEach(b => b.classList.toggle('active', b.dataset.tab === 'register'));
  if (document.getElementById('loginForm')) document.getElementById('loginForm').classList.add('hidden');
  if (document.getElementById('registerForm')) document.getElementById('registerForm').classList.remove('hidden');
  clearTimeout(autoCloseTimer);
  clearTimeout(repeatTimer);
  autoCloseTimer = setTimeout(() => {
    if (isUserTyping()) return;
    overlay.classList.remove('open');
    if (!isRegistered) repeatTimer = setTimeout(openRegisterPopup, 30000);
  }, 8000);
}

setTimeout(openRegisterPopup, 3000);

let lastScrollPopup = 0;
window.addEventListener('scroll', () => {
  if (isUserTyping()) return;
  const scrolled = window.scrollY / (document.body.scrollHeight - window.innerHeight);
  const now = Date.now();
  if (scrolled > 0.4 && now - lastScrollPopup > 15000) {
    lastScrollPopup = now;
    openRegisterPopup();
  }
});

document.addEventListener('mouseleave', e => { if (e.clientY < 10 && !isUserTyping()) openRegisterPopup(); });

// ===== AUTH MODAL =====
const authOverlay = document.getElementById('authOverlay');
if (authOverlay) {

function closeAuthOverlay() {
  clearTimeout(autoCloseTimer);
  clearTimeout(repeatTimer);
  authOverlay.classList.remove('open');
}

document.getElementById('authClose').addEventListener('click', closeAuthOverlay);
authOverlay.addEventListener('click', e => { if (e.target === authOverlay) closeAuthOverlay(); });

document.querySelectorAll('.atab').forEach(btn => {
  btn.addEventListener('click', () => switchTab(btn.dataset.tab));
});

}

function switchTab(tab) {
  document.querySelectorAll('.atab').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
  document.getElementById('loginForm').classList.toggle('hidden', tab !== 'login');
  document.getElementById('registerForm').classList.toggle('hidden', tab !== 'register');
  document.getElementById('otpForm').classList.add('hidden');
  document.getElementById('loginOtpForm').classList.add('hidden');
  document.getElementById('forgotForm').classList.add('hidden');
  document.getElementById('forgotOtpForm').classList.add('hidden');
}

function showForgotFlow() {
  document.getElementById('loginForm').classList.add('hidden');
  document.getElementById('forgotForm').classList.remove('hidden');
  document.getElementById('forgotOtpForm').classList.add('hidden');
}

function showLoginForm() {
  document.getElementById('loginForm').classList.remove('hidden');
  document.getElementById('forgotForm').classList.add('hidden');
  document.getElementById('forgotOtpForm').classList.add('hidden');
}

function togglePass(id, btn) {
  const inp = document.getElementById(id);
  const isText = inp.type === 'text';
  inp.type = isText ? 'password' : 'text';
  btn.querySelector('i').className = isText ? 'fa-regular fa-eye' : 'fa-regular fa-eye-slash';
}

function showToast(msg) {
  let t = document.querySelector('.auth-toast');
  if (!t) { t = document.createElement('div'); t.className = 'auth-toast'; document.body.appendChild(t); }
  t.innerHTML = '<i class="fa-solid fa-circle-check"></i> ' + msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3500);
}

if (document.getElementById('loginForm')) {
  document.getElementById('loginForm').addEventListener('submit', async e => {
  e.preventDefault();
  const btn = e.target.querySelector('.btn-auth');
  const email    = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPass').value;
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Verifying...';
  btn.disabled = true;
  try {
    const res  = await fetch(`${API}/auth/login`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({email, password}) });
    const data = await res.json();
    if (data.success && data.needsOTP) {
      document.getElementById('loginForm').classList.add('hidden');
      document.getElementById('loginOtpForm').classList.remove('hidden');
      document.getElementById('loginOtpForm').dataset.email = email;
      document.getElementById('loginOtpEmailDisplay').textContent = email;
      document.getElementById('loginOtpInput').value = '';
      showToast('OTP sent to ' + email);
    } else if (data.success) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      window.location.reload();
    } else {
      showToast(data.message || 'Login failed');
    }
  } catch {
    showToast('Server error. Make sure backend is running.');
  }
  btn.innerHTML = 'Login to Account <i class="fa-solid fa-arrow-right"></i>';
  btn.disabled = false;
});



let _regData = {};
document.getElementById('registerForm').addEventListener('submit', async e => {
  e.preventDefault();
  const btn = e.target.querySelector('.btn-auth');
  const firstName = document.getElementById('regFirst').value.trim();
  const lastName  = document.getElementById('regLast').value.trim();
  const phone     = document.getElementById('regPhone').value.trim();
  const email     = document.getElementById('regEmail').value.trim();
  const role      = document.getElementById('regRole').value;
  const city      = document.getElementById('regCity').value;
  const password  = document.getElementById('regPass').value;

  // Basic email format check
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    showToast('Please enter a valid email address.');
    return;
  }

  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Validating email...';
  btn.disabled = true;

  // MX record check — real email domain verify
  try {
    const mx = await fetch(`${API}/auth/check-email?email=${encodeURIComponent(email)}`);
    const mxData = await mx.json();
    if (!mxData.valid) {
      showToast('Invalid email address. Please use a real email.');
      btn.innerHTML = 'Create Free Account <i class="fa-solid fa-arrow-right"></i>';
      btn.disabled = false;
      return;
    }
  } catch {
    // If MX check fails (network), allow to proceed
  }

  _regData = { firstName, lastName, phone, email, role, city, password };
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending OTP...';
  try {
    const res  = await fetch(`${API}/auth/register`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(_regData) });
    const data = await res.json();
    if (data.success) {
      document.getElementById('registerForm').classList.add('hidden');
      document.getElementById('otpEmailDisplay').textContent = email;
      document.getElementById('otpForm').classList.remove('hidden');
      document.getElementById('otpForm').dataset.email = email;
      document.getElementById('otpInput').value = '';
      showToast('OTP sent to ' + email);
    } else {
      showToast(data.message || 'Registration failed');
    }
  } catch {
    showToast('Server error. Make sure backend is running.');
  }
  btn.innerHTML = 'Create Free Account <i class="fa-solid fa-arrow-right"></i>';
  btn.disabled = false;
});

async function verifyRegisterOTP() {
  const btn   = document.getElementById('otpVerifyBtn');
  const email = document.getElementById('otpForm').dataset.email;
  const otp   = document.getElementById('otpInput').value.trim();
  if (!otp || otp.length < 6) { showToast('Enter 6-digit OTP'); return; }
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Verifying...';
  btn.disabled = true;
  try {
    const res  = await fetch(`${API}/auth/verify-register`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ email, otp }) });
    const data = await res.json();
    if (data.success) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('showWelcome', 'register');
      isRegistered = true;
      const redirect = sessionStorage.getItem('redirectAfterLogin');
      if (redirect) { sessionStorage.removeItem('redirectAfterLogin'); window.location.href = redirect; }
      else window.location.reload();
    } else {
      showToast(data.message || 'Invalid OTP');
    }
  } catch {
    showToast('Server error.');
  }
  btn.innerHTML = 'Verify & Activate Account <i class="fa-solid fa-check"></i>';
  btn.disabled = false;
}

async function resendOTP() {
  const email = document.getElementById('otpForm').dataset.email;
  if (!email) return;
  try {
    const res  = await fetch(`${API}/auth/resend-otp`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ email }) });
    const data = await res.json();
    showToast(data.success ? 'OTP resent to ' + email : (data.message || 'Error'));
  } catch { showToast('Server error.'); }
}

async function sendForgotOTP() {
  const btn   = document.getElementById('forgotSendBtn');
  const email = document.getElementById('forgotEmail').value.trim();
  if (!email) { showToast('Enter your email'); return; }
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
  btn.disabled = true;
  try {
    const res  = await fetch(`${API}/auth/forgot-password`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ email }) });
    const data = await res.json();
    if (data.success) {
      document.getElementById('forgotForm').classList.add('hidden');
      document.getElementById('forgotEmailDisplay').textContent = email;
      document.getElementById('forgotOtpForm').classList.remove('hidden');
      document.getElementById('forgotOtpForm').dataset.email = email;
      showToast('OTP sent to ' + email);
    } else {
      showToast(data.message || 'Error sending OTP');
    }
  } catch { showToast('Server error.'); }
  btn.innerHTML = 'Send OTP <i class="fa-solid fa-paper-plane"></i>';
  btn.disabled = false;
}

async function resetPassword() {
  const btn      = document.getElementById('resetPassBtn');
  const email    = document.getElementById('forgotOtpForm').dataset.email;
  const otp      = document.getElementById('forgotOtpInput').value.trim();
  const newPass  = document.getElementById('newPassInput').value;
  if (!otp || otp.length < 6) { showToast('Enter 6-digit OTP'); return; }
  if (!newPass || newPass.length < 6) { showToast('Password must be at least 6 characters'); return; }
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Resetting...';
  btn.disabled = true;
  try {
    const res  = await fetch(`${API}/auth/reset-password`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ email, otp, newPassword: newPass }) });
    const data = await res.json();
    if (data.success) {
      showToast('Password reset successfully! Please login.');
      showLoginForm();
      document.getElementById('loginEmail').value = email;
    } else {
      showToast(data.message || 'Invalid OTP');
    }
  } catch { showToast('Server error.'); }
  btn.innerHTML = 'Reset Password <i class="fa-solid fa-check"></i>';
  btn.disabled = false;
}

} // end loginForm block

async function verifyLoginOTP() {
  const btn   = document.getElementById('loginOtpVerifyBtn');
  const email = document.getElementById('loginOtpForm').dataset.email;
  const otp   = document.getElementById('loginOtpInput').value.trim();
  if (!otp || otp.length < 6) { showToast('Enter 6-digit OTP'); return; }
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Verifying...';
  btn.disabled = true;
  try {
    const res  = await fetch(`${API}/auth/verify-login`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ email, otp }) });
    const data = await res.json();
    if (data.success) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      const redirect = sessionStorage.getItem('redirectAfterLogin');
      if (redirect) { sessionStorage.removeItem('redirectAfterLogin'); window.location.href = redirect; }
      else window.location.reload();
    } else {
      showToast(data.message || 'Invalid OTP');
    }
  } catch {
    showToast('Server error.');
  }
  btn.innerHTML = 'Verify & Login <i class="fa-solid fa-check"></i>';
  btn.disabled = false;
}

async function resendLoginOTP() {
  const email = document.getElementById('loginOtpForm').dataset.email;
  if (!email) return;
  try {
    const res  = await fetch(`${API}/auth/resend-otp`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ email }) });
    const data = await res.json();
    showToast(data.success ? 'OTP resent to ' + email : (data.message || 'Error'));
  } catch { showToast('Server error.'); }
}

// ===== INQUIRY MODAL =====
const inqOverlay = document.getElementById('inqOverlay');
if (inqOverlay) {

document.querySelector('.btn-inquiry').addEventListener('click', () => {
  document.getElementById('inqForm').style.display = 'flex';
  document.querySelector('.inq-header').style.display = 'block';
  document.getElementById('inqSuccess').classList.remove('show');
  inqOverlay.classList.add('open');
});

document.getElementById('inqClose').addEventListener('click', () => inqOverlay.classList.remove('open'));
inqOverlay.addEventListener('click', e => { if (e.target === inqOverlay) inqOverlay.classList.remove('open'); });

document.getElementById('inqForm').addEventListener('submit', async e => {
  e.preventDefault();
  const btn = e.target.querySelector('.btn-auth');
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Submitting...';
  btn.disabled = true;
  const fields = e.target.querySelectorAll('input,select,textarea');
  const body = {
    name:         fields[0].value,
    phone:        fields[1].value,
    email:        fields[2].value,
    propertyType: fields[3].value,
    lookingFor:   fields[4].value,
    city:         fields[5].value,
    budget:       fields[6].value,
    area:         fields[7].value,
    message:      fields[8]?.value || ''
  };
  try {
    const res = await fetch(`${API}/inquiry`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    const data = await res.json();
    const refId = data.inquiry?.refId || ('CRS-' + Math.floor(100000 + Math.random() * 900000));
    document.getElementById('inqRefId').textContent = refId;
  } catch {
    document.getElementById('inqRefId').textContent = 'CRS-' + Math.floor(100000 + Math.random() * 900000);
  }
  document.getElementById('inqForm').style.display = 'none';
  document.querySelector('.inq-header').style.display = 'none';
  document.getElementById('inqSuccess').classList.add('show');
});

document.getElementById('inqSuccessClose').addEventListener('click', () => inqOverlay.classList.remove('open'));

}

// ===== NAV DROPDOWN MOBILE =====
document.querySelectorAll('.nav-drop-btn').forEach(btn => {
  btn.addEventListener('click', e => {
    if (window.innerWidth <= 768) {
      e.preventDefault();
      btn.closest('.nav-dropdown').classList.toggle('open');
    }
  });
});

// ===== NAV CLOSE ON LINK CLICK =====
document.querySelectorAll('.nav a').forEach(a => {
  a.addEventListener('click', () => {
    document.getElementById('nav').classList.remove('open');
    const btn = document.getElementById('hamburger');
    if (btn) { btn.classList.remove('active'); btn.innerHTML = '<i class="fa-solid fa-bars"></i>'; }
  });
});

// ===== LIVE CHAT WIDGET =====
const liveChatBtn = document.getElementById('liveChatBtn');
const liveChatWidget = document.getElementById('liveChatWidget');
const liveChatClose = document.getElementById('liveChatClose');

if (liveChatBtn && liveChatWidget) {
  liveChatBtn.addEventListener('click', () => liveChatWidget.classList.toggle('open'));
  liveChatClose.addEventListener('click', () => liveChatWidget.classList.remove('open'));
}

// AI Q&A knowledge base — City Real Space
const lcwQA = [
  {
    q: ['buy', 'purchase', 'kharidna', 'kharidu', 'kharidni', 'lena', 'leni', 'property chahiye', 'flat chahiye', 'ghar chahiye'],
    a: '🏠 Bilkul! Hamare paas 12,500+ verified properties hain — Ahmedabad, Gandhinagar, Surat mein. Aap kaunsa property type dhundh rahe hain?\n\n• Apartment / Flat\n• Villa / Bungalow\n• Plot / Land\n• Commercial'
  },
  {
    q: ['sell', 'bechna', 'bechu', 'list', 'bechni', 'property sell', 'meri property'],
    a: '💰 Hum aapki property best market price pe sell karenge! Free valuation + zero brokerage on select projects.\n\nAbhi WhatsApp karein: +91 93775 31247'
  },
  {
    q: ['rent', 'lease', 'kiraya', 'rental', 'kiraye pe', 'rent pe'],
    a: '🏡 Hamare paas ₹15,000/month se shuru rental properties hain. Kaun sa area aur BHK chahiye aapko?'
  },
  {
    q: ['2bhk', '2 bhk', 'two bhk', 'do bhk'],
    a: '🛏️ 2 BHK flats available hain:\n• Bopal: ₹55L – ₹75L\n• Satellite: ₹70L – ₹95L\n• Memnagar: ₹60L – ₹80L\n\nKaunsa area prefer karenge?'
  },
  {
    q: ['3bhk', '3 bhk', 'three bhk', 'teen bhk'],
    a: '🛏️ 3 BHK options:\n• Prahlad Nagar: ₹90L – ₹1.5Cr\n• Thaltej: ₹85L – ₹1.2Cr\n• Bopal: ₹75L – ₹1Cr\n\nBudget kya hai aapka?'
  },
  {
    q: ['4bhk', '4 bhk', 'four bhk', 'char bhk'],
    a: '🏠 4 BHK premium properties:\n• Prahlad Nagar: ₹1.5Cr – ₹2.5Cr\n• Bodakdev: ₹1.8Cr – ₹3Cr\n• Vastrapur: ₹1.6Cr – ₹2.8Cr\n\nSite visit book karein — bilkul free!'
  },
  {
    q: ['price', 'cost', 'budget', 'kitna', 'rate', 'kitne ka', 'daam', 'paisa'],
    a: '💎 Hamare properties ka range:\n• Budget: ₹30L – ₹60L\n• Mid Range: ₹60L – ₹1.5Cr\n• Premium: ₹1.5Cr – ₹5Cr+\n\nAapka budget kya hai? Best options suggest karunga!'
  },
  {
    q: ['bopal', 'satellite', 'prahlad nagar', 'thaltej', 'giftcity', 'gift city', 'memnagar', 'shela', 'vastrapur', 'bodakdev', 'navrangpura', 'chandkheda'],
    a: '📍 Hum sab prime areas cover karte hain — Bopal, Satellite, Prahlad Nagar, Thaltej, GIFT City, Memnagar, Shela aur bahut zyada!\n\nKaunse area mein property chahiye?'
  },
  {
    q: ['loan', 'home loan', 'finance', 'emi', 'bank', 'interest'],
    a: '🏦 Free Home Loan guidance dete hain hum! 15+ banks ke saath kaam karte hain — SBI, HDFC, ICICI, Axis.\n\nBest interest rate ke liye abhi call karein: +91 98250 12824'
  },
  {
    q: ['visit', 'site visit', 'dekhna', 'show', 'dikhao', 'visit book', 'free visit'],
    a: '🚗 FREE Site Visit — koi charge nahi!\n\nBas apna preferred date & time share karein, hum sab arrange kar denge. WhatsApp karein: +91 93775 31247'
  },
  {
    q: ['contact', 'call', 'phone', 'number', 'agent', 'baat', 'expert'],
    a: '📞 Hamare experts se baat karein:\n• +91 98250 12824\n• +91 84600 14000\n• admin@cityestate.co.in\n\nMon–Sat: 9AM – 7PM | Sun: 10AM – 4PM'
  },
  {
    q: ['new launch', 'new project', 'upcoming', 'naya', 'launch'],
    a: '🚀 New Launch projects available hain:\n• GIFT City — pre-launch prices\n• Bopal — 2 & 3 BHK\n• Shela — premium villas\n\nEarly bird discount ke liye abhi contact karein!'
  },
  {
    q: ['commercial', 'office', 'shop', 'warehouse', 'dukaan', 'godown'],
    a: '🏢 Commercial properties:\n• Office spaces: 500 – 10,000 sqft\n• Shops / Showrooms: CG Road, SG Highway\n• Warehouses: Sanand, Changodar\n\nKya requirement hai aapki?'
  },
  {
    q: ['brokerage', 'commission', 'charge', 'fees', 'zero brokerage'],
    a: '✅ Select projects pe Zero Brokerage! Aur sab properties pe transparent pricing — koi hidden charges nahi.'
  },
  {
    q: ['legal', 'document', 'registration', 'agreement', 'papers'],
    a: '📄 Free Legal Documentation help dete hain hum — sale agreement, registration, title verification sab.\n\nHamara legal team aapki poori help karega!'
  },
  {
    q: ['hello', 'hi', 'hey', 'helo', 'namaste', 'namaskar', 'kem cho', 'kaise ho'],
    a: '👋 Hello! City Real Space mein aapka swagat hai!\n\nMain aapki property search mein help kar sakta hoon. Aap kya dhundh rahe hain?'
  },
  {
    q: ['thanks', 'thank you', 'shukriya', 'dhanyawad', 'ok', 'okay', 'theek hai'],
    a: '🙏 Aapka shukriya! Koi bhi sawaal ho toh zaroor poochein. Hamare experts 30 minutes mein aapse contact karenge!'
  },
];

const lcwFinalMsg = '🙏 Thank you for chatting with us! Our property expert will contact you within 30 minutes. You can also call us directly at 📞 +91 98250 12824. Have a great day! 😊';

let lcwMsgCount = 0;

function lcwGetReply(text) {
  const lower = text.toLowerCase();
  for (const item of lcwQA) {
    if (item.q.some(k => lower.includes(k))) return item.a;
  }
  // Default smart fallback
  return '😊 Samajh gaya! Hamare property expert aapko 30 minutes mein call karenge.\n\nYa abhi call karein: 📞 +91 98250 12824';
}

function lcwAddMsg(text, type) {
  if (!liveChatWidget) return;
  const body = liveChatWidget.querySelector('.lcw-body');
  const div = document.createElement('div');
  div.className = 'lcw-msg ' + type;
  // Convert \n to <br> for formatting
  div.innerHTML = `<div class="lcw-bubble">${text.replace(/\n/g, '<br>')}</div>`;
  body.appendChild(div);
  body.scrollTop = body.scrollHeight;
}

function lcwShowTyping() {
  if (!liveChatWidget) return null;
  const body = liveChatWidget.querySelector('.lcw-body');
  const div = document.createElement('div');
  div.className = 'lcw-msg bot lcw-typing-msg';
  div.innerHTML = '<div class="lcw-bubble lcw-typing"><span></span><span></span><span></span></div>';
  body.appendChild(div);
  body.scrollTop = body.scrollHeight;
  return div;
}

function lcwBotReply(userText) {
  const typingEl = lcwShowTyping();
  lcwMsgCount++;
  const isLast = lcwMsgCount >= 4;
  setTimeout(() => {
    if (typingEl) typingEl.remove();
    const reply = isLast ? lcwFinalMsg : lcwGetReply(userText);
    lcwAddMsg(reply, 'bot');
    if (isLast) {
      const inp = document.getElementById('lcwInput');
      const snd = document.getElementById('lcwSend');
      if (inp) { inp.disabled = true; inp.placeholder = 'Call us: +91 98250 12824'; }
      if (snd) snd.disabled = true;
    }
  }, 1200);
}

function lcwQuick(text) {
  const qb = liveChatWidget.querySelector('.lcw-quick-btns');
  if (qb) qb.remove();
  lcwAddMsg(text, 'user');
  lcwBotReply(text);
}

if (document.getElementById('lcwSend')) {
  document.getElementById('lcwSend').addEventListener('click', lcwSendMsg);
  document.getElementById('lcwInput').addEventListener('keydown', e => { if (e.key === 'Enter') lcwSendMsg(); });
}

function lcwSendMsg() {
  const input = document.getElementById('lcwInput');
  const text = input.value.trim();
  if (!text || input.disabled) return;
  const qb = liveChatWidget && liveChatWidget.querySelector('.lcw-quick-btns');
  if (qb) qb.remove();
  lcwAddMsg(text, 'user');
  input.value = '';
  lcwBotReply(text);
}

// ===== COOKIE CONSENT =====
(function loadCookieConsent() {
  const s = document.createElement('script');
  s.src = 'cookie-consent.js';
  document.body.appendChild(s);
})();
