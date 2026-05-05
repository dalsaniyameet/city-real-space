const fs = require('fs');
const file = 'c:/Users/meetd/Downloads/City Real Space/properties.html';
let html = fs.readFileSync(file, 'utf8');

// Find start and end by exact positions
const si = html.indexOf("'<button class=\"card-fav\"");
const endPattern = "Contact Now</button>' +\r\n    '</div></div></div></div>';";
const ei = html.indexOf(endPattern, si);

console.log('si='+si+' ei='+ei);
if (si === -1 || ei === -1) { console.log('Not found'); process.exit(1); }

const before = html.substring(0, si);
const after  = html.substring(ei + endPattern.length);

const newCard = `'<div class="card-verified"><div class="card-verified-inner"><span class="cv-icon"><i class="fa-solid fa-check"></i></span> Verified Seller</div></div>' +
    (p.views > 0 || p.createdAt ? '<div class="card-meta-bar">' + (p.views > 0 ? '<span><i class="fa-solid fa-eye"></i> ' + p.views + '</span>' : '') + (p.createdAt ? '<span><i class="fa-regular fa-clock"></i> ' + (Math.floor((Date.now()-new Date(p.createdAt))/86400000)===0?'Today':Math.floor((Date.now()-new Date(p.createdAt))/86400000)===1?'1 day ago':Math.floor((Date.now()-new Date(p.createdAt))/86400000)+' days ago') + '</span>' : '') + '</div>' : '') +
    '<div class="card-price"><span>' + price + '</span></div></div>' +
    '<div class="card-body">' +
    '<div class="card-loc"><i class="fa-solid fa-location-dot"></i>' + loc + '</div>' +
    '<div class="card-title">' + p.title + '</div>' +
    (p.extraDetails && p.extraDetails.negotiable && p.extraDetails.negotiable !== 'No' ? '<span class="card-negotiable"><i class="fa-solid fa-handshake"></i> Negotiable</span>' : '') +
    '<div class="card-specs">' + specs + '</div>' +
    '<div class="card-footer"><div class="card-agent"><div class="agent-av">' + initials + '</div><span class="agent-name">' + agentName + '</span></div>' +
    '<div style="display:flex;gap:5px;align-items:center;">' +
    '<button class="card-action-btn" title="Share" onclick="event.stopPropagation();cardShare(\\'' + propUrl + '\\',\\'' + p.title.replace(/'/g,"\\\\'") + '\\')"><i class="fa-solid fa-share-nodes"></i></button>' +
    '<button class="card-action-btn" title="Report" onclick="event.stopPropagation();cardReport(\\'' + p._id + '\\')"><i class="fa-solid fa-flag"></i></button>' +
    '<button class="btn-compare" title="Compare" onclick="toggleCompare(event,\\'' + p._id + '\\')" id="cmpBtn_' + p._id + '"><i class="fa-solid fa-code-compare"></i></button>' +
    '<button class="btn-offer" onclick="requireLoginForOffer(event,\\'' + p.title.replace(/'/g,"\\\\'") + '\\',\\'' + loc.replace(/'/g,"\\\\'") + '\\')">Contact Now</button>' +
    '</div></div></div></div>';`;

html = before + newCard + after;
console.log('Card replaced');

// Add helpers
const helpersMarker = '// No static fallback';
if (html.includes(helpersMarker)) {
  const helpers = `// Card Share
function cardShare(url, title) {
  var fullUrl = window.location.origin + url;
  if (navigator.share) { navigator.share({ title: title, url: fullUrl }); }
  else {
    if (navigator.clipboard) navigator.clipboard.writeText(fullUrl);
    var t = document.querySelector('.auth-toast');
    if (!t) { t = document.createElement('div'); t.className = 'auth-toast'; document.body.appendChild(t); }
    t.innerHTML = '<i class="fa-solid fa-check"></i> Link Copied!';
    t.classList.add('show'); setTimeout(function(){ t.classList.remove('show'); }, 2000);
  }
}
function cardReport(id) {
  if (confirm('Report this listing as fake or incorrect?')) {
    fetch(API + '/properties/' + id + '/report', { method: 'POST' }).catch(function(){});
    var t = document.querySelector('.auth-toast');
    if (!t) { t = document.createElement('div'); t.className = 'auth-toast'; document.body.appendChild(t); }
    t.innerHTML = '<i class="fa-solid fa-flag"></i> Reported. Thank you!';
    t.classList.add('show'); setTimeout(function(){ t.classList.remove('show'); }, 3000);
  }
}
function renderRecentlyViewed() {
  try {
    var rv = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
    if (!rv.length) return;
    var existing = document.getElementById('rvSection');
    if (existing) existing.remove();
    var sec = document.createElement('div');
    sec.id = 'rvSection'; sec.className = 'rv-section';
    sec.innerHTML = '<h3><i class="fa-solid fa-clock-rotate-left"></i> Recently Viewed</h3><div class="rv-scroll">' +
      rv.map(function(p) {
        return '<div class="rv-card" onclick="window.open(\\'' + p.url + '\\',\\'_blank\\')">' +
          (p.img ? '<img src="' + p.img + '" alt="' + p.title + '" loading="lazy"/>' : '<div style="height:90px;background:#f0f2f5"></div>') +
          '<div class="rv-card-body"><div class="rv-card-title">' + p.title + '</div><div class="rv-card-price">' + p.price + '</div></div></div>';
      }).join('') + '</div>';
    var wrap = document.querySelector('.prop-page-wrap');
    var head = document.querySelector('.prop-page-head');
    if (wrap && head) wrap.insertBefore(sec, head.nextSibling);
  } catch(e) {}
}
function saveRecentlyViewed(p, propUrl) {
  try {
    var rv = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
    if (!rv.find(function(x){ return x.id === p._id; })) {
      rv.unshift({ id: p._id, title: p.title, price: formatPrice(p.price, p.status), img: p.images && p.images[0] ? p.images[0] : '', url: propUrl });
      localStorage.setItem('recentlyViewed', JSON.stringify(rv.slice(0, 10)));
    }
  } catch(e) {}
}
// No static fallback`;
  html = html.replace(helpersMarker, helpers);
  console.log('Helpers added');
}

// saveRecentlyViewed before return
const returnMarker = "  return '<div class=\"prop-card\"";
if (html.includes(returnMarker)) {
  html = html.replace(returnMarker, "  saveRecentlyViewed(p, propUrl);\r\n  return '<div class=\"prop-card\"");
  console.log('saveRecentlyViewed added');
}

// renderRecentlyViewed after loadProperties
if (!html.includes('renderRecentlyViewed()')) {
  html = html.replace('loadProperties(1);', 'loadProperties(1);\nrenderRecentlyViewed();');
  console.log('renderRecentlyViewed call added');
}

fs.writeFileSync(file, html, 'utf8');
console.log('Done. Size:', html.length);
