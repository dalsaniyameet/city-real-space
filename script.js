const API = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
  ? 'http://localhost:5000/api' : '/api';

// ===== PRICE FORMAT =====
function formatPrice(price, status) {
  if (!price) return 'Price on Request';
  if (status === 'for-rent') {
    if (price >= 100000) return '\u20b9' + (price / 100000).toFixed(price % 100000 === 0 ? 0 : 1) + 'L/mo';
    if (price >= 1000)   return '\u20b9' + Math.round(price / 1000) + 'K/mo';
    return '\u20b9' + price.toLocaleString('en-IN') + '/mo';
  }
  if (price >= 10000000) return '\u20b9' + (price / 10000000).toFixed(price % 10000000 === 0 ? 0 : 2).replace(/\.?0+$/, '') + ' Cr';
  if (price >= 100000)   return '\u20b9' + (price / 100000).toFixed(price % 100000 === 0 ? 0 : 2).replace(/\.?0+$/, '') + ' L';
  if (price >= 1000)     return '\u20b9' + Math.round(price / 1000) + 'K';
  return '\u20b9' + price.toLocaleString('en-IN');
}

// ===== AUTH STATE =====
async function checkAuthState() {
  var stored = localStorage.getItem('user');
  var token  = localStorage.getItem('token');
  var user   = null;
  try { user = stored && stored !== 'null' ? JSON.parse(stored) : null; } catch(e) { localStorage.removeItem('user'); localStorage.removeItem('token'); }
  var loginBtn   = document.getElementById('loginBtn');
  var userMenu   = document.getElementById('userMenu');
  var nameDisplay = document.getElementById('userNameDisplay');
  var postBtn    = document.getElementById('postPropBtn');
  if (user && token && loginBtn && userMenu) {
    try {
      var r = await fetch(API + '/auth/me', { headers: { 'Authorization': 'Bearer ' + token } });
      if (!r.ok) { handleLogout(); return; }
    } catch(e) {}
    loginBtn.style.display  = 'none';
    userMenu.style.display  = 'block';
    if (nameDisplay) nameDisplay.textContent = user.firstName || user.email.split('@')[0];
    if (postBtn) postBtn.style.display = 'flex';
  }
}

function handleLogout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.reload();
}

var userMenuBtn  = document.getElementById('userMenuBtn');
var userDropdown = document.getElementById('userDropdown');
if (userMenuBtn) {
  userMenuBtn.addEventListener('click', function() {
    userDropdown.style.display = userDropdown.style.display === 'none' ? 'block' : 'none';
  });
  document.addEventListener('click', function(e) {
    if (!userMenuBtn.contains(e.target)) userDropdown.style.display = 'none';
  });
}
checkAuthState();

// ===== CARD CREATE =====
function dbToCard(p) {
  var city2  = ((p.location && p.location.city) || 'ahmedabad').toLowerCase().replace(/\s+/g, '-');
  var area2  = ((p.location && p.location.area) || 'gujarat').toLowerCase().replace(/\s+/g, '-');
  var propUrl = p.slug ? '/property/' + city2 + '/' + area2 + '/' + p.slug : 'property-detail.html?id=' + p._id;
  var statusMap = { 'for-sale': 'For Sale', 'for-rent': 'For Rent', 'new-launch': 'New Launch', 'sold': 'Sold', 'rented': 'Rented' };
  var badgeClassMap = { 'for-rent': 'rent', 'new-launch': 'new' };
  var furnished = (p.extraDetails && p.extraDetails.furnished) || p.furnished || (p.specs && p.specs.furnished) || '';
  return {
    _id: p._id, propUrl: propUrl,
    img: (p.images && p.images[0]) || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&q=80',
    images: p.images || [],
    badge: statusMap[p.status] || p.status,
    badgeClass: badgeClassMap[p.status] || '',
    price: formatPrice(p.price, p.status),
    loc: ((p.location && p.location.area) || '') + ', ' + ((p.location && p.location.city) || ''),
    title: p.title,
    beds: p.category === 'commercial' ? null : (p.specs && p.specs.beds) || 0,
    baths: p.category === 'commercial' ? null : (p.specs && p.specs.baths) || 0,
    sqft: String((p.specs && p.specs.sqft) || 0),
    agent: (p.agent && p.agent.initials) || 'CRS',
    agentName: (p.agent && p.agent.name) || 'CRS Agent',
    type: p.type,
    furnished: furnished
  };
}

