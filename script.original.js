// ===== DISABLE VIEW SOURCE ONLY =====
document.addEventListener('keydown', e => {
  // Ctrl+U (view-source), Ctrl+S (save), Ctrl+Shift+I/J/C (devtools), F12
  if (
    (e.ctrlKey && (e.key === 'u' || e.key === 'U')) ||
    (e.ctrlKey && (e.key === 's' || e.key === 'S')) ||
    (e.ctrlKey && e.shiftKey && ['i','I','j','J','c','C'].includes(e.key)) ||
    e.key === 'F12'
  ) e.preventDefault();
});

// ===== AUTH STATE ===== v2
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

console.log('ðŸŒ Main Site - API Endpoint:', API);

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
    } catch { /* network error â€” keep logged in */ }
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

// ===== AUTO LOGIN POPUP FOR GUEST USERS =====
(function() {
  const token = localStorage.getItem('token');
  const shown = sessionStorage.getItem('loginPopupShown');
  if (token || shown) return; // already logged in or already shown this session
  setTimeout(function() {
    const overlay = document.getElementById('authOverlay');
    if (!overlay) return;
    sessionStorage.setItem('loginPopupShown', '1');
    overlay.classList.add('open');
    if (typeof switchTab === 'function') switchTab('register');
  }, 20000); // 20 seconds baad show karo
})();

// ===== EMPTY STATE HTML =====
const emptyState = (msg) => `<div style="grid-column:1/-1;text-align:center;padding:60px 20px;color:#aaa;"><i class="fa-solid fa-building" style="font-size:3rem;margin-bottom:16px;display:block;opacity:0.3"></i><p style="font-size:1rem;font-weight:600;color:#bbb;">${msg || 'No properties available right now.'}</p><p style="font-size:0.82rem;margin-top:6px;">Check back soon or <a href="contact.html" style="color:#E53935;font-weight:700;">contact us</a> for latest listings.</p></div>`;
const emptySlide = (msg) => `<div style="min-width:100%;text-align:center;padding:60px 20px;color:#aaa;"><i class="fa-solid fa-building" style="font-size:3rem;margin-bottom:16px;display:block;opacity:0.3"></i><p style="font-size:1rem;font-weight:600;color:#bbb;">${msg || 'No properties available right now.'}</p></div>`;

