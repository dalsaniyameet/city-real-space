const API = (function() {
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:5000/api';
  }
  return 'https://city-real-space.vercel.app/api';
})();

// ===== AUTH GUARD =====
const adminToken = localStorage.getItem('adminToken');
const adminUser  = JSON.parse(localStorage.getItem('adminUser') || 'null');
if (!adminToken || !adminUser || adminUser.role !== 'admin') {
  window.location.replace('login.html');
  throw new Error('Unauthorized');
}

// ===== SESSION TIMEOUT — 20 min inactivity =====
const SESSION_TIMEOUT = 20 * 60 * 1000;
let _sessionTimer;

// Check expiry on load BEFORE starting timer
const _lastActive = parseInt(localStorage.getItem('adminLastActive') || '0');
if (_lastActive && (Date.now() - _lastActive) > SESSION_TIMEOUT) {
  localStorage.removeItem('adminToken');
  localStorage.removeItem('adminUser');
  localStorage.removeItem('adminLastActive');
  window.location.replace('login.html');
  throw new Error('Session expired');
}

// Set lastActive on fresh login
if (!_lastActive) localStorage.setItem('adminLastActive', Date.now());

function resetSessionTimer() {
  clearTimeout(_sessionTimer);
  localStorage.setItem('adminLastActive', Date.now());
  _sessionTimer = setTimeout(function() {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    localStorage.removeItem('adminLastActive');
    alert('Session expired due to inactivity. Please login again.');
    window.location.replace('login.html');
  }, SESSION_TIMEOUT);
}

['mousemove', 'keydown', 'click', 'scroll', 'touchstart'].forEach(function(evt) {
  document.addEventListener(evt, resetSessionTimer, { passive: true });
});

// Start initial timer without updating lastActive
_sessionTimer = setTimeout(function() {
  localStorage.removeItem('adminToken');
  localStorage.removeItem('adminUser');
  localStorage.removeItem('adminLastActive');
  alert('Session expired due to inactivity. Please login again.');
  window.location.replace('login.html');
}, SESSION_TIMEOUT);

document.getElementById('adminName').textContent = adminUser ? (adminUser.firstName || 'Admin') : 'Admin';

document.getElementById('adminLogout').addEventListener('click', function(e) {
  e.preventDefault();
  clearTimeout(_sessionTimer);
  fetch('/api/auth/admin-logout', { method: 'POST' }).catch(() => {});
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
  var titles = { dashboard: 'Dashboard', properties: 'Properties', submissions: 'User Submissions', blogs: 'Blog Posts', inquiries: 'Inquiries', contacts: 'Contact Messages', users: 'Users', requirements: 'Requirements' };
  document.getElementById('topbarTitle').textContent = titles[name] || name;
  if (name === 'dashboard')    loadStats();
  if (name === 'properties')   loadProperties('all');
  if (name === 'submissions')  loadSubmissions();
  if (name === 'blogs')        loadBlogs();
  if (name === 'inquiries')    loadInquiries('all');
  if (name === 'contacts')     loadContacts();
  if (name === 'users')        loadUsers();
  if (name === 'requirements') loadRequirements();
}

document.querySelectorAll('.sb-link[data-page]').forEach(function(link) {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    goPage(link.dataset.page);
    if (window.innerWidth <= 900) document.getElementById('sidebar').classList.remove('open');
  });
});

document.getElementById('sidebarToggle').addEventListener('click', function() {
  document.getElementById('sidebar').classList.toggle('open');
  const overlay = document.getElementById('sidebarOverlay');
  overlay.style.display = document.getElementById('sidebar').classList.contains('open') ? 'block' : 'none';
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
    document.getElementById('inqBadge').textContent    = s.newInquiries || '';
    if (s.totalReqs !== undefined) {
      document.getElementById('st-reqs').textContent = s.totalReqs;
      document.getElementById('reqBadge').textContent = s.newReqs || '';
    }
    const sub = await api('GET', '/user-properties');
    if (sub.success) document.getElementById('subBadge').textContent = sub.properties.filter(function(p) { return !p.isApproved; }).length || '';
    // Trending / Residential / Commercial counts
    const allProps = await api('GET', '/properties');
    if (allProps.success && allProps.properties) {
      const props = allProps.properties;
      const tEl = document.getElementById('st-trending');
      const rEl = document.getElementById('st-residential');
      const cEl = document.getElementById('st-commercial');
      if (tEl) tEl.textContent = props.filter(function(p){ return p.isFeatured; }).length;
      if (rEl) rEl.textContent = props.filter(function(p){ return p.category === 'residential' || !['office','shop','warehouse'].includes(p.type); }).length;
      if (cEl) cEl.textContent = props.filter(function(p){ return p.category === 'commercial' || ['office','shop','warehouse'].includes(p.type); }).length;
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
      item.innerHTML = '<img src="' + e.target.result + '" style="width:100%;height:100%;object-fit:cover"/><button type="button" onclick="this.parentElement.remove()" style="position:absolute;top:3px;right:3px;background:rgba(0,0,0,0.6);border:none;color:#fff;border-radius:50%;width:20px;height:20px;cursor:pointer;font-size:0.65rem;display:flex;align-items:center;justify-content:center"><i class="fa-solid fa-xmark"></i></button>';
      document.getElementById('pImagePreview').appendChild(item);
    };
    reader.readAsDataURL(file);
  });
}

async function uploadToCloudinary(file) {
  const fd = new FormData();
  fd.append('file', file);
  const res = await fetch(API + '/upload', {
    method: 'POST',
    headers: { 'Authorization': 'Bearer ' + adminToken },
    body: fd
  });
  const data = await res.json();
  if (!data.url) throw new Error('Upload failed');
  return 'https://city-real-space.vercel.app' + data.url;
}

async function handleBlogImage(input) {
  const file = input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    document.getElementById('bImgPreview').src = e.target.result;
    document.getElementById('bImgPreview').style.display = 'block';
    document.getElementById('bImgIcon').style.display = 'none';
  };
  reader.readAsDataURL(file);
  try {
    toast('Uploading...');
    const url = await uploadToCloudinary(file);
    document.getElementById('bImage').value = url;
    toast('Image uploaded! ✅');
  } catch(e) {
    toast('Upload failed', 'error');
  }
}

function bImageUrlPreview(url) {
  const img = document.getElementById('bImgPreview');
  const icon = document.getElementById('bImgIcon');
  if (url.trim()) {
    img.src = url.trim();
    img.style.display = 'block';
    icon.style.display = 'none';
  } else {
    img.style.display = 'none';
    icon.style.display = 'flex';
  }
}

// ===== PROPERTIES =====
let currentPropFilter = 'all';
let propsCache = {};