function createCard(d) {
  var furnLabel = '';
  if (d.furnished) {
    var fl = d.furnished.toLowerCase();
    if (fl.includes('fully'))   furnLabel = 'Fully Furnished';
    else if (fl.includes('semi')) furnLabel = 'Semi Furnished';
    else if (fl.includes('unfurnished') || fl.includes('no')) furnLabel = 'Unfurnished';
  }

  var specs = d.beds !== null && d.beds !== undefined
    ? '<div class="cs"><i class="fa-solid fa-bed"></i>' + d.beds + ' Beds</div>' +
      '<div class="cs"><i class="fa-solid fa-bath"></i>' + d.baths + ' Baths</div>' +
      '<div class="cs"><i class="fa-solid fa-vector-square"></i>' + d.sqft + ' sqft</div>' +
      (furnLabel ? '<div class="cs"><i class="fa-solid fa-couch"></i>' + furnLabel + '</div>' : '')
    : '<div class="cs"><i class="fa-solid fa-vector-square"></i>' + d.sqft + ' sqft</div>' +
      '<div class="cs"><i class="fa-solid fa-building"></i>' + (d.type || '') + '</div>' +
      (furnLabel ? '<div class="cs"><i class="fa-solid fa-couch"></i>' + furnLabel + '</div>' : '');

  var fallbacks = [
    'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&q=80',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80'
  ];
  var imgs = (d.images && d.images.length > 1) ? d.images : [d.img || fallbacks[0], fallbacks[1], fallbacks[2]];
  var id = 'cs_' + Math.random().toString(36).substr(2, 6);

  var slides = imgs.map(function(src, i) {
    return '<div class="ci-slide' + (i === 0 ? ' active' : '') + '"><img src="' + src + '" alt="' + d.title + '" loading="lazy"/></div>';
  }).join('');

  var dots = imgs.length > 1 ? '<div class="ci-dots">' + imgs.map(function(_, i) {
    return '<span class="ci-dot' + (i === 0 ? ' active' : '') + '" onclick="ciGo(\'' + id + '\',' + i + ',event)"></span>';
  }).join('') + '</div>' : '';

  var arrows = imgs.length > 1
    ? '<button class="ci-arr ci-prev" onclick="ciMove(\'' + id + '\',-1,event)"><i class="fa-solid fa-chevron-left"></i></button>' +
      '<button class="ci-arr ci-next" onclick="ciMove(\'' + id + '\',1,event)"><i class="fa-solid fa-chevron-right"></i></button>'
    : '';

  return '<div class="prop-card" onclick="window.open(\'' + (d.propUrl || 'property-detail.html?id=' + d._id) + '\',\'_blank\')" style="cursor:pointer">' +
    '<div class="card-img" id="' + id + '">' +
    slides + arrows + dots +
    '<span class="card-badge ' + d.badgeClass + '">' + d.badge + '</span>' +
    '<div class="card-verified"><div class="card-verified-inner"><span class="cv-icon"><i class="fa-solid fa-check"></i></span> Verified</div></div>' +
    '<div class="card-price"><span>' + d.price + '</span></div>' +
    '</div>' +
    '<div class="card-body">' +
    '<div class="card-loc"><i class="fa-solid fa-location-dot"></i>' + d.loc + '</div>' +
    '<div class="card-title">' + d.title + '</div>' +
    '<div class="card-specs">' + specs + '</div>' +
    '<div class="card-footer">' +
    '<div class="card-agent"><div class="agent-av">' + d.agent + '</div><span class="agent-name">' + d.agentName + '</span></div>' +
    '<button class="btn-offer" onclick="requireLoginForOffer(event,\'' + d.title.replace(/'/g, "&apos;") + '\',\'' + d.loc.replace(/'/g, "&apos;") + '\')">Contact Now</button>' +
    '</div></div></div>';
}

function ciMove(id, dir, e) {
  e.stopPropagation();
  var wrap   = document.getElementById(id);
  var slides = wrap.querySelectorAll('.ci-slide');
  var dots   = wrap.querySelectorAll('.ci-dot');
  var cur    = Array.from(slides).findIndex(function(s) { return s.classList.contains('active'); });
  slides[cur].classList.remove('active');
  if (dots[cur]) dots[cur].classList.remove('active');
  cur = (cur + dir + slides.length) % slides.length;
  slides[cur].classList.add('active');
  if (dots[cur]) dots[cur].classList.add('active');
}
function ciGo(id, idx, e) {
  e.stopPropagation();
  var wrap = document.getElementById(id);
  wrap.querySelectorAll('.ci-slide').forEach(function(s, i) { s.classList.toggle('active', i === idx); });
  wrap.querySelectorAll('.ci-dot').forEach(function(d, i) { d.classList.toggle('active', i === idx); });
}

// ===== AUTO SCROLL CARD IMAGES =====
function startCardImageAutoScroll() {
  document.querySelectorAll('.prop-card').forEach(function(card) {
    if (card.dataset.autoScroll) return;
    card.dataset.autoScroll = '1';
    var el = card.querySelector('.card-img');
    if (!el) return;
    var slides = el.querySelectorAll('.ci-slide');
    if (slides.length < 2) return;
    setInterval(function() {
      var dots = el.querySelectorAll('.ci-dot');
      var cur  = Array.from(slides).findIndex(function(s) { return s.classList.contains('active'); });
      slides[cur].classList.remove('active');
      if (dots[cur]) dots[cur].classList.remove('active');
      cur = (cur + 1) % slides.length;
      slides[cur].classList.add('active');
      if (dots[cur]) dots[cur].classList.add('active');
    }, 2000);
  });
}

var emptyState = function(msg) {
  return '<div class="empty-res"><i class="fa-solid fa-building"></i><p>' + (msg || 'No properties found.') + '</p></div>';
};
var emptySlide = function(msg) {
  return '<div class="empty-res"><i class="fa-solid fa-building"></i><p>' + (msg || 'No properties available right now.') + '</p></div>';
};

// ===== LOAD ALL PROPERTIES =====
async function loadAllProperties() {
  var trendingGrid = document.getElementById('trendingGrid');
  var resSlider    = document.getElementById('resSlider');
  var comSlider    = document.getElementById('comSlider');

  if (!trendingGrid && !resSlider) return;

  try {
    var results = await Promise.all([
      fetch(API + '/properties/trending').then(function(r) { return r.json(); }),
      fetch(API + '/properties/residential').then(function(r) { return r.json(); }),
      fetch(API + '/properties/commercial').then(function(r) { return r.json(); })
    ]);

    var trending    = results[0];
    var residential = results[1];
    var commercial  = results[2];

    if (trendingGrid) {
      trendingGrid.innerHTML = (trending.success && trending.properties && trending.properties.length)
        ? trending.properties.map(function(p) { return createCard(dbToCard(p)); }).join('')
        : emptyState('No trending properties.');
    }
    if (resSlider) {
      resSlider.innerHTML = (residential.success && residential.properties && residential.properties.length)
        ? residential.properties.map(function(p) { return createCard(dbToCard(p)); }).join('')
        : emptySlide('No residential properties.');
    }
    if (comSlider) {
      comSlider.innerHTML = (commercial.success && commercial.properties && commercial.properties.length)
        ? commercial.properties.map(function(p) { return createCard(dbToCard(p)); }).join('')
        : emptySlide('No commercial properties.');
    }

    startCardImageAutoScroll();

    if (resSlider) initSlider('resSlider', 'resPrev', 'resNext');
    if (comSlider) initSlider('comSlider', 'comPrev', 'comNext');

  } catch(e) {
    if (trendingGrid) trendingGrid.innerHTML = emptyState('Could not load properties.');
    if (resSlider)    resSlider.innerHTML    = emptySlide('Could not load properties.');
    if (comSlider)    comSlider.innerHTML    = emptySlide('Could not load properties.');
  }
}

// ===== SLIDER =====
function initSlider(sliderId, prevId, nextId) {
  var slider = document.getElementById(sliderId);
  if (!slider || slider.dataset.sliderInit) return;
  slider.dataset.sliderInit = '1';

  var cards = Array.from(slider.children);
  cards.forEach(function(c) { slider.appendChild(c.cloneNode(true)); });
  slider.style.transform = 'translateX(0px)';

  var offset = 0, paused = false, raf;
  var wrap   = slider.parentElement;

  function cardW() {
    var c = slider.querySelector('.prop-card');
    return c ? (c.offsetWidth + 20) : 320;
  }
  function totalW() { return cardW() * cards.length; }

  function animate() {
    if (!paused) {
      offset += 0.4;
      if (offset >= totalW()) offset = 0;
      slider.style.transform = 'translateX(-' + offset + 'px)';
    }
    raf = requestAnimationFrame(animate);
  }
  animate();

  wrap.addEventListener('mouseenter', function() { paused = true; }, { passive: true });
  wrap.addEventListener('mouseleave', function() { paused = false; }, { passive: true });

  var prevBtn = document.getElementById(prevId);
  var nextBtn = document.getElementById(nextId);
  if (prevBtn) prevBtn.addEventListener('click', function() {
    paused = true;
    offset = Math.max(offset - cardW(), 0);
    slider.style.transform = 'translateX(-' + offset + 'px)';
    setTimeout(function() { paused = false; }, 1000);
  });
  if (nextBtn) nextBtn.addEventListener('click', function() {
    paused = true;
    offset = Math.min(offset + cardW(), totalW() - 1);
    slider.style.transform = 'translateX(-' + offset + 'px)';
    setTimeout(function() { paused = false; }, 1000);
  });

  // Touch swipe
  var startX = 0, startOff = 0, dragging = false;
  wrap.addEventListener('touchstart', function(e) { startX = e.touches[0].clientX; startOff = offset; paused = true; }, { passive: true });
  wrap.addEventListener('touchmove',  function(e) { offset = Math.max(0, Math.min(startOff + (startX - e.touches[0].clientX), totalW() - 1)); slider.style.transform = 'translateX(-' + offset + 'px)'; }, { passive: true });
  wrap.addEventListener('touchend',   function()  { setTimeout(function() { paused = false; }, 800); }, { passive: true });
}

loadAllProperties();

// ===== LOAD BLOG POSTS =====
(async function loadHomePosts() {
  var grid = document.getElementById('homePostsGrid');
  if (!grid) return;
  try {
    var r    = await fetch(API + '/blogs?limit=4');
    var data = await r.json();
    if (data.success && data.blogs && data.blogs.length) {
      grid.innerHTML = data.blogs.map(function(b, i) {
        var date = new Date(b.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
        var url  = b.slug ? '/blog/' + b.slug : '/blog-detail.html?id=' + b._id;
        return '<div class="post-card' + (i === 0 ? ' featured' : '') + '">' +
          '<div class="post-img"><img src="' + (b.image || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80') + '" alt="' + b.title + '" loading="lazy"/>' +
          '<span class="post-cat">' + (b.category || 'Real Estate') + '</span></div>' +
          '<div class="post-body">' +
          '<div class="post-meta"><i class="fa-regular fa-calendar"></i>' + date + '</div>' +
          '<h3>' + b.title + '</h3>' +
          '<p>' + (b.excerpt || '') + '</p>' +
          '<a href="' + url + '" class="post-link">Read More <i class="fa-solid fa-arrow-right"></i></a>' +
          '</div></div>';
      }).join('');
    } else {
      grid.innerHTML = '<p style="text-align:center;color:#aaa;padding:40px">No posts yet.</p>';
    }
  } catch(e) {
    grid.innerHTML = '<p style="text-align:center;color:#aaa;padding:40px">No posts yet.</p>';
  }
}());

// ===== HAMBURGER =====
var hamburger = document.getElementById('hamburger');
if (hamburger) {
  hamburger.addEventListener('click', function() {
    var nav   = document.getElementById('mobileNav');
    if (!nav) return;
    var isOpen = nav.style.display === 'flex';
    nav.style.display = isOpen ? 'none' : 'flex';
    hamburger.innerHTML = isOpen ? '<i class="fa-solid fa-bars"></i>' : '<i class="fa-solid fa-xmark"></i>';
    document.body.style.overflow = isOpen ? '' : 'hidden';
  });
}

// ===== SCROLL =====
window.addEventListener('scroll', function() {
  var h  = document.getElementById('header');
  var bt = document.getElementById('backTop');
  if (h)  h.classList.toggle('scrolled', window.scrollY > 50);
  if (bt) bt.classList.toggle('show', window.scrollY > 400);
}, { passive: true });

var backTop = document.getElementById('backTop');
if (backTop) backTop.addEventListener('click', function() { window.scrollTo({ top: 0, behavior: 'smooth' }); });

// ===== SEARCH =====
var cityLocalities = {
  'Ahmedabad': ['Prahlad Nagar','Satellite','Bopal','Thaltej','Memnagar','Vastrapur','Bodakdev','Navrangpura','Chandkheda','Shela','SG Highway','CG Road','Iscon','Giftcity','Chekhla','Narol','Vatva','Odhav','Nikol','Naroda','Maninagar','Paldi','Ashram Road','Sanand','Dholera','Shyamal','Science City','Gota','Sola'],
  'Gandhinagar': ['Giftcity','Sector 1','Sector 5','Sector 11','Sector 21','Infocity'],
  'Surat': ['Adajan','Vesu','Pal','Katargam','Udhna','Althan'],
  'Vadodara': ['Alkapuri','Gotri','Waghodia Road','Manjalpur','Fatehgunj'],
  'Rajkot': ['Kalawad Road','Mavdi','Raiya Road','University Road','150 Feet Ring Road']
};

var cityEl    = document.getElementById('searchCity');
var localityEl = document.getElementById('searchLocality');
if (cityEl && localityEl) {
  cityEl.addEventListener('change', function() {
    var locs = Object.keys(cityLocalities[this.value] || {});
    if (!locs.length) locs = cityLocalities[this.value] || [];
    localityEl.innerHTML = '<option value="">Select Locality</option>' +
      locs.map(function(l) { return '<option value="' + l + '">' + l + '</option>'; }).join('');
  });
}

// Search tabs
document.querySelectorAll('.stab').forEach(function(tab) {
  tab.addEventListener('click', function() {
    document.querySelectorAll('.stab').forEach(function(t) { t.classList.remove('active'); });
    this.classList.add('active');
  });
});

var mainSearchBtn = document.getElementById('mainSearchBtn');
if (mainSearchBtn) {
  mainSearchBtn.addEventListener('click', function() {
    var activeTab  = document.querySelector('.stab.active');
    var status     = activeTab ? activeTab.dataset.status : '';
    var city       = cityEl ? cityEl.value : '';
    var area       = localityEl ? localityEl.value : '';
    var typeEl     = document.getElementById('searchType');
    var budgetEl   = document.getElementById('searchBudget');
    var type       = typeEl ? typeEl.value : '';
    var budget     = budgetEl ? budgetEl.value : '';
    var params     = new URLSearchParams();
    if (status && status !== 'commercial') params.set('status', status);
    if (status === 'commercial') params.set('category', 'commercial');
    if (city)   params.set('city', city);
    if (area)   params.set('area', area);
    if (type)   params.set('type', type);
    if (budget) {
      if (budget.startsWith('rent-')) {
        var p = budget.split('-'); params.set('minPrice', p[1]); params.set('maxPrice', p[2]);
        if (!params.has('status')) params.set('status', 'for-rent');
      } else if (budget.startsWith('sale-')) {
        var p = budget.split('-'); params.set('minPrice', p[1]); params.set('maxPrice', p[2]);
      }
    }
    window.location.href = '/properties?' + params.toString();
  });
}

// ===== INQUIRY MODAL =====
var inqOverlay = document.getElementById('inqOverlay');
if (inqOverlay) {
  var inqBtn = document.querySelector('.btn-inquiry');
  if (inqBtn) inqBtn.addEventListener('click', function() {
    document.getElementById('inqForm').style.display = 'flex';
    document.querySelector('.inq-header').style.display = 'block';
    document.getElementById('inqSuccess').classList.remove('show');
    inqOverlay.classList.add('open');
  });
  document.getElementById('inqClose').addEventListener('click', function() { inqOverlay.classList.remove('open'); });
  inqOverlay.addEventListener('click', function(e) { if (e.target === inqOverlay) inqOverlay.classList.remove('open'); });

  document.getElementById('inqForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    var btn = e.target.querySelector('button[type=submit]');
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
    btn.disabled = true;
    var inputs = e.target.querySelectorAll('input,select,textarea');
    var body = {
      name: inputs[0].value, phone: inputs[1].value, email: inputs[2].value,
      propertyType: inputs[3].value, lookingFor: inputs[4].value,
      city: inputs[5].value, budget: inputs[6].value, area: inputs[7].value,
      message: inputs[8] ? inputs[8].value : ''
    };
    try {
      var res  = await fetch(API + '/inquiry', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      var data = await res.json();
      var refId = (data.inquiry && data.inquiry.refId) || 'CRS-' + Math.floor(100000 + Math.random() * 900000);
      document.getElementById('inqRefId').textContent = refId;
    } catch(err) {
      document.getElementById('inqRefId').textContent = 'CRS-' + Math.floor(100000 + Math.random() * 900000);
    }
    document.getElementById('inqForm').style.display = 'none';
    document.querySelector('.inq-header').style.display = 'none';
    document.getElementById('inqSuccess').classList.add('show');
  });

  document.getElementById('inqSuccessClose') && document.getElementById('inqSuccessClose').addEventListener('click', function() { inqOverlay.classList.remove('open'); });
}

// ===== AUTH MODAL =====
var authOverlay = document.getElementById('authOverlay');
if (authOverlay) {
  document.getElementById('authClose').addEventListener('click', function() { authOverlay.classList.remove('open'); });
  authOverlay.addEventListener('click', function(e) { if (e.target === authOverlay) authOverlay.classList.remove('open'); });
  document.querySelectorAll('.atab').forEach(function(tab) {
    tab.addEventListener('click', function() { switchTab(this.dataset.tab); });
  });

  // Auto popup after 20s if not logged in
  if (!localStorage.getItem('token') && !sessionStorage.getItem('loginPopupShown')) {
    setTimeout(function() {
      if (!document.getElementById('authOverlay')) return;
      sessionStorage.setItem('loginPopupShown', '1');
      authOverlay.classList.add('open');
      if (typeof switchTab === 'function') switchTab('login');
    }, 20000);
  }
}

function switchTab(tab) {
  document.querySelectorAll('.atab').forEach(function(t) { t.classList.toggle('active', t.dataset.tab === tab); });
  var loginForm    = document.getElementById('loginForm');
  var registerForm = document.getElementById('registerForm');
  var forgotForm   = document.getElementById('forgotForm');
  var forgotOtpForm = document.getElementById('forgotOtpForm');
  var otpForm      = document.getElementById('otpForm');
  var loginOtpForm = document.getElementById('loginOtpForm');
  if (loginForm)    loginForm.classList.toggle('hidden', tab !== 'login');
  if (registerForm) registerForm.classList.toggle('hidden', tab !== 'register');
  if (forgotForm)    forgotForm.classList.add('hidden');
  if (forgotOtpForm) forgotOtpForm.classList.add('hidden');
  if (otpForm)       otpForm.classList.add('hidden');
  if (loginOtpForm)  loginOtpForm.classList.add('hidden');
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

function togglePass(inputId, btn) {
  var inp = document.getElementById(inputId);
  var isText = inp.type === 'text';
  inp.type = isText ? 'password' : 'text';
  btn.querySelector('i').className = isText ? 'fa-regular fa-eye' : 'fa-regular fa-eye-slash';
}

function showToast(msg) {
  var t = document.querySelector('.auth-toast');
  if (!t) { t = document.createElement('div'); t.className = 'auth-toast'; document.body.appendChild(t); }
  t.innerHTML = '<i class="fa-solid fa-circle-info"></i> ' + msg;
  t.classList.add('show');
  setTimeout(function() { t.classList.remove('show'); }, 3000);
}

// Login form
var loginFormEl = document.getElementById('loginForm');
if (loginFormEl) {
  loginFormEl.addEventListener('submit', async function(e) {
    e.preventDefault();
    var btn   = e.target.querySelector('button[type=submit]');
    var email = document.getElementById('loginEmail').value.trim();
    var pass  = document.getElementById('loginPass').value;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Logging in...'; btn.disabled = true;
    try {
      var r    = await fetch(API + '/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: email, password: pass }) });
      var data = await r.json();
      if (data.success && data.needsOtp) {
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
    } catch(err) { showToast('Network error. Try again.'); }
    btn.innerHTML = 'Login to Account <i class="fa-solid fa-arrow-right"></i>'; btn.disabled = false;
  });
}

// Register form
var regFormEl = document.getElementById('registerForm');
if (regFormEl) {
  regFormEl.addEventListener('submit', async function(e) {
    e.preventDefault();
    var btn   = e.target.querySelector('button[type=submit]');
    var first = document.getElementById('regFirst').value.trim();
    var last  = document.getElementById('regLast').value.trim();
    var phone = document.getElementById('regPhone').value.trim();
    var email = document.getElementById('regEmail').value.trim();
    var role  = document.getElementById('regRole').value;
    var city  = document.getElementById('regCity').value;
    var pass  = document.getElementById('regPass').value;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending OTP...'; btn.disabled = true;
    try {
      var r    = await fetch(API + '/auth/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ firstName: first, lastName: last, phone: phone, email: email, role: role, city: city, password: pass }) });
      var data = await r.json();
      if (data.success) {
        document.getElementById('registerForm').classList.add('hidden');
        document.getElementById('otpEmailDisplay').textContent = email;
        document.getElementById('otpForm').dataset.email = email;
        document.getElementById('otpInput').value = '';
        document.getElementById('otpForm').classList.remove('hidden');
        showToast('OTP sent to ' + email);
        startOtpTimer('resendOtpLink', 'resendOtpTimer');
      } else { showToast(data.message || 'Registration failed'); }
    } catch(err) { showToast('Network error. Try again.'); }
    btn.innerHTML = 'Create Free Account <i class="fa-solid fa-arrow-right"></i>'; btn.disabled = false;
  });
}

async function verifyRegisterOTP() {
  var btn   = document.getElementById('otpVerifyBtn');
  var email = document.getElementById('otpForm').dataset.email;
  var otp   = document.getElementById('otpInput').value.trim();
  if (!otp || otp.length < 6) { showToast('Enter 6-digit OTP'); return; }
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Verifying...'; btn.disabled = true;
  try {
    var r    = await fetch(API + '/auth/verify-otp', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: email, otp: otp }) });
    var data = await r.json();
    if (data.success) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      window.location.reload();
    } else { showToast(data.message || 'Invalid OTP'); }
  } catch(err) { showToast('Network error. Try again.'); }
  btn.innerHTML = 'Verify & Activate Account <i class="fa-solid fa-check"></i>'; btn.disabled = false;
}

async function verifyLoginOTP() {
  var btn   = document.getElementById('loginOtpVerifyBtn');
  var email = document.getElementById('loginOtpForm').dataset.email;
  var otp   = document.getElementById('loginOtpInput').value.trim();
  if (!otp || otp.length < 6) { showToast('Enter 6-digit OTP'); return; }
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Verifying...'; btn.disabled = true;
  try {
    var r    = await fetch(API + '/auth/verify-login-otp', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: email, otp: otp }) });
    var data = await r.json();
    if (data.success) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      window.location.reload();
    } else { showToast(data.message || 'Invalid OTP'); }
  } catch(err) { showToast('Network error. Try again.'); }
  btn.innerHTML = 'Verify & Login <i class="fa-solid fa-check"></i>'; btn.disabled = false;
}

