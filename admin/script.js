const API = (function() {
  if (window.location.protocol === 'file:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:5000/api';
  }
  return 'https://city-real-space.onrender.com/api';
})();

console.log('🔒 Admin Panel Script - API Endpoint:', API);

// ===== CITY → LOCALITY DATA =====
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

// City change → populate locality
document.getElementById('pCitySelect').addEventListener('change', function() {
  const city = this.value;
  const areaEl = document.getElementById('pAreaSelect');
  const subEl  = document.getElementById('pSubAreaSelect');
  const locs   = Object.keys(cityLocalities[city] || {});
  areaEl.innerHTML = '<option value="">-- Select Locality --</option>' +
    locs.map(l => '<option value="' + l + '">' + l + '</option>').join('') +
    '<option value="__other__">Other (Type Manually)</option>';
  subEl.innerHTML = '<option value="">-- Select Locality First --</option>';
  document.getElementById('pSubArea').value = '';
});

// Locality change → populate sub-area
document.getElementById('pAreaSelect').addEventListener('change', function() {
  const city  = document.getElementById('pCitySelect').value;
  const area  = this.value;
  const subEl = document.getElementById('pSubAreaSelect');
  if (area === '__other__') {
    subEl.innerHTML = '<option value="">-- N/A --</option>';
    return;
  }
  const subs = (cityLocalities[city] && cityLocalities[city][area]) || [];
  subEl.innerHTML = '<option value="">-- Select Sub Area --</option>' +
    subs.map(s => '<option value="' + s + '">' + s + '</option>').join('') +
    '<option value="__other__">Other (Type Manually)</option>';
  document.getElementById('pSubArea').value = '';
});

// Sub-area select → fill text input
document.getElementById('pSubAreaSelect').addEventListener('change', function() {
  if (this.value && this.value !== '__other__') {
    document.getElementById('pSubArea').value = this.value;
  } else if (this.value === '__other__') {
    document.getElementById('pSubArea').value = '';
    document.getElementById('pSubArea').focus();
  }
});

// ===== AUTH GUARD — instant check before anything loads =====
const adminToken = localStorage.getItem('adminToken');
const adminUser  = JSON.parse(localStorage.getItem('adminUser') || 'null');
if (!adminToken || !adminUser || adminUser.role !== 'admin') {
  window.location.replace('login.html');
  throw new Error('Unauthorized');
}

// ===== SESSION TIMEOUT — 10 min inactivity =====
const SESSION_TIMEOUT = 10 * 60 * 1000;
let _sessionTimer;

function resetSessionTimer() {
  clearTimeout(_sessionTimer);
  localStorage.setItem('adminLastActive', Date.now());
  _sessionTimer = setTimeout(function() {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    localStorage.removeItem('adminLastActive');
    alert('⏰ Session expired due to inactivity. Please login again.');
    window.location.replace('login.html');
  }, SESSION_TIMEOUT);
}

// Check if already expired on load
const lastActive = parseInt(localStorage.getItem('adminLastActive') || '0');
if (lastActive && (Date.now() - lastActive) > SESSION_TIMEOUT) {
  localStorage.removeItem('adminToken');
  localStorage.removeItem('adminUser');
  localStorage.removeItem('adminLastActive');
  window.location.replace('login.html');
  throw new Error('Session expired');
}

// Also verify token with backend on load
(async function verifyAdminSession() {
  try {
    const res = await fetch(API + '/auth/me', { headers: { Authorization: 'Bearer ' + adminToken } });
    const data = await res.json();
    if (!res.ok || !data.user || data.user.role !== 'admin') {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      localStorage.removeItem('adminLastActive');
      window.location.replace('login.html');
    }
  } catch(e) { /* network error — keep session */ }
})();

['mousemove','keydown','click','scroll','touchstart'].forEach(function(evt) {
  document.addEventListener(evt, resetSessionTimer, { passive: true });
});
resetSessionTimer();

document.getElementById('adminName').textContent = adminUser ? (adminUser.firstName || 'Admin') : 'Admin';

document.getElementById('adminLogout').addEventListener('click', function(e) {
  e.preventDefault();
  clearTimeout(_sessionTimer);
  localStorage.removeItem('adminToken');
  localStorage.removeItem('adminUser');
  localStorage.removeItem('adminLastActive');
  window.location.replace('login.html');
});

// ===== API HELPER =====
async function api(method, path, body) {
  const opts = {
    method: method,
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + adminToken }
  };
  if (body) opts.body = JSON.stringify(body);
  try {
    const res = await fetch(API + '/admin' + path, opts);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return { success: false, message: err.message || 'Server error ' + res.status };
    }
    return res.json();
  } catch(e) {
    toast('Backend not reachable. Check server.', 'error');
    return { success: false, message: e.message };
  }
}

// ===== TOAST =====
function toast(msg, type) {
  const t = document.getElementById('adminToast');
  t.textContent = msg;
  t.className = 'admin-toast show' + (type === 'error' ? ' error' : '');
  setTimeout(function() { t.className = 'admin-toast'; }, 3000);
}

// ===== NAVIGATION =====
function goPage(name) {
  document.querySelectorAll('.sb-link').forEach(function(l) {
    l.classList.toggle('active', l.dataset.page === name);
  });
  document.querySelectorAll('.page').forEach(function(p) {
    p.classList.toggle('active', p.id === 'page-' + name);
  });
  var titles = { dashboard: 'Dashboard', properties: 'Properties', submissions: 'User Submissions', blogs: 'Blog Posts', inquiries: 'Inquiries', contacts: 'Contact Messages', users: 'Users', requirements: 'User Requirements' };
  document.getElementById('topbarTitle').textContent = titles[name] || name;
  if (name === 'dashboard')    loadStats();
  if (name === 'properties')   loadProperties('all');
  if (name === 'submissions')  loadSubmissions();
  if (name === 'blogs')        loadBlogs();
  if (name === 'inquiries')    loadInquiries();
  if (name === 'contacts')     loadContacts();
  if (name === 'users')        loadUsers();
  if (name === 'requirements') loadRequirements();
}

document.querySelectorAll('.sb-link[data-page]').forEach(function(link) {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    goPage(link.dataset.page);
    if (window.innerWidth <= 900) {
      document.getElementById('sidebar').classList.remove('open');
      document.getElementById('sidebarOverlay').style.display = 'none';
    }
  });
});

document.getElementById('sidebarToggle').addEventListener('click', function() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  sidebar.classList.toggle('open');
  overlay.style.display = sidebar.classList.contains('open') ? 'block' : 'none';
});

document.getElementById('sidebarOverlay').addEventListener('click', function() {
  document.getElementById('sidebar').classList.remove('open');
  this.style.display = 'none';
});

// ===== MODAL =====
function openModal(id) { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }

document.querySelectorAll('.modal-overlay').forEach(function(m) {
  m.addEventListener('click', function(e) {
    if (e.target === m) m.classList.remove('open');
  });
});

// ===== FORMAT DATE =====
function fmtDate(d) {
  return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

// ===== DASHBOARD STATS =====
async function loadStats() {
  try {
    const data = await api('GET', '/stats');
    if (!data.success) return;
    const s = data.stats;
    document.getElementById('st-total').textContent    = s.totalProps;
    document.getElementById('st-pending').textContent  = s.pendingProps;
    document.getElementById('st-approved').textContent = s.approvedProps;
    document.getElementById('st-inq').textContent      = s.newInquiries;
    document.getElementById('st-users').textContent    = s.totalUsers;
    document.getElementById('st-blogs').textContent    = s.totalBlogs;
    document.getElementById('inqBadge').textContent    = s.newInquiries;
    const sub = await api('GET', '/user-properties');
    if (sub.success) document.getElementById('subBadge').textContent = sub.properties.filter(function(p) { return !p.isApproved; }).length;
    const inqData = await api('GET', '/inquiries');
    if (inqData.success) {
      document.getElementById('inqBadge').textContent = inqData.inquiries.filter(function(i) { return i.status === 'new'; }).length;
    }
    const reqData = await api('GET', '/requirements');
    if (reqData.success) {
      const reqCount = reqData.inquiries.filter(function(i) { return i.status === 'new'; }).length;
      document.getElementById('reqBadge').textContent = reqCount;
      document.getElementById('st-reqs').textContent = reqData.inquiries.length;
    }
    // Trending / Residential / Commercial counts
    const allProps = await api('GET', '/properties');
    if (allProps.success && allProps.properties) {
      const props = allProps.properties;
      document.getElementById('st-trending').textContent    = props.filter(function(p){ return p.isFeatured; }).length;
      document.getElementById('st-residential').textContent = props.filter(function(p){ return p.category === 'residential'; }).length;
      document.getElementById('st-commercial').textContent  = props.filter(function(p){ return p.category === 'commercial'; }).length;
    }
  } catch(e) { console.log('Stats error', e); }
}

// ===== CLOUDINARY =====
const CLOUDINARY_CLOUD  = 'dhqan0w6t';
const CLOUDINARY_PRESET = 'crs_upload';

function handleAdminImages(input) {
  Array.from(input.files).forEach(function(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const item = document.createElement('div');
      item.style.cssText = 'position:relative;width:90px;height:70px;border-radius:8px;overflow:hidden;border:1.5px solid #e8e8e8;flex-shrink:0';
      item._file = file;
      item.innerHTML = '<img src="' + e.target.result + '" style="width:100%;height:100%;object-fit:cover"/>' +
        '<button type="button" onclick="this.parentElement.remove()" style="position:absolute;top:3px;right:3px;background:rgba(0,0,0,0.6);border:none;color:#fff;border-radius:50%;width:20px;height:20px;cursor:pointer;font-size:0.65rem;display:flex;align-items:center;justify-content:center"><i class="fa-solid fa-xmark"></i></button>';
      document.getElementById('pImagePreview').appendChild(item);
    };
    reader.readAsDataURL(file);
  });
}