function renderPropRow(p) {
  const isCommercial = p.category === 'commercial' || ['office','shop','warehouse'].includes(p.type);
  const typeLabel = { apartment:'Apartment', villa:'Villa', bungalow:'Bungalow', rowhouse:'Row House', plot:'Plot', office:'Office', shop:'Shop', warehouse:'Warehouse' };
  const catHtml = isCommercial
    ? '<span style="color:#60a5fa;font-weight:700;font-size:0.78rem;">Commercial</span><br><small style="color:var(--text3);font-size:0.68rem;">' + (typeLabel[p.type] || p.type) + '</small>'
    : '<span style="color:#34d399;font-weight:700;font-size:0.78rem;">Residential</span><br><small style="color:var(--text3);font-size:0.68rem;">' + (typeLabel[p.type] || p.type) + '</small>';
  const trendBtn = '<button class="act-btn trending' + (p.isFeatured ? ' active' : '') + '" title="' + (p.isFeatured ? 'Remove Trending' : 'Mark Trending') + '" onclick="toggleTrending(\'' + p._id + '\', ' + !!p.isFeatured + ')" style="' + (p.isFeatured ? 'background:rgba(245,158,11,0.25);color:#f59e0b;box-shadow:0 0 8px rgba(245,158,11,0.3);' : '') + '"><i class="fa-solid fa-fire"></i></button>';
  return '<tr>' +
    '<td><div style="display:flex;align-items:center;gap:10px">' +
    (p.images && p.images[0] ? '<img src="' + p.images[0] + '" class="prop-thumb" alt=""/>' : '<div style="width:48px;height:36px;background:rgba(255,255,255,0.05);border-radius:6px;display:flex;align-items:center;justify-content:center;color:#555"><i class="fa-solid fa-image"></i></div>') +
    '<div class="prop-info"><strong>' + p.title + '</strong><span>' + (p.isFeatured ? '🔥 ' : '') + (p.agent && p.agent.name ? p.agent.name : '') + '</span></div></div></td>' +
    '<td style="white-space:normal">' + catHtml + '</td>' +
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

function editPropertyById(id) {
  const p = propsCache[id];
  if (p) editProperty(p);
  else toast('Property not found', 'error');
}

async function loadProperties(filter) {
  currentPropFilter = filter;
  document.querySelectorAll('.fbtn[data-filter]').forEach(function(b) {
    b.classList.toggle('active', b.dataset.filter === filter);
  });
  document.querySelectorAll('#page-properties .fbtn:not([data-filter])').forEach(function(b) { b.classList.remove('active'); });
  let param = '';
  if (filter === 'pending')  param = '?status=pending';
  if (filter === 'approved') param = '?status=approved';
  const data = await api('GET', '/properties' + param);
  const tbody = document.getElementById('propTbody');
  if (!data.success || !data.properties || !data.properties.length) {
    tbody.innerHTML = '<tr><td colspan="7"><div class="empty-state"><i class="fa-solid fa-building"></i><p>No properties found.</p></div></td></tr>';
    return;
  }
  data.properties.forEach(function(p) { propsCache[p._id] = p; });
  tbody.innerHTML = data.properties.map(function(p) { return renderPropRow(p); }).join('');
}

async function toggleTrending(id, isFeatured) {
  const data = await api('PUT', '/properties/' + id, { isFeatured: !isFeatured });
  if (data.success) {
    toast(isFeatured ? 'Removed from Trending!' : '🔥 Added to Trending!');
    loadProperties(currentPropFilter);
    loadStats();
  } else toast(data.message || 'Error', 'error');
}

// Filter buttons
document.querySelectorAll('.fbtn[data-filter]').forEach(function(b) {
  b.addEventListener('click', function() { loadProperties(b.dataset.filter); });
});

// Residential / Commercial / Trending buttons
function setPropFilterActive(btn) {
  document.querySelectorAll('#page-properties .fbtn').forEach(function(b) { b.classList.remove('active'); });
  btn.classList.add('active');
}

function applyPropFilter(cat) {
  const tbody = document.getElementById('propTbody');
  tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:40px"><i class="fa-solid fa-spinner fa-spin" style="color:var(--accent);font-size:1.5rem"></i></td></tr>';
  const paramMap = { residential: '?category=residential', commercial: '?category=commercial', trending: '?featured=true' };
  api('GET', '/properties' + (paramMap[cat] || '')).then(function(data) {
    if (!data.success || !data.properties || !data.properties.length) {
      const msgs = { residential: 'No residential properties.', commercial: 'No commercial properties.', trending: 'No trending properties. Click 🔥 to mark any property as trending.' };
      tbody.innerHTML = '<tr><td colspan="7"><div class="empty-state"><i class="fa-solid fa-building"></i><p>' + (msgs[cat] || 'No properties found.') + '</p></div></td></tr>';
      return;
    }
    data.properties.forEach(function(p) { propsCache[p._id] = p; });
    tbody.innerHTML = data.properties.map(function(p) { return renderPropRow(p); }).join('');
  });
}

['btnResidential','btnCommercial','btnTrending'].forEach(function(id) {
  const btn = document.getElementById(id);
  if (!btn) return;
  const catMap = { btnResidential:'residential', btnCommercial:'commercial', btnTrending:'trending' };
  btn.addEventListener('click', function() {
    setPropFilterActive(this);
    applyPropFilter(catMap[id]);
  });
});

// Project/Society dynamic data by type
const projectsByType = {
  apartment: [
    'Shivalik Sharda','Adani Shantigram','Godrej Garden City','Nirma University Township',
    'Safal Parisar','Gala Aria','Rajpath Rangoli','Aryan Aura','Siddhi Vinayak Heights',
    'Shree Siddhivinayak Residency','Patel Arcade','Ganesh Meridian','Shyamal Row Houses',
    'Iscon Platinum','Binori Town Square','Shivalik Sharda','Sun South Park'
  ],
  villa: [
    'Adani Shantigram Villas','Godrej Villas','Nirma Villas','Shivalik Villas',
    'Safal Villas','Sun Villas','Rajpath Villas','Aryan Villas'
  ],
  bungalow: [
    'Shivalik Bungalows','Adani Bungalows','Godrej Bungalows','Nirma Bungalows',
    'Safal Bungalows','Sun Bungalows','Rajpath Bungalows'
  ],
  rowhouse: [
    'Shyamal Row Houses','Safal Row Houses','Sun Row Houses','Rajpath Row Houses',
    'Aryan Row Houses','Ganesh Row Houses'
  ],
  plot: [
    'Sardar Patel Ring Road Scheme','AUDA Scheme','GIDC Scheme','Naroda GIDC',
    'Sanand GIDC','Bavla GIDC','Changodar GIDC','Survey No. (Manual)'
  ],
  office: [
    'Prahlad Nagar Trade Centre','Shivalik Business Hub','Iscon Business Park',
    'GIFT City Tower','SG Business Hub','Safal Profitaire','Ganesh Meridian',
    'Binori Town Square','Sun Gravitas','Mondeal Heights','Mondeal Square'
  ],
  shop: [
    'Iscon Mega Mall','Alpha One Mall','Ahmedabad One Mall','Shivalik Plaza',
    'Safal Square','CG Square','Himalaya Mall','Acropolis Mall','Gulmohar Park Mall'
  ],
  warehouse: [
    'Naroda GIDC Warehouse','Sanand GIDC Warehouse','Changodar GIDC Warehouse',
    'Bavla GIDC Warehouse','Vatva GIDC Warehouse','Odhav GIDC Warehouse'
  ]
};

const projectLabelByType = {
  apartment: 'Project / Society Name',
  villa:     'Villa Project / Township Name',
  bungalow:  'Bungalow Society Name',
  rowhouse:  'Row House Society Name',
  plot:      'Scheme / Survey No.',
  office:    'Building / Complex Name',
  shop:      'Mall / Complex Name',
  warehouse: 'GIDC / Industrial Area Name'
};

function updateProjectDropdown(type) {
  const sel = document.getElementById('pProjectSelect');
  const label = document.getElementById('pProjectLabel');
  const projects = projectsByType[type] || [];
  label.textContent = projectLabelByType[type] || 'Project / Society Name';
  if (!type) {
    sel.innerHTML = '<option value="">-- Select Type First --</option>';
    document.getElementById('pProject').placeholder = 'Select property type first';
    return;
  }
  sel.innerHTML = '<option value="">-- Select or Type Below --</option>' +
    projects.map(p => '<option value="' + p + '">' + p + '</option>').join('') +
    '<option value="__other__">Other (Type Manually)</option>';
  document.getElementById('pProject').value = '';
  document.getElementById('pProject').placeholder = label.textContent + ' (manual)';
}

function handleProjectSelect() {
  const sel = document.getElementById('pProjectSelect');
  const inp = document.getElementById('pProject');
  if (sel.value && sel.value !== '__other__') inp.value = sel.value;
  else if (sel.value === '__other__') { inp.value = ''; inp.focus(); }
}

// Area / City dropdown + manual input sync
const adminSubLocalities = {
  'Prahlad Nagar':   ['Prahlad Nagar Cross Road','Commerce Six Roads','Anand Nagar Cross Road','Satellite Road','100 Feet Road Prahlad Nagar'],
  'Satellite':       ['Satellite Main Road','Jodhpur Cross Road','Ambawadi','Nehru Nagar','Judges Bungalow Road'],
  'Bopal':           ['Bopal Chokdi','South Bopal','Ambli Bopal Road','Shilaj','Ghuma'],
  'Thaltej':         ['Thaltej Cross Road','SG Highway Thaltej','Sola Road','Science City Road'],
  'Memnagar':        ['Memnagar Fire Station','Gurukul Road','Drive In Road'],
  'Vastrapur':       ['Vastrapur Lake','Vastrapur Cross Road','Judges Bungalow'],
  'Bodakdev':        ['Bodakdev Cross Road','100 Feet Road Bodakdev','Sindhu Bhavan Road'],
  'Navrangpura':     ['CG Road','Navrangpura Cross Road','Swastik Cross Road','Panchvati'],
  'Chandkheda':      ['Chandkheda Gam','Sola Bhagwat','Visat Cross Road','Tragad'],
  'Shela':           ['Shela Village','Shela Chokdi','Ambli Road Shela'],
  'SG Highway':      ['Sola','Gota','Motera','Ranip','Sabarmati'],
  'CG Road':         ['Ellisbridge','Paldi','Ambawadi','Swastik Cross Road'],
  'Iscon':           ['Iscon Cross Road','Iscon Ambli Road','Bopal Road'],
  'Giftcity':        ['GIFT City Block 1','GIFT City Block 2','GIFT City SEZ','Infocity Road'],
  'Sector 1':        ['Sector 1A','Sector 1B','Sector 1C'],
  'Sector 5':        ['Sector 5A','Sector 5B'],
  'Sector 11':       ['Sector 11A','Sector 11B'],
  'Sector 21':       ['Sector 21A','Sector 21B'],
  'Infocity':        ['Infocity Road','Infocity Phase 1','Infocity Phase 2'],
  'Adajan':          ['Adajan Patia','Adajan Gam','Pal Adajan Road','Rander Road'],
  'Vesu':            ['Vesu Main Road','Vesu Canal Road','Bhatar Road'],
  'Pal':             ['Pal Gam','Pal Bhatha','Pal Char Rasta'],
  'Katargam':        ['Katargam Darwaja','Ring Road Katargam'],
  'Udhna':           ['Udhna Darwaja','Udhna Magdalla Road'],
  'Althan':          ['Althan Gam','Althan Bhatha','Bhatar Althan Road'],
  'Alkapuri':        ['Alkapuri Society','RC Dutt Road','Productivity Road'],
  'Gotri':           ['Gotri Road','Gotri Vasna Road','Sama Savli Road'],
  'Waghodia Road':   ['Waghodia Chokdi','Waghodia GIDC'],
  'Manjalpur':       ['Manjalpur Gam','Manjalpur Char Rasta','Old Padra Road'],
  'Fatehgunj':       ['Fatehgunj Main Road','Old Padra Road'],
  'Kalawad Road':    ['Kalawad Road Chokdi','Nana Mava Road'],
  'Mavdi':           ['Mavdi Main Road','Mavdi Plot','Mavdi Chowk'],
  'Raiya Road':      ['Raiya Chokdi','Raiya Telephone Exchange'],
  'University Road': ['University Road Chokdi','Yagnik Road','Tagore Road'],
  '150 Feet Ring Road': ['150 Feet Ring Road Chokdi','Bhaktinagar','Aji GIDC']
};

function handleAreaSelect() {
  const sel = document.getElementById('pAreaSelect');
  const subSel = document.getElementById('pSubAreaSelect');
  const subInp = document.getElementById('pSubArea');
  if (sel.value && sel.value !== '__other__') {
    const subs = adminSubLocalities[sel.value] || [];
    subSel.innerHTML = '<option value="">-- Select Sub Area --</option>' +
      subs.map(s => '<option value="' + s + '">' + s + '</option>').join('') +
      '<option value="__other__">Other (Type Manually)</option>';
    subInp.value = '';
  } else if (sel.value === '__other__') {
    subSel.innerHTML = '<option value="">-- Select Sub Area --</option><option value="__other__">Other (Type Manually)</option>';
    subInp.value = '';
  }
}

function handleSubAreaSelect() {
  const sel = document.getElementById('pSubAreaSelect');
  const inp = document.getElementById('pSubArea');
  if (sel.value && sel.value !== '__other__') inp.value = sel.value;
  else if (sel.value === '__other__') { inp.value = ''; inp.focus(); }
}

function handleCitySelect() {
  // City is handled via pCitySelect dropdown directly
}

document.getElementById('addPropBtn').addEventListener('click', function() {
  document.getElementById('propModalTitle').textContent = 'Add Property';
  document.getElementById('propForm').reset();
  document.getElementById('propId').value = '';
  document.getElementById('pApproved').checked = true;
  document.getElementById('pImage').value = '';
  document.getElementById('pImagePreview').innerHTML = '';
  document.getElementById('pAreaSelect').value = '';
  document.getElementById('pSubAreaSelect').innerHTML = '<option value="">-- Select Sub Area --</option>';
  document.getElementById('pSubArea').value = '';
  document.getElementById('pCitySelect').value = '';
  document.getElementById('pProjectSelect').innerHTML = '<option value="">-- Select or Type Below --</option>';
  document.getElementById('pProject').value = '';
  document.getElementById('pProjectLabel').textContent = 'Project / Society Name';
  toggleAdminBeds();
  openModal('propModal');
});

// Auto-set category & toggle beds based on type
const commercialAdminTypes = ['office', 'shop', 'warehouse'];
function toggleAdminBeds() {
  const type = document.getElementById('pType').value;
  const isComm = commercialAdminTypes.includes(type);
  if (isComm) document.getElementById('pCategory').value = 'commercial';
  else if (type) document.getElementById('pCategory').value = 'residential';
  document.getElementById('adminBedsRow').style.display = isComm ? 'none' : '';
  updateProjectDropdown(type);
}
document.getElementById('pType').addEventListener('change', toggleAdminBeds);

function editProperty(p) {
  document.getElementById('propModalTitle').textContent = 'Edit Property';
  document.getElementById('propId').value = p._id;
  document.getElementById('pTitle').value = p.title || '';
  document.getElementById('pPriceLabel').value = p.priceLabel || '';
  document.getElementById('pPrice').value = p.price || '';
  document.getElementById('pType').value = p.type || '';
  document.getElementById('pCategory').value = p.category || 'residential';
  document.getElementById('pStatus').value = p.status || 'for-sale';
  // Sync dropdowns
  const cityOpts = Array.from(document.getElementById('pCitySelect').options).map(o => o.value);
  document.getElementById('pCitySelect').value = cityOpts.includes(p.location?.city) ? p.location.city : '';
  const areaOpts = Array.from(document.getElementById('pAreaSelect').options).map(o => o.value);
  document.getElementById('pAreaSelect').value = areaOpts.includes(p.location?.area) ? p.location.area : '';
  document.getElementById('pSubArea').value = p.location?.subArea || p.location?.area || '';
  document.getElementById('pBeds').value = p.specs ? p.specs.beds : 0;
  document.getElementById('pBaths').value = p.specs ? p.specs.baths : 0;
  document.getElementById('pSqft').value = p.specs ? p.specs.sqft : 0;
  document.getElementById('pCarpetArea').value = (p.specs && p.specs.carpetArea) || 0;
  document.getElementById('pBuiltArea').value = (p.specs && p.specs.builtArea) || 0;
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
  toggleAdminBeds();
  const preview = document.getElementById('pImagePreview');
  preview.innerHTML = '';
  if (p.images && p.images.length) {
    p.images.forEach(function(url) {
      const item = document.createElement('div');
      item.style.cssText = 'position:relative;width:90px;height:70px;border-radius:8px;overflow:hidden;border:1.5px solid #e8e8e8;flex-shrink:0';
      item._existingUrl = url;
      item.innerHTML = '<img src="' + url + '" style="width:100%;height:100%;object-fit:cover"/><button type="button" onclick="this.parentElement.remove()" style="position:absolute;top:3px;right:3px;background:rgba(0,0,0,0.6);border:none;color:#fff;border-radius:50%;width:20px;height:20px;cursor:pointer;font-size:0.65rem;display:flex;align-items:center;justify-content:center"><i class="fa-solid fa-xmark"></i></button>';
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
    } else if (item._existingUrl) {
      imageUrls.push(item._existingUrl);
    }
  }
  const body = {
    title: document.getElementById('pTitle').value,
    priceLabel: document.getElementById('pPriceLabel').value,
    price: Number(document.getElementById('pPrice').value),
    type: document.getElementById('pType').value,
    category: document.getElementById('pCategory').value,
    status: document.getElementById('pStatus').value,
    location: { area: document.getElementById('pSubArea').value || document.getElementById('pAreaSelect').value, city: document.getElementById('pCitySelect').value },
    specs: { beds: Number(document.getElementById('pBeds').value), baths: Number(document.getElementById('pBaths').value), sqft: Number(document.getElementById('pSqft').value), carpetArea: Number(document.getElementById('pCarpetArea').value) || 0, builtArea: Number(document.getElementById('pBuiltArea').value) || 0 },
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
      tokenAmount: document.getElementById('pToken').value
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
  if (!data.success || !data.properties || !data.properties.length) {
    tbody.innerHTML = '<tr><td colspan="8"><div class="empty-state"><i class="fa-solid fa-inbox"></i><p>No user submissions yet.</p></div></td></tr>';
    document.getElementById('subBadge').textContent = 0;
    return;
  }
  // Sirf woh properties jo actual registered users ne post ki hain
  const userProps = data.properties.filter(function(p) {
    return p.postedBy && p.postedBy.firstName;
  });
  if (!userProps.length) {
    tbody.innerHTML = '<tr><td colspan="8"><div class="empty-state"><i class="fa-solid fa-inbox"></i><p>No user submissions yet.<br><small style="color:var(--text3)">Jab koi registered user property post karega, yahan dikhega.</small></p></div></td></tr>';
    document.getElementById('subBadge').textContent = 0;
    return;
  }
  document.getElementById('subBadge').textContent = userProps.filter(function(p){return !p.isApproved;}).length || '';
  tbody.innerHTML = userProps.map(function(p) {
    const statusBadge = p.isRejected
      ? '<span class="badge badge-red">Rejected</span>'
      : p.isApproved
      ? '<span class="badge badge-green">Approved</span>'
      : '<span class="badge badge-orange">Pending</span>';
    return '<tr>' +
      '<td><div style="display:flex;align-items:center;gap:10px">' +
      (p.images && p.images[0] ? '<img src="' + p.images[0] + '" class="prop-thumb"/>' : '<div style="width:48px;height:36px;background:#f0f0f0;border-radius:6px;display:flex;align-items:center;justify-content:center;color:#ccc"><i class="fa-solid fa-image"></i></div>') +
      '<div class="prop-info"><strong>' + p.title + '</strong>' +
      (p.isRejected && p.rejectedReason ? '<span style="color:#f87171;font-size:0.68rem;">Reason: ' + p.rejectedReason + '</span>' : '') +
      '</div></div></td>' +
      '<td><strong>' + (p.postedBy ? p.postedBy.firstName + ' ' + p.postedBy.lastName : '—') + '</strong></td>' +
      '<td>' + (p.postedBy ? p.postedBy.phone : '—') + '</td>' +
      '<td>' + (p.location ? p.location.area + ', ' + p.location.city : '') + '</td>' +
      '<td><strong>' + (p.priceLabel || '₹' + p.price) + '</strong></td>' +
      '<td>' + statusBadge + '</td>' +
      '<td>' + fmtDate(p.createdAt) + '</td>' +
      '<td><div class="act-btns">' +
      (!p.isApproved && !p.isRejected ? '<button class="act-btn approve" title="Approve" onclick="approveSubmission(\'' + p._id + '\')"><i class="fa-solid fa-check"></i></button>' : '') +
      (!p.isRejected ? '<button class="act-btn del" title="Reject" onclick="rejectSubmission(\'' + p._id + '\')"><i class="fa-solid fa-xmark"></i></button>' : '') +
      (p.isRejected ? '<button class="act-btn approve" title="Re-Approve" onclick="approveSubmission(\'' + p._id + '\')"><i class="fa-solid fa-rotate-right"></i></button>' : '') +
      '<button class="act-btn del" title="Delete" onclick="deleteSubmission(\'' + p._id + '\')"><i class="fa-solid fa-trash"></i></button>' +
      '</div></td></tr>';
  }).join('');
}

async function approveSubmission(id) {
  const data = await api('PUT', '/properties/' + id + '/approve');
  if (data.success) { toast('✅ Approved! User ko WA notify kiya.'); loadSubmissions(); loadStats(); }
  else toast(data.message || 'Error', 'error');
}

async function rejectSubmission(id) {
  const reason = prompt('Rejection reason likhein (optional):') || 'Does not meet listing standards';
  if (reason === null) return; // Cancel pressed
  const data = await api('PUT', '/properties/' + id + '/reject', { reason });
  if (data.success) { toast('❌ Rejected. User ko WA notify kiya.'); loadSubmissions(); loadStats(); }
  else toast(data.message || 'Error', 'error');
}

async function deleteSubmission(id) {
  if (!confirm('Delete this submission?')) return;
  const data = await api('DELETE', '/properties/' + id);
  if (data.success) { toast('Deleted.'); loadSubmissions(); loadStats(); }
  else toast(data.message || 'Error', 'error');
}

// ===== BLOGS =====
async function loadBlogs() {
  const data = await api('GET', '/blogs');
  const tbody = document.getElementById('blogTbody');
  if (!data.success || !data.blogs || !data.blogs.length) {
    tbody.innerHTML = '<tr><td colspan="7"><div class="empty-state"><i class="fa-solid fa-newspaper"></i><p>No blog posts yet.</p></div></td></tr>';
    return;
  }
  tbody.innerHTML = data.blogs.map(function(b) {
    // SEO score calculate karo
    let seo = 0;
    if (b.title  && b.title.length  >= 5)  seo += 20;
    if (b.excerpt && b.excerpt.length >= 20) seo += 15;
    if (b.content && b.content.split(/\s+/).length >= 300) seo += 25;
    if (b.image  && b.image.length  > 0)  seo += 15;
    if (b.metaDescription && b.metaDescription.length >= 50) seo += 15;
    if (b.slug   && b.slug.length   >= 3)  seo += 10;
    const seoColor = seo >= 80 ? '#34d399' : seo >= 50 ? '#fbbf24' : '#f87171';
    const seoLabel = seo >= 80 ? 'Great' : seo >= 50 ? 'Average' : 'Low';
    return '<tr>' +
      '<td><strong>' + b.title + '</strong></td>' +
      '<td><span class="badge badge-blue">' + b.category + '</span></td>' +
      '<td>' + b.author + '</td>' +
      '<td><div style="display:flex;align-items:center;gap:8px;">' +
        '<div style="width:36px;height:36px;border-radius:50%;background:conic-gradient(' + seoColor + ' ' + seo + '%, rgba(255,255,255,0.08) 0);display:flex;align-items:center;justify-content:center;">' +
          '<div style="width:26px;height:26px;border-radius:50%;background:#1e293b;display:flex;align-items:center;justify-content:center;font-size:0.6rem;font-weight:800;color:' + seoColor + '">' + seo + '</div>' +
        '</div>' +
        '<span style="font-size:0.72rem;color:' + seoColor + ';font-weight:700;">' + seoLabel + '</span>' +
      '</div></td>' +
      '<td><span class="badge ' + (b.isPublished ? 'badge-green' : 'badge-gray') + '">' + (b.isPublished ? 'Published' : 'Draft') + '</span></td>' +
      '<td>' + fmtDate(b.createdAt) + '</td>' +
      '<td><div class="act-btns">' +
      '<button class="act-btn edit" onclick=\'editBlog(' + JSON.stringify(b).replace(/'/g, "&#39;") + ')\'><i class="fa-solid fa-pen"></i></button>' +
      '<button class="act-btn del" onclick="deleteBlog(\'' + b._id + '\')"><i class="fa-solid fa-trash"></i></button>' +
      '</div></td></tr>';
  }).join('');
}

document.getElementById('addBlogBtn').addEventListener('click', function() {
  document.getElementById('blogModalTitle').textContent = 'Write Blog Post';
  document.getElementById('blogForm').reset();
  document.getElementById('blogId').value = '';
  document.getElementById('bAuthor').value = 'CRS Team';
  document.getElementById('bPublished').checked = true;
  document.getElementById('bImgPreview').style.display = 'none';
  document.getElementById('bImgIcon').style.display = 'flex';
  document.getElementById('bImageFile').value = '';
  document.getElementById('bImage').value = '';
  document.getElementById('bContentEditor').innerHTML = '';
  document.getElementById('bSlug').value = '';
  document.getElementById('bMetaTitle').value = '';
  document.getElementById('bMetaDesc').value = '';
  updateBlogSeoScore();
  openModal('blogModal');
});

function editBlog(b) {
  document.getElementById('blogModalTitle').textContent = 'Edit Blog Post';
  document.getElementById('blogId').value = b._id;
  document.getElementById('bTitle').value = b.title || '';
  document.getElementById('bCategory').value = b.category || 'Market Insight';
  document.getElementById('bAuthor').value = b.author || 'CRS Team';
  document.getElementById('bImage').value = b.image || '';
  // Show image preview if exists
  if (b.image) {
    document.getElementById('bImgPreview').src = b.image;
    document.getElementById('bImgPreview').style.display = 'block';
    document.getElementById('bImgIcon').style.display = 'none';
  } else {
    document.getElementById('bImgPreview').style.display = 'none';
    document.getElementById('bImgIcon').style.display = 'flex';
  }
  document.getElementById('bSlug').value = b.slug || '';
  document.getElementById('bExcerpt').value = b.excerpt || '';
  document.getElementById('bContentEditor').innerHTML = b.content || '';
  document.getElementById('bContent').value = b.content || '';
  document.getElementById('bMetaTitle').value = b.metaTitle || '';
  document.getElementById('bMetaDesc').value = b.metaDescription || '';
  document.getElementById('bPublished').checked = b.isPublished || false;
  document.getElementById('bFeatured').checked = b.isFeatured || false;
  updateBlogSeoScore();
  openModal('blogModal');
}

document.getElementById('blogForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  const id = document.getElementById('blogId').value;
  const btn = document.getElementById('blogSaveBtn');
  btn.textContent = 'Saving...'; btn.disabled = true;
  const body = {
    title: document.getElementById('bTitle').value,
    slug: document.getElementById('bSlug').value,
    category: document.getElementById('bCategory').value,
    author: document.getElementById('bAuthor').value,
    image: document.getElementById('bImage').value,
    excerpt: document.getElementById('bExcerpt').value,
    content: document.getElementById('bContentEditor').innerHTML,
    metaTitle: document.getElementById('bMetaTitle').value,
    metaDescription: document.getElementById('bMetaDesc').value,
    isPublished: document.getElementById('bPublished').checked,
    isFeatured: document.getElementById('bFeatured').checked
  };
  const data = id ? await api('PUT', '/blogs/' + id, body) : await api('POST', '/blogs', body);
  btn.textContent = 'Save Blog Post'; btn.disabled = false;
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

// ===== INQUIRIES =====
let allInquiries = [];

async function loadInquiries(filter) {
  if (!filter) filter = 'all';
  // Filter buttons active state
  document.querySelectorAll('[data-inqfilter]').forEach(function(b) {
    b.classList.toggle('active', b.dataset.inqfilter === filter);
  });
  // Fetch only once, then filter client-side
  if (filter === 'all' || !allInquiries.length) {
    const data = await api('GET', '/inquiries');
    if (!data.success) return;
    allInquiries = data.inquiries || [];
  }
  const filterMap = {
    'all':        null,
    'Get Offer':  'Get Offer',
    'Buy':        'Buy',
    'Rent':       'Rent / Lease',
    'Sell':       'Sell My Property'
  };
  const filtered = filter === 'all'
    ? allInquiries
    : allInquiries.filter(function(i) { return i.lookingFor === filterMap[filter]; });

  const tbody = document.getElementById('inqTbody');
  if (!filtered.length) {
    tbody.innerHTML = '<tr><td colspan="10"><div class="empty-state"><i class="fa-solid fa-message"></i><p>No inquiries found.</p></div></td></tr>';
    return;
  }
  tbody.innerHTML = filtered.map(function(i) {
    const typeColor = {
      'Get Offer':       'badge-purple',
      'Buy':             'badge-green',
      'Rent / Lease':    'badge-blue',
      'Sell My Property':'badge-orange'
    };
    return '<tr>' +
      '<td><strong style="color:#E53935">' + (i.refId || '—') + '</strong></td>' +
      '<td>' + i.name + '</td>' +
      '<td>' + i.phone + '</td>' +
      '<td><span class="badge ' + (typeColor[i.interestedIn] || 'badge-blue') + '">' + (i.interestedIn || '—') + '</span></td>' +
      '<td><span class="badge ' + (typeColor[i.lookingFor] || 'badge-gray') + '">' + (i.lookingFor || '—') + '</span></td>' +
      '<td>' + (i.city || '—') + '</td>' +
      '<td>' + (i.budget || '—') + '</td>' +
      '<td><select onchange="updateInqStatus(\'' + i._id + '\', this.value)" style="border:1.5px solid #e8e8e8;border-radius:7px;padding:4px 8px;font-size:0.78rem;font-family:Poppins,sans-serif;outline:none;cursor:pointer;">' +
      '<option value="new"'       + (i.status==='new'       ? ' selected' : '') + '>New</option>' +
      '<option value="contacted"' + (i.status==='contacted' ? ' selected' : '') + '>Contacted</option>' +
      '<option value="closed"'    + (i.status==='closed'    ? ' selected' : '') + '>Closed</option>' +
      '</select></td>' +
      '<td>' + fmtDate(i.createdAt) + '</td>' +
      '<td><div class="act-btns"><button class="act-btn del" onclick="deleteInquiry(\'' + i._id + '\')"><i class="fa-solid fa-trash"></i></button></div></td>' +
      '</tr>';
  }).join('');
}

async function updateInqStatus(id, status) {
  const data = await api('PUT', '/inquiries/' + id + '/status', { status });
  if (data.success) toast('Status updated!');
  else toast('Error', 'error');
}

async function deleteInquiry(id) {
  if (!confirm('Delete this inquiry?')) return;
  const data = await api('DELETE', '/inquiries/' + id);
  if (data.success) { toast('Deleted.'); allInquiries = []; loadInquiries('all'); loadStats(); }
  else toast(data.message || 'Error', 'error');
}

// ===== REQUIREMENTS =====
async function loadRequirements() {
  const data = await api('GET', '/requirements');
  const tbody = document.getElementById('reqTbody');
  if (!data.success || !data.inquiries || !data.inquiries.length) {
    tbody.innerHTML = '<tr><td colspan="9"><div class="empty-state"><i class="fa-solid fa-bell"></i><p>No requirements yet.</p></div></td></tr>';
    document.getElementById('reqBadge').textContent = '';
    return;
  }
  const newCount = data.inquiries.filter(function(r) { return r.status === 'new'; }).length;
  document.getElementById('reqBadge').textContent = newCount || '';
  tbody.innerHTML = data.inquiries.map(function(r) {
    return '<tr>' +
      '<td><strong>' + r.name + '</strong></td>' +
      '<td>' + r.phone + '</td>' +
      '<td>' + (r.interestedIn || r.propertyType || '—') + '</td>' +
      '<td>' + (r.budget || '—') + '</td>' +
      '<td>' + (r.city || '—') + '</td>' +
      '<td style="max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;cursor:pointer" title="' + (r.message || '') + '">' + (r.message || '—') + '</td>' +
      '<td><select onchange="updateInqStatus(\'' + r._id + '\', this.value)" style="border:1.5px solid #e8e8e8;border-radius:7px;padding:4px 8px;font-size:0.78rem;font-family:Poppins,sans-serif;outline:none;cursor:pointer;">' +
      '<option value="new"'       + (r.status==='new'       ? ' selected' : '') + '>New</option>' +
      '<option value="contacted"' + (r.status==='contacted' ? ' selected' : '') + '>Contacted</option>' +
      '<option value="closed"'    + (r.status==='closed'    ? ' selected' : '') + '>Closed</option>' +
      '</select></td>' +
      '<td>' + fmtDate(r.createdAt) + '</td>' +
      '<td><div class="act-btns"><button class="act-btn del" onclick="deleteRequirement(\'' + r._id + '\')"><i class="fa-solid fa-trash"></i></button></div></td>' +
      '</tr>';
  }).join('');
}

async function deleteRequirement(id) {
  if (!confirm('Delete this requirement?')) return;
  const data = await api('DELETE', '/inquiries/' + id);
  if (data.success) { toast('Deleted.'); loadRequirements(); }
  else toast(data.message || 'Error', 'error');
}

// ===== USERS =====
async function loadUsers() {
  const data = await api('GET', '/users');
  const tbody = document.getElementById('userTbody');
  if (!data.success || !data.users || !data.users.length) {
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

// ===== CONTACTS =====
async function loadContacts() {
  try {
    const res  = await fetch(API + '/contact', {
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
        '<td><select onchange="updateContactStatus(\'' + c._id + '\', this.value)" style="border:1.5px solid var(--border);border-radius:7px;padding:4px 8px;font-size:0.78rem;font-family:Poppins,sans-serif;outline:none;cursor:pointer;background:var(--card2);color:var(--text);">' +
        '<option value="new"'     + (c.status==='new'     ? ' selected' : '') + '>New</option>' +
        '<option value="read"'    + (c.status==='read'    ? ' selected' : '') + '>Read</option>' +
        '<option value="replied"' + (c.status==='replied' ? ' selected' : '') + '>Replied</option>' +
        '</select></td>' +
        '<td>' + fmtDate(c.createdAt) + '</td>' +
        '<td><div class="act-btns"><button class="act-btn del" onclick="deleteContact(\'' + c._id + '\')"><i class="fa-solid fa-trash"></i></button></div></td>' +
        '</tr>';
    }).join('');
  } catch(e) {
    console.error('loadContacts error:', e);
  }
}

async function updateContactStatus(id, status) {
  const res = await fetch(API + '/contact/' + id + '/status', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + adminToken },
    body: JSON.stringify({ status })
  });
  const data = await res.json();
  if (data.success) toast('Status updated!');
  else toast('Error', 'error');
}

async function deleteContact(id) {
  if (!confirm('Delete this message?')) return;
  const res = await fetch(API + '/contact/' + id, {
    method: 'DELETE',
    headers: { 'Authorization': 'Bearer ' + adminToken }
  });
  const data = await res.json();
  if (data.success) { toast('Deleted.'); loadContacts(); }
  else toast('Error', 'error');
}

// ===== TEST API + STATUS BAR =====
async function checkApiStatus() {
  const dot    = document.getElementById('apiStatusDot');
  const text   = document.getElementById('apiStatusText');
  const detail = document.getElementById('apiStatusDetail');
  const ping   = document.getElementById('apiStatusPing');
  const btn    = document.getElementById('apiRefreshBtn');
  if (btn) { btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Checking...'; btn.disabled = true; }
  if (dot)  dot.style.cssText  = 'width:10px;height:10px;border-radius:50%;background:#f59e0b;box-shadow:0 0 0 3px rgba(245,158,11,0.2);flex-shrink:0;animation:badge-pulse 1s infinite;';
  if (text) { text.textContent = 'Checking...'; text.style.color = '#94a3b8'; }
  if (detail) detail.textContent = '';
  if (ping)   ping.textContent   = '';
  try {
    const start = Date.now();
    const res   = await fetch(API.replace('/api','') + '/api/health');
    const data  = await res.json();
    const ms    = Date.now() - start;
    if (data.success) {
      if (dot)    { dot.style.cssText = 'width:10px;height:10px;border-radius:50%;background:#10b981;box-shadow:0 0 0 3px rgba(16,185,129,0.25),0 0 8px rgba(16,185,129,0.4);flex-shrink:0;'; }
      if (text)   { text.textContent = '✅ API Connected'; text.style.color = '#34d399'; }
      if (detail) { detail.textContent = data.message || 'Server running'; }
      if (ping)   { ping.textContent = ms + 'ms'; }
    } else { throw new Error('Server error'); }
  } catch(e) {
    if (dot)    { dot.style.cssText = 'width:10px;height:10px;border-radius:50%;background:#ef4444;box-shadow:0 0 0 3px rgba(239,68,68,0.25);flex-shrink:0;'; }
    if (text)   { text.textContent = '❌ API Not Reachable'; text.style.color = '#f87171'; }
    if (detail) { detail.textContent = 'Server offline — run: node server.js'; }
    if (ping)   { ping.textContent = ''; }
  }
  if (btn) { btn.innerHTML = '<i class="fa-solid fa-rotate-right"></i> Test API'; btn.disabled = false; }
}

async function testApiConnection() {
  const btn    = document.getElementById('testApiBtn');
  const result = document.getElementById('apiTestResult');
  if (btn) { btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Testing...'; btn.disabled = true; }
  if (result) result.style.display = 'none';
  try {
    const start = Date.now();
    const res   = await fetch(API.replace('/api','') + '/api/health');
    const data  = await res.json();
    const ms    = Date.now() - start;
    if (data.success) {
      result.style.cssText = 'display:block;margin-top:14px;padding:12px 16px;border-radius:10px;font-size:0.82rem;font-weight:600;background:rgba(16,185,129,0.12);color:#34d399;border:1px solid rgba(16,185,129,0.3);';
      result.innerHTML = '<i class="fa-solid fa-circle-check"></i> Connected! &nbsp;|&nbsp; ' + (data.message || 'OK') + ' &nbsp;|&nbsp; ' + ms + 'ms';
    } else { throw new Error('API error'); }
  } catch(e) {
    result.style.cssText = 'display:block;margin-top:14px;padding:12px 16px;border-radius:10px;font-size:0.82rem;font-weight:600;background:rgba(239,68,68,0.12);color:#f87171;border:1px solid rgba(239,68,68,0.3);';
    result.innerHTML = '<i class="fa-solid fa-circle-xmark"></i> Not Reachable — ' + API;
  }
  if (btn) { btn.innerHTML = '<i class="fa-solid fa-plug"></i> Test API'; btn.disabled = false; }
}

// ===== INIT =====
loadStats();
checkApiStatus();

// ===== BLOG RICH TEXT + SEO SCORE =====
function bFmt(cmd) { document.getElementById('bContentEditor').focus(); document.execCommand(cmd, false, null); }
function bFmtBlock(tag) { document.getElementById('bContentEditor').focus(); document.execCommand('formatBlock', false, tag); }
function bInsertLink() {
  const url = prompt('Enter URL:');
  if (url) { document.getElementById('bContentEditor').focus(); document.execCommand('createLink', false, url); }
}

function updateBlogSeoScore() {
  const title   = document.getElementById('bTitle').value.trim();
  const excerpt = document.getElementById('bExcerpt').value.trim();
  const content = document.getElementById('bContentEditor').innerText.trim();
  const image   = document.getElementById('bImage').value.trim();
  const meta    = document.getElementById('bMetaDesc').value.trim();
  const slug    = document.getElementById('bSlug').value.trim();

  const checks = [
    { id: 'bsc-title',   pts: 20, ok: title.length >= 5 },
    { id: 'bsc-excerpt', pts: 15, ok: excerpt.length >= 20 },
    { id: 'bsc-content', pts: 25, ok: content.split(/\s+/).length >= 300 },
    { id: 'bsc-image',   pts: 15, ok: image.length > 0 },
    { id: 'bsc-meta',    pts: 15, ok: meta.length >= 50 },
    { id: 'bsc-slug',    pts: 10, ok: slug.length >= 3 }
  ];

  let score = 0;
  checks.forEach(c => {
    const li = document.getElementById(c.id);
    if (!li) return;
    const icon = li.querySelector('span');
    if (c.ok) {
      score += c.pts;
      li.style.color = 'rgba(255,255,255,0.85)';
      if (icon) { icon.style.background = 'rgba(16,185,129,0.3)'; icon.style.color = '#6ee7b7'; }
    } else {
      li.style.color = 'rgba(255,255,255,0.25)';
      if (icon) { icon.style.background = 'rgba(251,191,36,0.06)'; icon.style.color = 'rgba(255,255,255,0.2)'; }
    }
  });

  document.getElementById('bSeoNum').textContent = score;
  const circ = 314.16;
  document.getElementById('bSeoCircle').style.strokeDashoffset = circ - (circ * score / 100);

  const gradA = document.getElementById('bSeoGradA');
  const gradB = document.getElementById('bSeoGradB');
  const status = document.getElementById('bSeoStatus');
  const pubBtn = document.getElementById('bSeoPublishBtn');

  if (score >= 80) {
    gradA.setAttribute('stop-color','#34d399'); gradB.setAttribute('stop-color','#059669');
    status.innerHTML = '<i class="fa-solid fa-arrow-up"></i> Great Quality';
    status.style.cssText = 'font-size:0.68rem;font-weight:800;letter-spacing:0.6px;text-transform:uppercase;padding:4px 12px;border-radius:20px;display:inline-flex;align-items:center;gap:5px;margin-bottom:12px;background:rgba(16,185,129,0.18);color:#6ee7b7;border:1px solid rgba(16,185,129,0.35);';
    pubBtn.style.cssText = 'width:100%;padding:10px;border-radius:10px;border:none;font-size:0.75rem;font-weight:700;font-family:Poppins,sans-serif;cursor:pointer;background:linear-gradient(135deg,#fbbf24,#f59e0b);color:#1a0a00;display:flex;align-items:center;justify-content:center;gap:7px;transition:all 0.3s;';
    pubBtn.innerHTML = '<i class="fa-solid fa-rocket"></i> Publish Post';
  } else if (score >= 50) {
    gradA.setAttribute('stop-color','#fbbf24'); gradB.setAttribute('stop-color','#f59e0b');
    status.innerHTML = '<i class="fa-solid fa-minus"></i> Average';
    status.style.cssText = 'font-size:0.68rem;font-weight:800;letter-spacing:0.6px;text-transform:uppercase;padding:4px 12px;border-radius:20px;display:inline-flex;align-items:center;gap:5px;margin-bottom:12px;background:rgba(251,191,36,0.18);color:#fde68a;border:1px solid rgba(251,191,36,0.35);';
    pubBtn.style.cssText = 'width:100%;padding:10px;border-radius:10px;border:none;font-size:0.75rem;font-weight:700;font-family:Poppins,sans-serif;cursor:pointer;background:rgba(251,191,36,0.15);color:rgba(251,191,36,0.8);border:1px solid rgba(251,191,36,0.3);display:flex;align-items:center;justify-content:center;gap:7px;transition:all 0.3s;';
    pubBtn.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Save Draft';
  } else {
    gradA.setAttribute('stop-color','#f87171'); gradB.setAttribute('stop-color','#ef4444');
    status.innerHTML = '<i class="fa-solid fa-arrow-down"></i> Needs Work';
    status.style.cssText = 'font-size:0.68rem;font-weight:800;letter-spacing:0.6px;text-transform:uppercase;padding:4px 12px;border-radius:20px;display:inline-flex;align-items:center;gap:5px;margin-bottom:12px;background:rgba(239,68,68,0.18);color:#fca5a5;border:1px solid rgba(239,68,68,0.35);';
    pubBtn.style.cssText = 'width:100%;padding:10px;border-radius:10px;border:none;font-size:0.75rem;font-weight:700;font-family:Poppins,sans-serif;cursor:pointer;background:rgba(251,191,36,0.06);color:rgba(251,191,36,0.3);border:1px solid rgba(251,191,36,0.12);display:flex;align-items:center;justify-content:center;gap:7px;transition:all 0.3s;';
    pubBtn.innerHTML = '<i class="fa-solid fa-lock"></i> Fill required fields';
  }

  // Google preview update
  document.getElementById('bPreviewTitle').textContent = title || 'Post Title';
  document.getElementById('bPreviewSlug').textContent  = slug  || 'post-slug';
  document.getElementById('bPreviewDesc').textContent  = meta  || 'Page description will appear here...';
  document.getElementById('bMetaTitleCount').textContent = document.getElementById('bMetaTitle').value.length;
  document.getElementById('bMetaDescCount').textContent  = meta.length;
}

// Auto-generate slug from title
document.getElementById('bTitle').addEventListener('input', function() {
  const slug = this.value.toLowerCase().replace(/[^a-z0-9\s-]/g,'').trim().replace(/\s+/g,'-').replace(/-+/g,'-');
  document.getElementById('bSlug').value = slug;
  updateBlogSeoScore();
});
['bExcerpt','bSlug','bImage','bMetaTitle','bMetaDesc'].forEach(id => {
  const el = document.getElementById(id);
  if (el) el.addEventListener('input', updateBlogSeoScore);
});
if (document.getElementById('bContentEditor')) {
  document.getElementById('bContentEditor').addEventListener('input', updateBlogSeoScore);
}

// Blog preview toggle
document.getElementById('blogPreviewToggle').addEventListener('click', function() {
  const pane = document.getElementById('blogPreviewPane');
  const editor = document.getElementById('blogEditorCol');
  const scoreCol = document.getElementById('blogScoreCol');
  const isShowing = pane.style.display === 'block';
  pane.style.display = isShowing ? 'none' : 'block';
  editor.style.display = isShowing ? 'block' : 'none';
  scoreCol.style.display = isShowing ? 'flex' : 'none';
  this.innerHTML = isShowing ? '<i class="fa-solid fa-eye"></i> Preview' : '<i class="fa-solid fa-pen"></i> Edit';
  if (!isShowing) {
    const title = document.getElementById('bTitle').value;
    const content = document.getElementById('bContentEditor').innerHTML;
    const img = document.getElementById('bImage').value;
    pane.innerHTML = '<div style="max-width:700px;margin:0 auto;padding:32px 24px;font-family:Poppins,sans-serif;">' +
      (img ? '<img src="' + img + '" style="width:100%;border-radius:12px;margin-bottom:24px;max-height:360px;object-fit:cover;"/>' : '') +
      '<h1 style="font-size:1.8rem;font-weight:800;color:#0D1B2A;margin-bottom:16px;">' + (title || 'Post Title') + '</h1>' +
      '<div style="font-size:0.95rem;line-height:1.9;color:#444;">' + (content || '<p style="color:#aaa">No content yet...</p>') + '</div>' +
      '</div>';
  }
});

// ===== ADMIN PROPERTY LISTING SCORE =====
function updateAdminListingScore() {
  const title  = document.getElementById('pTitle')?.value.trim() || '';
  const type   = document.getElementById('pType')?.value || '';
  const city   = document.getElementById('pCitySelect')?.value || '';
  const area   = document.getElementById('pAreaSelect')?.value || document.getElementById('pSubArea')?.value.trim() || '';
  const price  = Number(document.getElementById('pPrice')?.value) || 0;
  const sqft   = Number(document.getElementById('pSqft')?.value) || 0;
  const desc   = document.getElementById('pDesc')?.value.trim() || '';
  const imgs   = document.querySelectorAll('#pImagePreview div').length;

  const checks = [
    { id: 'asc-title',  pts: 15, ok: title.length >= 5 },
    { id: 'asc-type',   pts: 10, ok: type.length > 0 },
    { id: 'asc-city',   pts: 15, ok: city.length > 0 && area.length > 0 },
    { id: 'asc-price',  pts: 15, ok: price > 0 },
    { id: 'asc-area',   pts: 10, ok: sqft > 0 },
    { id: 'asc-desc',   pts: 20, ok: desc.length >= 30 },
    { id: 'asc-images', pts: 15, ok: imgs > 0 }
  ];

  let score = 0;
  checks.forEach(c => {
    const li = document.getElementById(c.id);
    if (!li) return;
    const icon = li.querySelector('.asi');
    if (c.ok) {
      score += c.pts;
      li.style.color = 'rgba(255,255,255,0.85)';
      if (icon) { icon.style.background = 'rgba(16,185,129,0.25)'; icon.style.color = '#6ee7b7'; }
    } else {
      li.style.color = 'rgba(255,255,255,0.3)';
      if (icon) { icon.style.background = 'rgba(255,255,255,0.05)'; icon.style.color = 'rgba(255,255,255,0.2)'; }
    }
  });

  const numEl   = document.getElementById('ascNum');
  const circle  = document.getElementById('ascCircle');
  const glow    = document.getElementById('ascGlow');
  const badge   = document.getElementById('ascStatusBadge');
  const pubBtn  = document.getElementById('ascPublishBtn');
  if (!numEl) return;

  numEl.textContent = score;
  const circ = 351.86;
  const offset = circ - (circ * score / 100);
  circle.style.strokeDashoffset = offset;
  glow.style.strokeDashoffset   = offset;

  const gradA = document.getElementById('ascGradA');
  const gradB = document.getElementById('ascGradB');

  if (score >= 80) {
    gradA.setAttribute('stop-color','#34d399'); gradB.setAttribute('stop-color','#059669');
    badge.className = 'asc-status-badge high'; badge.innerHTML = '<i class="fas fa-arrow-up"></i> High Listing';
    pubBtn.className = 'asc-publish-btn unlocked'; pubBtn.innerHTML = '<i class="fas fa-rocket"></i> Save & Publish';
  } else if (score >= 50) {
    gradA.setAttribute('stop-color','#fbbf24'); gradB.setAttribute('stop-color','#f59e0b');
    badge.className = 'asc-status-badge medium'; badge.innerHTML = '<i class="fas fa-minus"></i> Medium Listing';
    pubBtn.className = 'asc-publish-btn medium'; pubBtn.innerHTML = '<i class="fas fa-floppy-disk"></i> Save Property';
  } else {
    gradA.setAttribute('stop-color','#f87171'); gradB.setAttribute('stop-color','#ef4444');
    badge.className = 'asc-status-badge low'; badge.innerHTML = '<i class="fas fa-arrow-down"></i> Low Listing';
    pubBtn.className = 'asc-publish-btn locked'; pubBtn.innerHTML = '<i class="fas fa-lock"></i> Fill required fields';
  }
}

function ascPublishClick() {
  document.getElementById('propSaveBtn').click();
}

// Attach score update to property form fields
['pTitle','pType','pCitySelect','pAreaSelect','pSubArea','pPrice','pSqft','pDesc'].forEach(id => {
  const el = document.getElementById(id);
  if (el) el.addEventListener('input', updateAdminListingScore), el.addEventListener('change', updateAdminListingScore);
});

// Observer for image preview changes
const imgPreviewObs = new MutationObserver(updateAdminListingScore);
const imgPreviewEl = document.getElementById('pImagePreview');
if (imgPreviewEl) imgPreviewObs.observe(imgPreviewEl, { childList: true });
let notifList = JSON.parse(localStorage.getItem('adminNotifs') || '[]');

function renderNotifs() {
  const list = document.getElementById('notifList');
  const dot  = document.getElementById('notifDot');
  if (!notifList.length) {
    list.innerHTML = '<div style="text-align:center;padding:32px 20px;color:#475569;"><i class="fa-solid fa-bell-slash" style="font-size:1.8rem;margin-bottom:8px;display:block;opacity:0.4;"></i><p style="font-size:0.8rem;">No notifications yet</p></div>';
    dot.style.display = 'none';
    dot.textContent = '0';
    return;
  }
  const count = notifList.length;
  dot.style.display = 'inline-flex';
  dot.textContent = count > 99 ? '99+' : count;
  list.innerHTML = notifList.slice().reverse().map(function(n) {
    const iconMap = { inquiry: 'fa-message', contact: 'fa-envelope', register: 'fa-user-plus', login: 'fa-right-to-bracket' };
    const colorMap = { inquiry: '#6366f1', contact: '#3b82f6', register: '#10b981', login: '#f59e0b' };
    const icon  = iconMap[n.type]  || 'fa-bell';
    const color = colorMap[n.type] || '#94a3b8';
    return '<div style="padding:12px 18px;border-bottom:1px solid rgba(255,255,255,0.05);display:flex;gap:10px;align-items:flex-start;">' +
      '<div style="width:32px;height:32px;border-radius:50%;background:' + color + '22;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:2px;">' +
      '<i class="fa-solid ' + icon + '" style="font-size:0.75rem;color:' + color + ';"></i></div>' +
      '<div style="flex:1;min-width:0;">' +
      '<div style="font-size:0.78rem;font-weight:600;color:#e2e8f0;margin-bottom:2px;">' + n.title + '</div>' +
      '<div style="font-size:0.72rem;color:#64748b;">' + n.body + '</div>' +
      '<div style="font-size:0.65rem;color:#475569;margin-top:3px;">' + new Date(n.time).toLocaleString('en-IN') + '</div>' +
      '</div></div>';
  }).join('');
}

function addNotif(type, title, body) {
  notifList.push({ type, title, body, time: Date.now() });
  if (notifList.length > 50) notifList = notifList.slice(-50);
  localStorage.setItem('adminNotifs', JSON.stringify(notifList));
  renderNotifs();
  // Bell ko highlight karo
  const btn = document.getElementById('notifBtn');
  btn.style.animation = 'none';
  btn.style.background = 'rgba(239,68,68,0.25)';
  btn.style.color = '#f87171';
  btn.style.boxShadow = '0 0 20px rgba(239,68,68,0.5)';
  setTimeout(() => {
    btn.style.animation = 'bellRingFast 0.5s ease-in-out 3';
  }, 50);
  setTimeout(() => {
    btn.style.animation = 'bellRing 3s ease-in-out infinite';
    btn.style.background = 'rgba(239,68,68,0.15)';
    btn.style.color = '#f87171';
    btn.style.boxShadow = '0 0 12px rgba(239,68,68,0.3)';
  }, 1600);
}

function clearNotifs() {
  notifList = [];
  localStorage.removeItem('adminNotifs');
  renderNotifs();
}

function toggleNotifPanel() {
  const panel = document.getElementById('notifPanel');
  const isOpen = panel.style.display === 'block';
  panel.style.display = isOpen ? 'none' : 'block';
  if (!isOpen) {
    // Panel khula — count reset karo
    const dot = document.getElementById('notifDot');
    dot.style.display = 'none';
  }
}

document.addEventListener('click', function(e) {
  const btn   = document.getElementById('notifBtn');
  const panel = document.getElementById('notifPanel');
  if (panel && !panel.contains(e.target) && !btn.contains(e.target)) panel.style.display = 'none';
});

// Test WhatsApp notification
async function sendTestWA() {
  try {
    const data = await api('POST', '/send-wa', { message: '🔔 Test notification from City Real Space Admin Panel! Everything is working.' });
    if (data.success) toast('WhatsApp sent! ✅');
    else toast(data.message || 'WA Error', 'error');
  } catch(e) { toast('Error sending WA', 'error'); }
}

// Poll for new inquiries every 10 seconds using timestamp
let lastInqTime     = null;
let lastContactTime = null;
let lastUserCount   = -1;
let isFirstPoll     = true;

async function pollNotifications() {
  try {
    const data = await api('GET', '/stats');
    if (!data.success) return;
    const s = data.stats;

    if (isFirstPoll) {
      isFirstPoll     = false;
      lastInqTime     = s.latestInquiry ? s.latestInquiry.createdAt : null;
      lastContactTime = s.latestContact ? s.latestContact.createdAt : null;
      lastUserCount   = s.totalUsers || 0;
      if (s.newInquiries > 0) {
        document.getElementById('notifDot').style.display = 'block';
        addNotif('inquiry', '📩 ' + s.newInquiries + ' Pending Inquiries', 'Check Inquiries tab.');
      }
      if (s.newContacts > 0) {
        document.getElementById('notifDot').style.display = 'block';
        document.getElementById('contactBadge').textContent = s.newContacts;
        addNotif('contact', '✉️ ' + s.newContacts + ' Unread Messages', 'Check Contacts tab.');
      }
      return;
    }

    // Naya inquiry
    if (s.latestInquiry) {
      if (lastInqTime === null || new Date(s.latestInquiry.createdAt) > new Date(lastInqTime)) {
        lastInqTime = s.latestInquiry.createdAt;
        addNotif('inquiry', '📩 New Inquiry!', (s.latestInquiry.name || 'Someone') + ' (' + (s.latestInquiry.phone || '') + ') submitted an inquiry.');
      }
    }

    // Naya contact message
    if (s.latestContact) {
      if (lastContactTime === null || new Date(s.latestContact.createdAt) > new Date(lastContactTime)) {
        lastContactTime = s.latestContact.createdAt;
        addNotif('contact', '✉️ New Contact Message!', (s.latestContact.name || 'Someone') + ' sent a message.');
        document.getElementById('contactBadge').textContent = s.newContacts || '';
      }
    }

    // Naya user
    if (lastUserCount >= 0 && s.totalUsers > lastUserCount) {
      addNotif('register', '👤 New User!', (s.totalUsers - lastUserCount) + ' new user registered.');
    }
    lastUserCount = s.totalUsers || 0;

    if (s.newInquiries > 0) document.getElementById('notifDot').style.display = 'block';

  } catch(e) {}
}

pollNotifications();
setInterval(pollNotifications, 10000);

renderNotifs();

// ===== CITY → AREA DROPDOWN SYNC =====
const adminCityAreas = {
  'Ahmedabad':   ['Prahlad Nagar','Satellite','Bopal','Thaltej','Memnagar','Vastrapur','Bodakdev','Navrangpura','Chandkheda','Shela','SG Highway','CG Road','Iscon','Giftcity'],
  'Gandhinagar': ['Giftcity','Sector 1','Sector 5','Sector 11','Sector 21','Infocity'],
  'Surat':       ['Adajan','Vesu','Pal','Katargam','Udhna','Althan'],
  'Vadodara':    ['Alkapuri','Gotri','Waghodia Road','Manjalpur','Fatehgunj'],
  'Rajkot':      ['Kalawad Road','Mavdi','Raiya Road','University Road','150 Feet Ring Road']
};

document.getElementById('pCitySelect').addEventListener('change', function() {
  const areas = adminCityAreas[this.value] || [];
  const sel = document.getElementById('pAreaSelect');
  sel.innerHTML = '<option value="">-- Select Area --</option>' +
    areas.map(a => '<option value="' + a + '">' + a + '</option>').join('') +
    '<option value="__other__">Other (Type Manually)</option>';
  document.getElementById('pSubAreaSelect').innerHTML = '<option value="">-- Select Locality First --</option>';
  document.getElementById('pSubArea').value = '';
  updateAdminListingScore();
});

document.getElementById('pAreaSelect').addEventListener('change', function() {
  handleAreaSelect();
  updateAdminListingScore();
});
document.getElementById('pSubAreaSelect').addEventListener('change', handleSubAreaSelect);