async function resendOTP() {
  var email = document.getElementById('otpForm').dataset.email;
  if (!email) return;
  try {
    var r    = await fetch(API + '/auth/resend-otp', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: email }) });
    var data = await r.json();
    showToast(data.success ? 'OTP resent to ' + email : (data.message || 'Error'));
    if (data.success) startOtpTimer('resendOtpLink', 'resendOtpTimer');
  } catch(err) { showToast('Network error. Try again.'); }
}

async function resendLoginOTP() {
  var email = document.getElementById('loginOtpForm').dataset.email;
  if (!email) return;
  try {
    var r    = await fetch(API + '/auth/resend-otp', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: email }) });
    var data = await r.json();
    showToast(data.success ? 'OTP resent to ' + email : (data.message || 'Error'));
    if (data.success) startOtpTimer('resendLoginOtpLink', 'resendLoginOtpTimer');
  } catch(err) { showToast('Network error. Try again.'); }
}

async function sendForgotOTP() {
  var btn   = document.getElementById('forgotSendBtn');
  var email = document.getElementById('forgotEmail').value.trim();
  if (!email) { showToast('Enter your email'); return; }
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...'; btn.disabled = true;
  try {
    var r    = await fetch(API + '/auth/forgot-password', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: email }) });
    var data = await r.json();
    if (data.success) {
      document.getElementById('forgotForm').classList.add('hidden');
      document.getElementById('forgotEmailDisplay').textContent = email;
      document.getElementById('forgotOtpForm').classList.remove('hidden');
      document.getElementById('forgotOtpForm').dataset.email = email;
      showToast('OTP sent to ' + email);
    } else { showToast(data.message || 'Error sending OTP'); }
  } catch(err) { showToast('Network error. Try again.'); }
  btn.innerHTML = 'Send OTP <i class="fa-solid fa-paper-plane"></i>'; btn.disabled = false;
}