async function uploadToCloudinary(file) {
  const fd = new FormData();
  fd.append('file', file);
  fd.append('upload_preset', CLOUDINARY_PRESET);
  const res = await fetch('https://api.cloudinary.com/v1_1/' + CLOUDINARY_CLOUD + '/image/upload', { method: 'POST', body: fd });
  const data = await res.json();
  if (!data.secure_url) throw new Error('Upload failed');
  return data.secure_url;
}

// ===== CALC LISTING SCORE FOR EXISTING PROPERTY =====
function calcPropScore(p) {
  let s = 0;
  if (p.title && p.title.trim().length >= 5)                          s += 15;
  if (p.type)                                                          s += 10;
  if (p.location && p.location.city && p.location.area)               s += 15;
  if (p.price > 0)                                                     s += 15;
  if (p.specs && p.specs.sqft > 0)                                     s += 10;
  if (p.description && p.description.trim().length >= 30)             s += 20;
  if (p.images && p.images.length > 0)                                s += 15;
  return s;
}

function listingBadgeHtml(p) {
  const s = calcPropScore(p);
  if (s >= 85) return '<span style="display:inline-flex;align-items:center;gap:4px;background:linear-gradient(135deg,#d1fae5,#a7f3d0);color:#065f46;font-size:0.65rem;font-weight:800;padding:3px 9px;border-radius:20px;border:1px solid #6ee7b7;white-space:nowrap"><i class="fas fa-fire" style="color:#10b981"></i> High</span>';
  if (s >= 50) return '<span style="display:inline-flex;align-items:center;gap:4px;background:#eff6ff;color:#1e40af;font-size:0.65rem;font-weight:800;padding:3px 9px;border-radius:20px;border:1px solid #93c5fd;white-space:nowrap"><i class="fas fa-equals" style="color:#3b82f6"></i> Mid</span>';
  return '<span style="display:inline-flex;align-items:center;gap:4px;background:#fef2f2;color:#991b1b;font-size:0.65rem;font-weight:800;padding:3px 9px;border-radius:20px;border:1px solid #fca5a5;white-space:nowrap"><i class="fas fa-arrow-down" style="color:#ef4444"></i> Low</span>';
}

let currentPropFilter = 'all';
let propsCache = {};

function renderPropRow(p) {
  const isCommercial = p.category === 'commercial' || ['office','shop','warehouse'].includes(p.type);
  const typeLabel = { apartment:'Apartment', villa:'Villa', bungalow:'Bungalow', rowhouse:'Row House', plot:'Plot', office:'Office', shop:'Shop', warehouse:'Warehouse' };
  const catBadge = isCommercial
    ? '<span style="color:#60a5fa;font-weight:700;font-size:0.78rem;">Commercial</span><br><small style="color:var(--text3);font-size:0.68rem;">' + (typeLabel[p.type] || p.type) + '</small>'
    : '<span style="color:#34d399;font-weight:700;font-size:0.78rem;">Residential</span><br><small style="color:var(--text3);font-size:0.68rem;">' + (typeLabel[p.type] || p.type) + '</small>';
  const trendBtn = '<button class="act-btn trending' + (p.isFeatured ? ' active' : '') + '" title="' + (p.isFeatured ? 'Remove Trending' : 'Mark Trending') + '" onclick="toggleTrending(\'' + p._id + '\', ' + (p.isFeatured ? 'true' : 'false') + ')" style="' + (p.isFeatured ? 'background:rgba(245,158,11,0.25);color:#f59e0b;box-shadow:0 0 8px rgba(245,158,11,0.3);' : '') + '"><i class="fa-solid fa-fire"></i></button>';
  return '<tr>' +
    '<td><div style="display:flex;align-items:center;gap:10px">' +
    (p.images && p.images[0] ? '<img src="' + p.images[0] + '" class="prop-thumb" alt=""/>' : '<div style="width:48px;height:36px;background:rgba(255,255,255,0.05);border-radius:6px;display:flex;align-items:center;justify-content:center;color:#555"><i class="fa-solid fa-image"></i></div>') +
    '<div class="prop-info"><strong>' + p.title + '</strong><span>' + (p.isFeatured ? '🔥 ' : '') + (p.agent && p.agent.name ? p.agent.name : '') + '</span></div></div></td>' +
    '<td style="white-space:normal">' + catBadge + '</td>' +
    '<td>' + (p.location ? p.location.area + ', ' + p.location.city : '—') + '</td>' +
    '<td><strong>' + (p.priceLabel || '₹' + p.price) + '</strong></td>' +
    '<td><span class="badge ' + (p.status === 'for-sale' ? 'badge-green' : p.status === 'for-rent' ? 'badge-blue' : 'badge-orange') + '">' + p.status + '</span></td>' +
    '<td><span class="badge ' + (p.isApproved ? 'badge-green' : 'badge-orange') + '">' + (p.isApproved ? 'Approved' : 'Pending') + '</span></td>' +
    '<td><div class="act-btns">' +
    (!p.isApproved ? '<button class="act-btn approve" title="Approve" onclick="approveProperty(\'' + p._id + '\')"><i class="fa-solid fa-check"></i></button>' : '') +
    trendBtn +
    '<button class="act-btn edit" title="Edit" onclick="editPropertyById(\'' + p._id + '\')" ><i class="fa-solid fa-pen"></i></button>' +
    '<button class="act-btn del" title="Delete" onclick="deleteProperty(\'' + p._id + '\')"><i class="fa-solid fa-trash"></i></button>' +
    '</div></td></tr>';
}


async function loadProperties(filter) {
  currentPropFilter = filter;
  document.querySelectorAll('.fbtn[data-filter]').forEach(function(b) {
    b.classList.toggle('active', b.dataset.filter === filter);
  });
  let param = '';
  if (filter === 'pending')  param = '?approved=false';
  if (filter === 'approved') param = '?approved=true';
  const data = await api('GET', '/properties' + param);
  const tbody = document.getElementById('propTbody');
  if (!data.success || !data.properties.length) {
    tbody.innerHTML = '<tr><td colspan="8"><div class="empty-state"><i class="fa-solid fa-building"></i><p>No properties found.</p></div></td></tr>';
    return;
  }
  data.properties.forEach(function(p) { propsCache[p._id] = p; });
  tbody.innerHTML = data.properties.map(function(p) { return renderPropRow(p); }).join('');
}

function editPropertyById(id) {
  const p = propsCache[id];
  if (!p) { toast('Property not found', 'error'); return; }
  editProperty(p);
}

document.querySelectorAll('.fbtn[data-filter]').forEach(function(b) {
  b.addEventListener('click', function() { loadProperties(b.dataset.filter); });
});

// Category + Trending filter buttons
function setPropFilterActive(btn) {
  document.querySelectorAll('#page-properties .fbtn').forEach(function(b) { b.classList.remove('active'); });
  btn.classList.add('active');
}

function applyPropFilter(cat) {
  const tbody = document.getElementById('propTbody');
  tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:40px"><i class="fa-solid fa-spinner fa-spin" style="color:var(--accent);font-size:1.5rem"></i></td></tr>';
  const paramMap = { residential: '?category=residential', commercial: '?category=commercial', trending: '?featured=true' };
  const emptyMsg = { residential: 'No residential properties found.', commercial: 'No commercial properties found.', trending: 'No trending properties. Click 🔥 on any property to mark it trending.' };
  api('GET', '/properties' + (paramMap[cat] || '')).then(function(data) {
    if (!data.success || !data.properties || !data.properties.length) {
      tbody.innerHTML = '<tr><td colspan="7"><div class="empty-state"><i class="fa-solid fa-building"></i><p>' + (emptyMsg[cat] || 'No properties found.') + '</p></div></td></tr>';
      return;
    }
    data.properties.forEach(function(p) { propsCache[p._id] = p; });
    tbody.innerHTML = data.properties.map(function(p) { return renderPropRow(p); }).join('');
  });
}

['btnResidential','btnCommercial','btnTrending'].forEach(function(id) {
  const btn = document.getElementById(id);
  if (!btn) return;
  btn.addEventListener('click', function() {
    setPropFilterActive(this);
    const catMap = { btnResidential:'residential', btnCommercial:'commercial', btnTrending:'trending' };
    applyPropFilter(catMap[id]);
  });
});

