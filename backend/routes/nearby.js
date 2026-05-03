const express = require('express');
const router  = express.Router();
const https   = require('https');

// GET /api/nearby?lat=23.01&lng=72.52&type=school
router.get('/', async (req, res) => {
  const { lat, lng, type } = req.query;
  if (!lat || !lng || !type) return res.json({ success: false, elements: [] });

  const tagMap = {
    school:         'amenity=school|amenity=college|amenity=university',
    hospital:       'amenity=hospital|amenity=clinic|amenity=doctors|amenity=pharmacy',
    subway_station: 'railway=station|railway=halt|amenity=bus_station',
    restaurant:     'amenity=restaurant|amenity=cafe|amenity=fast_food',
    bank:           'amenity=bank|amenity=atm',
    supermarket:    'shop=supermarket|shop=mall|amenity=marketplace'
  };

  const radius = type === 'subway_station' ? 5000 : 3000;
  const tags   = (tagMap[type] || `amenity=${type}`).split('|');
  const nodeQ  = tags.map(t => { const [k,v]=t.split('='); return `node["${k}"="${v}"](around:${radius},${lat},${lng});`; }).join('');
  const wayQ   = tags.map(t => { const [k,v]=t.split('='); return `way["${k}"="${v}"](around:${radius},${lat},${lng});`; }).join('');
  const query  = `[out:json][timeout:25];(${nodeQ}${wayQ});out center 50;`;

  try {
    const data = await overpassFetch(query);
    res.json({ success: true, elements: data.elements || [] });
  } catch(e) {
    res.json({ success: false, elements: [] });
  }
});

function overpassFetch(query) {
  return new Promise((resolve, reject) => {
    const body = 'data=' + encodeURIComponent(query);
    const options = {
      hostname: 'overpass-api.de',
      path: '/api/interpreter',
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Content-Length': Buffer.byteLength(body) }
    };
    const req = https.request(options, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => { try { resolve(JSON.parse(data)); } catch(e) { reject(e); } });
    });
    req.on('error', reject);
    req.setTimeout(8000, () => { req.destroy(); reject(new Error('timeout')); });
    req.write(body);
    req.end();
  });
}

module.exports = router;