async function resetPassword() {
  var btn      = document.getElementById('resetPassBtn');
  var email    = document.getElementById('forgotOtpForm').dataset.email;
  var otp      = document.getElementById('forgotOtpInput').value.trim();
  var newPass  = document.getElementById('newPassInput').value;
  if (!otp || otp.length < 6) { showToast('Enter 6-digit OTP'); return; }
  if (!newPass || newPass.length < 6) { showToast('Password must be at least 6 chars'); return; }
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Resetting...'; btn.disabled = true;
  try {
    var r    = await fetch(API + '/auth/reset-password', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: email, otp: otp, newPassword: newPass }) });
    var data = await r.json();
    if (data.success) {
      showToast('Password reset successful!');
      showLoginForm();
      var loginEmailEl = document.getElementById('loginEmail');
      if (loginEmailEl) loginEmailEl.value = email;
    } else { showToast(data.message || 'Invalid OTP'); }
  } catch(err) { showToast('Network error. Try again.'); }
  btn.innerHTML = 'Reset Password <i class="fa-solid fa-check"></i>'; btn.disabled = false;
}

function startOtpTimer(linkId, timerId, seconds) {
  seconds = seconds || 60;
  var link  = document.getElementById(linkId);
  var timer = document.getElementById(timerId);
  if (!link || !timer) return;
  link.dataset.disabled = '1'; link.style.opacity = '0.4'; link.style.pointerEvents = 'none';
  var s = seconds;
  timer.textContent = '(' + s + 's)';
  var iv = setInterval(function() {
    s--; timer.textContent = '(' + s + 's)';
    if (s <= 0) {
      clearInterval(iv); timer.textContent = '';
      link.dataset.disabled = '0'; link.style.opacity = '1'; link.style.pointerEvents = 'inline';
    }
  }, 1000);
}