document.getElementById('addPropBtn').addEventListener('click', function() {
  document.getElementById('propModalTitle').textContent = 'Add Property';
  document.getElementById('propForm').reset();
  document.getElementById('propId').value = '';
  document.getElementById('pApproved').checked = true;
  document.getElementById('pImage').value = '';
  document.getElementById('pImagePreview').innerHTML = '';
  // Reset dynamic dropdowns
  document.getElementById('pAreaSelect').innerHTML = '<option value="">-- Select City First --</option>';
  document.getElementById('pSubAreaSelect').innerHTML = '<option value="">-- Select Locality First --</option>';
  document.getElementById('pSubArea').value = '';
  openModal('propModal');
});

function editProperty(p) {
  document.getElementById('propModalTitle').textContent = 'Edit Property';
  document.getElementById('propId').value = p._id;
  document.getElementById('pTitle').value = p.title || '';
  document.getElementById('pPriceLabel').value = p.priceLabel || '';
  document.getElementById('pPrice').value = p.price || '';
  document.getElementById('pType').value = p.type || '';
  document.getElementById('pCategory').value = p.category || 'residential';
  document.getElementById('pStatus').value = p.status || 'for-sale';

  // City → populate locality → set value
  const city = p.location ? p.location.city : '';
  const area = p.location ? p.location.area : '';
  const subArea = (p.extraDetails && p.extraDetails.subArea) || '';

  const cityEl = document.getElementById('pCitySelect');
  cityEl.value = city;
  // Trigger locality population
  const locs = Object.keys(cityLocalities[city] || {});
  const areaEl = document.getElementById('pAreaSelect');
  areaEl.innerHTML = '<option value="">-- Select Locality --</option>' +
    locs.map(l => '<option value="' + l + '">' + l + '</option>').join('') +
    '<option value="__other__">Other (Type Manually)</option>';
  areaEl.value = area;
  // Trigger sub-area population
  const subs = (cityLocalities[city] && cityLocalities[city][area]) || [];
  const subEl = document.getElementById('pSubAreaSelect');
  subEl.innerHTML = '<option value="">-- Select Sub Area --</option>' +
    subs.map(s => '<option value="' + s + '">' + s + '</option>').join('') +
    '<option value="__other__">Other (Type Manually)</option>';
  subEl.value = subArea;
  document.getElementById('pSubArea').value = subArea;

  document.getElementById('pBeds').value = p.specs ? p.specs.beds : 0;
  document.getElementById('pBaths').value = p.specs ? p.specs.baths : 0;
  document.getElementById('pSqft').value = p.specs ? p.specs.sqft : 0;
  document.getElementById('pBalconies').value = (p.extraDetails && p.extraDetails.balconies) || 0;
  document.getElementById('pFloor').value = (p.extraDetails && p.extraDetails.floor) || '';
  document.getElementById('pTotalFloors').value = (p.extraDetails && p.extraDetails.totalFloors) || '';
  document.getElementById('pFurnished').value = (p.extraDetails && p.extraDetails.furnished) || '';
  document.getElementById('pPossession').value = (p.extraDetails && p.extraDetails.possession) || 'Ready to Move';
  document.getElementById('pProject').value = (p.extraDetails && p.extraDetails.project) || '';
  document.getElementById('pToken').value = (p.extraDetails && p.extraDetails.tokenAmount) || '';
  document.getElementById('pAgentName').value = p.agent ? p.agent.name : '';
  document.getElementById('pAgentPhone').value = p.agent ? p.agent.phone : '';
  document.getElementById('pDesc').value = p.description || '';
  document.getElementById('pFeatured').checked = p.isFeatured || false;
  document.getElementById('pApproved').checked = p.isApproved || false;
  // Update dynamic fields based on type
  updateAdminTypeFields();
  const preview = document.getElementById('pImagePreview');
  preview.innerHTML = '';
  if (p.images && p.images.length) {
    p.images.forEach(function(url) {
      const item = document.createElement('div');
      item.style.cssText = 'position:relative;width:90px;height:70px;border-radius:8px;overflow:hidden;border:1.5px solid #e8e8e8;flex-shrink:0';
      item.dataset.existingUrl = url;
      item.innerHTML = '<img src="' + url + '" style="width:100%;height:100%;object-fit:cover"/>' +
        '<button type="button" onclick="this.parentElement.remove()" style="position:absolute;top:3px;right:3px;background:rgba(0,0,0,0.6);border:none;color:#fff;border-radius:50%;width:20px;height:20px;cursor:pointer;font-size:0.65rem;display:flex;align-items:center;justify-content:center"><i class="fa-solid fa-xmark"></i></button>';
      preview.appendChild(item);
    });
  }
  openModal('propModal');
}

document.getElementById('propForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  const id = document.getElementById('propId').value;
  const btn = document.getElementById('propSaveBtn');
  btn.textContent = 'Saving...'; btn.disabled = true;
  const previewItems = document.querySelectorAll('#pImagePreview div');
  const imageUrls = [];
  for (const item of previewItems) {
    if (item._file) {
      try { imageUrls.push(await uploadToCloudinary(item._file)); } catch(e) {}
    } else if (item.dataset.existingUrl) {
      imageUrls.push(item.dataset.existingUrl);
    }
  }
  const body = {
    title: document.getElementById('pTitle').value,
    priceLabel: document.getElementById('pPriceLabel').value,
    price: Number(document.getElementById('pPrice').value),
    type: document.getElementById('pType').value,
    category: document.getElementById('pCategory').value,
    status: document.getElementById('pStatus').value,
    location: {
      area: document.getElementById('pAreaSelect').value === '__other__' ? '' : (document.getElementById('pAreaSelect').value || ''),
      city: document.getElementById('pCitySelect').value
    },
    specs: { beds: Number(document.getElementById('pBeds').value), baths: Number(document.getElementById('pBaths').value), sqft: Number(document.getElementById('pSqft').value) },
    agent: { name: document.getElementById('pAgentName').value, phone: document.getElementById('pAgentPhone').value, initials: document.getElementById('pAgentName').value.split(' ').map(function(w){return w[0];}).join('').toUpperCase() },
    images: imageUrls,
    description: document.getElementById('pDesc').value,
    isFeatured: document.getElementById('pFeatured').checked,
    isApproved: document.getElementById('pApproved').checked,
    extraDetails: {
      balconies: Number(document.getElementById('pBalconies').value) || 0,
      floor: document.getElementById('pFloor').value,
      totalFloors: document.getElementById('pTotalFloors').value,
      furnished: document.getElementById('pFurnished').value,
      possession: document.getElementById('pPossession').value,
      project: document.getElementById('pProject').value,
      tokenAmount: document.getElementById('pToken').value,
      subArea: document.getElementById('pSubArea').value || document.getElementById('pSubAreaSelect').value
    }
  };
  const data = id ? await api('PUT', '/properties/' + id, body) : await api('POST', '/properties', body);
  btn.textContent = 'Save Property'; btn.disabled = false;
  if (data.success) {
    toast(id ? 'Property updated!' : 'Property added!');
    closeModal('propModal');
    loadProperties(currentPropFilter);
    loadStats();
  } else {
    toast(data.message || 'Error saving property', 'error');
  }
});

async function approveProperty(id) {
  const data = await api('PUT', '/properties/' + id + '/approve');
  if (data.success) { toast('Property approved!'); loadProperties(currentPropFilter); loadStats(); }
  else toast(data.message || 'Error', 'error');
}

async function toggleTrending(id, isFeatured) {
  const data = await api('PUT', '/properties/' + id, { isFeatured: !isFeatured });
  if (data.success) {
    toast(isFeatured ? 'Removed from Trending!' : '🔥 Added to Trending!');
    loadProperties(currentPropFilter);
    loadStats();
  } else toast(data.message || 'Error', 'error');
}

let currentCategoryFilter = '';
function filterByCategory(cat) {
  currentCategoryFilter = cat;
  // Switch to properties page WITHOUT triggering loadProperties
  document.querySelectorAll('.sb-link').forEach(function(l) {
    l.classList.toggle('active', l.dataset.page === 'properties');
  });
  document.querySelectorAll('.page').forEach(function(p) {
    p.classList.toggle('active', p.id === 'page-properties');
  });
  document.getElementById('topbarTitle').textContent = 'Properties';

  if (cat === 'trending') {
    loadTrendingProperties();
  } else {
    loadPropertiesByCategory(cat);
  }
}

async function loadTrendingProperties() {
  const data = await api('GET', '/properties?featured=true');
  const tbody = document.getElementById('propTbody');
  if (!data.success || !data.properties.length) {
    tbody.innerHTML = '<tr><td colspan="8"><div class="empty-state"><i class="fa-solid fa-fire"></i><p>No trending properties yet.<br><small>Click 🔥 fire button on any property to mark it trending.</small></p></div></td></tr>';
    return;
  }
  data.properties.forEach(function(p) { propsCache[p._id] = p; });
  tbody.innerHTML = data.properties.map(function(p) { return renderPropRow(p); }).join('');
}