// ===== CONVERT DB PROPERTY TO CARD FORMAT =====
function dbToCard(p) {
  const statusMap = { 'for-sale': 'For Sale', 'for-rent': 'For Rent', 'new-launch': 'New Launch', 'sold': 'Sold', 'rented': 'Rented' };
  const badgeClassMap = { 'for-rent': 'rent', 'new-launch': 'new' };
  const city = (p.location?.city || 'ahmedabad').toLowerCase().replace(/\s+/g, '-');
  const area = (p.location?.area || 'gujarat').toLowerCase().replace(/\s+/g, '-');
  const propUrl = p.slug
    ? '/property/' + city + '/' + area + '/' + p.slug
    : 'property-detail.html?id=' + p._id;
  return {
    _id: p._id,
    propUrl,
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
    <div class="prop-card" onclick="window.open('${p.propUrl || '/property-detail?id=' + p._id}','_blank')" style="cursor:pointer">
      <div class="card-img" id="${id}">
        ${slides}${arrows}${dots}
        <span class="card-badge ${p.badgeClass || ''}">${p.badge}</span>
        <button class="card-fav" onclick="toggleFav(this)"><i class="fa-regular fa-heart"></i></button>
        <div class="card-verified"><div class="card-verified-inner"><span class="cv-icon"><i class="fa-solid fa-check"></i></span> Verified</div></div>
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
          <button class="btn-offer" onclick="requireLoginForOffer(event,'${p.title.replace(/'/g,"&apos;")}','${p.loc.replace(/'/g,"&apos;")}')">Contact Now</button>
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

// ===== LOAD PROPERTIES FROM BACKEND (no static fallback) =====
async function loadAllProperties() {
  if (!document.getElementById('trendingGrid')) return;

  const params = new URLSearchParams(window.location.search);
  const hasFilter = params.toString().length > 0;

  if (hasFilter) {
    const sectionHead = document.querySelector('#trending .section-head h2');
    if (sectionHead) sectionHead.innerHTML = 'Search <span class="yellow">Results</span>';
    try {
      const res = await fetch(`${API}/properties?${params.toString()}&limit=12`);
      const data = await res.json();
      const grid = document.getElementById('trendingGrid');
      grid.innerHTML = (data.success && data.properties.length)
        ? data.properties.map(p => createCard(dbToCard(p))).join('')
        : emptyState('No properties found matching your search.');
    } catch {
      document.getElementById('trendingGrid').innerHTML = emptyState('Could not load properties. Please try again.');
    }
    try {
      const [r, c] = await Promise.all([
        fetch(`${API}/properties/residential`).then(r => r.json()),
        fetch(`${API}/properties/commercial`).then(r => r.json())
      ]);
      document.getElementById('resSlider').innerHTML = (r.success && r.properties.length) ? r.properties.map(p => createCard(dbToCard(p))).join('') : emptySlide('No residential properties available.');
      document.getElementById('comSlider').innerHTML = (c.success && c.properties.length) ? c.properties.map(p => createCard(dbToCard(p))).join('') : emptySlide('No commercial properties available.');
    } catch {
      document.getElementById('resSlider').innerHTML = emptySlide('Could not load properties.');
      document.getElementById('comSlider').innerHTML = emptySlide('Could not load properties.');
    }
  } else {
    try {
      const [t, r, c] = await Promise.all([
        fetch(`${API}/properties/trending`).then(r => r.json()),
        fetch(`${API}/properties/residential`).then(r => r.json()),
        fetch(`${API}/properties/commercial`).then(r => r.json())
      ]);
      document.getElementById('trendingGrid').innerHTML = (t.success && t.properties.length) ? t.properties.map(p => createCard(dbToCard(p))).join('') : emptyState('No trending properties right now. Check back soon!');
      document.getElementById('resSlider').innerHTML   = (r.success && r.properties.length) ? r.properties.map(p => createCard(dbToCard(p))).join('') : emptySlide('No residential properties available.');
      document.getElementById('comSlider').innerHTML   = (c.success && c.properties.length) ? c.properties.map(p => createCard(dbToCard(p))).join('') : emptySlide('No commercial properties available.');
    } catch {
      document.getElementById('trendingGrid').innerHTML = emptyState('Could not load properties. Please try again.');
      document.getElementById('resSlider').innerHTML    = emptySlide('Could not load properties.');
      document.getElementById('comSlider').innerHTML    = emptySlide('Could not load properties.');
    }
  }
  // Only init slider if cards exist
  if (document.querySelector('#resSlider .prop-card')) initSlider('resSlider', 'resPrev', 'resNext');
  if (document.querySelector('#comSlider .prop-card')) initSlider('comSlider', 'comPrev', 'comNext');
  // Auto scroll images inside each card
  startCardImageAutoScroll();
}

function startCardImageAutoScroll() {
  document.querySelectorAll('#resSlider .prop-card, #comSlider .prop-card, #trendingGrid .prop-card').forEach(function(card) {
    if (card.dataset.imgAuto) return;
    card.dataset.imgAuto = '1';
    const el = card.querySelector('.card-img');
    if (!el) return;
    const slides = el.querySelectorAll('.ci-slide');
    if (slides.length < 2) return;
    setInterval(function() {
      const dots = el.querySelectorAll('.ci-dot');
      let cur = [...slides].findIndex(s => s.classList.contains('active'));
      slides[cur].classList.remove('active');
      if (dots[cur]) dots[cur].classList.remove('active');
      cur = (cur + 1) % slides.length;
      slides[cur].classList.add('active');
      if (dots[cur]) dots[cur].classList.add('active');
    }, 4000); // 4 seconds per image
  });
}

// ===== PROPERTY SLIDER (smooth infinite marquee + drag/touch) =====
function initSlider(sliderId, prevId, nextId) {
  const slider = document.getElementById(sliderId);
  const wrap = slider.parentElement;

  // Duplicate cards for seamless loop
  const origCards = Array.from(slider.children);
  origCards.forEach(card => slider.appendChild(card.cloneNode(true)));

  slider.style.willChange = 'transform';

  const totalW = () => {
    const card = slider.querySelector('.prop-card');
    return (card.offsetWidth + 24) * origCards.length;
  };

  let offset = 0;
  let speed = 0.4;
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
  wrap.addEventListener('mouseenter', () => paused = true, { passive: true });
  wrap.addEventListener('mouseleave', () => paused = false, { passive: true });

  // Manual buttons
  const cardW = () => slider.querySelector('.prop-card').offsetWidth + 24;
  document.getElementById(nextId).addEventListener('click', () => {
    paused = true;
    offset = Math.min(offset + cardW(), totalW() - 1);
    slider.style.transform = `translateX(${-offset}px)`;
    setTimeout(() => paused = false, 2000);
  });
  document.getElementById(prevId).addEventListener('click', () => {
    paused = true;
    offset = Math.max(offset - cardW(), 0);
    slider.style.transform = `translateX(${-offset}px)`;
    setTimeout(() => paused = false, 2000);
  });

  // ===== MOUSE DRAG =====
  let isDragging = false, dragStartX = 0, dragStartOffset = 0;
  wrap.addEventListener('mousedown', e => {
    isDragging = true;
    paused = true;
    dragStartX = e.clientX;
    dragStartOffset = offset;
    wrap.style.cursor = 'grabbing';
  });
  window.addEventListener('mousemove', e => {
    if (!isDragging) return;
    const diff = dragStartX - e.clientX;
    offset = Math.max(0, Math.min(dragStartOffset + diff, totalW() - 1));
    slider.style.transform = `translateX(${-offset}px)`;
  }, { passive: true });
  window.addEventListener('mouseup', () => {
    if (!isDragging) return;
    isDragging = false;
    wrap.style.cursor = '';
    setTimeout(() => paused = false, 2000);
  });

  // ===== TOUCH SWIPE =====
  let touchStartX = 0, touchStartOffset = 0;
  wrap.addEventListener('touchstart', e => {
    paused = true;
    touchStartX = e.touches[0].clientX;
    touchStartOffset = offset;
  }, { passive: true });
  wrap.addEventListener('touchmove', e => {
    const diff = touchStartX - e.touches[0].clientX;
    offset = Math.max(0, Math.min(touchStartOffset + diff, totalW() - 1));
    slider.style.transform = `translateX(${-offset}px)`;
  }, { passive: true });
  wrap.addEventListener('touchend', () => {
    setTimeout(() => paused = false, 2000);
  }, { passive: true });
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
  function getSlideDelay(idx) {
    // Banner.png (index 0) ke liye 8 seconds, baaki ke liye 4 seconds
    return idx === 0 ? 8000 : 4000;
  }
  function nextHeroSlide() {
    heroSlides[heroCurrent].classList.remove('active');
    heroCurrent = (heroCurrent + 1) % heroSlides.length;
    heroSlides[heroCurrent].classList.add('active');
    setTimeout(nextHeroSlide, getSlideDelay(heroCurrent));
  }
  setTimeout(nextHeroSlide, getSlideDelay(0));
}

// ===== STATS COUNTER =====
function animateCounter(el, target, duration) {
  if (!target || isNaN(target)) return;
  const suffix = el.dataset.suffix || '';
  let start = 0;
  const step = target / (duration / 16);
  const timer = setInterval(() => {
    start += step;
    if (start >= target) { start = target; clearInterval(timer); }
    el.textContent = Math.floor(start).toLocaleString() + suffix;
  }, 16);
}

const statsObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      document.querySelectorAll('.snum[data-target]').forEach(el => {
        animateCounter(el, Number(el.dataset.target), 3500);
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
}, { passive: true });

// ===== BACK TO TOP =====
if (document.getElementById('backTop')) document.getElementById('backTop').addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ===== HAMBURGER =====
if (document.getElementById('hamburger')) document.getElementById('hamburger').addEventListener('click', () => {
  const nav = document.getElementById('mobileNav');
  const btn = document.getElementById('hamburger');
  if (!nav) return;
  const isOpen = nav.style.display === 'flex';
  if (isOpen) {
    nav.style.display = 'none';
    btn.innerHTML = '<i class="fa-solid fa-bars"></i>';
    document.body.style.overflow = '';
  } else {
    nav.style.display = 'flex';
    btn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    document.body.style.overflow = 'hidden';
  }
});

// ===== SEARCH TABS =====
const cityLocalities = {
  'Ahmedabad': {
    '100 Feet Road':    ['100 Feet Road Satellite','100 Feet Road Bodakdev','100 Feet Road Prahlad Nagar','100 Feet Road Anand Nagar'],
    'Adalaj':           ['Adalaj Village','Adalaj Chokdi','Adalaj GIDC','Near Adalaj Stepwell'],
    'Ambawadi':         ['Ambawadi Circle','Ambawadi Society','Judges Bungalow Road','Nehru Nagar Cross Road'],
    'Ambli':            ['Ambli Village','Ambli Bopal Road','Ambli Cross Road','Near Ambli Metro'],
    'Ashram Road':      ['Ashram Road Main','Income Tax','Ellis Bridge','Navrangpura'],
    'Bavla':            ['Bavla Chokdi','Bavla GIDC','Bavla Village','Near Bavla Highway'],
    'Bhadaj':           ['Bhadaj Village','Bhadaj Road','Near Bhadaj Lake'],
    'Bhat':             ['Bhat Village','Bhat GIDC','Near Bhat Flyover'],
    'Bhuyangdev':       ['Bhuyangdev Cross Road','Bhuyangdev Society','Near Bhuyangdev Temple'],
    'Bodakdev':         ['Bodakdev Cross Road','100 Feet Road Bodakdev','Sindhu Bhavan Road','Judges Bungalow Road'],
    'Bopal':            ['Bopal Chokdi','South Bopal','Ambli Bopal Road','Shilaj','Ghuma','Near Bopal Metro'],
    'CG Road':          ['Navrangpura','Ellisbridge','Paldi','Ambawadi','Swastik Cross Road','Panchvati'],
    'Chanakyapuri':     ['Chanakyapuri Society','Chanakyapuri Cross Road','Near Chanakyapuri Park'],
    'Chandkheda':       ['Chandkheda Gam','Sola Bhagwat','Visat Cross Road','Tragad','Near Chandkheda Metro'],
    'Chandlodia':       ['Chandlodia Village','Chandlodia Cross Road','Near Chandlodia Lake'],
    'Changodar':        ['Changodar GIDC','Changodar Village','Near Changodar Highway'],
    'Dholera':          ['Dholera SIR','Dholera Village','Dholera Smart City Zone'],
    'Drive In Road':    ['Drive In Road Main','Near Drive In Cinema','Memnagar Cross Road'],
    'Ellisbridge':      ['Ellisbridge Main','Ashram Road','Paldi Cross Road','Near Ellisbridge Gymkhana'],
    'Ghatlodia':        ['Ghatlodia Cross Road','Ghatlodia Society','Near Ghatlodia Lake','Sola Road'],
    'Ghuma':            ['Ghuma Village','Ghuma Cross Road','Near Ghuma Lake'],
    'Gift City':        ['GIFT City Block 1','GIFT City Block 2','GIFT City SEZ','Infocity Road','GIFT City Phase 2'],
    'Gota':             ['Gota Cross Road','Gota Village','Near Gota Flyover','SG Highway Gota'],
    'Gulbai Tekra':     ['Gulbai Tekra Main','Near Gulbai Tekra Market','Paldi Road'],
    'Gurukul':          ['Gurukul Road','Gurukul Cross Road','Drive In Road','Near Gurukul School'],
    'Hebatpur Road':    ['Hebatpur Village','Hebatpur Cross Road','Near Hebatpur Lake'],
    'Income Tax':       ['Income Tax Circle','Ashram Road','Near Income Tax Office','Ellisbridge'],
    'Iscon Ambli Road': ['Iscon Cross Road','Iscon Ambli Road','Bopal Road','Near Iscon Temple'],
    'Jagatpur':         ['Jagatpur Village','Jagatpur Road','Near Jagatpur GIDC'],
    'Jivrajpark':       ['Jivrajpark Cross Road','Jivrajpark Society','Near Jivrajpark Metro'],
    'Jodhpur':          ['Jodhpur Cross Road','Jodhpur Village','Satellite Road','Near Jodhpur Park'],
    'Kalol':            ['Kalol Town','Kalol GIDC','Near Kalol Highway'],
    'Koba':             ['Koba Circle','Koba Village','Near Koba Highway','Koba GIDC'],
    'Koteshwar':        ['Koteshwar Village','Koteshwar Road','Near Koteshwar Temple'],
    'Kudasan':          ['Kudasan Village','Kudasan Cross Road','Near Kudasan Highway'],
    'Law Garden':       ['Law Garden Main','Near Law Garden Market','Ellisbridge','Netaji Road'],
    'Makarba':          ['Makarba Village','Makarba Cross Road','Near Makarba Lake','SG Highway'],
    'Manekbaug':        ['Manekbaug Society','Manekbaug Cross Road','Near Manekbaug Hall'],
    'Memnagar':         ['Memnagar Fire Station','Gurukul Road','Drive In Road','Navrangpura','Memnagar Cross Road'],
    'Mithakhali':       ['Mithakhali Cross Road','Mithakhali Six Roads','Near Mithakhali Market'],
    'Motera':           ['Motera Stadium Road','Motera Village','Near Motera Metro','Sabarmati'],
    'Nana Chiloda':     ['Nana Chiloda Village','Nana Chiloda Road','Near Nana Chiloda GIDC'],
    'Naranpura':        ['Naranpura Cross Road','Naranpura Society','Near Naranpura Market'],
    'Navrangpura':      ['CG Road','Navrangpura Cross Road','Swastik Cross Road','Panchvati','Near Navrangpura Market'],
    'Nehru Nagar':      ['Nehru Nagar Cross Road','Nehru Nagar Society','Near Nehru Nagar Market'],
    'New CG Road':      ['New CG Road Main','Near New CG Road Market','Chandkheda'],
    'New Ranip':        ['New Ranip Cross Road','New Ranip Society','Near New Ranip Market'],
    'New Wadaj':        ['New Wadaj Cross Road','New Wadaj Society','Near New Wadaj Market'],
    'Nirnay Nagar':     ['Nirnay Nagar Cross Road','Nirnay Nagar Society','Near Nirnay Nagar Park'],
    'Ognaj':            ['Ognaj Village','Ognaj Cross Road','Near Ognaj Lake'],
    'Paldi':            ['Paldi Cross Road','Paldi Society','Near Paldi Market','Ellisbridge'],
    'Palodia':          ['Palodia Village','Palodia Cross Road','Near Palodia Lake'],
    'Pethapur':         ['Pethapur Village','Pethapur Road','Near Pethapur Highway'],
    'Prahladnagar':     ['Prahlad Nagar Cross Road','Commerce Six Roads','Anand Nagar Cross Road','Satellite Road','100 Feet Road Prahlad Nagar'],
    'Ramdevnagar':      ['Ramdevnagar Cross Road','Ramdevnagar Society','Near Ramdevnagar Market'],
    'Rancharda':        ['Rancharda Village','Rancharda Cross Road','Near Rancharda Lake'],
    'Randesan':         ['Randesan Village','Randesan Cross Road','Near Randesan Highway'],
    'Ranip':            ['Ranip Cross Road','Ranip Society','Near Ranip Market','New Ranip'],
    'Raysan':           ['Raysan Village','Raysan Cross Road','Near Raysan Lake'],
    'Sabarmati':        ['Sabarmati Ashram Road','Sabarmati Cross Road','Near Sabarmati River','Motera'],
    'Sanand':           ['Sanand GIDC','Sanand Town','Near Sanand Highway','Sanand Village'],
    'Sanathal':         ['Sanathal Village','Sanathal Cross Road','Near Sanathal Lake'],
    'Santej':           ['Santej Village','Santej Cross Road','Near Santej Highway'],
    'Sargasan':         ['Sargasan Cross Road','Sargasan Village','Near Sargasan Highway'],
    'Sarkhej':          ['Sarkhej Cross Road','Sarkhej Village','Near Sarkhej Roza','Sarkhej Highway'],
    'Satellite':        ['Satellite Main Road','Jodhpur Cross Road','Ambawadi','Nehru Nagar','Judges Bungalow Road','Commerce Six Roads'],
    'Science City':     ['Science City Road','Near Science City','Sola Road','Thaltej'],
    'SG Road':          ['SG Highway Main','Sola','Gota','Motera','Ranip','Near SG Highway Metro'],
    'Shahibaug':        ['Shahibaug Cross Road','Shahibaug Society','Near Shahibaug Zoo'],
    'Shastrinagar':     ['Shastrinagar Cross Road','Shastrinagar Society','Near Shastrinagar Market'],
    'Shela':            ['Shela Village','Shela Chokdi','Ambli Road Shela','Near Shela Lake'],
    'Shilaj':           ['Shilaj Village','Shilaj Cross Road','Near Shilaj Lake','Ambli Bopal Road'],
    'Shivranjani':      ['Shivranjani Cross Road','Shivranjani Society','Near Shivranjani Metro'],
    'Shyamal':          ['Shyamal Cross Road','Shyamal Society','Near Shyamal Market'],
    'Thaltej':          ['Thaltej Cross Road','SG Highway Thaltej','Sola Road','Science City Road','Near Thaltej Metro'],
    'Thol':             ['Thol Village','Thol Lake Road','Near Thol Bird Sanctuary'],
    'Tragad':           ['Tragad Village','Tragad Cross Road','Near Tragad Lake'],
    'Usmanpura':        ['Usmanpura Cross Road','Usmanpura Society','Near Usmanpura Market'],
    'Vaishno Devi':     ['Vaishno Devi Circle','Near Vaishno Devi Temple','SG Highway'],
    'Vasna':            ['Vasna Cross Road','Vasna Society','Near Vasna Market','Paldi'],
    'Vastrapur':        ['Vastrapur Lake','Vastrapur Cross Road','Judges Bungalow','Bodakdev','Near Vastrapur Metro'],
    'Vavol':            ['Vavol Village','Vavol Cross Road','Near Vavol Lake'],
    'Vejalpur':         ['Vejalpur Cross Road','Vejalpur Society','Near Vejalpur Market'],
    'Zundal':           ['Zundal Village','Zundal Cross Road','Near Zundal Highway']
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

// City select â†’ locality populate
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
      const parts = budget.split('-');
      if (budget.startsWith('rent-')) {
        const [, min, max] = budget.split('-');
        if (min) params.set('minPrice', min);
        if (max) params.set('maxPrice', max);
        // Force rent status if not already set
        if (!params.get('status')) params.set('status', 'for-rent');
      } else if (budget.startsWith('sale-')) {
        const [, min, max] = budget.split('-');
        if (min) params.set('minPrice', min);
        if (max) params.set('maxPrice', max);
      } else {
        const [min, max] = parts;
        if (min) params.set('minPrice', min);
        if (max) params.set('maxPrice', max);
      }
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
              <option>Morning (9AM â€“ 12PM)</option>
              <option>Afternoon (12PM â€“ 3PM)</option>
              <option>Evening (3PM â€“ 7PM)</option>
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
        <p style="text-align:center;font-size:0.72rem;color:#aaa;margin-top:10px">ðŸ”’ Your details are safe. No spam calls.</p>
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
  if (!localStorage.getItem('token')) {
    showLoginPrompt('Save properties to your favourites!');
    return;
  }
  const icon = btn.querySelector('i');
  const isActive = btn.classList.toggle('active');
  // Re-trigger animation
  btn.classList.remove('active');
  void btn.offsetWidth;
  if (isActive) btn.classList.add('active');
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

// ===== REGISTER AUTO POPUP â€” DISABLED =====
let isRegistered = !!localStorage.getItem('token');

// ===== AUTH MODAL =====
const authOverlay = document.getElementById('authOverlay');
if (authOverlay) {

function closeAuthOverlay() {
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
      startOtpTimer('resendLoginOtpLink', 'resendLoginOtpTimer');
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

  // MX record check â€” real email domain verify
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
      startOtpTimer('resendOtpLink', 'resendOtpTimer');
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
  const link = document.getElementById('resendOtpLink');
  if (link && link.dataset.disabled === '1') return;
  try {
    const res  = await fetch(`${API}/auth/resend-otp`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ email }) });
    const data = await res.json();
    showToast(data.success ? 'OTP resent to ' + email : (data.message || 'Error'));
    if (data.success) startOtpTimer('resendOtpLink', 'resendOtpTimer');
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
  const link = document.getElementById('resendLoginOtpLink');
  if (link && link.dataset.disabled === '1') return;
  try {
    const res  = await fetch(`${API}/auth/resend-otp`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ email }) });
    const data = await res.json();
    showToast(data.success ? 'OTP resent to ' + email : (data.message || 'Error'));
    if (data.success) startOtpTimer('resendLoginOtpLink', 'resendLoginOtpTimer');
  } catch { showToast('Server error.'); }
}