// ===== OFFER MODAL =====
(function() {
  var overlay = document.createElement('div');
  overlay.id = 'offerOverlay';
  overlay.style.cssText = 'position:fixed;inset:0;z-index:3000;background:rgba(13,27,42,0.75);backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center;padding:20px;opacity:0;pointer-events:none;transition:opacity 0.25s';
  overlay.innerHTML = '<div id="offerBox" style="background:#fff;border-radius:20px;width:100%;max-width:460px;overflow:hidden;box-shadow:0 32px 80px rgba(0,0,0,0.3);transform:translateY(24px) scale(0.97);transition:transform 0.25s;position:relative"><div style="background:linear-gradient(135deg,#0D1B2A,#1a3a5c);padding:24px 28px 20px;"><button id="offerCloseBtn" style="position:absolute;top:14px;right:14px;width:32px;height:32px;border-radius:50%;border:none;background:rgba(255,255,255,0.15);color:#fff;font-size:0.9rem;cursor:pointer;display:flex;align-items:center;justify-content:center;"><i class="fa-solid fa-xmark"></i></button><p style="color:rgba(255,255,255,0.6);font-size:0.75rem;font-weight:600;letter-spacing:1px;text-transform:uppercase;margin-bottom:6px">Contact Agent For</p><h3 id="offerPropTitle" style="color:#fff;font-size:1.1rem;font-weight:800;margin:0 0 4px;line-height:1.3">Property</h3><p id="offerPropLoc" style="color:#FFC107;font-size:0.8rem;display:flex;align-items:center;gap:5px;margin:0"><i class="fa-solid fa-location-dot"></i><span></span></p></div><div style="padding:24px 28px"><div style="display:flex;flex-direction:column;gap:12px;margin-bottom:16px"><div style="display:flex;align-items:center;gap:10px;border:1.5px solid #e0e0e0;border-radius:10px;padding:11px 14px"><i class="fa-solid fa-user" style="color:#E53935;font-size:0.85rem"></i><input id="offerName" type="text" placeholder="Your Full Name *" style="flex:1;border:none;outline:none;font-family:Poppins,sans-serif;font-size:0.88rem;color:#333;background:transparent"/></div><div style="display:flex;align-items:center;gap:10px;border:1.5px solid #e0e0e0;border-radius:10px;padding:11px 14px"><i class="fa-solid fa-phone" style="color:#E53935;font-size:0.85rem"></i><span style="font-size:0.85rem;font-weight:600;color:#555;border-right:1px solid #e0e0e0;padding-right:10px">+91</span><input id="offerPhone" type="tel" placeholder="Mobile Number *" maxlength="10" style="flex:1;border:none;outline:none;font-family:Poppins,sans-serif;font-size:0.88rem;color:#333;background:transparent"/></div></div><div style="display:flex;gap:10px"><button id="offerWaBtn" style="flex:1;background:#25D366;color:#fff;border:none;padding:13px;border-radius:10px;font-size:0.88rem;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;font-family:Poppins,sans-serif"><i class="fa-brands fa-whatsapp" style="font-size:1rem"></i> WhatsApp</button><button id="offerCallBtn" style="flex:1;background:#E53935;color:#fff;border:none;padding:13px;border-radius:10px;font-size:0.88rem;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;font-family:Poppins,sans-serif"><i class="fa-solid fa-phone"></i> Call Back</button></div><p style="text-align:center;font-size:0.72rem;color:#aaa;margin-top:10px"><i class="fa-solid fa-lock" style="margin-right:4px"></i>Your details are safe. No spam.</p></div></div>';
  document.body.appendChild(overlay);

  function closeOffer() { overlay.style.opacity = '0'; overlay.style.pointerEvents = 'none'; }
  overlay.addEventListener('click', function(e) { if (e.target === overlay) closeOffer(); });
  document.getElementById('offerCloseBtn').addEventListener('click', closeOffer);

  document.getElementById('offerWaBtn').addEventListener('click', function() {
    var name  = document.getElementById('offerName').value.trim();
    var phone = document.getElementById('offerPhone').value.trim();
    var title = document.getElementById('offerPropTitle').textContent;
    var loc   = document.getElementById('offerPropLoc').querySelector('span').textContent;
    if (!name || !phone) { alert('Please enter your name and phone number.'); return; }
    var msg = encodeURIComponent('Hi, I am ' + name + ' (+91 ' + phone + '). Interested in: ' + title + ' (' + loc + '). Please share best offer.');
    window.open('https://wa.me/919825031247?text=' + msg, '_blank');
    closeOffer();
  });

  document.getElementById('offerCallBtn').addEventListener('click', async function() {
    var name  = document.getElementById('offerName').value.trim();
    var phone = document.getElementById('offerPhone').value.trim();
    var title = document.getElementById('offerPropTitle').textContent;
    var loc   = document.getElementById('offerPropLoc').querySelector('span').textContent;
    if (!name || !phone) { alert('Please enter your name and phone number.'); return; }
    try {
      await fetch(API + '/inquiry', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: name, phone: phone, propertyName: title, lookingFor: 'Contact Now', city: loc, message: 'Contact Now: ' + title + ' (' + loc + ')' }) });
    } catch(e) {}
    closeOffer();
    showToast('Callback request sent! We\'ll call you shortly.');
  });

  var u = JSON.parse(localStorage.getItem('user') || 'null');
  if (u) {
    if (u.firstName) document.getElementById('offerName').value = (u.firstName + ' ' + (u.lastName || '')).trim();
    if (u.phone) document.getElementById('offerPhone').value = u.phone.replace('+91', '').trim();
  }

  window.openOfferModal = function(title, loc) {
    document.getElementById('offerPropTitle').textContent = title;
    document.getElementById('offerPropLoc').querySelector('span').textContent = loc;
    overlay.style.opacity = '1'; overlay.style.pointerEvents = 'all';
    document.getElementById('offerBox').style.transform = 'translateY(0) scale(1)';
  };
}());