async function loadPropertiesByCategory(cat) {
  const data = await api('GET', '/properties?category=' + cat);
  const tbody = document.getElementById('propTbody');
  if (!data.success || !data.properties.length) {
    tbody.innerHTML = '<tr><td colspan="8"><div class="empty-state"><i class="fa-solid fa-building"></i><p>No ' + cat + ' properties found.</p></div></td></tr>';
    return;
  }
  data.properties.forEach(function(p) { propsCache[p._id] = p; });
  tbody.innerHTML = data.properties.map(function(p) { return renderPropRow(p); }).join('');
}

async function deleteProperty(id) {
  if (!confirm('Delete this property?')) return;
  const data = await api('DELETE', '/properties/' + id);
  if (data.success) { toast('Property deleted.'); loadProperties(currentPropFilter); loadStats(); }
  else toast(data.message || 'Error', 'error');
}

// ===== USER SUBMISSIONS =====
async function loadSubmissions() {
  const data = await api('GET', '/user-properties');
  const tbody = document.getElementById('subTbody');
  if (!data.success || !data.properties.length) {
    tbody.innerHTML = '<tr><td colspan="9"><div class="empty-state"><i class="fa-solid fa-inbox"></i><p>No user submissions yet.</p></div></td></tr>';
    document.getElementById('subBadge').textContent = 0;
    return;
  }
  document.getElementById('subBadge').textContent = data.properties.filter(function(p){return !p.isApproved;}).length;
  tbody.innerHTML = data.properties.map(function(p) {
    return '<tr>' +
      '<td><div style="display:flex;align-items:center;gap:10px">' +
      (p.images && p.images[0] ? '<img src="' + p.images[0] + '" class="prop-thumb"/>' : '<div style="width:48px;height:36px;background:#f0f0f0;border-radius:6px;display:flex;align-items:center;justify-content:center;color:#ccc"><i class="fa-solid fa-image"></i></div>') +
      '<div class="prop-info"><strong>' + p.title + '</strong></div></div></td>' +
      '<td><strong>' + (p.postedBy ? p.postedBy.firstName + ' ' + p.postedBy.lastName : '—') + '</strong></td>' +
      '<td>' + (p.postedBy ? p.postedBy.phone : '—') + '</td>' +
      '<td>' + (p.location ? p.location.area + ', ' + p.location.city : '') + '</td>' +
      '<td><strong>' + (p.priceLabel || '₹' + p.price) + '</strong></td>' +
      '<td>' + listingBadgeHtml(p) + '</td>' +
      '<td><span class="badge ' + (p.isApproved ? 'badge-green' : 'badge-orange') + '">' + (p.isApproved ? 'Approved' : 'Pending') + '</span></td>' +
      '<td>' + fmtDate(p.createdAt) + '</td>' +
      '<td><div class="act-btns">' +
      (!p.isApproved ? '<button class="act-btn approve" onclick="approveSubmission(\'' + p._id + '\')"><i class="fa-solid fa-check"></i></button>' : '') +
      '<button class="act-btn del" onclick="deleteSubmission(\'' + p._id + '\')"><i class="fa-solid fa-trash"></i></button>' +
      '</div></td></tr>';
  }).join('');
}

async function approveSubmission(id) {
  const data = await api('PUT', '/properties/' + id + '/approve');
  if (data.success) { toast('Approved!'); loadSubmissions(); loadStats(); }
  else toast(data.message || 'Error', 'error');
}

async function deleteSubmission(id) {
  if (!confirm('Delete this submission?')) return;
  const data = await api('DELETE', '/properties/' + id);
  if (data.success) { toast('Deleted.'); loadSubmissions(); loadStats(); }
  else toast(data.message || 'Error', 'error');
}

// ===== BLOGS =====
let blogsCache = {};

async function loadBlogs() {
  const data = await api('GET', '/blogs');
  const tbody = document.getElementById('blogTbody');
  if (!data.success || !data.blogs.length) {
    tbody.innerHTML = '<tr><td colspan="6"><div class="empty-state"><i class="fa-solid fa-newspaper"></i><p>No blog posts yet.</p></div></td></tr>';
    return;
  }
  data.blogs.forEach(function(b) { blogsCache[b._id] = b; });
  tbody.innerHTML = data.blogs.map(function(b) {
    const seoScore = calcBlogSeoScore(b);
    const scoreBadge = seoScore >= 80
      ? '<span style="background:#e8f5e9;color:#2e7d32;font-size:0.65rem;font-weight:800;padding:2px 8px;border-radius:20px;border:1px solid #a5d6a7;">🟢 ' + seoScore + '</span>'
      : seoScore >= 50
      ? '<span style="background:#fff3e0;color:#e65100;font-size:0.65rem;font-weight:800;padding:2px 8px;border-radius:20px;border:1px solid #ffcc80;">🟡 ' + seoScore + '</span>'
      : '<span style="background:#ffebee;color:#c62828;font-size:0.65rem;font-weight:800;padding:2px 8px;border-radius:20px;border:1px solid #ef9a9a;">🔴 ' + seoScore + '</span>';
    return '<tr>' +
      '<td><div style="display:flex;align-items:center;gap:10px">' +
      (b.image ? '<img src="' + b.image + '" style="width:48px;height:36px;border-radius:6px;object-fit:cover;flex-shrink:0"/>' : '<div style="width:48px;height:36px;background:#f0f0f0;border-radius:6px;display:flex;align-items:center;justify-content:center;color:#ccc"><i class="fa-solid fa-image"></i></div>') +
      '<div><strong style="font-size:0.83rem;color:#0D1B2A;display:block;max-width:220px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' + b.title + '</strong><small style="color:#aaa">' + (b.slug || '') + '</small></div></div></td>' +
      '<td><span class="badge badge-blue">' + b.category + '</span></td>' +
      '<td>' + b.author + '</td>' +
      '<td>' + scoreBadge + '</td>' +
      '<td><span class="badge ' + (b.isPublished ? 'badge-green' : 'badge-gray') + '">' + (b.isPublished ? 'Published' : 'Draft') + '</span></td>' +
      '<td>' + fmtDate(b.createdAt) + '</td>' +
      '<td><div class="act-btns">' +
      '<button class="act-btn edit" onclick="editBlogById(\'' + b._id + '\')"><i class="fa-solid fa-pen"></i></button>' +
      '<button class="act-btn del" onclick="deleteBlog(\'' + b._id + '\')"><i class="fa-solid fa-trash"></i></button>' +
      '</div></td></tr>';
  }).join('');
}

function calcBlogSeoScore(b) {
  let s = 0;
  if (b.title && b.title.trim().length >= 5) s += 20;
  if (b.excerpt && b.excerpt.trim().length >= 20) s += 15;
  if (b.content && b.content.replace(/<[^>]*>/g,'').trim().split(/\s+/).length >= 300) s += 25;
  if (b.image && b.image.trim()) s += 15;
  if (b.metaDescription && b.metaDescription.trim().length >= 20) s += 15;
  if (b.slug && b.slug.trim()) s += 10;
  return s;
}

function editBlogById(id) {
  const b = blogsCache[id];
  if (!b) { toast('Blog not found', 'error'); return; }
  editBlog(b);
}

document.getElementById('addBlogBtn').addEventListener('click', function() {
  document.getElementById('blogModalTitle').textContent = 'Write Blog Post';
  document.getElementById('blogForm').reset();
  document.getElementById('blogId').value = '';
  document.getElementById('bAuthor').value = 'CRS Team';
  document.getElementById('bPublished').checked = true;
  document.getElementById('bContentEditor').innerHTML = '';
  document.getElementById('bSlug').value = '';
  document.getElementById('bMetaTitle').value = '';
  document.getElementById('bMetaDesc').value = '';
  document.getElementById('bMetaTitleCount').textContent = '0';
  document.getElementById('bMetaDescCount').textContent = '0';
  document.getElementById('bImgPreview').style.display = 'none';
  document.getElementById('bImgIcon').style.display = 'block';
  updateBlogSeoScore();
  openModal('blogModal');
});

function editBlog(b) {
  document.getElementById('blogModalTitle').textContent = 'Edit Blog Post';
  document.getElementById('blogId').value = b._id;
  document.getElementById('bTitle').value = b.title || '';
  document.getElementById('bSlug').value = b.slug || '';
  document.getElementById('bCategory').value = b.category || 'Market Insight';
  document.getElementById('bAuthor').value = b.author || 'CRS Team';
  document.getElementById('bImage').value = b.image || '';
  document.getElementById('bExcerpt').value = b.excerpt || '';
  document.getElementById('bContentEditor').innerHTML = b.content || '';
  document.getElementById('bContent').value = b.content || '';
  document.getElementById('bMetaTitle').value = b.metaTitle || '';
  document.getElementById('bMetaDesc').value = b.metaDescription || '';
  document.getElementById('bMetaTitleCount').textContent = (b.metaTitle || '').length;
  document.getElementById('bMetaDescCount').textContent = (b.metaDescription || '').length;
  document.getElementById('bPublished').checked = b.isPublished || false;
  // Image preview
  if (b.image) {
    document.getElementById('bImgPreview').src = b.image;
    document.getElementById('bImgPreview').style.display = 'block';
    document.getElementById('bImgIcon').style.display = 'none';
  }
  updateBlogSeoScore();
  openModal('blogModal');
}