// ===== OTP RESEND TIMER =====
function startOtpTimer(linkId, timerId, seconds) {
  seconds = seconds || 60;
  const link  = document.getElementById(linkId);
  const timer = document.getElementById(timerId);
  if (!link || !timer) return;
  link.dataset.disabled = '1';
  link.style.opacity = '0.4';
  link.style.pointerEvents = 'none';
  let remaining = seconds;
  timer.textContent = '(' + remaining + 's)';
  const interval = setInterval(function() {
    remaining--;
    timer.textContent = '(' + remaining + 's)';
    if (remaining <= 0) {
      clearInterval(interval);
      timer.textContent = '';
      link.dataset.disabled = '0';
      link.style.opacity = '1';
      link.style.pointerEvents = 'auto';
    }
  }, 1000);
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

// AI Q&A knowledge base â€” City Real Space
const lcwQA = [
  {
    q: ['buy', 'purchase', 'kharidna', 'kharidu', 'kharidni', 'lena', 'leni', 'property chahiye', 'flat chahiye', 'ghar chahiye'],
    a: 'ðŸ  Bilkul! Hamare paas 12,500+ verified properties hain â€” Ahmedabad, Gandhinagar, Surat mein. Aap kaunsa property type dhundh rahe hain?\n\nâ€¢ Apartment / Flat\nâ€¢ Villa / Bungalow\nâ€¢ Plot / Land\nâ€¢ Commercial'
  },
  {
    q: ['sell', 'bechna', 'bechu', 'list', 'bechni', 'property sell', 'meri property'],
    a: 'ðŸ’° Hum aapki property best market price pe sell karenge! Free valuation + zero brokerage on select projects.\n\nAbhi WhatsApp karein: +91 93775 31247'
  },
  {
    q: ['rent', 'lease', 'kiraya', 'rental', 'kiraye pe', 'rent pe'],
    a: 'ðŸ¡ Hamare paas ₹15,000/month se shuru rental properties hain. Kaun sa area aur BHK chahiye aapko?'
  },
  {
    q: ['2bhk', '2 bhk', 'two bhk', 'do bhk'],
    a: 'ðŸ›ï¸ 2 BHK flats available hain:\nâ€¢ Bopal: ₹55L â€“ ₹75L\nâ€¢ Satellite: ₹70L â€“ ₹95L\nâ€¢ Memnagar: ₹60L â€“ ₹80L\n\nKaunsa area prefer karenge?'
  },
  {
    q: ['3bhk', '3 bhk', 'three bhk', 'teen bhk'],
    a: 'ðŸ›ï¸ 3 BHK options:\nâ€¢ Prahlad Nagar: ₹90L â€“ ₹1.5Cr\nâ€¢ Thaltej: ₹85L â€“ ₹1.2Cr\nâ€¢ Bopal: ₹75L â€“ ₹1Cr\n\nBudget kya hai aapka?'
  },
  {
    q: ['4bhk', '4 bhk', 'four bhk', 'char bhk'],
    a: 'ðŸ  4 BHK premium properties:\nâ€¢ Prahlad Nagar: ₹1.5Cr â€“ ₹2.5Cr\nâ€¢ Bodakdev: ₹1.8Cr â€“ ₹3Cr\nâ€¢ Vastrapur: ₹1.6Cr â€“ ₹2.8Cr\n\nSite visit book karein â€” bilkul free!'
  },
  {
    q: ['price', 'cost', 'budget', 'kitna', 'rate', 'kitne ka', 'daam', 'paisa'],
    a: 'ðŸ’Ž Hamare properties ka range:\nâ€¢ Budget: ₹30L â€“ ₹60L\nâ€¢ Mid Range: ₹60L â€“ ₹1.5Cr\nâ€¢ Premium: ₹1.5Cr â€“ ₹5Cr+\n\nAapka budget kya hai? Best options suggest karunga!'
  },
  {
    q: ['bopal', 'satellite', 'prahlad nagar', 'thaltej', 'giftcity', 'gift city', 'memnagar', 'shela', 'vastrapur', 'bodakdev', 'navrangpura', 'chandkheda'],
    a: '📍 Hum sab prime areas cover karte hain â€” Bopal, Satellite, Prahlad Nagar, Thaltej, GIFT City, Memnagar, Shela aur bahut zyada!\n\nKaunse area mein property chahiye?'
  },
  {
    q: ['loan', 'home loan', 'finance', 'emi', 'bank', 'interest'],
    a: 'ðŸ¦ Free Home Loan guidance dete hain hum! 15+ banks ke saath kaam karte hain â€” SBI, HDFC, ICICI, Axis.\n\nBest interest rate ke liye abhi call karein: +91 98250 31247'
  },
  {
    q: ['visit', 'site visit', 'dekhna', 'show', 'dikhao', 'visit book', 'free visit'],
    a: '🚗 FREE Site Visit â€” koi charge nahi!\n\nBas apna preferred date & time share karein, hum sab arrange kar denge. WhatsApp karein: +91 93775 31247'
  },
  {
    q: ['contact', 'call', 'phone', 'number', 'agent', 'baat', 'expert'],
    a: '📍ž Hamare experts se baat karein:\nâ€¢ +91 98250 31247\nâ€¢ +91 84600 14000\nâ€¢ info@cityrealspace.com\n\nMonâ€“Sat: 9AM â€“ 7PM | Sun: 10AM â€“ 4PM'
  },
  {
    q: ['new launch', 'new project', 'upcoming', 'naya', 'launch'],
    a: '🚀 New Launch projects available hain:\nâ€¢ GIFT City â€” pre-launch prices\nâ€¢ Bopal â€” 2 & 3 BHK\nâ€¢ Shela â€” premium villas\n\nEarly bird discount ke liye abhi contact karein!'
  },
  {
    q: ['commercial', 'office', 'shop', 'warehouse', 'dukaan', 'godown'],
    a: 'ðŸ¢ Commercial properties:\nâ€¢ Office spaces: 500 â€“ 10,000 sqft\nâ€¢ Shops / Showrooms: CG Road, SG Highway\nâ€¢ Warehouses: Sanand, Changodar\n\nKya requirement hai aapki?'
  },
  {
    q: ['brokerage', 'commission', 'charge', 'fees', 'zero brokerage'],
    a: 'âœ… Select projects pe Zero Brokerage! Aur sab properties pe transparent pricing â€” koi hidden charges nahi.'
  },
  {
    q: ['legal', 'document', 'registration', 'agreement', 'papers'],
    a: '📍„ Free Legal Documentation help dete hain hum â€” sale agreement, registration, title verification sab.\n\nHamara legal team aapki poori help karega!'
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

const lcwFinalMsg = '🙏 Thank you for chatting with us! Our property expert will contact you within 30 minutes. You can also call us directly at 📍ž +91 98250 31247. Have a great day! 😊';

let lcwMsgCount = 0;

function lcwGetReply(text) {
  const lower = text.toLowerCase();
  for (const item of lcwQA) {
    if (item.q.some(k => lower.includes(k))) return item.a;
  }
  // Default smart fallback
  return '😊 Samajh gaya! Hamare property expert aapko 30 minutes mein call karenge.\n\nYa abhi call karein: 📍ž +91 98250 31247';
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
      if (inp) { inp.disabled = true; inp.placeholder = 'Call us: +91 98250 31247'; }
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