function requireLoginForOffer(e, title, loc) {
  e.stopPropagation();
  if (window.openOfferModal) openOfferModal(title, loc);
}

// ===== NAV DROPDOWN MOBILE =====
document.querySelectorAll('.nav-drop-btn').forEach(function(btn) {
  btn.addEventListener('click', function(e) {
    if (window.innerWidth <= 768) {
      e.preventDefault();
      btn.closest('.nav-dropdown').classList.toggle('open');
    }
  });
});

document.querySelectorAll('.social-links a').forEach(function(a) {
  a.addEventListener('click', function() { var nav = document.getElementById('mobileNav'); if (nav) { nav.style.display = 'none'; document.body.style.overflow = ''; } });
});

// ===== LIVE CHAT =====
var liveChatBtn    = document.getElementById('liveChatBtn');
var liveChatWidget = document.getElementById('liveChatWidget');
var liveChatClose  = document.getElementById('liveChatClose');
if (liveChatBtn && liveChatWidget) {
  liveChatBtn.addEventListener('click', function() { liveChatWidget.classList.toggle('open'); });
  if (liveChatClose) liveChatClose.addEventListener('click', function() { liveChatWidget.classList.remove('open'); });
}

var lcwQA = [
  { q: ['buy','purchase','kharidna','kharidni','flat chahiye','ghar chahiye'], a: '🏠 Great choice! We have 49+ verified properties in Ahmedabad.\n\nBrowse: /properties\nOr call: +91 98250 31247' },
  { q: ['sell','bechna','list','listing'], a: '🏷️ List your property FREE on City Real Space!\n\nVisit: /post-property\nOr call: +91 98250 31247' },
  { q: ['rent','kiraya','lease','rental'], a: '🔑 Rental properties available in Ahmedabad.\n\nBrowse: /properties?status=for-rent\nOr WhatsApp: +91 98250 31247' },
  { q: ['hello','hi','hey','namaste','helo'], a: '👋 Hello! Welcome to City Real Space!\n\nHow can I help you today?\n• Buy Property\n• Sell Property\n• Rent Property\n• Site Visit' },
  { q: ['contact','call','phone','number'], a: '📞 Reach us:\n• +91 98250 31247\n• info@cityrealspace.com\n\nMon–Sat: 9AM–7PM | Sun: 10AM–4PM' }
];
var lcwFinalMsg = '😊 For more help, please contact us directly:\n📞 +91 98250 31247\n💬 WhatsApp: wa.me/919825031247';