document.getElementById('blogForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  const id = document.getElementById('blogId').value;
  const btn = document.getElementById('blogSaveBtn');
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Saving...'; btn.disabled = true;
  // Sync editor content to hidden textarea
  document.getElementById('bContent').value = document.getElementById('bContentEditor').innerHTML;
  const body = {
    title:           document.getElementById('bTitle').value,
    slug:            document.getElementById('bSlug').value,
    category:        document.getElementById('bCategory').value,
    author:          document.getElementById('bAuthor').value,
    image:           document.getElementById('bImage').value,
    excerpt:         document.getElementById('bExcerpt').value,
    content:         document.getElementById('bContent').value,
    metaTitle:       document.getElementById('bMetaTitle').value,
    metaDescription: document.getElementById('bMetaDesc').value,
    isPublished:     document.getElementById('bPublished').checked,
    isFeatured:      document.getElementById('bFeatured').checked
  };
  const data = id ? await api('PUT', '/blogs/' + id, body) : await api('POST', '/blogs', body);
  btn.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Save Blog Post'; btn.disabled = false;
  if (data.success) {
    toast(id ? 'Blog updated!' : 'Blog created!');
    closeModal('blogModal');
    loadBlogs();
    loadStats();
  } else {
    toast(data.message || 'Error', 'error');
  }
});

async function deleteBlog(id) {
  if (!confirm('Delete this blog?')) return;
  const data = await api('DELETE', '/blogs/' + id);
  if (data.success) { toast('Blog deleted.'); loadBlogs(); loadStats(); }
  else toast(data.message || 'Error', 'error');
}

// ===== BLOG RICH TEXT EDITOR =====
function bFmt(cmd) {
  document.getElementById('bContentEditor').focus();
  document.execCommand(cmd, false, null);
  updateBlogSeoScore();
}
function bFmtBlock(tag) {
  document.getElementById('bContentEditor').focus();
  document.execCommand('formatBlock', false, tag);
  updateBlogSeoScore();
}
function bInsertLink() {
  const url = prompt('Enter URL:');
  if (url) { document.getElementById('bContentEditor').focus(); document.execCommand('createLink', false, url); }
}

// Auto slug from title
document.getElementById('bTitle').addEventListener('input', function() {
  const slug = this.value.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');
  if (!document.getElementById('bSlug').dataset.manual) document.getElementById('bSlug').value = slug;
  document.getElementById('bPreviewTitle').textContent = this.value || 'Blog Post Title';
  updateBlogSeoScore();
});
document.getElementById('bSlug').addEventListener('input', function() {
  this.dataset.manual = '1';
  document.getElementById('bPreviewSlug').textContent = this.value || 'post-slug';
  updateBlogSeoScore();
});
document.getElementById('bExcerpt').addEventListener('input', updateBlogSeoScore);
document.getElementById('bContentEditor').addEventListener('input', updateBlogSeoScore);
document.getElementById('bImage').addEventListener('input', function() {
  const url = this.value.trim();
  if (url) {
    document.getElementById('bImgPreview').src = url;
    document.getElementById('bImgPreview').style.display = 'block';
    document.getElementById('bImgIcon').style.display = 'none';
  } else {
    document.getElementById('bImgPreview').style.display = 'none';
    document.getElementById('bImgIcon').style.display = 'block';
  }
  updateBlogSeoScore();
});
document.getElementById('bMetaTitle').addEventListener('input', function() {
  document.getElementById('bMetaTitleCount').textContent = this.value.length;
  updateBlogSeoScore();
});
document.getElementById('bMetaDesc').addEventListener('input', function() {
  document.getElementById('bMetaDescCount').textContent = this.value.length;
  document.getElementById('bPreviewDesc').textContent = this.value || 'Meta description will appear here...';
  updateBlogSeoScore();
});

// Preview toggle
document.getElementById('blogPreviewToggle').addEventListener('click', function() {
  const editor = document.getElementById('blogEditorCol');
  const score  = document.getElementById('blogScoreCol');
  const previewPane = document.getElementById('blogPreviewPane');
  const isPreview = this.dataset.mode === 'preview';
  if (isPreview) {
    editor.style.display = '';
    score.style.display = '';
    previewPane.style.display = 'none';
    this.innerHTML = '<i class="fa-solid fa-eye"></i> Preview';
    this.dataset.mode = '';
  } else {
    // Build preview content
    const img   = document.getElementById('bImage').value;
    const cat   = document.getElementById('bCategory').value;
    const title = document.getElementById('bTitle').value || 'Blog Title';
    const auth  = document.getElementById('bAuthor').value;
    const body  = document.getElementById('bContentEditor').innerHTML || '<p style="color:#aaa">No content yet...</p>';
    const date  = new Date().toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'});
    previewPane.innerHTML = `
      <div style="padding:20px;max-width:680px;margin:0 auto;">
        ${img ? '<img src="'+img+'" style="width:100%;height:280px;object-fit:cover;border-radius:12px;margin-bottom:20px;"/>' : ''}
        <span style="background:#E53935;color:#fff;font-size:0.72rem;font-weight:700;padding:4px 10px;border-radius:50px;">${cat}</span>
        <h1 style="font-size:1.6rem;font-weight:800;color:#0D1B2A;margin:12px 0 8px;line-height:1.3;">${title}</h1>
        <p style="color:#888;font-size:0.82rem;margin-bottom:20px;">By ${auth} &nbsp;|&nbsp; ${date}</p>
        <div style="font-size:0.92rem;color:#444;line-height:1.9;">${body}</div>
      </div>`;
    previewPane.style.display = 'block';
    editor.style.display = 'none';
    score.style.display = 'none';
    this.innerHTML = '<i class="fa-solid fa-pen"></i> Edit';
    this.dataset.mode = 'preview';
  }
});

// SEO Score
function updateBlogSeoScore() {
  const title   = document.getElementById('bTitle').value.trim();
  const excerpt = document.getElementById('bExcerpt').value.trim();
  const content = document.getElementById('bContentEditor').innerText || '';
  const image   = document.getElementById('bImage').value.trim();
  const meta    = document.getElementById('bMetaDesc').value.trim();
  const slug    = document.getElementById('bSlug').value.trim();
  const words   = content.split(/\s+/).filter(Boolean).length;

  const checks = [
    { id:'bsc-title',   pts:20, ok: title.length >= 5 },
    { id:'bsc-excerpt', pts:15, ok: excerpt.length >= 20 },
    { id:'bsc-content', pts:25, ok: words >= 300 },
    { id:'bsc-image',   pts:15, ok: !!image },
    { id:'bsc-meta',    pts:15, ok: meta.length >= 20 },
    { id:'bsc-slug',    pts:10, ok: !!slug },
  ];

  let score = 0;
  checks.forEach(c => {
    const li = document.getElementById(c.id);
    if (!li) return;
    const icon = li.querySelector('span');
    if (c.ok) {
      score += c.pts;
      li.style.color = 'rgba(255,255,255,0.85)';
      if (icon) { icon.style.background = 'rgba(52,211,153,0.22)'; icon.style.color = '#34d399'; icon.style.boxShadow = '0 0 8px rgba(52,211,153,0.35)'; }
      li.querySelector('span:last-child').style.opacity = '1';
    } else {
      li.style.color = 'rgba(255,255,255,0.3)';
      if (icon) { icon.style.background = 'rgba(255,255,255,0.05)'; icon.style.color = 'rgba(255,255,255,0.15)'; icon.style.boxShadow = 'none'; }
      li.querySelector('span:last-child').style.opacity = '0.5';
    }
  });

  // Ring
  const circ = 314.16;
  document.getElementById('bSeoNum').textContent = score;
  document.getElementById('bSeoCircle').style.strokeDashoffset = circ - (circ * score / 100);

  // Gradient
  const ga = document.getElementById('bSeoGradA'), gb = document.getElementById('bSeoGradB');
  if (score >= 75) { ga.setAttribute('stop-color','#34d399'); gb.setAttribute('stop-color','#059669'); }
  else if (score >= 50) { ga.setAttribute('stop-color','#60a5fa'); gb.setAttribute('stop-color','#2563eb'); }
  else if (score >= 25) { ga.setAttribute('stop-color','#fbbf24'); gb.setAttribute('stop-color','#d97706'); }
  else { ga.setAttribute('stop-color','#f87171'); gb.setAttribute('stop-color','#dc2626'); }

  // Status
  const st = document.getElementById('bSeoStatus');
  if (score >= 80) { st.style.cssText = 'font-size:0.68rem;font-weight:800;letter-spacing:0.6px;text-transform:uppercase;padding:4px 12px;border-radius:20px;display:inline-flex;align-items:center;gap:5px;margin-bottom:12px;background:rgba(52,211,153,0.18);color:#6ee7b7;border:1px solid rgba(52,211,153,0.35);'; st.innerHTML = '<i class="fa-solid fa-fire"></i> SEO Ready!'; }
  else if (score >= 50) { st.style.cssText = 'font-size:0.68rem;font-weight:800;letter-spacing:0.6px;text-transform:uppercase;padding:4px 12px;border-radius:20px;display:inline-flex;align-items:center;gap:5px;margin-bottom:12px;background:rgba(251,191,36,0.15);color:#fde68a;border:1px solid rgba(251,191,36,0.3);'; st.innerHTML = '<i class="fa-solid fa-equals"></i> Getting Better'; }
  else { st.style.cssText = 'font-size:0.68rem;font-weight:800;letter-spacing:0.6px;text-transform:uppercase;padding:4px 12px;border-radius:20px;display:inline-flex;align-items:center;gap:5px;margin-bottom:12px;background:rgba(239,68,68,0.18);color:#fca5a5;border:1px solid rgba(239,68,68,0.35);'; st.innerHTML = '<i class="fa-solid fa-arrow-down"></i> Needs Work'; }

  // Publish button
  const pb = document.getElementById('bSeoPublishBtn');
  if (score >= 75) {
    pb.style.cssText = 'width:100%;padding:10px;border-radius:10px;border:none;font-size:0.75rem;font-weight:700;font-family:Poppins,sans-serif;cursor:pointer;background:linear-gradient(135deg,#10b981,#059669);color:#fff;display:flex;align-items:center;justify-content:center;gap:7px;transition:all 0.3s;box-shadow:0 4px 18px rgba(16,185,129,0.4);';
    pb.innerHTML = '<i class="fa-solid fa-fire"></i> SEO Ready — Publish!';
  } else if (score >= 50) {
    pb.style.cssText = 'width:100%;padding:10px;border-radius:10px;border:none;font-size:0.75rem;font-weight:700;font-family:Poppins,sans-serif;cursor:pointer;background:linear-gradient(135deg,#3b82f6,#1d4ed8);color:#fff;display:flex;align-items:center;justify-content:center;gap:7px;transition:all 0.3s;';
    pb.innerHTML = '<i class="fa-solid fa-rocket"></i> Ready to Publish';
  } else {
    pb.style.cssText = 'width:100%;padding:10px;border-radius:10px;border:none;font-size:0.75rem;font-weight:700;font-family:Poppins,sans-serif;cursor:not-allowed;background:rgba(255,255,255,0.05);color:rgba(255,255,255,0.25);border:1px solid rgba(255,255,255,0.08);display:flex;align-items:center;justify-content:center;gap:7px;';
    pb.innerHTML = '<i class="fa-solid fa-lock"></i> Fill required fields';
  }
}