function lcwGetReply(msg) {
  var m = msg.toLowerCase();
  for (var i = 0; i < lcwQA.length; i++) {
    if (lcwQA[i].q.some(function(q) { return m.includes(q); })) return lcwQA[i].a;
  }
  return 'I\'ll connect you with our team!\n📞 +91 98250 31247\n💬 WhatsApp: wa.me/919825031247';
}

function lcwAddMsg(text, type) {
  if (!liveChatWidget) return;
  var body = liveChatWidget.querySelector('.lcw-body');
  var div  = document.createElement('div');
  div.className = 'lcw-msg ' + type;
  div.innerHTML = '<div class="lcw-bubble">' + text.replace(/\n/g, '<br>') + '</div>';
  body.appendChild(div);
  body.scrollTop = body.scrollHeight;
}

function lcwBotReply(msg) {
  setTimeout(function() { lcwAddMsg(lcwGetReply(msg), 'bot'); }, 500);
}

function lcwQuick(msg) {
  var btns = liveChatWidget && liveChatWidget.querySelector('.lcw-quick-btns');
  if (btns) btns.remove();
  lcwAddMsg(msg, 'user');
  lcwBotReply(msg);
}

var lcwSendBtn = document.getElementById('lcwSend');
var lcwInput   = document.getElementById('lcwInput');
if (lcwSendBtn) {
  lcwSendBtn.addEventListener('click', function() {
    var msg = lcwInput.value.trim();
    if (!msg) return;
    var btns = liveChatWidget && liveChatWidget.querySelector('.lcw-quick-btns');
    if (btns) btns.remove();
    lcwAddMsg(msg, 'user');
    lcwInput.value = '';
    lcwBotReply(msg);
  });
  lcwInput && lcwInput.addEventListener('keypress', function(e) { if (e.key === 'Enter') lcwSendBtn.click(); });
}