// ===== INQUIRIES =====
let allInquiries = [];

async function loadInquiries(filter) {
  if (!filter) filter = 'all';
  document.querySelectorAll('[data-inqfilter]').forEach(b => b.classList.toggle('active', b.dataset.inqfilter === filter));
  const data = await api('GET', '/inquiries');
  if (!data.success) return;
  allInquiries = data.inquiries;
  const list = filter === 'all' ? allInquiries : allInquiries.filter(i => (i.lookingFor || '').trim() === filter);
  const tbody = document.getElementById('inqTbody');

  if (!list.length) {
    tbody.innerHTML = '<tr><td colspan="10"><div class="empty-state"><i class="fa-solid fa-message"></i><p>No inquiries found.</p></div></td></tr>';
    return;
  }

  tbody.innerHTML = list.map(function(i) {
    const isOffer = i.lookingFor === 'Get Offer';
    const propName = i.propertyName || i.propertyTitle || i.propertyType || '';
    return '<tr>' +
      '<td><strong style="color:#E53935">' + (i.refId || '—') + '</strong></td>' +
      '<td><strong>' + i.name + '</strong><br><small style="color:#aaa">' + (i.email || '') + '</small></td>' +
      '<td><a href="tel:+91' + i.phone + '" style="color:#1565c0;font-weight:600;display:flex;align-items:center;gap:5px"><i class="fa-solid fa-phone" style="font-size:0.7rem"></i>+91 ' + i.phone + '</a></td>' +
      '<td><span class="badge ' + (isOffer ? 'badge-orange' : 'badge-blue') + '">' + (i.lookingFor || '—') + '</span></td>' +
      '<td>' + (propName
        ? '<div style="background:#fff8e1;border:1.5px solid #ffe082;border-radius:8px;padding:6px 10px;max-width:180px">' +
          '<div style="font-size:0.7rem;color:#f57f17;font-weight:700;margin-bottom:2px"><i class="fa-solid fa-building" style="margin-right:4px"></i>PROPERTY</div>' +
          '<div style="font-size:0.82rem;color:#333;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis" title="' + propName + '">' + propName + '</div>' +
          (i.city ? '<div style="font-size:0.72rem;color:#888;margin-top:2px"><i class="fa-solid fa-location-dot" style="color:#E53935;margin-right:3px"></i>' + i.city + '</div>' : '') +
          '</div>'
        : '<span style="color:#aaa">—</span>') + '</td>' +
      '<td>' + (i.city || '—') + '</td>' +
      '<td>' + (i.budget || '—') + '</td>' +
      '<td><select onchange="updateInqStatus(\'' + i._id + '\', this.value)" style="border:1.5px solid #e8e8e8;border-radius:7px;padding:4px 8px;font-size:0.78rem;font-family:Poppins,sans-serif;outline:none;cursor:pointer;">' +
      '<option value="new"' + (i.status==='new'?' selected':'') + '>🔴 New</option>' +
      '<option value="contacted"' + (i.status==='contacted'?' selected':'') + '>🟡 Contacted</option>' +
      '<option value="closed"' + (i.status==='closed'?' selected':'') + '>🟢 Closed</option>' +
      '</select></td>' +
      '<td>' + (i.createdAt ? fmtDate(i.createdAt) : '—') + '</td>' +
      '<td><div class="act-btns">' +
      '<a href="https://wa.me/91' + i.phone + '?text=' + encodeURIComponent('Hi ' + i.name + ', regarding your inquiry' + (propName ? ' for "' + propName + '"' : '') + ' — City Real Space team is here to help!') + '" target="_blank" class="act-btn approve" title="WhatsApp"><i class="fa-brands fa-whatsapp"></i></a>' +
      '<button class="act-btn del" onclick="deleteInquiry(\'' + i._id + '\')"><i class="fa-solid fa-trash"></i></button>' +
      '</div></td>' +
      '</tr>';
  }).join('');
}

// Filter buttons
document.querySelectorAll('[data-inqfilter]').forEach(b => {
  b.addEventListener('click', function() { allInquiries = []; loadInquiries(this.dataset.inqfilter); });
});

async function updateInqStatus(id, status) {
  const data = await api('PUT', '/inquiries/' + id + '/status', { status: status });
  if (data.success) toast('Status updated!');
  else toast('Error', 'error');
}

async function deleteInquiry(id) {
  if (!confirm('Delete this inquiry?')) return;
  const data = await api('DELETE', '/inquiries/' + id);
  if (data.success) { toast('Deleted.'); loadInquiries(); loadStats(); }
  else toast(data.message || 'Error', 'error');
}

// ===== REQUIREMENTS =====
async function loadRequirements() {
  const tbody = document.getElementById('reqTbody');
  tbody.innerHTML = '<tr><td colspan="9" style="text-align:center;padding:40px;color:#aaa"><i class="fa-solid fa-spinner fa-spin" style="font-size:1.5rem"></i></td></tr>';
  try {
    const res = await fetch(API + '/admin/requirements', {
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + adminToken }
    });
    const data = await res.json();
    if (!data.success || !data.inquiries) {
      tbody.innerHTML = '<tr><td colspan="9"><div class="empty-state"><i class="fa-solid fa-bell"></i><p>Could not load. Check backend.</p></div></td></tr>';
      return;
    }
    const reqs = data.inquiries;
    document.getElementById('reqBadge').textContent = reqs.filter(function(r) { return r.status === 'new'; }).length;
    if (!reqs.length) {
      tbody.innerHTML = '<tr><td colspan="9"><div class="empty-state"><i class="fa-solid fa-bell"></i><p>No requirements posted yet.</p></div></td></tr>';
      return;
    }
    tbody.innerHTML = reqs.map(function(r) {
      return '<tr>' +
        '<td><strong>' + r.name + '</strong></td>' +
        '<td><a href="tel:+91' + r.phone + '" style="color:#1565c0;font-weight:600;display:flex;align-items:center;gap:5px"><i class="fa-solid fa-phone" style="font-size:0.7rem"></i> +91 ' + r.phone + '</a></td>' +
        '<td>' + (r.propertyType || '—') + '</td>' +
        '<td>' + (r.budget || '—') + '</td>' +
        '<td>' + (r.city || '—') + '</td>' +
        '<td style="max-width:180px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' + (r.message || '—') + '</td>' +
        '<td><select onchange="updateInqStatus(\'' + r._id + '\',this.value)" style="border:1.5px solid #e8e8e8;border-radius:7px;padding:4px 8px;font-size:0.78rem;font-family:Poppins,sans-serif;outline:none;cursor:pointer">' +
        '<option value="new"' + (r.status === 'new' ? ' selected' : '') + '>🔴 New</option>' +
        '<option value="contacted"' + (r.status === 'contacted' ? ' selected' : '') + '>🟡 Contacted</option>' +
        '<option value="closed"' + (r.status === 'closed' ? ' selected' : '') + '>🟢 Closed</option>' +
        '</select></td>' +
        '<td>' + fmtDate(r.createdAt) + '</td>' +
        '<td><div class="act-btns">' +
        '<a href="https://wa.me/91' + r.phone + '?text=' + encodeURIComponent('Hi ' + r.name + ', we received your property requirement. Our team will help you find the best match!') + '" target="_blank" class="act-btn approve" title="WhatsApp"><i class="fa-brands fa-whatsapp"></i></a>' +
        '<button class="act-btn del" onclick="deleteReq(\'' + r._id + '\')"><i class="fa-solid fa-trash"></i></button>' +
        '</div></td></tr>';
    }).join('');
  } catch(e) {
    tbody.innerHTML = '<tr><td colspan="9"><div class="empty-state"><i class="fa-solid fa-bell"></i><p>Error: ' + e.message + '</p></div></td></tr>';
  }
}

async function deleteReq(id) {
  if (!confirm('Delete this requirement?')) return;
  const data = await api('DELETE', '/inquiries/' + id);
  if (data.success) { toast('Deleted.'); loadRequirements(); }
  else toast(data.message || 'Error', 'error');
}

// ===== USERS =====
async function loadUsers() {
  const data = await api('GET', '/users');
  const tbody = document.getElementById('userTbody');
  if (!data.success || !data.users.length) {
    tbody.innerHTML = '<tr><td colspan="7"><div class="empty-state"><i class="fa-solid fa-users"></i><p>No users yet.</p></div></td></tr>';
    return;
  }
  tbody.innerHTML = data.users.map(function(u) {
    return '<tr>' +
      '<td><strong>' + u.firstName + ' ' + u.lastName + '</strong></td>' +
      '<td>' + u.email + '</td>' +
      '<td>' + u.phone + '</td>' +
      '<td><span class="badge badge-blue">' + u.role + '</span></td>' +
      '<td>' + (u.city || '—') + '</td>' +
      '<td>' + fmtDate(u.createdAt) + '</td>' +
      '<td><div class="act-btns"><button class="act-btn del" onclick="deleteUser(\'' + u._id + '\')"><i class="fa-solid fa-trash"></i></button></div></td>' +
      '</tr>';
  }).join('');
}

async function deleteUser(id) {
  if (!confirm('Delete this user?')) return;
  const data = await api('DELETE', '/users/' + id);
  if (data.success) { toast('User deleted.'); loadUsers(); loadStats(); }
  else toast(data.message || 'Error', 'error');
}

// ===== ADMIN TYPE → DYNAMIC FIELDS =====
const ADMIN_TYPE_CONFIG = {
  apartment: { residential: true,  plot: false, commercial: false, floor: true,  carpet: true,  build: true  },
  villa:     { residential: true,  plot: false, commercial: false, floor: false, carpet: true,  build: true  },
  bungalow:  { residential: true,  plot: false, commercial: false, floor: false, carpet: true,  build: true  },
  rowhouse:  { residential: true,  plot: false, commercial: false, floor: false, carpet: true,  build: true  },
  plot:      { residential: false, plot: true,  commercial: false, floor: false, carpet: false, build: false },
  office:    { residential: false, plot: false, commercial: true,  floor: true,  carpet: true,  build: false },
  shop:      { residential: false, plot: false, commercial: true,  floor: true,  carpet: false, build: false },
  warehouse: { residential: false, plot: false, commercial: true,  floor: false, carpet: false, build: true  },
};

function updateAdminTypeFields() {
  const type = document.getElementById('pType').value;
  const cfg  = ADMIN_TYPE_CONFIG[type] || { residential: false, plot: false, commercial: false, floor: false, carpet: false, build: false };
  document.getElementById('adminBedsRow').style.display       = cfg.residential ? '' : 'none';
  document.getElementById('adminPlotRow').style.display       = cfg.plot        ? '' : 'none';
  document.getElementById('adminCommercialRow').style.display = cfg.commercial  ? '' : 'none';
  document.getElementById('adminFloorRow').style.display      = cfg.floor       ? '' : 'none';
  document.getElementById('adminFurnishedRow').style.display  = (cfg.residential || cfg.commercial) ? '' : 'none';
  document.getElementById('pCarpetGrp').style.display         = cfg.carpet      ? '' : 'none';
  document.getElementById('pBuiltGrp').style.display          = cfg.build       ? '' : 'none';
  // Area label
  document.getElementById('pSuperAreaLabel').textContent = cfg.plot ? 'Plot Area (sq.ft)' : cfg.commercial ? 'Carpet / Built-up Area (sq.ft)' : 'Super Built-up Area (sq.ft)';
  updateAdminScore();
}

document.getElementById('pType').addEventListener('change', updateAdminTypeFields);

// ===== ADMIN LISTING SCORE =====
// Total = 100 pts. High Listing needs ALL 7 fields filled properly.
const ASC_CHECKS = [
  { id:'asc-title',  pts:15, done:()=> document.getElementById('pTitle').value.trim().length >= 5 },
  { id:'asc-type',   pts:10, done:()=> !!document.getElementById('pType').value },
  { id:'asc-city',   pts:15, done:()=> !!document.getElementById('pCitySelect').value && !!document.getElementById('pAreaSelect').value },
  { id:'asc-price',  pts:15, done:()=> Number(document.getElementById('pPrice').value) > 0 },
  { id:'asc-area',   pts:10, done:()=> Number(document.getElementById('pSqft').value) > 0 },
  { id:'asc-desc',   pts:20, done:()=> document.getElementById('pDesc').value.trim().length >= 30 },
  { id:'asc-images', pts:15, done:()=> document.querySelectorAll('#pImagePreview div').length > 0 },
];
// circumference = 2*PI*56 = 351.86
const ASC_CIRC = 351.86;
let _ascPrev = -1;

function updateAdminScore() {
  let score = 0;
  ASC_CHECKS.forEach(c => {
    const li = document.getElementById(c.id);
    if (!li) return;
    const ok = !!c.done();
    li.className = ok ? 'done' : '';
    if (ok) score += c.pts;
  });

  // Ring
  document.getElementById('ascNum').textContent = score;
  const offset = ASC_CIRC - (ASC_CIRC * score / 100);
  document.getElementById('ascCircle').style.strokeDashoffset = offset;
  document.getElementById('ascGlow').style.strokeDashoffset   = offset;

  // Gradient + number color
  const ga = document.getElementById('ascGradA'), gb = document.getElementById('ascGradB');
  const numEl = document.querySelector('#ascRing .asc-num span');
  if (score >= 75) {
    ga.setAttribute('stop-color','#34d399'); gb.setAttribute('stop-color','#059669');
    if (numEl) numEl.style.color = '#6ee7b7';
  } else if (score >= 50) {
    ga.setAttribute('stop-color','#60a5fa'); gb.setAttribute('stop-color','#2563eb');
    if (numEl) numEl.style.color = '#93c5fd';
  } else if (score >= 25) {
    ga.setAttribute('stop-color','#fbbf24'); gb.setAttribute('stop-color','#d97706');
    if (numEl) numEl.style.color = '#fde68a';
  } else {
    ga.setAttribute('stop-color','#f87171'); gb.setAttribute('stop-color','#dc2626');
    if (numEl) numEl.style.color = '#fff';
  }

  // Pulse on milestone
  if ([25,50,75,100].includes(score) && score !== _ascPrev) {
    const ring = document.getElementById('ascRing');
    ring.style.color = score >= 75 ? '#34d399' : score >= 50 ? '#60a5fa' : '#fbbf24';
    ring.classList.remove('pulse'); void ring.offsetWidth; ring.classList.add('pulse');
    setTimeout(()=> ring.classList.remove('pulse'), 900);
  }
  _ascPrev = score;

  // High-score confetti burst at 85+
  const panel = document.querySelector('.admin-score-panel');
  if (score >= 85 && _ascPrev < 85) {
    panel.classList.add('high-glow');
    ascBurstConfetti(panel);
  } else if (score < 85) {
    panel.classList.remove('high-glow');
  }

  // Status badge — Low / Medium / High Listing
  const badge = document.getElementById('ascStatusBadge');
  if (score >= 75) {
    badge.className = 'asc-status-badge high';
    badge.innerHTML = '<i class="fas fa-fire"></i> High Listing';
  } else if (score >= 50) {
    badge.className = 'asc-status-badge mid';
    badge.innerHTML = '<i class="fas fa-equals"></i> Medium Listing';
  } else {
    badge.className = 'asc-status-badge low';
    badge.innerHTML = '<i class="fas fa-arrow-down"></i> Low Listing';
  }

  // Publish button
  const btn = document.getElementById('ascPublishBtn');
  if (score >= 75) {
    btn.className = 'asc-publish-btn high-listing';
    btn.innerHTML = '<i class="fas fa-fire"></i> High Listing — Publish!';
  } else if (score >= 50) {
    btn.className = 'asc-publish-btn ready';
    btn.innerHTML = '<i class="fas fa-rocket"></i> Ready to Publish';
  } else {
    const need = 50 - score;
    btn.className = 'asc-publish-btn locked';
    btn.innerHTML = '<i class="fas fa-lock"></i> Need ' + need + ' more pts';
  }
}