// ===== GIFT POPUP =====
var giftPopup = document.getElementById('giftPopup');
var giftBtn   = document.getElementById('giftBtn');
var giftClose = document.getElementById('giftPopupClose');
if (giftBtn && giftPopup) {
  giftBtn.addEventListener('click', function() { giftPopup.classList.toggle('open'); });
  if (giftClose) giftClose.addEventListener('click', function(e) { e.stopPropagation(); giftPopup.classList.remove('open'); });
}

// ===== COOKIE CONSENT =====
(function() {
  var s = document.createElement('script');
  s.src = '/cookie-consent.js';
  document.body.appendChild(s);
}());

// ===== RS AD PANEL =====
function openRsAd() {
  var panel = document.getElementById('rsAdPanel');
  var tab   = document.getElementById('rsTab');
  var mob   = document.getElementById('rsMobTrigger');
  if (panel) { panel.classList.add('open'); if (tab) tab.classList.add('shifted'); if (mob) mob.classList.add('hidden'); }
}
function closeRsAd() {
  var panel = document.getElementById('rsAdPanel');
  var tab   = document.getElementById('rsTab');
  var mob   = document.getElementById('rsMobTrigger');
  if (panel) { panel.classList.remove('open'); if (tab) tab.classList.remove('shifted'); if (mob) mob.classList.remove('hidden'); }
}

// RS Ad slider
(function() {
  var cur = 0, total = 5, prog = 0, timer, progTimer;
  var track = document.getElementById('rsSlidesTrack');
  var dots  = document.querySelectorAll('.rs-dot');
  var bar   = document.getElementById('rsProgressBar');
  var DURATION = 2500;
  if (!track) return;

  function getW() { return window.innerWidth <= 768 ? window.innerWidth : 340; }
  function rsGoTo(n) {
    if (dots[cur]) dots[cur].classList.remove('active');
    cur = (n + total) % total;
    track.style.transform = 'translateX(-' + cur * getW() + 'px)';
    if (dots[cur]) dots[cur].classList.add('active');
    startProg();
  }
  function startProg() {
    clearInterval(progTimer); prog = 0;
    if (bar) { bar.style.transition = 'none'; bar.style.width = '0%'; }
    setTimeout(function() {
      if (bar) bar.style.transition = 'width 0.1s linear';
      progTimer = setInterval(function() {
        prog += 100 / (DURATION / 100);
        if (bar) bar.style.width = Math.min(prog, 100) + '%';
        if (prog >= 100) clearInterval(progTimer);
      }, 100);
    }, 30);
  }
  function autoPlay() { timer = setInterval(function() { rsGoTo(cur + 1); }, DURATION); }
  function resetAuto() { clearInterval(timer); autoPlay(); }

  dots.forEach(function(d) { d.addEventListener('click', function() { rsGoTo(+this.dataset.rs); resetAuto(); }); });
  var prevBtn = document.getElementById('rsPrevBtn');
  var nextBtn = document.getElementById('rsNextBtn');
  if (prevBtn) prevBtn.addEventListener('click', function() { rsGoTo(cur - 1); resetAuto(); });
  if (nextBtn) nextBtn.addEventListener('click', function() { rsGoTo(cur + 1); resetAuto(); });

  startProg(); autoPlay();
}());