function ascPublishClick() {
  const score = parseInt(document.getElementById('ascNum').textContent);
  if (score < 50) { toast('Fill required fields to reach 50+ score.', 'error'); return; }
  document.getElementById('pApproved').checked = true;
  document.getElementById('propSaveBtn').click();
}

function ascBurstConfetti(panel) {
  const colors = ['#34d399','#6ee7b7','#fbbf24','#60a5fa','#f472b6','#a78bfa','#fff'];
  const ring   = document.getElementById('ascRing');
  const rx = ring.offsetLeft + ring.offsetWidth  / 2;
  const ry = ring.offsetTop  + ring.offsetHeight / 2;
  // remove old particles
  panel.querySelectorAll('.asc-particle').forEach(p => p.remove());
  for (let i = 0; i < 28; i++) {
    const p   = document.createElement('div');
    p.className = 'asc-particle';
    const angle = (i / 28) * 360;
    const dist  = 55 + Math.random() * 55;
    const tx    = Math.cos(angle * Math.PI / 180) * dist;
    const ty    = Math.sin(angle * Math.PI / 180) * dist;
    const dur   = 0.7 + Math.random() * 0.6;
    p.style.cssText = [
      'left:'  + rx + 'px',
      'top:'   + ry + 'px',
      'background:' + colors[i % colors.length],
      '--tx:' + tx.toFixed(1) + 'px',
      '--ty:' + ty.toFixed(1) + 'px',
      '--rot:' + (Math.random() * 720 - 360).toFixed(0) + 'deg',
      '--dur:' + dur.toFixed(2) + 's',
      'width:'  + (5 + Math.random() * 5).toFixed(0) + 'px',
      'height:' + (5 + Math.random() * 5).toFixed(0) + 'px',
      'border-radius:' + (Math.random() > 0.5 ? '50%' : '2px'),
    ].join(';');
    panel.appendChild(p);
    setTimeout(() => p.remove(), (dur + 0.1) * 1000);
  }
}

// Attach score listeners to admin form fields
['pTitle','pType','pCitySelect','pAreaSelect','pPrice','pSqft','pDesc'].forEach(id => {
  const el = document.getElementById(id);
  if (el) { el.addEventListener('input', updateAdminScore); el.addEventListener('change', updateAdminScore); }
});

// Watch image preview changes via MutationObserver
const pImgObserver = new MutationObserver(updateAdminScore);
pImgObserver.observe(document.getElementById('pImagePreview'), { childList: true });

// ===== CONTACTS =====
async function loadContacts() {
  try {
    const res = await fetch('https://city-real-space.onrender.com/api/contact', {
      headers: { 'Authorization': 'Bearer ' + adminToken }
    });
    const data = await res.json();
    const tbody = document.getElementById('contactTbody');
    if (!data.success || !data.contacts || !data.contacts.length) {
      tbody.innerHTML = '<tr><td colspan="8"><div class="empty-state"><i class="fa-solid fa-envelope"></i><p>No contact messages yet.</p></div></td></tr>';
      document.getElementById('contactBadge').textContent = '';
      return;
    }
    const newCount = data.contacts.filter(function(c) { return c.status === 'new'; }).length;
    document.getElementById('contactBadge').textContent = newCount || '';
    tbody.innerHTML = data.contacts.map(function(c) {
      return '<tr>' +
        '<td><strong>' + c.name + '</strong></td>' +
        '<td>' + c.phone + '</td>' +
        '<td>' + (c.email || '—') + '</td>' +
        '<td>' + (c.subject || '—') + '</td>' +
        '<td style="max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + c.message + '</td>' +
        '<td><select onchange="updateContactStatus(\'' + c._id + '\',this.value)" style="border:1.5px solid #e0e0e0;border-radius:7px;padding:4px 8px;font-size:0.78rem;font-family:Poppins,sans-serif;outline:none;cursor:pointer;">' +
        '<option value="new"'     + (c.status==='new'     ? ' selected':'') + '>🔴 New</option>' +
        '<option value="read"'    + (c.status==='read'    ? ' selected':'') + '>🟡 Read</option>' +
        '<option value="replied"' + (c.status==='replied' ? ' selected':'') + '>🟢 Replied</option>' +
        '</select></td>' +
        '<td>' + fmtDate(c.createdAt) + '</td>' +
        '<td><div class="act-btns">' +
        '<a href="https://wa.me/91' + c.phone + '?text=' + encodeURIComponent('Hi ' + c.name + ', thank you for contacting City Real Space!') + '" target="_blank" class="act-btn approve" title="WhatsApp"><i class="fa-brands fa-whatsapp"></i></a>' +
        '<button class="act-btn del" onclick="deleteContact(\'' + c._id + '\')"><i class="fa-solid fa-trash"></i></button>' +
        '</div></td></tr>';
    }).join('');
  } catch(e) { console.error('loadContacts:', e); }
}

async function updateContactStatus(id, status) {
  const res = await fetch('https://city-real-space.onrender.com/api/contact/' + id + '/status', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + adminToken },
    body: JSON.stringify({ status })
  });
  const data = await res.json();
  if (data.success) toast('Status updated!');
  else toast('Error', 'error');
}

async function deleteContact(id) {
  const res = await fetch('https://city-real-space.onrender.com/api/contact/' + id, {
    method: 'DELETE',
    headers: { 'Authorization': 'Bearer ' + adminToken }
  });
  const data = await res.json();
  if (data.success) { toast('Deleted! ✅'); loadContacts(); }
  else toast('Error: ' + (data.message || 'Delete failed'), 'error');
}

// ===== INIT =====
document.body.style.visibility = 'visible';
loadStats();

// ===== CONTACTS =====
async function loadContacts() {
  try {
    const res  = await fetch('https://city-real-space.onrender.com/api/contact', {
      headers: { 'Authorization': 'Bearer ' + adminToken }
    });
    const data = await res.json();
    const tbody = document.getElementById('contactTbody');
    if (!data.success || !data.contacts || !data.contacts.length) {
      tbody.innerHTML = '<tr><td colspan="8"><div class="empty-state"><i class="fa-solid fa-envelope"></i><p>No contact messages yet.</p></div></td></tr>';
      document.getElementById('contactBadge').textContent = '';
      return;
    }
    const newCount = data.contacts.filter(function(c) { return c.status === 'new'; }).length;
    document.getElementById('contactBadge').textContent = newCount || '';
    tbody.innerHTML = data.contacts.map(function(c) {
      return '<tr>' +
        '<td><strong style="color:var(--text)">' + c.name + '</strong></td>' +
        '<td>' + c.phone + '</td>' +
        '<td>' + (c.email || '—') + '</td>' +
        '<td>' + (c.subject || '—') + '</td>' +
        '<td style="max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + c.message + '</td>' +
        '<td><select onchange="updateContactStatus(\'' + c._id + '\', this.value)" style="border:1.5px solid #e8e8e8;border-radius:7px;padding:4px 8px;font-size:0.78rem;font-family:Poppins,sans-serif;outline:none;cursor:pointer;">' +
        '<option value="new"'     + (c.status==='new'     ? ' selected' : '') + '>🔴 New</option>' +
        '<option value="read"'    + (c.status==='read'    ? ' selected' : '') + '>🟡 Read</option>' +
        '<option value="replied"' + (c.status==='replied' ? ' selected' : '') + '>🟢 Replied</option>' +
        '</select></td>' +
        '<td>' + fmtDate(c.createdAt) + '</td>' +
        '<td><div class="act-btns">' +
        '<a href="https://wa.me/91' + c.phone + '?text=' + encodeURIComponent('Hi ' + c.name + ', thank you for contacting City Real Space!') + '" target="_blank" class="act-btn approve" title="WhatsApp"><i class="fa-brands fa-whatsapp"></i></a>' +
        '<button class="act-btn del" onclick="deleteContact(\'' + c._id + '\')"><i class="fa-solid fa-trash"></i></button>' +
        '</div></td></tr>';
    }).join('');
  } catch(e) {
    console.error('loadContacts error:', e);
  }
}

async function updateContactStatus(id, status) {
  await fetch('https://city-real-space.onrender.com/api/contact/' + id + '/status', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + adminToken },
    body: JSON.stringify({ status })
  });
  toast('Status updated!');
  loadContacts();
}

async function deleteContact(id) {
  if (!confirm('Delete this message?')) return;
  await fetch('https://city-real-space.onrender.com/api/contact/' + id, {
    method: 'DELETE',
    headers: { 'Authorization': 'Bearer ' + adminToken }
  });
  toast('Deleted.'); loadContacts();
}
