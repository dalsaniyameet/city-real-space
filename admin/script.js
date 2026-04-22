const API = (function() {
  if (window.location.protocol === 'file:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:5000/api';
  }
  return 'https://city-real-space.vercel.app/api';
})();

console.log('ðŸ”’ Admin Panel Script - API Endpoint:', API);

// ===== CITY â†’ LOCALITY DATA =====
const cityLocalities = {
  'Ahmedabad': {
    '100 Feet Road':   ['100 Feet Road Satellite','100 Feet Road Bodakdev','100 Feet Road Prahlad Nagar','100 Feet Road Anand Nagar'],
    'Adalaj':          ['Adalaj Village','Adalaj Chokdi','Adalaj GIDC','Near Adalaj Stepwell'],
    'Ambawadi':        ['Ambawadi Circle','Ambawadi Society','Judges Bungalow Road','Nehru Nagar Cross Road'],
    'Ambli':           ['Ambli Village','Ambli Bopal Road','Ambli Cross Road','Near Ambli Metro'],
    'Ashram Road':     ['Ashram Road Main','Income Tax','Ellis Bridge','Navrangpura'],
    'Bavla':           ['Bavla Chokdi','Bavla GIDC','Bavla Village','Near Bavla Highway'],
    'Bhadaj':          ['Bhadaj Village','Bhadaj Road','Near Bhadaj Lake'],
    'Bhat':            ['Bhat Village','Bhat GIDC','Near Bhat Flyover'],
    'Bhuyangdev':      ['Bhuyangdev Cross Road','Bhuyangdev Society','Near Bhuyangdev Temple'],
    'Bodakdev':        ['Bodakdev Cross Road','100 Feet Road Bodakdev','Sindhu Bhavan Road','Judges Bungalow Road'],
    'Bopal':           ['Bopal Chokdi','South Bopal','Ambli Bopal Road','Shilaj','Ghuma','Near Bopal Metro'],
    'CG Road':         ['Navrangpura','Ellisbridge','Paldi','Ambawadi','Swastik Cross Road','Panchvati'],
    'Chanakyapuri':    ['Chanakyapuri Society','Chanakyapuri Cross Road','Near Chanakyapuri Park'],
    'Chandkheda':      ['Chandkheda Gam','Sola Bhagwat','Visat Cross Road','Tragad','Near Chandkheda Metro'],
    'Chandlodia':      ['Chandlodia Village','Chandlodia Cross Road','Near Chandlodia Lake'],
    'Changodar':       ['Changodar GIDC','Changodar Village','Near Changodar Highway'],
    'Dholera':         ['Dholera SIR','Dholera Village','Dholera Smart City Zone'],
    'Drive In Road':   ['Drive In Road Main','Near Drive In Cinema','Memnagar Cross Road'],
    'Ellisbridge':     ['Ellisbridge Main','Ashram Road','Paldi Cross Road','Near Ellisbridge Gymkhana'],
    'Gandhinagar':     ['Sector 1','Sector 5','Sector 11','Sector 21','Infocity','Gift City'],
    'Ghatlodia':       ['Ghatlodia Cross Road','Ghatlodia Society','Near Ghatlodia Lake','Sola Road'],
    'Ghuma':           ['Ghuma Village','Ghuma Cross Road','Near Ghuma Lake'],
    'Gift City':       ['GIFT City Block 1','GIFT City Block 2','GIFT City SEZ','Infocity Road','GIFT City Phase 2'],
    'Gota':            ['Gota Cross Road','Gota Village','Near Gota Flyover','SG Highway Gota'],
    'Gulbai Tekra':    ['Gulbai Tekra Main','Near Gulbai Tekra Market','Paldi Road'],
    'Gurukul':         ['Gurukul Road','Gurukul Cross Road','Drive In Road','Near Gurukul School'],
    'Hebatpur Road':   ['Hebatpur Village','Hebatpur Cross Road','Near Hebatpur Lake'],
    'Income Tax':      ['Income Tax Circle','Ashram Road','Near Income Tax Office','Ellisbridge'],
    'Iscon Ambli Road':['Iscon Cross Road','Iscon Ambli Road','Bopal Road','Near Iscon Temple'],
    'Jagatpur':        ['Jagatpur Village','Jagatpur Road','Near Jagatpur GIDC'],
    'Jivrajpark':      ['Jivrajpark Cross Road','Jivrajpark Society','Near Jivrajpark Metro'],
    'Jodhpur':         ['Jodhpur Cross Road','Jodhpur Village','Satellite Road','Near Jodhpur Park'],
    'Kalol':           ['Kalol Town','Kalol GIDC','Near Kalol Highway'],
    'Koba':            ['Koba Circle','Koba Village','Near Koba Highway','Koba GIDC'],
    'Koteshwar':       ['Koteshwar Village','Koteshwar Road','Near Koteshwar Temple'],
    'Kudasan':         ['Kudasan Village','Kudasan Cross Road','Near Kudasan Highway'],
    'Law Garden':      ['Law Garden Main','Near Law Garden Market','Ellisbridge','Netaji Road'],
    'Makarba':         ['Makarba Village','Makarba Cross Road','Near Makarba Lake','SG Highway'],
    'Manekbaug':       ['Manekbaug Society','Manekbaug Cross Road','Near Manekbaug Hall'],
    'Manipur':         ['Manipur Village','Manipur Cross Road','Near Manipur Lake'],
    'Memnagar':        ['Memnagar Fire Station','Gurukul Road','Drive In Road','Navrangpura','Memnagar Cross Road'],
    'Mithakhali':      ['Mithakhali Cross Road','Mithakhali Six Roads','Near Mithakhali Market'],
    'Motera':          ['Motera Stadium Road','Motera Village','Near Motera Metro','Sabarmati'],
    'Nana Chiloda':    ['Nana Chiloda Village','Nana Chiloda Road','Near Nana Chiloda GIDC'],
    'Naranpura':       ['Naranpura Cross Road','Naranpura Society','Near Naranpura Market'],
    'Navrangpura':     ['CG Road','Navrangpura Cross Road','Swastik Cross Road','Panchvati','Near Navrangpura Market'],
    'Nehru Nagar':     ['Nehru Nagar Cross Road','Nehru Nagar Society','Near Nehru Nagar Market'],
    'New CG Road':     ['New CG Road Main','Near New CG Road Market','Chandkheda'],
    'New Ranip':       ['New Ranip Cross Road','New Ranip Society','Near New Ranip Market'],
    'New Wadaj':       ['New Wadaj Cross Road','New Wadaj Society','Near New Wadaj Market'],
    'Nirnay Nagar':    ['Nirnay Nagar Cross Road','Nirnay Nagar Society','Near Nirnay Nagar Park'],
    'Ognaj':           ['Ognaj Village','Ognaj Cross Road','Near Ognaj Lake'],
    'Paldi':           ['Paldi Cross Road','Paldi Society','Near Paldi Market','Ellisbridge'],
    'Palodia':         ['Palodia Village','Palodia Cross Road','Near Palodia Lake'],
    'Pethapur':        ['Pethapur Village','Pethapur Road','Near Pethapur Highway'],
    'Prahladnagar':    ['Prahlad Nagar Cross Road','Commerce Six Roads','Anand Nagar Cross Road','Satellite Road','100 Feet Road Prahlad Nagar'],
    'Ramdevnagar':     ['Ramdevnagar Cross Road','Ramdevnagar Society','Near Ramdevnagar Market'],
    'Rancharda':       ['Rancharda Village','Rancharda Cross Road','Near Rancharda Lake'],
    'Randesan':        ['Randesan Village','Randesan Cross Road','Near Randesan Highway'],
    'Randheja':        ['Randheja Village','Randheja Road','Near Randheja Highway'],
    'Ranip':           ['Ranip Cross Road','Ranip Society','Near Ranip Market','New Ranip'],
    'Raysan':          ['Raysan Village','Raysan Cross Road','Near Raysan Lake'],
    'Sabarmati':       ['Sabarmati Ashram Road','Sabarmati Cross Road','Near Sabarmati River','Motera'],
    'Sanand':          ['Sanand GIDC','Sanand Town','Near Sanand Highway','Sanand Village'],
    'Sanathal':        ['Sanathal Village','Sanathal Cross Road','Near Sanathal Lake'],
    'Santej':          ['Santej Village','Santej Cross Road','Near Santej Highway'],
    'Sargasan':        ['Sargasan Cross Road','Sargasan Village','Near Sargasan Highway'],
    'Sarkhej':         ['Sarkhej Cross Road','Sarkhej Village','Near Sarkhej Roza','Sarkhej Highway'],
    'Satellite':       ['Satellite Main Road','Jodhpur Cross Road','Ambawadi','Nehru Nagar','Judges Bungalow Road','Commerce Six Roads'],
    'Science City':    ['Science City Road','Near Science City','Sola Road','Thaltej'],
    'SG Road':         ['SG Highway Main','Sola','Gota','Motera','Ranip','Near SG Highway Metro'],
    'Shahibaug':       ['Shahibaug Cross Road','Shahibaug Society','Near Shahibaug Zoo'],
    'Shastrinagar':    ['Shastrinagar Cross Road','Shastrinagar Society','Near Shastrinagar Market'],
    'Shela':           ['Shela Village','Shela Chokdi','Ambli Road Shela','Near Shela Lake'],
    'Shilaj':          ['Shilaj Village','Shilaj Cross Road','Near Shilaj Lake','Ambli Bopal Road'],
    'Shivranjani':     ['Shivranjani Cross Road','Shivranjani Society','Near Shivranjani Metro'],
    'Shyamal':         ['Shyamal Cross Road','Shyamal Society','Near Shyamal Market'],
    'Thaltej':         ['Thaltej Cross Road','SG Highway Thaltej','Sola Road','Science City Road','Near Thaltej Metro'],
    'Thol':            ['Thol Village','Thol Lake Road','Near Thol Bird Sanctuary'],
    'Tragad':          ['Tragad Village','Tragad Cross Road','Near Tragad Lake'],
    'Usmanpura':       ['Usmanpura Cross Road','Usmanpura Society','Near Usmanpura Market'],
    'Vaishno Devi':    ['Vaishno Devi Circle','Near Vaishno Devi Temple','SG Highway'],
    'Vasna':           ['Vasna Cross Road','Vasna Society','Near Vasna Market','Paldi'],
    'Vastrapur':       ['Vastrapur Lake','Vastrapur Cross Road','Judges Bungalow','Bodakdev','Near Vastrapur Metro'],
    'Vavol':           ['Vavol Village','Vavol Cross Road','Near Vavol Lake'],
    'Vejalpur':        ['Vejalpur Cross Road','Vejalpur Society','Near Vejalpur Market'],
    'Zundal':          ['Zundal Village','Zundal Cross Road','Near Zundal Highway']
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

// City change â†’ populate locality
document.getElementById('pCitySelect').addEventListener('change', function() {
  const city = this.value;
  const areaEl = document.getElementById('pAreaSelect');
  const subEl  = document.getElementById('pSubAreaSelect');
  const locs   = Object.keys(cityLocalities[city] || {});
  areaEl.innerHTML = '<option value="">-- Select Locality --</option>' +
    locs.map(l => '<option value="' + l + '">' + l + '</option>').join('') +
    '<option value="__other__">Other (Type Manually)</option>';
  subEl.innerHTML  = '<option value="">-- Select Locality First --</option>';
  document.getElementById('pProject').value  = '';
  document.getElementById('projectDropdown').style.display = 'none';
});

// Locality change â†’ populate sub-area + projects
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
  // Reset project field and refresh dropdown suggestions
  document.getElementById('pProject').value = '';
  document.getElementById('projectDropdown').style.display = 'none';
});

// Sub-area select â†’ fill text input
document.getElementById('pSubAreaSelect').addEventListener('change', function() {
  if (this.value && this.value !== '__other__') {
    document.getElementById('pSubArea') && (document.getElementById('pSubArea').value = this.value);
  }
});

// Project smart combo â€” shows ALL projects from all cities/areas
function onProjectInput(query) {
  var city = document.getElementById('pCitySelect').value;
  var area = document.getElementById('pAreaSelect').value;
  var dropdown = document.getElementById('projectDropdown');
  var q = (query || '').toLowerCase().trim();

  // Collect projects: if city+area selected, show those first; else show ALL
  var projects = [];
  if (city && area && cityData[city] && cityData[city][area]) {
    projects = cityData[city][area].projects || [];
  } else if (city && cityData[city]) {
    // All areas of selected city
    Object.values(cityData[city]).forEach(function(a) {
      if (a.projects) projects = projects.concat(a.projects);
    });
  } else {
    // All cities, all areas
    Object.values(cityData).forEach(function(c) {
      Object.values(c).forEach(function(a) {
        if (a.projects) projects = projects.concat(a.projects);
      });
    });
  }

  // Remove duplicates
  projects = projects.filter(function(v, i, a) { return a.indexOf(v) === i; });

  // Filter by query
  var filtered = q ? projects.filter(function(p) { return p.toLowerCase().indexOf(q) !== -1; }) : projects;

  // Build dropdown
  var items = filtered.slice(0, 30).map(function(p) {
    return '<div onclick="selectProject(\'' + p.replace(/'/g, "\\'") + '\')" ' +
      'style="padding:10px 14px;cursor:pointer;font-size:0.85rem;color:#333;border-bottom:1px solid #f5f5f5;transition:background 0.15s;" ' +
      'onmouseover="this.style.background=\'#fff5f5\'" onmouseout="this.style.background=\'\'">'
      + '<i class="fa-solid fa-building" style="color:#FF4D4D;margin-right:8px;font-size:0.75rem;"></i>' + p + '</div>';
  }).join('');

  // If typed something and no match â€” show "Use: <typed>" option
  if (q && filtered.length === 0) {
    items = '<div onclick="selectProject(\'' + query.replace(/'/g, "\\'") + '\')" ' +
      'style="padding:10px 14px;cursor:pointer;font-size:0.85rem;color:#E53935;border-bottom:1px solid #f5f5f5;transition:background 0.15s;" ' +
      'onmouseover="this.style.background=\'#fff5f5\'" onmouseout="this.style.background=\'\'">'
      + '<i class="fa-solid fa-plus" style="color:#E53935;margin-right:8px;font-size:0.75rem;"></i>Add "' + query + '" manually</div>';
  } else if (q && !filtered.some(function(p) { return p.toLowerCase() === q; })) {
    // Typed something, some matches exist but exact not found â€” add option at bottom
    items += '<div onclick="selectProject(\'' + query.replace(/'/g, "\\'") + '\')" ' +
      'style="padding:10px 14px;cursor:pointer;font-size:0.85rem;color:#E53935;transition:background 0.15s;background:#fff8f8;" ' +
      'onmouseover="this.style.background=\'#fff5f5\'" onmouseout="this.style.background=\'#fff8f8\'">' +
      '<i class="fa-solid fa-plus" style="color:#E53935;margin-right:8px;font-size:0.75rem;"></i>Add "' + query + '" manually</div>';
  }

  if (!items) { dropdown.style.display = 'none'; return; }
  dropdown.innerHTML = items;
  dropdown.style.display = 'block';
}

function selectProject(name) {
  document.getElementById('pProject').value = name;
  document.getElementById('projectDropdown').style.display = 'none';
}

// Close dropdown on outside click
document.addEventListener('click', function(e) {
  var dd = document.getElementById('projectDropdown');
  var inp = document.getElementById('pProject');
  if (dd && inp && !dd.contains(e.target) && e.target !== inp) dd.style.display = 'none';
});

// cityData reference for projects â€” real Ahmedabad societies/projects
const cityData = {
  'Ahmedabad': {
    '100 Feet Road':    { projects: ['Shivalik Sharda','Rajpath Rangoli','Safal Profitaire','Iscon Platinum','Goyal Intercity'] },
    'Adalaj':           { projects: ['Adani Shantigram','Nirma University Township','Vraj Residency','Shree Siddhi Heights'] },
    'Ambawadi':         { projects: ['Goyal Intercity','Rajpath Rangoli','Safal Parisar','Shivalik Sharda'] },
    'Ambli':            { projects: ['Adani Samsara','Goyal Riviera','Rajpath Synfonia','Shivalik Satyamev','Safal Parisar II'] },
    'Ashram Road':      { projects: ['Iscon Platinum','Safal Profitaire','Rajpath Rangoli','Goyal Intercity'] },
    'Bavla':            { projects: ['Bavla Residency','Shree Siddhi Heights','Vraj Homes'] },
    'Bhadaj':           { projects: ['Bhadaj Heights','Shree Residency','Vraj Bungalows'] },
    'Bhat':             { projects: ['Bhat Residency','Shree Heights','Vraj Township'] },
    'Bhuyangdev':       { projects: ['Bhuyangdev Heights','Shree Siddhi Residency','Vraj Homes'] },
    'Bodakdev':         { projects: ['Shivalik Satyamev','Rajpath Synfonia','Adani Samsara','Goyal Riviera','Safal Parisar III'] },
    'Bopal':            { projects: ['Shivalik Satyamev','Goyal Riviera','Adani Samsara','Safal Parisar II','Rajpath Synfonia','Bopal Heights','Vraj Residency'] },
    'CG Road':          { projects: ['Safal Profitaire','Goyal Intercity','Iscon Platinum','Rajpath Rangoli','Shivalik Sharda'] },
    'Chanakyapuri':     { projects: ['Chanakyapuri Heights','Shree Residency','Vraj Homes'] },
    'Chandkheda':       { projects: ['Shivalik Sharda','Adani Shantigram','Nirma Township','Vraj Residency','Chandkheda Heights'] },
    'Chandlodia':       { projects: ['Chandlodia Heights','Shree Siddhi Residency','Vraj Bungalows'] },
    'Changodar':        { projects: ['Changodar Industrial Park','Shree Heights','Vraj Township'] },
    'Dholera':          { projects: ['Dholera SIR Phase 1','Dholera Smart City','Dholera Industrial Zone'] },
    'Drive In Road':    { projects: ['Drive In Heights','Shree Residency','Goyal Intercity II'] },
    'Ellisbridge':      { projects: ['Iscon Platinum','Safal Profitaire','Rajpath Rangoli','Goyal Intercity'] },
    'Ghatlodia':        { projects: ['Ghatlodia Heights','Shree Siddhi Residency','Vraj Homes','Rajpath Synfonia'] },
    'Ghuma':            { projects: ['Ghuma Heights','Shree Residency','Vraj Bungalows','Adani Samsara'] },
    'Gift City':        { projects: ['GIFT One','GIFT Two','GIFT SEZ Tower','Infocity Square','GIFT City Phase 2'] },
    'Gota':             { projects: ['Gota Heights','Shree Siddhi Residency','Vraj Homes','Adani Shantigram'] },
    'Gulbai Tekra':     { projects: ['Gulbai Tekra Heights','Shree Residency','Iscon Platinum'] },
    'Gurukul':          { projects: ['Gurukul Heights','Shree Siddhi Residency','Goyal Intercity','Rajpath Rangoli'] },
    'Hebatpur Road':    { projects: ['Hebatpur Heights','Shree Residency','Vraj Bungalows'] },
    'Income Tax':       { projects: ['Income Tax Heights','Iscon Platinum','Safal Profitaire'] },
    'Iscon Ambli Road': { projects: ['Rajpath Synfonia','Adani Samsara','Shivalik Satyamev','Goyal Riviera','Iscon Platinum'] },
    'Jagatpur':         { projects: ['Jagatpur Heights','Shree Siddhi Residency','Vraj Township'] },
    'Jivrajpark':       { projects: ['Jivrajpark Heights','Shree Residency','Vraj Homes','Safal Parisar'] },
    'Jodhpur':          { projects: ['Jodhpur Heights','Shree Siddhi Residency','Rajpath Rangoli','Goyal Intercity'] },
    'Kalol':            { projects: ['Kalol Heights','Shree Residency','Vraj Township'] },
    'Koba':             { projects: ['Koba Heights','Shree Siddhi Residency','Adani Shantigram','Vraj Homes'] },
    'Koteshwar':        { projects: ['Koteshwar Heights','Shree Residency','Vraj Bungalows'] },
    'Kudasan':          { projects: ['Kudasan Heights','Shree Siddhi Residency','Vraj Township'] },
    'Law Garden':       { projects: ['Law Garden Heights','Iscon Platinum','Safal Profitaire'] },
    'Makarba':          { projects: ['Makarba Heights','Shree Residency','Vraj Homes','Adani Samsara'] },
    'Manekbaug':        { projects: ['Manekbaug Heights','Shree Siddhi Residency','Safal Parisar'] },
    'Manipur':          { projects: ['Manipur Heights','Shree Residency','Vraj Bungalows'] },
    'Memnagar':         { projects: ['Goyal Intercity','Shivalik Sharda','Rajpath Rangoli','Safal Profitaire','Memnagar Heights'] },
    'Mithakhali':       { projects: ['Mithakhali Heights','Iscon Platinum','Safal Profitaire','Goyal Intercity'] },
    'Motera':           { projects: ['Motera Heights','Shree Siddhi Residency','Adani Shantigram','Vraj Homes'] },
    'Nana Chiloda':     { projects: ['Nana Chiloda Heights','Shree Residency','Vraj Township'] },
    'Naranpura':        { projects: ['Naranpura Heights','Shree Siddhi Residency','Goyal Intercity','Rajpath Rangoli'] },
    'Navrangpura':      { projects: ['Safal Profitaire','Goyal Intercity','Iscon Platinum','Rajpath Rangoli','Shivalik Sharda'] },
    'Nehru Nagar':      { projects: ['Nehru Nagar Heights','Shree Residency','Goyal Intercity'] },
    'New CG Road':      { projects: ['New CG Road Heights','Shree Siddhi Residency','Vraj Homes'] },
    'New Ranip':        { projects: ['New Ranip Heights','Shree Residency','Vraj Township'] },
    'New Wadaj':        { projects: ['New Wadaj Heights','Shree Siddhi Residency','Vraj Homes'] },
    'Nirnay Nagar':     { projects: ['Nirnay Nagar Heights','Shree Residency','Vraj Bungalows'] },
    'Ognaj':            { projects: ['Ognaj Heights','Shree Siddhi Residency','Vraj Township'] },
    'Paldi':            { projects: ['Paldi Heights','Shree Residency','Safal Parisar','Goyal Intercity'] },
    'Palodia':          { projects: ['Palodia Heights','Shree Siddhi Residency','Vraj Bungalows','Adani Samsara'] },
    'Pethapur':         { projects: ['Pethapur Heights','Shree Residency','Vraj Township'] },
    'Prahladnagar':     { projects: ['Shivalik Sharda','Adani Shantigram','Safal Profitaire','Iscon Platinum','Rajpath Rangoli','Goyal Intercity'] },
    'Ramdevnagar':      { projects: ['Ramdevnagar Heights','Shree Siddhi Residency','Vraj Homes'] },
    'Rancharda':        { projects: ['Rancharda Heights','Shree Residency','Vraj Bungalows','Adani Samsara'] },
    'Randesan':         { projects: ['Randesan Heights','Shree Siddhi Residency','Vraj Township'] },
    'Randheja':         { projects: ['Randheja Heights','Shree Residency','Vraj Homes'] },
    'Ranip':            { projects: ['Ranip Heights','Shree Siddhi Residency','Vraj Township','Adani Shantigram'] },
    'Raysan':           { projects: ['Raysan Heights','Shree Residency','Vraj Bungalows'] },
    'Sabarmati':        { projects: ['Sabarmati Heights','Shree Siddhi Residency','Adani Shantigram','Vraj Homes'] },
    'Sanand':           { projects: ['Sanand Heights','Shree Residency','Vraj Township','Sanand GIDC Residency'] },
    'Sanathal':         { projects: ['Sanathal Heights','Shree Siddhi Residency','Vraj Bungalows'] },
    'Santej':           { projects: ['Santej Heights','Shree Residency','Vraj Township'] },
    'Sargasan':         { projects: ['Sargasan Heights','Shree Siddhi Residency','Vraj Homes'] },
    'Sarkhej':          { projects: ['Sarkhej Heights','Shree Residency','Vraj Bungalows','Adani Samsara'] },
    'Satellite':        { projects: ['Goyal Intercity','Shivalik Sharda','Rajpath Rangoli','Safal Parisar','Adani Aangan','Iscon Platinum'] },
    'Science City':     { projects: ['Science City Heights','Shree Siddhi Residency','Rajpath Synfonia','Adani Shantigram'] },
    'SG Road':          { projects: ['Adani Aangan','Shivalik Satyamev','Goyal Riviera','Rajpath Synfonia','Safal Parisar'] },
    'Shahibaug':        { projects: ['Shahibaug Heights','Shree Residency','Vraj Homes'] },
    'Shastrinagar':     { projects: ['Shastrinagar Heights','Shree Siddhi Residency','Vraj Township'] },
    'Shela':            { projects: ['Goyal Riviera','Rajpath Rangoli','Safal Parisar','Adani Samsara','Shela Heights'] },
    'Shilaj':           { projects: ['Shilaj Heights','Shree Residency','Vraj Bungalows','Adani Samsara','Goyal Riviera'] },
    'Shivranjani':      { projects: ['Shivranjani Heights','Shree Siddhi Residency','Safal Parisar','Goyal Intercity'] },
    'Shyamal':          { projects: ['Shyamal Heights','Shree Residency','Vraj Homes','Safal Parisar'] },
    'Thaltej':          { projects: ['Shivalik Sharda','Adani Shantigram','Safal Profitaire','Rajpath Rangoli','Thaltej Heights'] },
    'Thol':             { projects: ['Thol Heights','Shree Residency','Vraj Bungalows'] },
    'Tragad':           { projects: ['Tragad Heights','Shree Siddhi Residency','Adani Shantigram','Vraj Homes'] },
    'Usmanpura':        { projects: ['Usmanpura Heights','Shree Residency','Vraj Township'] },
    'Vaishno Devi':     { projects: ['Vaishno Devi Heights','Shree Siddhi Residency','Adani Samsara','Vraj Homes'] },
    'Vasna':            { projects: ['Vasna Heights','Shree Residency','Safal Parisar','Goyal Intercity'] },
    'Vastrapur':        { projects: ['Adani Aangan','Safal Parisar','Goyal Riviera','Shivalik Satyamev','Vastrapur Heights'] },
    'Vavol':            { projects: ['Vavol Heights','Shree Siddhi Residency','Vraj Bungalows'] },
    'Vejalpur':         { projects: ['Vejalpur Heights','Shree Residency','Vraj Homes','Safal Parisar'] },
    'Zundal':           { projects: ['Zundal Heights','Shree Siddhi Residency','Vraj Township'] }
  },
  'Gandhinagar': {
    'Giftcity':  { projects: ['GIFT One','GIFT Two','GIFT SEZ Tower'] },
    'Sector 1':  { projects: ['GDA Sector 1 Residency','Gandhinagar Heights'] },
    'Sector 5':  { projects: ['GDA Sector 5 Residency'] },
    'Sector 11': { projects: ['GDA Sector 11 Residency'] },
    'Sector 21': { projects: ['GDA Sector 21 Residency'] },
    'Infocity':  { projects: ['Infocity Square','Infocity Heights'] }
  },
  'Surat': {
    'Adajan':   { projects: ['Shree Naman Residency','Siddhi Vinayak Tower','Raj Residency'] },
    'Vesu':     { projects: ['Vesu Heights','Bhatar Residency'] },
    'Pal':      { projects: ['Pal Residency','Pal Heights'] },
    'Katargam': { projects: ['Katargam Tower','Ring Road Residency'] },
    'Udhna':    { projects: ['Udhna Heights'] },
    'Althan':   { projects: ['Althan Residency','Bhatar Heights'] }
  },
  'Vadodara': {
    'Alkapuri':       { projects: ['Alkapuri Heights','RC Dutt Residency'] },
    'Gotri':          { projects: ['Gotri Residency','Sama Savli Heights'] },
    'Waghodia Road':  { projects: ['Waghodia Residency'] },
    'Manjalpur':      { projects: ['Manjalpur Heights','Old Padra Residency'] },
    'Fatehgunj':      { projects: ['Fatehgunj Residency'] }
  },
  'Rajkot': {
    'Kalawad Road':       { projects: ['Kalawad Residency','Nana Mava Heights'] },
    'Mavdi':              { projects: ['Mavdi Residency'] },
    'Raiya Road':         { projects: ['Raiya Heights','Raiya Residency'] },
    'University Road':    { projects: ['University Heights','Yagnik Residency'] },
    '150 Feet Ring Road': { projects: ['Ring Road Residency','Bhaktinagar Heights'] }
  }
};

// ===== AUTH GUARD â€” instant check before anything loads =====
const adminToken = localStorage.getItem('adminToken');
const adminUser  = JSON.parse(localStorage.getItem('adminUser') || 'null');
if (!adminToken || !adminUser || adminUser.role !== 'admin') {
  window.location.replace('login.html');
  throw new Error('Unauthorized');
}

// ===== SESSION TIMEOUT â€” 24 hours =====
const SESSION_TIMEOUT = 24 * 60 * 60 * 1000;
let _sessionTimer;

function resetSessionTimer() {
  clearTimeout(_sessionTimer);
  localStorage.setItem('adminLastActive', Date.now());
  _sessionTimer = setTimeout(function() {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    localStorage.removeItem('adminLastActive');
    alert('â° Session expired due to inactivity. Please login again.');
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
  } catch(e) { /* network error â€” keep session */ }
})();

['mousemove','keydown','click','scroll','touchstart'].forEach(function(evt) {
  document.addEventListener(evt, resetSessionTimer, { passive: true });
});
resetSessionTimer();

document.getElementById('adminName').textContent = adminUser ? (adminUser.firstName || 'Admin') : 'Admin';

document.getElementById('adminLogout').addEventListener('click', function(e) {
  e.preventDefault();
  clearTimeout(_sessionTimer);
  // Clear OTP session so next login requires OTP again
  if (adminUser && adminUser.email) {
    localStorage.removeItem('adminOtpVerified_' + adminUser.email);
    localStorage.removeItem('adminOtpToken_'    + adminUser.email);
    localStorage.removeItem('adminOtpUser_'     + adminUser.email);
  }
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
  t.className = 'admin-toast show' + (type === 'error' ? ' error' : type === 'warn' ? ' warn' : type === 'success' ? ' success' : '');
  setTimeout(function() { t.className = 'admin-toast'; }, 4000);
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
  if (name === 'drafts')       loadDrafts();
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
    if (sub.success) {
      const pendingCount = sub.properties.filter(function(p) { return !p.isApproved; }).length;
      document.getElementById('subBadge').textContent = pendingCount || '';
    }
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
  var isCommercial = p.category === 'commercial' || ['office','shop','showroom','warehouse','factory','coworking','industrial_land'].indexOf(p.type) !== -1;
  var typeLabel = { apartment:'Apartment', villa:'Villa', bungalow:'Bungalow', rowhouse:'Row House', plot:'Plot', office:'Office', shop:'Shop', showroom:'Showroom', warehouse:'Warehouse', factory:'Factory', coworking:'Co-working', industrial_land:'Industrial Land' };
  var catBadge = isCommercial
    ? '<span style="color:#60a5fa;font-weight:700;font-size:0.78rem;">Commercial</span><br><small style="color:var(--text3);font-size:0.68rem;">' + (typeLabel[p.type] || p.type) + '</small>'
    : '<span style="color:#34d399;font-weight:700;font-size:0.78rem;">Residential</span><br><small style="color:var(--text3);font-size:0.68rem;">' + (typeLabel[p.type] || p.type) + '</small>';
  var trendBtn = '<button class="act-btn trending' + (p.isFeatured ? ' active' : '') + '" title="' + (p.isFeatured ? 'Remove Trending' : 'Mark Trending') + '" onclick="toggleTrending(\'' + p._id + '\', ' + (p.isFeatured ? 'true' : 'false') + ')" style="' + (p.isFeatured ? 'background:rgba(245,158,11,0.25);color:#f59e0b;box-shadow:0 0 8px rgba(245,158,11,0.3);' : '') + '"><i class="fa-solid fa-fire"></i></button>';
  // Listing Score
  var score = calcPropScore(p);
  var sc = score >= 75 ? '#10b981' : score >= 50 ? '#3b82f6' : score >= 25 ? '#f59e0b' : '#ef4444';
  var sb = score >= 75 ? 'rgba(16,185,129,0.12)' : score >= 50 ? 'rgba(59,130,246,0.12)' : score >= 25 ? 'rgba(245,158,11,0.12)' : 'rgba(239,68,68,0.12)';
  var sl = score >= 75 ? 'Ã°Å¸â€Â¥' : score >= 50 ? 'Ã¢Å¡Â¡' : score >= 25 ? 'Ã¢Å¡Â Ã¯Â¸Â' : 'Ã°Å¸â€œâ€°';
  var scoreBadge = '<div style="display:inline-flex;align-items:center;gap:4px;background:' + sb + ';color:' + sc + ';font-size:0.65rem;font-weight:800;padding:2px 8px;border-radius:20px;margin-top:3px;">' + sl + ' ' + score + '/100</div>';
  return '<tr>' +
    '<td><div style="display:flex;align-items:center;gap:10px">' +
    (p.images && p.images[0] ? '<img src="' + p.images[0] + '" class="prop-thumb" alt=""/>' : '<div style="width:48px;height:36px;background:rgba(255,255,255,0.05);border-radius:6px;display:flex;align-items:center;justify-content:center;color:#555"><i class="fa-solid fa-image"></i></div>') +
    '<div class="prop-info"><strong>' + p.title + '</strong><span>' + (p.isFeatured ? 'Ã°Å¸â€Â¥ ' : '') + (p.agent && p.agent.name ? p.agent.name : '') + '</span>' + scoreBadge + '</div></div></td>' +
    '<td style="white-space:normal">' + catBadge + '</td>' +
    '<td>' + (p.location ? p.location.area + ', ' + p.location.city : 'Ã¢â‚¬â€') + '</td>' +
    '<td><strong>' + (p.priceLabel || 'Ã¢â€šÂ¹' + p.price) + '</strong></td>' +
    '<td><span class="badge ' + (p.status === 'for-sale' ? 'badge-green' : p.status === 'for-rent' ? 'badge-blue' : 'badge-orange') + '">' + p.status + '</span></td>' +
    '<td><span class="badge ' + (p.isApproved ? 'badge-green' : 'badge-orange') + '">' + (p.isApproved ? 'Approved' : 'Pending') + '</span></td>' +
    '<td><div class="act-btns">' +
    (!p.isApproved ? '<button class="act-btn approve" title="Approve" onclick="approveProperty(\'' + p._id + '\')"><i class="fa-solid fa-check"></i></button>' : '') +
    trendBtn +
    '<button class="act-btn edit" title="Edit" onclick="editPropertyById(\'' + p._id + '\')"><i class="fa-solid fa-pen"></i></button>' +
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
  const emptyMsg = { residential: 'No residential properties found.', commercial: 'No commercial properties found.', trending: 'No trending properties. Click ðŸ”¥ on any property to mark it trending.' };
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
  btn.addEventListener('click', function(e) {
    e.stopPropagation();
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
  var ppsfReset = document.getElementById('pPricePerSqft');
  if (ppsfReset) { ppsfReset.value = ''; ppsfReset.dataset.manual = '0'; }
  var ppsfHint = document.getElementById('pricePerSqftHint');


  var plReset = document.getElementById('pPriceLabel'); if (plReset) { plReset.value = ''; plReset.dataset.manual = ''; }


  var unitReset = document.getElementById('pPriceUnit');
  if (unitReset) unitReset.value = 'cr';
  // RERA default
  var reraReset = document.getElementById('pReraNo');
  if (reraReset) reraReset.value = 'NTC Reg No: 12376';
  // Possession default + auto date
  var possReset = document.getElementById('pPossession');
  if (possReset) { possReset.value = 'Ready to Move'; autoAvailDate('Ready to Move'); }
  var avReset = document.getElementById('pAvailDate');
  if (avReset) avReset.dataset.manual = '';
  // Reset dynamic dropdowns
  document.getElementById('pAreaSelect').innerHTML = '<option value="">-- Select City First --</option>';
  document.getElementById('pSubAreaSelect').innerHTML = '<option value="">-- Select Locality First --</option>';
  document.getElementById('pProject').value = '';
  document.getElementById('projectDropdown').style.display = 'none';
  // Reset stepper to step 1
  document.querySelectorAll('.step-panel').forEach(function(p) { p.classList.remove('active','slide-back'); });
  document.querySelectorAll('.stepper-step').forEach(function(t) { t.classList.remove('active','done'); });
  document.getElementById('step-1').classList.add('active');
  document.getElementById('step-tab-1').classList.add('active');
  updateStepperProgress(1);
  initAmenitiesGrid([]);
  _ascPrev = -1;
  filterPropertyTypeByCategory('residential');
  updateAdminScore();
  openModal('propModal');
});

function editProperty(p) {
  var ex = p.extraDetails || {};
  // ===== EDIT MODE: Lock structural fields, only allow editable ones =====


  document.getElementById('propModalTitle').textContent = 'Edit Property';
  document.getElementById('propId').value   = p._id;
  document.getElementById('pTitle').value   = p.title || '';
  document.getElementById('pPriceLabel').value = p.priceLabel || '';
  document.getElementById('pPrice').value   = p.price || '';
  if (p.price) {
    var ap = p.price;
    var unitEl2 = document.getElementById('pPriceUnit');
    var priceEl2 = document.getElementById('pPrice');
    if (ap >= 10000000) {
      if (unitEl2) unitEl2.value = 'cr';
      if (priceEl2) priceEl2.value = parseFloat((ap/10000000).toFixed(4).replace(/\.?0+$/,''));
    } else if (ap >= 100000) {
      if (unitEl2) unitEl2.value = 'lakh';
      if (priceEl2) priceEl2.value = parseFloat((ap/100000).toFixed(4).replace(/\.?0+$/,''));
    } else if (ap >= 1000) {
      if (unitEl2) unitEl2.value = 'k';
      if (priceEl2) priceEl2.value = parseFloat((ap/1000).toFixed(2).replace(/\.?0+$/,''));
    } else {
      if (unitEl2) unitEl2.value = 'rs';
      if (priceEl2) priceEl2.value = ap;
    }
    _actualPrice = ap;
    var plEl = document.getElementById('pPriceLabel');
    if (plEl) { plEl.value = p.priceLabel || ''; plEl.dataset.manual = p.priceLabel ? '1' : ''; }
    autoPriceLabel();
  }
  document.getElementById('pType').value    = p.type  || '';
  document.getElementById('pDesc').value    = p.description || '';
  document.getElementById('pFeatured').checked = p.isFeatured  || false;
  document.getElementById('pApproved').checked = p.isApproved  || false;
  document.getElementById('pAgentName').value  = p.agent ? p.agent.name  : '';
  document.getElementById('pAgentPhone').value = p.agent ? p.agent.phone : '';
  document.getElementById('pToken').value      = ex.tokenAmount || '';
  document.getElementById('pPossession').value = ex.possession  || 'Ready to Move';
  document.getElementById('pReraNo') && (document.getElementById('pReraNo').value = ex.reraNo || '');

  // ===== STEP 3 MISSING FIELDS =====
  // Deposit toggle
  var depositVal = ex.deposit || 'None';
  document.getElementById('pDeposit') && (document.getElementById('pDeposit').value = depositVal);
  document.querySelectorAll('.hs-toggle-btn').forEach(function(b) {
    var oc = b.getAttribute('onclick') || '';
    if (oc.indexOf("'pDeposit'") !== -1) b.classList.toggle('active', oc.indexOf("'" + depositVal + "'") !== -1);
  });
  // Availability date
  document.getElementById('pAvailDate') && (document.getElementById('pAvailDate').value = ex.availDate || ex.availFrom || '');
  var avEditEl = document.getElementById('pAvailDate');
  if (avEditEl) avEditEl.dataset.manual = avEditEl.value ? '1' : '';
  // Floor / Total Floors (step 3 fields)
  document.getElementById('pFloor')       && (document.getElementById('pFloor').value       = ex.floor       || '');
  document.getElementById('pTotalFloors') && (document.getElementById('pTotalFloors').value = ex.totalFloors || '');
  // Sell pricing
  var allInc = ex.allInclusive || 'Yes';
  var negot  = ex.negotiable   || 'Yes';
  var taxCh  = ex.taxCharges   || 'Included';
  document.getElementById('pAllInclusive')     && (document.getElementById('pAllInclusive').value     = allInc);
  document.getElementById('pNegotiable')       && (document.getElementById('pNegotiable').value       = negot);
  document.getElementById('pTaxCharges')       && (document.getElementById('pTaxCharges').value       = taxCh);
  document.getElementById('pBookingAmount')    && (document.getElementById('pBookingAmount').value    = ex.bookingAmount    || '');
  document.getElementById('pMaintenance')      && (document.getElementById('pMaintenance').value      = ex.maintenance      || '');
  document.getElementById('pAnnualDues')       && (document.getElementById('pAnnualDues').value       = ex.annualDues       || '');
  document.getElementById('pMembershipCharge') && (document.getElementById('pMembershipCharge').value = ex.membershipCharge || '');
  // Sell pricing toggles
  [['pAllInclusive', allInc], ['pNegotiable', negot], ['pTaxCharges', taxCh]].forEach(function(pair) {
    document.querySelectorAll('.hs-toggle-btn').forEach(function(b) {
      var oc = b.getAttribute('onclick') || '';
      if (oc.indexOf("'" + pair[0] + "'") !== -1) b.classList.toggle('active', oc.indexOf("'" + pair[1] + "'") !== -1);
    });
  });
  // Rent pricing
  document.getElementById('rMaintenance')  && (document.getElementById('rMaintenance').value  = ex.maintenance_rent || '');
  document.getElementById('rLockIn')       && (document.getElementById('rLockIn').value       = ex.lockIn           || '');
  document.getElementById('rNoticePeriod') && (document.getElementById('rNoticePeriod').value = ex.noticePeriod     || '');
  document.getElementById('rRentIncrease') && (document.getElementById('rRentIncrease').value = ex.rentIncrease     || '');
  var brokVal = ex.brokerage || 'None';
  document.getElementById('rBrokerage') && (document.getElementById('rBrokerage').value = brokVal);
  document.querySelectorAll('.hs-toggle-btn').forEach(function(b) {
    var oc = b.getAttribute('onclick') || '';
    if (oc.indexOf("'rBrokerage'") !== -1) b.classList.toggle('active', oc.indexOf("'" + brokVal + "'") !== -1);
  });
  // Commercial lease terms
  document.getElementById('cLockIn')       && (document.getElementById('cLockIn').value       = ex.cLockIn       || ex.lockIn       || '');
  document.getElementById('cNoticePeriod') && (document.getElementById('cNoticePeriod').value = ex.cNoticePeriod || ex.noticePeriod || '');
  document.getElementById('cRentIncrease') && (document.getElementById('cRentIncrease').value = ex.cRentIncrease || ex.rentIncrease || '');
  var cBrokVal = ex.cBrokerage || ex.brokerage || 'None';
  document.getElementById('cBrokerage') && (document.getElementById('cBrokerage').value = cBrokVal);
  document.querySelectorAll('.hs-toggle-btn').forEach(function(b) {
    var oc = b.getAttribute('onclick') || '';
    if (oc.indexOf("'cBrokerage'") !== -1) b.classList.toggle('active', oc.indexOf("'" + cBrokVal + "'") !== -1);
  });
  // Step 4 fields
  document.getElementById('pVideoUrl')     && (document.getElementById('pVideoUrl').value     = p.videoUrl     || '');
  document.getElementById('pPricePerSqft') && (document.getElementById('pPricePerSqft').value = p.pricePerSqft || '');
  var ppsfEl = document.getElementById('pPricePerSqft');
  if (ppsfEl) ppsfEl.dataset.manual = p.pricePerSqft ? '1' : '0';

  // Commercial lift fields
  // Office area fields
  document.getElementById('oCarpet') && (document.getElementById('oCarpet').value = ex.oCarpet || ex.carpetArea || '');
  document.getElementById('oSBA')    && (document.getElementById('oSBA').value    = ex.oSBA    || ex.superBuiltUp || (p.specs && p.specs.sqft ? p.specs.sqft : '') || '');
  // Sync to nonResAreaRow fields (shown for commercial/plot)
  setTimeout(function() {
    var carpetVal = String(ex.oCarpet || ex.carpetArea || '');
    var sbaVal    = String(ex.oSBA   || ex.superBuiltUp || (p.specs && p.specs.sqft ? p.specs.sqft : '') || '');
    var pSqftCarpetEl = document.getElementById('pSqftCarpet');
    var pSqftEl       = document.getElementById('pSqft');
    if (pSqftCarpetEl) pSqftCarpetEl.value = carpetVal;
    if (pSqftEl)       pSqftEl.value       = sbaVal;
    updateAdminScore();
  }, 300);

  document.getElementById('cLiftPassenger') && (document.getElementById('cLiftPassenger').value = ex.commLiftPassenger || '');
  document.getElementById('cLiftService')   && (document.getElementById('cLiftService').value   = ex.commLiftService   || '');
  document.getElementById('cLiftCommon')    && (document.getElementById('cLiftCommon').value    = ex.commLiftCommon    || '');
  document.getElementById('oLiftCommon')       && (document.getElementById('oLiftCommon').value       = ex.officeLiftPassenger || '');
  document.getElementById('oLiftOwner')        && (document.getElementById('oLiftOwner').value        = ex.officeLiftService   || '');
  document.getElementById('oLiftOwnerPrivate') && (document.getElementById('oLiftOwnerPrivate').value = ex.officeLiftOwner     || '');
  document.getElementById('cTotalFloors')   && (document.getElementById('cTotalFloors').value   = ex.commTotalFloors   || '');
  document.getElementById('cYourFloor')     && (document.getElementById('cYourFloor').value     = ex.commYourFloor     || '');
  if (ex.commParking) {
    document.getElementById('cParking') && (document.getElementById('cParking').value = ex.commParking);
    document.querySelectorAll('.hs-toggle-btn').forEach(function(b) {
      var oc = b.getAttribute('onclick') || '';
      if (oc.indexOf("'cParking'") !== -1) b.classList.toggle('active', oc.indexOf("'" + ex.commParking + "'") !== -1);
    });
  }

  // Category toggle
  var cat = p.category || 'residential';
  document.getElementById('pCategory').value = cat;
  document.querySelectorAll('.hs-toggle-btn').forEach(function(b) {
    var oc = b.getAttribute('onclick') || '';
    if (oc.indexOf("'pCategory'") !== -1) b.classList.toggle('active', oc.indexOf("'" + cat + "'") !== -1);
  });
  filterPropertyTypeByCategory(cat);
  // Restore pType after filterPropertyTypeByCategory resets it
  var pTypeEl = document.getElementById('pType');
  if (pTypeEl) {
    pTypeEl.querySelectorAll('option,optgroup').forEach(function(o) { o.disabled = false; o.style.display = ''; });
    pTypeEl.value = p.type || '';
  }
  updateAdminTypeFields();

  // ===== Fill all residential fields AFTER type fields are shown =====
  setTimeout(function() {
    // BHK chips
    var bedsVal2 = String(p.specs && p.specs.beds ? (p.specs.beds >= 4 ? '4' : p.specs.beds) : '');
    document.getElementById('pBeds').value = bedsVal2;
    document.querySelectorAll('#bhkChips .hs-chip').forEach(function(c) {
      c.classList.toggle('active', c.textContent.trim().startsWith(bedsVal2));
    });
    function setChip2(chipsId, val) {
      var el = document.getElementById(chipsId); if (!el) return;
      el.value = String(val);
      var chips = el.closest('.hs-field') ? el.closest('.hs-field').querySelectorAll('.hs-chip') : [];
      chips.forEach(function(c) {
        c.classList.toggle('active',
          c.textContent.trim() === String(val) ||
          (String(val) >= '4' && c.textContent.trim() === '4+') ||
          (String(val) >= '5' && c.textContent.trim() === '5+')
        );
      });
    }
    setChip2('rBeds',      ex.beds      || (p.specs && p.specs.beds  ? p.specs.beds  : ''));
    setChip2('rBaths',     ex.baths     || (p.specs && p.specs.baths ? p.specs.baths : ''));
    setChip2('rBalconies', ex.balconies || '0');
    // Area
    var rCarpetEl = document.getElementById('rCarpet'); if (rCarpetEl) rCarpetEl.value = ex.carpetArea || '';
    var rSBAEl    = document.getElementById('rSBA');    if (rSBAEl)    rSBAEl.value    = ex.superBuiltUp || (p.specs && p.specs.sqft ? p.specs.sqft : '');
    var pSqftEl   = document.getElementById('pSqft');   if (pSqftEl)   pSqftEl.value   = ex.superBuiltUp || (p.specs && p.specs.sqft ? p.specs.sqft : '');
    // Floor
    var rFloorEl = document.getElementById('rFloor'); if (rFloorEl) rFloorEl.value = ex.floor || '';
    var rTFEl    = document.getElementById('rTotalFloors'); if (rTFEl) rTFEl.value = ex.totalFloors || '';
    document.getElementById('pFloor')       && (document.getElementById('pFloor').value       = ex.floor       || '');
    document.getElementById('pTotalFloors') && (document.getElementById('pTotalFloors').value = ex.totalFloors || '');
    // Lift
    var liftVal2 = ex.lift || 'Available';
    document.getElementById('rLift') && (document.getElementById('rLift').value = liftVal2);
    document.querySelectorAll('.hs-toggle-btn').forEach(function(b) {
      var oc = b.getAttribute('onclick') || '';
      if (oc.indexOf("'rLift'") !== -1) b.classList.toggle('active', oc.indexOf("'" + liftVal2 + "'") !== -1);
    });
    // Parking
    var covP2 = ex.coveredParking || '0', openP2 = ex.openParking || '0';
    var covEl2 = document.getElementById('rCoveredParking');
    if (covEl2) { covEl2.value = covP2; var cd2 = document.getElementById('rCoveredParkingDisplay'); if (cd2) cd2.textContent = covP2; }
    var opEl2 = document.getElementById('rOpenParking');
    if (opEl2)  { opEl2.value = openP2; var od2 = document.getElementById('rOpenParkingDisplay');    if (od2) od2.textContent = openP2; }
    // Facing / Ownership / Age
    var rFacingEl = document.getElementById('rFacing'); if (rFacingEl) rFacingEl.value = ex.facing || '';
    var rOwnEl    = document.getElementById('rOwnership'); if (rOwnEl) rOwnEl.value = ex.ownership || '';
    var rAgeEl    = document.getElementById('rAge'); if (rAgeEl) rAgeEl.value = ex.ageOfProperty || '';
    document.getElementById('pAgeOfProperty') && (document.getElementById('pAgeOfProperty').value = ex.ageOfProperty || '');
    // Furnishing
    var furnVal2 = ex.furnished || ex.oFurnishing || 'Unfurnished';
    document.getElementById('rFurnishing') && (document.getElementById('rFurnishing').value = furnVal2);
    document.getElementById('pFurnished')  && (document.getElementById('pFurnished').value  = furnVal2);
    document.querySelectorAll('.hs-toggle-btn').forEach(function(b) {
      var oc = b.getAttribute('onclick') || '';
      if (oc.indexOf('setResFurnishing') !== -1) b.classList.toggle('active', oc.indexOf("'" + furnVal2 + "'") !== -1);
    });
    var fi2 = document.getElementById('furnishingItems');
    if (fi2) fi2.style.display = (furnVal2 === 'Unfurnished') ? 'none' : 'block';
    // Available From / Suitable For
    var rAFEl = document.getElementById('rAvailFrom'); if (rAFEl) rAFEl.value = ex.availFrom || '';
    var rSFEl = document.getElementById('rSuitableFor');
    if (rSFEl) {
      rSFEl.value = ex.suitableFor || 'Family';
      document.querySelectorAll('.hs-toggle-btn').forEach(function(b) {
        var oc = b.getAttribute('onclick') || '';
        if (oc.indexOf("'rSuitableFor'") !== -1) b.classList.toggle('active', oc.indexOf("'" + (ex.suitableFor||'Family') + "'") !== -1);
      });
    }
    // Amenity toggles
    function setToggle2(fieldId, val) {
      var el = document.getElementById(fieldId); if (!el || !val) return;
      el.value = val;
      document.querySelectorAll('.hs-toggle-btn').forEach(function(b) {
        var oc = b.getAttribute('onclick') || '';
        if (oc.indexOf("'" + fieldId + "'") !== -1) b.classList.toggle('active', oc.indexOf("'" + val + "'") !== -1);
      });
    }
    setToggle2('rSecurity',    ex.security    || 'Yes');
    setToggle2('rCCTV',        ex.cctv        || 'Yes');
    setToggle2('rWater',       ex.waterSupply || '24x7');
    setToggle2('rPowerBackup', ex.powerBackup || 'Yes');
    setToggle2('rGarden',      ex.garden      || 'Not Available');
    setToggle2('rGymPool',     ex.gymPool     || 'Not Available');
    // Amenities checkboxes
    initAmenitiesGrid(p.amenities || []);

    // ===== OFFICE FIELDS FILL =====
    if (p.type === 'office' || p.type === 'coworking') {
      var el = function(id){ return document.getElementById(id); };
      el('oCarpet') && (el('oCarpet').value = ex.oCarpet || ex.carpetArea || '');
      el('oSBA')    && (el('oSBA').value    = ex.oSBA    || ex.superBuiltUp || (p.specs&&p.specs.sqft?p.specs.sqft:'') || '');
      el('oCabins')          && (el('oCabins').value          = ex.oCabins          || '');
      el('oMinSeats')        && (el('oMinSeats').value        = ex.oMinSeats        || '');
      el('oMaxSeats')        && (el('oMaxSeats').value        = ex.oMaxSeats        || '');
      el('oWorkstations')    && (el('oWorkstations').value    = ex.oWorkstations    || '');
      el('oConferenceRooms') && (el('oConferenceRooms').value = ex.oConferenceRooms || '');
      el('oStaircase')       && (el('oStaircase').value       = ex.oStaircase       || '');
      el('oTotalFloors')     && (el('oTotalFloors').value     = ex.oTotalFloors     || ex.commTotalFloors || '');
      el('oYourFloor')       && (el('oYourFloor').value       = ex.oYourFloor       || ex.commYourFloor  || '');
      el('oLiftCommon')      && (el('oLiftCommon').value      = ex.officeLiftPassenger || '');
      el('oLiftOwner')       && (el('oLiftOwner').value       = ex.officeLiftService   || '');
      el('oLiftOwnerPrivate')&& (el('oLiftOwnerPrivate').value= ex.officeLiftOwner     || '');
      el('oOwnership')  && (el('oOwnership').value  = ex.oOwnership  || '');
      el('oPrevUsed')   && (el('oPrevUsed').value   = ex.oPrevUsed   || '');
      el('oSuitableFor')&& (el('oSuitableFor').value= ex.oSuitableFor|| '');
      el('oWashMale')   && (el('oWashMale').checked   = ex.oWashMale   || false);
      el('oWashFemale') && (el('oWashFemale').checked = ex.oWashFemale || false);
      el('oWashCommon') && (el('oWashCommon').checked = ex.oWashCommon || false);
      var meetVal = String(ex.oMeetingRooms || '0');
      el('oMeetingRooms') && (el('oMeetingRooms').value = meetVal);
      var tgls = [['oReception',ex.oReception||'No'],['oPantry',ex.oPantry||'No'],['oFurnishing',ex.oFurnishing||'Unfurnished'],['oAC',ex.oAC||'None'],['oParking',ex.oParking||'Not Available'],['oFireNOC',ex.oFireNOC||'No'],['oOccupancy',ex.oOccupancy||'No'],['oUPS',ex.oUPS||'No']];
      tgls.forEach(function(t){
        el(t[0]) && (el(t[0]).value = t[1]);
        document.querySelectorAll('.hs-toggle-btn').forEach(function(b){
          var oc=b.getAttribute('onclick')||'';
          if(oc.indexOf(t[0])!==-1) b.classList.toggle('active',oc.indexOf(t[1])!==-1);
        });
      });
      document.querySelectorAll('.hs-toggle-btn').forEach(function(b){
        var oc=b.getAttribute('onclick')||'';
        if(oc.indexOf('setMeetingRooms')!==-1) b.classList.toggle('active',oc.indexOf(meetVal)!==-1);
      });
    }

    // Score update
    updateAdminScore();
  }, 150);

  // Status toggle
  var status = p.status || 'for-sale';
  document.getElementById('pStatus').value = status;
  document.querySelectorAll('.hs-toggle-btn').forEach(function(b) {
    var oc = b.getAttribute('onclick') || '';
    if (oc.indexOf("'pStatus'") !== -1) b.classList.toggle('active', oc.indexOf("'" + status + "'") !== -1);
  });

  // City Ã¢â€ â€™ Locality Ã¢â€ â€™ SubArea
  var city    = p.location ? p.location.city : '';
  var area    = p.location ? p.location.area : '';
  var subArea = ex.subArea || '';
  var cityEl  = document.getElementById('pCitySelect');
  cityEl.value = city;
  var locs = Object.keys(cityLocalities[city] || {});
  var areaEl = document.getElementById('pAreaSelect');
  areaEl.innerHTML = '<option value="">-- Select Locality --</option>' +
    locs.map(function(l){ return '<option value="' + l + '">' + l + '</option>'; }).join('') +
    '<option value="__other__">Other (Type Manually)</option>';
  areaEl.value = area;
  var subs = (cityLocalities[city] && cityLocalities[city][area]) || [];
  var subEl = document.getElementById('pSubAreaSelect');
  subEl.innerHTML = '<option value="">-- Select Sub Area --</option>' +
    subs.map(function(s){ return '<option value="' + s + '">' + s + '</option>'; }).join('') +
    '<option value="__other__">Other (Type Manually)</option>';
  subEl.value = subArea;
  document.getElementById('pProject').value = ex.project || '';
  updateStepperProgress(1);

  // Type fields + amenities
  updateAdminTypeFields();
  onAdminTypeChange();
  // For commercial/plot: show nonResAreaRow explicitly
  var isCommOrPlot = ['office','shop','showroom','warehouse','factory','coworking','industrial_land','plot'].indexOf(p.type) !== -1;
  var nrr = document.getElementById('nonResAreaRow');
  if (nrr) nrr.style.display = isCommOrPlot ? '' : 'none';
  initAmenitiesGrid(p.amenities || []);

  // Score
  _ascPrev = -1;
  updateAdminScore();

  // Images
  var preview = document.getElementById('pImagePreview');
  preview.innerHTML = '';
  if (p.images && p.images.length) {
    p.images.forEach(function(url) {
      var item = document.createElement('div');
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
  // Final validation before submit
  const requiredChecks = [
    { id:'pCitySelect', msg:'City is required' },
    { id:'pAreaSelect', msg:'Locality is required' },
    { id:'pType',       msg:'Property type is required' },
    { id:'pPrice',      msg:'Price is required' },
    { id:'pTitle',      msg:'Property title is required (min 5 chars)' },
  ];
  document.querySelectorAll('.hs-field-error').forEach(el => el.classList.remove('hs-field-error'));
  document.querySelectorAll('.hs-error-msg').forEach(el => el.remove());
  let firstErr = null;
  for (const c of requiredChecks) {
    const el = document.getElementById(c.id);
    const val = el ? el.value.trim() : '';
    const invalid = !val || (c.id === 'pPrice' && !(Number(val) > 0)) || (c.id === 'pTitle' && val.length < 5);
    if (invalid) {
      const wrap = el && el.closest('.hs-field');
      if (wrap) {
        wrap.classList.add('hs-field-error');
        const err = document.createElement('div');
        err.className = 'hs-error-msg';
        err.innerHTML = '<i class="fa-solid fa-circle-exclamation"></i> ' + c.msg;
        wrap.appendChild(err);
      }
      if (!firstErr) firstErr = el;
    }
  }
  if (firstErr) {
    // Navigate to the step that has the error
    const stepMap = { pCitySelect:1, pAreaSelect:1, pType:1, pPrice:3, pTitle:4 };
    const errStep = stepMap[firstErr.id] || 1;
    const curActive = document.querySelector('.step-panel.active');
    const curNum = curActive ? parseInt(curActive.id.replace('step-','')) : 1;
    if (curNum !== errStep) {
      document.querySelectorAll('.step-panel').forEach(p => p.classList.remove('active','slide-back'));
      document.querySelectorAll('.stepper-step').forEach(t => t.classList.remove('active'));
      document.getElementById('step-' + errStep).classList.add('active');
      document.getElementById('step-tab-' + errStep).classList.add('active');
      updateStepperProgress(errStep);
    }
    firstErr.scrollIntoView({ behavior:'smooth', block:'center' });
    toast('Please fill all required fields', 'error');
    return;
  }
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
    price: _actualPrice > 0 ? _actualPrice : Number(document.getElementById('pPrice').value),
    type: document.getElementById('pType').value,
    category: document.getElementById('pCategory').value,
    status: document.getElementById('pStatus').value,
    location: {
      area: document.getElementById('pAreaSelect').value === '__other__' ? '' : (document.getElementById('pAreaSelect').value || ''),
      city: document.getElementById('pCitySelect').value
    },
    specs: {
      beds:  Number(document.getElementById('rBeds').value  || document.getElementById('pBeds').value  || 0),
      baths: Number(document.getElementById('rBaths').value || document.getElementById('pBaths').value || 0),
      sqft:  Number(document.getElementById('rSBA').value || document.getElementById('pSqft').value || (document.getElementById('oSBA')?document.getElementById('oSBA').value:0) || (document.getElementById('oCarpet')?document.getElementById('oCarpet').value:0) || 0)
    },
    agent: { name: document.getElementById('pAgentName').value, phone: document.getElementById('pAgentPhone').value, initials: document.getElementById('pAgentName').value.split(' ').map(function(w){return w[0];}).join('').toUpperCase() },
    images: imageUrls,
    description: document.getElementById('pDesc').value,
    isFeatured: document.getElementById('pFeatured').checked,
    isApproved: document.getElementById('pApproved').checked,
    videoUrl: document.getElementById('pVideoUrl') ? document.getElementById('pVideoUrl').value : '',
    pricePerSqft: document.getElementById('pPricePerSqft') ? Number(document.getElementById('pPricePerSqft').value) || 0 : 0,
    amenities: getSelectedAmenities(),
    extraDetails: {
      // Basic
      subArea:      document.getElementById('pSubAreaSelect').value !== '__other__' ? document.getElementById('pSubAreaSelect').value : '',
      project:      document.getElementById('pProject').value,
      possession:   document.getElementById('pPossession').value,
      tokenAmount:  document.getElementById('pToken').value,
      // Residential
      beds:         document.getElementById('rBeds').value,
      baths:        document.getElementById('rBaths').value,
      balconies:    document.getElementById('rBalconies').value || '0',
      carpetArea:   Number(document.getElementById('rCarpet').value) || Number((document.getElementById('oCarpet')||{value:0}).value) || 0,
      superBuiltUp: Number(document.getElementById('rSBA').value)    || Number((document.getElementById('oSBA')||{value:0}).value)    || 0,
      floor:        document.getElementById('rFloor') ? document.getElementById('rFloor').value : '',
      totalFloors:  document.getElementById('rTotalFloors') ? document.getElementById('rTotalFloors').value : '',
      furnished:    (function(){
        var cat = document.getElementById('pCategory') ? document.getElementById('pCategory').value : 'residential';
        if (cat === 'commercial') {
          return (document.getElementById('oFurnishing') ? document.getElementById('oFurnishing').value : '') || 'Unfurnished';
        }
        return (document.getElementById('rFurnishing') ? document.getElementById('rFurnishing').value : '') || (document.getElementById('pFurnished') ? document.getElementById('pFurnished').value : '') || 'Unfurnished';
      })(),
      facing:       document.getElementById('rFacing').value,
      ownership:    document.getElementById('rOwnership').value,
      lift:         document.getElementById('rLift').value,
      coveredParking: document.getElementById('rCoveredParking').value || '0',
      openParking:    document.getElementById('rOpenParking').value   || '0',
      ageOfProperty:  document.getElementById('rAge').value || document.getElementById('pAgeOfProperty').value,
      availFrom:    document.getElementById('rAvailFrom') ? document.getElementById('rAvailFrom').value : '',
      suitableFor:  document.getElementById('rSuitableFor') ? document.getElementById('rSuitableFor').value : '',
      // Amenities toggles
      security:     document.getElementById('rSecurity')    ? document.getElementById('rSecurity').value    : '',
      cctv:         document.getElementById('rCCTV')        ? document.getElementById('rCCTV').value        : '',
      waterSupply:  document.getElementById('rWater')       ? document.getElementById('rWater').value       : '',
      powerBackup:  document.getElementById('rPowerBackup') ? document.getElementById('rPowerBackup').value : '',
      garden:       document.getElementById('rGarden')      ? document.getElementById('rGarden').value      : '',
      gymPool:      document.getElementById('rGymPool')     ? document.getElementById('rGymPool').value     : '',
      // Sell pricing
      allInclusive:     document.getElementById('pAllInclusive')     ? document.getElementById('pAllInclusive').value     : '',
      negotiable:       document.getElementById('pNegotiable')       ? document.getElementById('pNegotiable').value       : '',
      taxCharges:       document.getElementById('pTaxCharges')       ? document.getElementById('pTaxCharges').value       : '',
      bookingAmount:    document.getElementById('pBookingAmount')    ? Number(document.getElementById('pBookingAmount').value)    : 0,
      maintenance:      document.getElementById('pMaintenance')      ? Number(document.getElementById('pMaintenance').value)      : 0,
      annualDues:       document.getElementById('pAnnualDues')       ? Number(document.getElementById('pAnnualDues').value)       : 0,
      membershipCharge: document.getElementById('pMembershipCharge') ? Number(document.getElementById('pMembershipCharge').value) : 0,
      // Rent
      maintenance_rent: document.getElementById('rMaintenance')  ? Number(document.getElementById('rMaintenance').value)  : 0,
      lockIn:           document.getElementById('rLockIn')        ? document.getElementById('rLockIn').value        : '',
      noticePeriod:     document.getElementById('rNoticePeriod')  ? document.getElementById('rNoticePeriod').value  : '',
      brokerage:        document.getElementById('rBrokerage')     ? document.getElementById('rBrokerage').value     : '',
      reraNo:           document.getElementById('pReraNo')        ? document.getElementById('pReraNo').value        : '',
      // Commercial lift fields
      commLiftPassenger: document.getElementById('cLiftPassenger') ? Number(document.getElementById('cLiftPassenger').value) || 0 : 0,
      commLiftService:   document.getElementById('cLiftService')   ? Number(document.getElementById('cLiftService').value)   || 0 : 0,
      commLiftCommon:    document.getElementById('cLiftCommon')    ? Number(document.getElementById('cLiftCommon').value)    || 0 : 0,
      // Office lift fields
      officeLiftPassenger: document.getElementById('oLiftCommon')       ? Number(document.getElementById('oLiftCommon').value)       || 0 : 0,
      officeLiftService:   document.getElementById('oLiftOwner')        ? Number(document.getElementById('oLiftOwner').value)        || 0 : 0,
      officeLiftOwner:     document.getElementById('oLiftOwnerPrivate') ? Number(document.getElementById('oLiftOwnerPrivate').value) || 0 : 0,
      commTotalFloors:   document.getElementById('cTotalFloors')   ? document.getElementById('cTotalFloors').value   : '',
      commYourFloor:     document.getElementById('cYourFloor')     ? document.getElementById('cYourFloor').value     : '',
      // Office specific fields
      oCabins:       document.getElementById('oCabins')       ? Number(document.getElementById('oCabins').value)       || 0 : 0,
      oMinSeats:     document.getElementById('oMinSeats')     ? Number(document.getElementById('oMinSeats').value)     || 0 : 0,
      oMaxSeats:     document.getElementById('oMaxSeats')     ? Number(document.getElementById('oMaxSeats').value)     || 0 : 0,
      oWorkstations: document.getElementById('oWorkstations') ? Number(document.getElementById('oWorkstations').value) || 0 : 0,
      oConferenceRooms: document.getElementById('oConferenceRooms') ? Number(document.getElementById('oConferenceRooms').value) || 0 : 0,
      oMeetingRooms: document.getElementById('oMeetingRooms') ? document.getElementById('oMeetingRooms').value : '',
      oReception:    document.getElementById('oReception')    ? document.getElementById('oReception').value    : '',
      oPantry:       document.getElementById('oPantry')       ? document.getElementById('oPantry').value       : '',
      oFurnishing:   document.getElementById('oFurnishing')   ? document.getElementById('oFurnishing').value   : '',
      oAC:           document.getElementById('oAC')           ? document.getElementById('oAC').value           : '',
      oWashMale:     document.getElementById('oWashMale')     ? document.getElementById('oWashMale').checked   : false,
      oWashFemale:   document.getElementById('oWashFemale')   ? document.getElementById('oWashFemale').checked : false,
      oWashCommon:   document.getElementById('oWashCommon')   ? document.getElementById('oWashCommon').checked : false,
      oTotalFloors:  document.getElementById('oTotalFloors')  ? document.getElementById('oTotalFloors').value  : '',
      oYourFloor:    document.getElementById('oYourFloor')    ? document.getElementById('oYourFloor').value    : '',
      oStaircase:    document.getElementById('oStaircase')    ? Number(document.getElementById('oStaircase').value) || 0 : 0,
      oParking:      document.getElementById('oParking')      ? document.getElementById('oParking').value      : '',
      oFireNOC:      document.getElementById('oFireNOC')      ? document.getElementById('oFireNOC').value      : '',
      oOccupancy:    document.getElementById('oOccupancy')    ? document.getElementById('oOccupancy').value    : '',
      oUPS:          document.getElementById('oUPS')          ? document.getElementById('oUPS').value          : '',
      oOwnership:    document.getElementById('oOwnership')    ? document.getElementById('oOwnership').value    : '',
      oPrevUsed:     document.getElementById('oPrevUsed')     ? document.getElementById('oPrevUsed').value     : '',
      oSuitableFor:  document.getElementById('oSuitableFor')  ? document.getElementById('oSuitableFor').value  : '',
      oCarpet:       document.getElementById('oCarpet')       ? Number(document.getElementById('oCarpet').value) || 0 : 0,
      oSBA:          document.getElementById('oSBA')          ? Number(document.getElementById('oSBA').value)   || 0 : 0,
      commParking:       document.getElementById('cParking')       ? document.getElementById('cParking').value       : ''
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
    toast(isFeatured ? 'Removed from Trending!' : 'ðŸ”¥ Added to Trending!');
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

  // Mark correct filter button as active
  var btnMap = { residential:'btnResidential', commercial:'btnCommercial', trending:'btnTrending' };
  document.querySelectorAll('#page-properties .fbtn').forEach(function(b) { b.classList.remove('active'); });
  var activeBtn = document.getElementById(btnMap[cat]);
  if (activeBtn) activeBtn.classList.add('active');

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
    tbody.innerHTML = '<tr><td colspan="8"><div class="empty-state"><i class="fa-solid fa-fire"></i><p>No trending properties yet.<br><small>Click ðŸ”¥ fire button on any property to mark it trending.</small></p></div></td></tr>';
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
  const pending = data.properties.filter(function(p){return !p.isApproved;}).length;
  document.getElementById('subBadge').textContent = pending || '';
  tbody.innerHTML = data.properties.map(function(p) {
    const postedName = p.postedBy ? ((p.postedBy.firstName || '') + ' ' + (p.postedBy.lastName || '')).trim() || p.postedBy.name || 'â€”' : 'â€”';
    const postedPhone = p.postedBy ? (p.postedBy.phone || 'â€”') : 'â€”';
    const postedRole  = p.postedBy ? (p.postedBy.role || '') : '';
    return '<tr>' +
      '<td><div style="display:flex;align-items:center;gap:10px">' +
      (p.images && p.images[0] ? '<img src="' + p.images[0] + '" class="prop-thumb"/>' : '<div style="width:48px;height:36px;background:#f0f0f0;border-radius:6px;display:flex;align-items:center;justify-content:center;color:#ccc"><i class="fa-solid fa-image"></i></div>') +
      '<div class="prop-info"><strong>' + (p.title || 'Untitled') + '</strong><span style="color:var(--text3);font-size:0.7rem">' + (p.type || '') + (p.category ? ' â€¢ ' + p.category : '') + '</span></div></div></td>' +
      '<td><strong style="color:var(--text)">' + postedName + '</strong>' + (postedRole ? '<br><span style="font-size:0.68rem;color:var(--text3)">' + postedRole + '</span>' : '') + '</td>' +
      '<td><a href="tel:' + postedPhone + '" style="color:#60a5fa;font-weight:600;font-size:0.82rem">' + postedPhone + '</a></td>' +
      '<td>' + (p.location ? (p.location.area || '') + (p.location.city ? ', ' + p.location.city : '') : 'â€”') + '</td>' +
      '<td><strong>' + (p.priceLabel || (p.price ? 'â‚¹' + Number(p.price).toLocaleString('en-IN') : 'â€”')) + '</strong></td>' +
      '<td>' + listingBadgeHtml(p) + '</td>' +
      '<td><span class="badge ' + (p.isApproved ? 'badge-green' : 'badge-orange') + '">' + (p.isApproved ? 'Approved' : 'Pending') + '</span></td>' +
      '<td>' + fmtDate(p.createdAt) + '</td>' +
      '<td><div class="act-btns">' +
      (!p.isApproved ? '<button class="act-btn approve" title="Approve" onclick="approveSubmission(\'' + p._id + '\')"><i class="fa-solid fa-check"></i></button>' : '') +
      '<button class="act-btn edit" title="Edit" onclick="editSubmissionById(\'' + p._id + '\')"><i class="fa-solid fa-pen"></i></button>' +
      '<button class="act-btn del" onclick="deleteSubmission(\'' + p._id + '\')"><i class="fa-solid fa-trash"></i></button>' +
      '</div></td></tr>';
  }).join('');
}

async function approveSubmission(id) {
  const data = await api('PUT', '/properties/' + id + '/approve');
  if (data.success) { toast('Approved! âœ…'); loadSubmissions(); loadStats(); loadNotifications(); }
  else toast(data.message || 'Error', 'error');
}

function editSubmissionById(id) {
  // Load the submission and open edit modal
  api('GET', '/user-properties').then(function(data) {
    if (!data.success) return;
    const p = data.properties.find(function(x) { return x._id === id; });
    if (!p) { toast('Property not found', 'error'); return; }
    editProperty(p);
  });
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
      ? '<span style="background:#e8f5e9;color:#2e7d32;font-size:0.65rem;font-weight:800;padding:2px 8px;border-radius:20px;border:1px solid #a5d6a7;">ðŸŸ¢ ' + seoScore + '</span>'
      : seoScore >= 50
      ? '<span style="background:#fff3e0;color:#e65100;font-size:0.65rem;font-weight:800;padding:2px 8px;border-radius:20px;border:1px solid #ffcc80;">ðŸŸ¡ ' + seoScore + '</span>'
      : '<span style="background:#ffebee;color:#c62828;font-size:0.65rem;font-weight:800;padding:2px 8px;border-radius:20px;border:1px solid #ef9a9a;">ðŸ”´ ' + seoScore + '</span>';
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
    pb.innerHTML = '<i class="fa-solid fa-fire"></i> SEO Ready â€” Publish!';
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
      '<td><strong style="color:#E53935">' + (i.refId || 'â€”') + '</strong></td>' +
      '<td><strong>' + i.name + '</strong><br><small style="color:#aaa">' + (i.email || '') + '</small></td>' +
      '<td><a href="tel:+91' + i.phone + '" style="color:#1565c0;font-weight:600;display:flex;align-items:center;gap:5px"><i class="fa-solid fa-phone" style="font-size:0.7rem"></i>+91 ' + i.phone + '</a></td>' +
      '<td><span class="badge ' + (isOffer ? 'badge-orange' : 'badge-blue') + '">' + (i.lookingFor || 'â€”') + '</span></td>' +
      '<td>' + (propName
        ? '<div style="background:#fff8e1;border:1.5px solid #ffe082;border-radius:8px;padding:6px 10px;max-width:180px">' +
          '<div style="font-size:0.7rem;color:#f57f17;font-weight:700;margin-bottom:2px"><i class="fa-solid fa-building" style="margin-right:4px"></i>PROPERTY</div>' +
          '<div style="font-size:0.82rem;color:#333;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis" title="' + propName + '">' + propName + '</div>' +
          (i.city ? '<div style="font-size:0.72rem;color:#888;margin-top:2px"><i class="fa-solid fa-location-dot" style="color:#E53935;margin-right:3px"></i>' + i.city + '</div>' : '') +
          '</div>'
        : '<span style="color:#aaa">â€”</span>') + '</td>' +
      '<td>' + (i.city || 'â€”') + '</td>' +
      '<td>' + (i.budget || 'â€”') + '</td>' +
      '<td><select onchange="updateInqStatus(\'' + i._id + '\', this.value)" style="border:1.5px solid #e8e8e8;border-radius:7px;padding:4px 8px;font-size:0.78rem;font-family:Poppins,sans-serif;outline:none;cursor:pointer;">' +
      '<option value="new"' + (i.status==='new'?' selected':'') + '>ðŸ”´ New</option>' +
      '<option value="contacted"' + (i.status==='contacted'?' selected':'') + '>ðŸŸ¡ Contacted</option>' +
      '<option value="closed"' + (i.status==='closed'?' selected':'') + '>ðŸŸ¢ Closed</option>' +
      '</select></td>' +
      '<td>' + (i.createdAt ? fmtDate(i.createdAt) : 'â€”') + '</td>' +
      '<td><div class="act-btns">' +
      '<a href="https://wa.me/91' + i.phone + '?text=' + encodeURIComponent('Hi ' + i.name + ', regarding your inquiry' + (propName ? ' for "' + propName + '"' : '') + ' â€” City Real Space team is here to help!') + '" target="_blank" class="act-btn approve" title="WhatsApp"><i class="fa-brands fa-whatsapp"></i></a>' +
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
        '<td>' + (r.propertyType || 'â€”') + '</td>' +
        '<td>' + (r.budget || 'â€”') + '</td>' +
        '<td>' + (r.city || 'â€”') + '</td>' +
        '<td style="max-width:180px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' + (r.message || 'â€”') + '</td>' +
        '<td><select onchange="updateInqStatus(\'' + r._id + '\',this.value)" style="border:1.5px solid #e8e8e8;border-radius:7px;padding:4px 8px;font-size:0.78rem;font-family:Poppins,sans-serif;outline:none;cursor:pointer">' +
        '<option value="new"' + (r.status === 'new' ? ' selected' : '') + '>ðŸ”´ New</option>' +
        '<option value="contacted"' + (r.status === 'contacted' ? ' selected' : '') + '>ðŸŸ¡ Contacted</option>' +
        '<option value="closed"' + (r.status === 'closed' ? ' selected' : '') + '>ðŸŸ¢ Closed</option>' +
        '</select></td>' +
        '<td>' + fmtDate(r.createdAt) + '</td>' +
        '<td><div class="act-btns">' +
        '<a href="https://wa.me/91' + r.phone + '?text=' + encodeURIComponent('Hi ' + r.name + ', we received your property requirement. Our team will help you find the best match!') + '" target="_blank" class="act-btn approve" title="WhatsApp"><i class="fa-brands fa-whatsapp"></i></a>' +
        '<button class="act-btn edit" title="Add Property for this User" onclick="addPropertyForReq(\'' + encodeURIComponent(r.name||'') + '\',\'' + (r.phone||'') + '\',\'' + encodeURIComponent(r.propertyType||'') + '\',\'' + encodeURIComponent(r.city||'') + '\',\'' + encodeURIComponent(r.budget||'') + '\')" style="background:rgba(99,102,241,0.15);color:#a5b4fc;"><i class="fa-solid fa-plus"></i></button>' +
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

// ===== ADD PROPERTY FOR REQUIREMENT =====
function addPropertyForReq(encName, phone, encType, encCity, encBudget) {
  const name   = decodeURIComponent(encName);
  const type   = decodeURIComponent(encType);
  const city   = decodeURIComponent(encCity);
  const budget = decodeURIComponent(encBudget);
  // Switch to properties page first, then open modal
  goPage('properties');
  setTimeout(function() {
    document.getElementById('propModalTitle').textContent = 'Add Property â€” For ' + name;
    document.getElementById('propForm').reset();
    document.getElementById('propId').value = '';
    document.getElementById('pApproved').checked = true;
    document.getElementById('pImage').value = '';
    document.getElementById('pImagePreview').innerHTML = '';
    document.getElementById('pAreaSelect').innerHTML = '<option value="">-- Select City First --</option>';
    document.getElementById('pSubAreaSelect').innerHTML = '<option value="">-- Select Locality First --</option>';
    document.getElementById('pSubArea').value = '';
    document.querySelectorAll('.step-panel').forEach(p => p.classList.remove('active','slide-back'));
    document.querySelectorAll('.stepper-step').forEach(t => t.classList.remove('active','done'));
    document.getElementById('step-1').classList.add('active');
    document.getElementById('step-tab-1').classList.add('active');
    updateStepperProgress(1);
    initAmenitiesGrid([]);
    _ascPrev = -1;
    // Pre-fill city
    if (city) {
      const cityEl = document.getElementById('pCitySelect');
      cityEl.value = city;
      cityEl.dispatchEvent(new Event('change'));
    }
    // Pre-fill property type
    const typeMap = {
      'Apartment / Flat':'apartment','Villa':'villa','Bungalow':'bungalow',
      'Row House':'rowhouse','Plot / Land':'plot','Office Space':'office',
      'Shop / Showroom':'shop','Warehouse':'warehouse'
    };
    const pType = typeMap[type] || '';
    if (pType) { document.getElementById('pType').value = pType; onAdminTypeChange(); }
    // Pre-fill agent
    document.getElementById('pAgentName').value  = name;
    document.getElementById('pAgentPhone').value = phone;
    // Info banner
    const existing = document.getElementById('reqBanner');
    if (existing) existing.remove();
    const banner = document.createElement('div');
    banner.id = 'reqBanner';
    banner.style.cssText = 'background:linear-gradient(135deg,rgba(99,102,241,0.12),rgba(139,92,246,0.08));border:1px solid rgba(99,102,241,0.3);border-radius:10px;padding:12px 16px;margin-bottom:16px;font-size:0.78rem;color:#a5b4fc;display:flex;align-items:center;gap:8px;';
    banner.innerHTML = '<i class="fa-solid fa-bell" style="color:#a5b4fc"></i><span>Requirement from: <strong>' + name + '</strong> (+91 ' + phone + ')' + (budget ? ' | Budget: ' + budget : '') + '</span>';
    const step1 = document.getElementById('step-1');
    step1.insertBefore(banner, step1.firstChild);
    updateAdminScore();
    openModal('propModal');
  }, 150);
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
      '<td>' + (u.city || 'â€”') + '</td>' +
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

// ===== BHK SQFT AUTO-SUGGEST DATA =====
const BHK_SQFT = {
  apartment: { '1': [450,650],  '2': [850,1200],  '3': [1200,1800], '4': [1800,2800] },
  villa:     { '1': [1200,1800],'2': [1800,2500],  '3': [2500,3500], '4': [3500,5000] },
  bungalow:  { '1': [1500,2000],'2': [2000,3000],  '3': [3000,4500], '4': [4500,7000] },
  rowhouse:  { '1': [800,1200], '2': [1200,1800],  '3': [1800,2800], '4': [2800,4000] },
  plot: {}, office: {}, shop: {}, showroom: {}, warehouse: {}, factory: {}, coworking: {}, industrial_land: {},
};

const TYPE_AREA_LABEL = {
  apartment:       'ðŸ“ Super Built-up Area (sq.ft)',
  villa:           'ðŸ“ Built-up Area (sq.ft)',
  bungalow:        'ðŸ“ Built-up Area (sq.ft)',
  rowhouse:        'ðŸ“ Built-up Area (sq.ft)',
  plot:            'ðŸ“ Plot Area (sq.ft)',
  office:          'ðŸ“ Carpet Area (sq.ft)',
  shop:            'ðŸ“ Carpet Area (sq.ft)',
  showroom:        'ðŸ“ Carpet Area (sq.ft)',
  warehouse:       'ðŸ“ Built-up Area (sq.ft)',
  factory:         'ðŸ“ Built-up / Plot Area (sq.ft)',
  coworking:       'ðŸ“ Carpet Area (sq.ft)',
  industrial_land: 'ðŸ“ Land Area (sq.ft)',
};

function onAdminTypeChange() {
  updateAdminTypeFields();
  showSqftSuggest();
}

// BHK auto-fill data
const BHK_AUTO = {
  apartment: {
    '1': { beds:1, baths:1, balconies:1, carpet:[450,550],  sba:[580,700]  },
    '2': { beds:2, baths:2, balconies:1, carpet:[750,950],  sba:[950,1200] },
    '3': { beds:3, baths:2, balconies:2, carpet:[1050,1300],sba:[1300,1600]},
    '4': { beds:4, baths:3, balconies:2, carpet:[1500,1900],sba:[1900,2500]},
  },
  villa: {
    '1': { beds:1, baths:1, balconies:1, carpet:[900,1200], sba:[1200,1600]},
    '2': { beds:2, baths:2, balconies:1, carpet:[1400,1800],sba:[1800,2400]},
    '3': { beds:3, baths:3, balconies:2, carpet:[2000,2600],sba:[2600,3400]},
    '4': { beds:4, baths:4, balconies:3, carpet:[3000,4000],sba:[3800,5000]},
  },
  bungalow: {
    '1': { beds:1, baths:1, balconies:0, carpet:[1200,1600],sba:[1600,2000]},
    '2': { beds:2, baths:2, balconies:1, carpet:[1800,2400],sba:[2200,3000]},
    '3': { beds:3, baths:3, balconies:2, carpet:[2600,3400],sba:[3200,4200]},
    '4': { beds:4, baths:4, balconies:2, carpet:[3500,5000],sba:[4200,6000]},
  },
  rowhouse: {
    '1': { beds:1, baths:1, balconies:0, carpet:[700,1000], sba:[900,1300] },
    '2': { beds:2, baths:2, balconies:1, carpet:[1100,1500],sba:[1400,1900]},
    '3': { beds:3, baths:2, balconies:2, carpet:[1600,2200],sba:[2000,2800]},
    '4': { beds:4, baths:3, balconies:2, carpet:[2400,3200],sba:[3000,4000]},
  },
};

// ===== COMMERCIAL oSBA → oCarpet + PricePerSqft AUTO =====
document.addEventListener('DOMContentLoaded', function() {
  var oSBAEl = document.getElementById('oSBA');
  if (oSBAEl) {
    oSBAEl.addEventListener('input', function() {
      autoCommCarpet(this.value);
      var pSqft = document.getElementById('pSqft');
      if (pSqft) pSqft.value = this.value;
      calcPricePerSqft();
      updateAdminScore();
    });
  }
  var oCarpetEl = document.getElementById('oCarpet');
  if (oCarpetEl) {
    oCarpetEl.addEventListener('input', function() {
      this.dataset.manual = 1;
      calcPricePerSqft();
    });
  }
});

// ===== AUTO COMMERCIAL CARPET FROM SBA =====
function autoCommCarpet(sbaVal) {
  var sba = parseFloat(sbaVal);
  var carpetEl = document.getElementById('oCarpet');
  if (!carpetEl || carpetEl.dataset.manual == '1') return;
  if (!sba) { carpetEl.value = ''; return; }
  // Real estate standard: Carpet = SBA x 0.70 (30% loading factor)
  carpetEl.value = Math.round(sba * 0.70);
}

// ===== AUTO PRICE PER SQFT =====
function calcPricePerSqft() {
  var priceEl = document.getElementById('pPricePerSqft');
  var hint    = document.getElementById('pricePerSqftHint');
  if (!priceEl || priceEl.dataset.manual == '1') return;

  // Rent property ke liye auto-calculate mat karo
  var status = document.getElementById('pStatus') ? document.getElementById('pStatus').value : 'for-sale';
  if (status === 'for-rent') { priceEl.value = ''; if (hint) hint.style.display = 'none'; return; }

  var price = _actualPrice > 0 ? _actualPrice : Number(document.getElementById('pPrice') ? document.getElementById('pPrice').value : 0);

  // SBA: residential rSBA, commercial oSBA, fallback pSqft
  var sqft = Number(document.getElementById('rSBA')  ? document.getElementById('rSBA').value  : 0) ||
             Number(document.getElementById('oSBA')  ? document.getElementById('oSBA').value  : 0) ||
             Number(document.getElementById('pSqft') ? document.getElementById('pSqft').value : 0);

  if (!price || !sqft) { if (hint) hint.style.display = 'none'; return; }

  var ppsf = Math.round(price / sqft);
  priceEl.value = ppsf;

  var segment = ppsf < 3000  ? 'Budget segment' :
                ppsf < 5000  ? 'Mid segment' :
                ppsf < 8000  ? 'Premium segment' :
                ppsf < 15000 ? 'Luxury segment' : 'Ultra Luxury';

  var msg = '\u20b9' + ppsf.toLocaleString('en-IN') + '/sq.ft  •  ' + price.toLocaleString('en-IN') + ' ÷ ' + sqft + ' sqft  •  ' + segment;
  if (hint) { hint.textContent = msg; hint.style.display = 'block'; }
}

// ===== AUTO AVAILABILITY DATE FROM POSSESSION =====
function autoAvailDate(possession) {
  var dateEl = document.getElementById('pAvailDate');
  var hint   = document.getElementById('availDateHint');
  if (!dateEl) return;

  // Agar user ne manually date set ki ho to override mat karo
  if (dateEl.dataset.manual) return;

  var today = new Date();
  var d;
  var msg = '';

  if (possession === 'Ready to Move') {
    // Aaj se 7 din baad — immediate possession
    d = new Date(today);
    d.setDate(d.getDate() + 7);
    msg = 'Ready to Move — 7 din mein available';
  } else if (possession === 'Under Construction') {
    // 18 months baad — typical UC delivery
    d = new Date(today);
    d.setMonth(d.getMonth() + 18);
    msg = 'Under Construction — ~18 months mein possession';
  } else if (possession === 'New Launch') {
    // 24 months baad — new launch
    d = new Date(today);
    d.setMonth(d.getMonth() + 24);
    msg = 'New Launch — ~24 months mein possession';
  }

  if (d) {
    var yyyy = d.getFullYear();
    var mm   = String(d.getMonth() + 1).padStart(2, '0');
    var dd   = String(d.getDate()).padStart(2, '0');
    dateEl.value = yyyy + '-' + mm + '-' + dd;
    if (hint) { hint.textContent = msg; hint.style.display = 'block'; }
  }
}

// Mark availDate as manually set if user types
document.addEventListener('DOMContentLoaded', function() {
  var avEl = document.getElementById('pAvailDate');
  if (avEl) avEl.addEventListener('change', function() { this.dataset.manual = '1'; });
  // Auto-set RERA if empty on modal open
  var reraEl = document.getElementById('pReraNo');
  if (reraEl && !reraEl.value) reraEl.value = 'NTC Reg No: 12376';
});

// ===== AUTO PRICE LABEL =====
function autoPriceLabel() {
  var val = document.getElementById('pPrice') ? document.getElementById('pPrice').value : '';
  var unit = document.getElementById('pPriceUnit') ? document.getElementById('pPriceUnit').value : 'rs';
  var n = parseFloat(val);
  var helper = document.getElementById('priceHelper');
  var helperText = document.getElementById('priceHelperText');
  var labelEl = document.getElementById('pPriceLabel');
  if (!helper || !helperText) return;
  if (!n || isNaN(n)) { helper.style.display = 'none'; return; }

  var status = document.getElementById('pStatus') ? document.getElementById('pStatus').value : 'for-sale';
  var isRent = status === 'for-rent';

  // Convert to actual rupees based on unit
  var actualAmount = n;
  if (unit === 'cr')    actualAmount = n * 10000000;
  else if (unit === 'lakh') actualAmount = n * 100000;
  else if (unit === 'k')    actualAmount = n * 1000;

  // Set actual value in hidden field for saving
  document.getElementById('pPrice').dataset.actual = actualAmount;

  // Human readable label
  var label = '';
  if (unit === 'cr')         label = '\u20b9' + n + ' Cr';
  else if (unit === 'lakh')  label = '\u20b9' + n + ' Lakh';
  else if (unit === 'k')     label = '\u20b9' + n + 'K';
  else {
    // Auto-detect for raw rupees
    if (actualAmount >= 10000000)     label = '\u20b9' + (actualAmount/10000000).toFixed(2).replace(/\.?0+$/,'') + ' Cr';
    else if (actualAmount >= 100000)  label = '\u20b9' + (actualAmount/100000).toFixed(2).replace(/\.?0+$/,'') + ' Lakh';
    else if (actualAmount >= 1000)    label = '\u20b9' + (actualAmount/1000).toFixed(1).replace(/\.?0+$/,'') + 'K';
    else                              label = '\u20b9' + actualAmount.toLocaleString('en-IN');
  }
  if (isRent) label += '/mo';

  // Helper text â€” full breakdown
  var breakdown = '\u20b9' + actualAmount.toLocaleString('en-IN');
  if (unit === 'cr')        breakdown += ' (' + n + ' Crore)';
  else if (unit === 'lakh') breakdown += ' (' + n + ' Lakh)';
  else if (unit === 'k')    breakdown += ' (' + n + ' Thousand)';

  helperText.textContent = breakdown;
  helper.style.display = 'flex';

  // Auto-fill label only if user hasn't manually typed
  if (labelEl && !labelEl.dataset.manual) {
    labelEl.value = label;
  }

  // Update actual price field value for saving
  _actualPrice = actualAmount;
  updateAdminScore();
}

function adjParking(fieldId, delta) {
  var inp = document.getElementById(fieldId);
  if (!inp) return;
  var cur = parseInt(inp.value) || 0;
  cur = Math.max(0, cur + delta);
  inp.value = cur;
  var disp = document.getElementById(fieldId + 'Display');
  if (disp) disp.textContent = cur;
}

function syncCommArea(inp) {
  var v = inp.value;
  var oC = document.getElementById('oCarpet');
  if (oC) oC.value = v;
  document.getElementById('pSqft').value = v;
  updateAdminScore();
}

function syncSBAtoMain() {
  var sba = document.getElementById('rSBA');
  var pSqft = document.getElementById('pSqft');
  if (pSqft && sba) pSqft.value = sba.value;
  calcPricePerSqft();
  updateAdminScore();
}

function hsChipBhk(chip, val) {
  chip.closest('.hs-chips').querySelectorAll('.hs-chip').forEach(c => c.classList.remove('active'));
  chip.classList.add('active');
  document.getElementById('pBeds').value = val;

  // Auto-fill Bedrooms, Bathrooms, Balconies in residentialFields
  var type = document.getElementById('pType').value;
  var key  = val === '4' ? '4' : val; // treat 4+ as 4
  var data = BHK_AUTO[type] && BHK_AUTO[type][key];

  if (data) {
    // --- Bedrooms chip ---
    var bedsStr = String(data.beds);
    var rBedsEl = document.getElementById('rBeds');
    if (rBedsEl) {
      rBedsEl.value = bedsStr;
      var bedsChips = document.getElementById('rBedsChips');
      if (bedsChips) bedsChips.querySelectorAll('.hs-chip').forEach(function(c) {
        c.classList.toggle('active', c.textContent.trim() === bedsStr || (data.beds >= 5 && c.textContent.trim() === '5+'));
      });
    }

    // --- Bathrooms chip ---
    var bathsStr = String(data.baths);
    var rBathsEl = document.getElementById('rBaths');
    if (rBathsEl) {
      rBathsEl.value = bathsStr;
      var bathChips = rBathsEl.closest('.hs-field').querySelectorAll('.hs-chip');
      bathChips.forEach(function(c) {
        c.classList.toggle('active', c.textContent.trim() === bathsStr || (data.baths >= 4 && c.textContent.trim() === '4+'));
      });
    }

    // --- Balconies chip ---
    var balStr = String(data.balconies);
    var rBalEl = document.getElementById('rBalconies');
    if (rBalEl) {
      rBalEl.value = balStr;
      var balChips = rBalEl.closest('.hs-field').querySelectorAll('.hs-chip');
      balChips.forEach(function(c) {
        c.classList.toggle('active', c.textContent.trim() === balStr || (data.balconies >= 3 && c.textContent.trim() === '3+'));
      });
    }

    // --- Carpet Area auto-fill (mid value) ---
    var carpetMid = Math.round((data.carpet[0] + data.carpet[1]) / 2);
    var rCarpetEl = document.getElementById('rCarpet');
    if (rCarpetEl && !rCarpetEl.value) {
      rCarpetEl.value = carpetMid;
    }

    // --- Super Built-up Area auto-fill ---
    var sbaMid = Math.round((data.sba[0] + data.sba[1]) / 2);
    var rSBAEl = document.getElementById('rSBA');
    if (rSBAEl && !rSBAEl.value) rSBAEl.value = sbaMid;

    // --- pSqft (main area field) auto-fill ---
    var pSqftEl = document.getElementById('pSqft');
    if (pSqftEl && !pSqftEl.value) pSqftEl.value = sbaMid;

    // --- Show area hint banner ---
    var hint = document.getElementById('sqftHint');
    if (hint) {
      hint.textContent = 'ðŸ’¡ ' + val + ' BHK ' + (type||'') + ': Carpet ' + data.carpet[0] + 'â€“' + data.carpet[1] + ' | SBA ' + data.sba[0] + 'â€“' + data.sba[1] + ' sq.ft';
      hint.style.display = 'block';
    }
  }

  showSqftSuggest();
  updateAdminScore();
}

function showSqftSuggest() {
  const type  = document.getElementById('pType').value;
  const beds  = document.getElementById('pBeds').value;
  const hint  = document.getElementById('sqftHint');
  const box   = document.getElementById('sqftSuggest');
  if (!hint || !box) return;

  const ranges = BHK_SQFT[type];
  if (!ranges || !beds || !ranges[beds]) {
    hint.style.display = 'none';
    box.style.display  = 'none';
    return;
  }
  const [lo, hi] = ranges[beds];
  const mid = Math.round((lo + hi) / 2);
  const suggestions = [lo, mid, hi];

  hint.textContent = 'ðŸ’¡ Typical ' + beds + ' BHK ' + (type||'') + ': ' + lo + 'â€“' + hi + ' sq.ft';
  hint.style.display = 'block';

  box.innerHTML = suggestions.map(s =>
    '<div onclick="document.getElementById(\'pSqft\').value=' + s + ';document.getElementById(\'sqftSuggest\').style.display=\'none\';updateAdminScore()" ' +
    'style="padding:8px 14px;cursor:pointer;font-size:0.82rem;font-weight:600;color:#FF4D4D;border-bottom:1px solid #fff5f5;transition:background 0.15s" ' +
    'onmouseover="this.style.background=\'#fff5f5\'" onmouseout="this.style.background=\'\'">ðŸ“ ' + s + ' sq.ft</div>'
  ).join('');
  box.style.display = 'block';

  // Auto-fill mid value if field is empty
  const sqftEl = document.getElementById('pSqft');
  if (!sqftEl.value) {
    sqftEl.value = mid;
    updateAdminScore();
  }
}

// Close suggest on outside click
document.addEventListener('click', function(e) {
  const box = document.getElementById('sqftSuggest');
  if (box && !box.contains(e.target) && e.target.id !== 'pSqft') box.style.display = 'none';
});

document.getElementById('pSqft') && document.getElementById('pSqft').addEventListener('focus', showSqftSuggest);
const ADMIN_TYPE_CONFIG = {
  apartment:       { residential: true,  plot: false, commercial: false, floor: true,  carpet: true,  build: true  },
  villa:           { residential: true,  plot: false, commercial: false, floor: false, carpet: true,  build: true  },
  bungalow:        { residential: true,  plot: false, commercial: false, floor: false, carpet: true,  build: true  },
  rowhouse:        { residential: true,  plot: false, commercial: false, floor: false, carpet: true,  build: true  },
  plot:            { residential: false, plot: true,  commercial: false, floor: false, carpet: false, build: false },
  office:          { residential: false, plot: false, commercial: true,  floor: true,  carpet: true,  build: false },
  shop:            { residential: false, plot: false, commercial: true,  floor: true,  carpet: false, build: false },
  showroom:        { residential: false, plot: false, commercial: true,  floor: true,  carpet: true,  build: false },
  warehouse:       { residential: false, plot: false, commercial: true,  floor: false, carpet: false, build: true  },
  factory:         { residential: false, plot: false, commercial: true,  floor: false, carpet: false, build: true  },
  coworking:       { residential: false, plot: false, commercial: true,  floor: true,  carpet: true,  build: false },
  industrial_land: { residential: false, plot: true,  commercial: false, floor: false, carpet: false, build: false },
};

function updateAdminTypeFields() {
  var type = document.getElementById('pType').value;
  var cfg  = ADMIN_TYPE_CONFIG[type] || { residential: false, plot: false, commercial: false, floor: false, carpet: false, build: false };
  var isOffice = type === 'office' || type === 'coworking';
  var bedsRow   = document.getElementById('adminBedsRow');       if (bedsRow)   bedsRow.style.display   = cfg.residential ? '' : 'none';
  var seatsRow  = document.getElementById('adminSeatsRow');      if (seatsRow)  seatsRow.style.display  = (cfg.commercial && !isOffice) ? '' : 'none';
  var plotRow   = document.getElementById('adminPlotRow');       if (plotRow)   plotRow.style.display   = cfg.plot ? '' : 'none';
  var commRow   = document.getElementById('adminCommercialRow'); if (commRow)   commRow.style.display   = cfg.commercial ? '' : 'none';
  var floorRow  = document.getElementById('adminFloorRow');      if (floorRow)  floorRow.style.display  = cfg.floor ? '' : 'none';
  var furnRow   = document.getElementById('adminFurnishedRow');  if (furnRow)   furnRow.style.display   = (cfg.residential || (cfg.commercial && !isOffice)) ? '' : 'none';
  var carpetGrp = document.getElementById('pCarpetGrp');         if (carpetGrp) carpetGrp.style.display = (cfg.carpet && !isOffice) ? '' : 'none';
  var builtGrp  = document.getElementById('pBuiltGrp');          if (builtGrp)  builtGrp.style.display  = cfg.build ? '' : 'none';
  var areaRow   = document.getElementById('areaRow');            if (areaRow)   areaRow.style.display   = isOffice ? 'none' : '';
  var sqftField = document.getElementById('pSqft') ? document.getElementById('pSqft').closest('.hs-field') : null;
  if (sqftField) sqftField.style.display = isOffice ? 'none' : '';
  var nonResRow = document.getElementById('nonResAreaRow');
  if (nonResRow) nonResRow.style.display = (cfg.commercial || cfg.plot) ? '' : 'none';
  var areaLabel = document.getElementById('pSqftLabel');
  if (areaLabel) areaLabel.textContent = TYPE_AREA_LABEL[type] || '\ud83d\udcd0 Super Built-up Area (sq.ft)';
  initAmenitiesGrid(getSelectedAmenities());
  updateAdminScore();
}

document.getElementById('pType').addEventListener('change', onAdminTypeChange);

// ===== ADMIN LISTING SCORE =====
// Total = 100 pts. High Listing needs ALL 7 fields filled properly.
const ASC_CHECKS = [
  { id:'asc-title',  pts:15, done:()=> document.getElementById('pTitle').value.trim().length >= 5 },
  { id:'asc-type',   pts:10, done:()=> !!document.getElementById('pType').value },
  { id:'asc-city',   pts:15, done:()=> !!document.getElementById('pCitySelect').value && !!document.getElementById('pAreaSelect').value },
  { id:'asc-price',  pts:15, done:()=> Number(document.getElementById('pPrice').value) > 0 },
  { id:'asc-area',   pts:10, done:function(){ var s=document.getElementById('pSqft'); var oSBA=document.getElementById('oSBA'); var oC=document.getElementById('oCarpet'); return Number(s&&s.value||0)>0 || Number(oSBA&&oSBA.value||0)>0 || Number(oC&&oC.value||0)>0; } },
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
  const ascNum    = document.getElementById('ascNum');
  const ascCircle = document.getElementById('ascCircle');
  const ascGlow   = document.getElementById('ascGlow');
  const ascGradA  = document.getElementById('ascGradA');
  const ascGradB  = document.getElementById('ascGradB');
  const ascRing   = document.getElementById('ascRing');
  const badge     = document.getElementById('ascStatusBadge');
  const btn       = document.getElementById('ascPublishBtn');
  const panel     = document.querySelector('.admin-score-panel');

  if (ascNum) ascNum.textContent = score;
  const offset = ASC_CIRC - (ASC_CIRC * score / 100);
  if (ascCircle) ascCircle.style.strokeDashoffset = offset;
  if (ascGlow)   ascGlow.style.strokeDashoffset   = offset;
  // Update top score bar
  const scoreBar = document.getElementById('ascScoreBar');
  if (scoreBar) scoreBar.style.width = score + '%';

  // Gradient + number color
  const numEl = ascRing ? ascRing.querySelector('.asc-num span') : null;
  if (score >= 75) {
    if (ascGradA) ascGradA.setAttribute('stop-color','#34d399');
    if (ascGradB) ascGradB.setAttribute('stop-color','#059669');
    if (numEl) numEl.style.color = '#6ee7b7';
  } else if (score >= 50) {
    if (ascGradA) ascGradA.setAttribute('stop-color','#60a5fa');
    if (ascGradB) ascGradB.setAttribute('stop-color','#2563eb');
    if (numEl) numEl.style.color = '#93c5fd';
  } else if (score >= 25) {
    if (ascGradA) ascGradA.setAttribute('stop-color','#fbbf24');
    if (ascGradB) ascGradB.setAttribute('stop-color','#d97706');
    if (numEl) numEl.style.color = '#fde68a';
  } else {
    if (ascGradA) ascGradA.setAttribute('stop-color','#f87171');
    if (ascGradB) ascGradB.setAttribute('stop-color','#dc2626');
    if (numEl) numEl.style.color = '#fff';
  }

  // Pulse on milestone
  if ([25,50,75,100].includes(score) && score !== _ascPrev) {
    if (ascRing) {
      ascRing.style.color = score >= 75 ? '#34d399' : score >= 50 ? '#60a5fa' : '#fbbf24';
      ascRing.classList.remove('pulse'); void ascRing.offsetWidth; ascRing.classList.add('pulse');
      setTimeout(()=> ascRing.classList.remove('pulse'), 900);
    }
  }
  _ascPrev = score;

  // High-score confetti burst at 85+
  if (panel) {
    if (score >= 85 && _ascPrev < 85) {
      panel.classList.add('high-glow');
      ascBurstConfetti(panel);
    } else if (score < 85) {
      panel.classList.remove('high-glow');
    }
  }

  // Status badge
  if (badge) {
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
  }

  // Publish button
  if (btn) {
    if (score >= 75) {
      btn.className = 'asc-publish-btn high-listing';
      btn.innerHTML = '<i class="fas fa-fire"></i> High Listing â€” Publish!';
    } else if (score >= 50) {
      btn.className = 'asc-publish-btn ready';
      btn.innerHTML = '<i class="fas fa-rocket"></i> Ready to Publish';
    } else {
      btn.className = 'asc-publish-btn locked';
      btn.innerHTML = '<i class="fas fa-lock"></i> Need ' + (50 - score) + ' more pts';
    }
  }
}

function ascPublishClick() {
  const score = parseInt((document.getElementById('ascNum') || {textContent:'0'}).textContent);
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

// pPriceLabel manual flag
var pPriceLabelEl = document.getElementById('pPriceLabel');
if (pPriceLabelEl) {
  pPriceLabelEl.addEventListener('input', function() {
    this.dataset.manual = this.value ? '1' : '';
  });
}

// Watch image preview changes via MutationObserver
const pImgObserver = new MutationObserver(updateAdminScore);
pImgObserver.observe(document.getElementById('pImagePreview'), { childList: true });

// ===== CONTACTS =====
async function loadContacts() {
  try {
    const res = await fetch(API + '/contact', {
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
        '<td>' + (c.email || 'â€”') + '</td>' +
        '<td>' + (c.subject || 'â€”') + '</td>' +
        '<td style="max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + c.message + '</td>' +
        '<td><select onchange="updateContactStatus(\'' + c._id + '\',this.value)" style="border:1.5px solid #e0e0e0;border-radius:7px;padding:4px 8px;font-size:0.78rem;font-family:Poppins,sans-serif;outline:none;cursor:pointer;">' +
        '<option value="new"'     + (c.status==='new'     ? ' selected':'') + '>ðŸ”´ New</option>' +
        '<option value="read"'    + (c.status==='read'    ? ' selected':'') + '>ðŸŸ¡ Read</option>' +
        '<option value="replied"' + (c.status==='replied' ? ' selected':'') + '>ðŸŸ¢ Replied</option>' +
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
  const res = await fetch(API + '/contact/' + id, {
    method: 'DELETE',
    headers: { 'Authorization': 'Bearer ' + adminToken }
  });
  const data = await res.json();
  if (data.success) { toast('Deleted! âœ…'); loadContacts(); }
  else toast('Error: ' + (data.message || 'Delete failed'), 'error');
}

// ===== AMENITIES GRID =====
const AMENITIES_BY_TYPE = {
  apartment: [
    { icon: 'ðŸ›—', label: 'Lift' },
    { icon: 'ðŸŠ', label: 'Swimming Pool' },
    { icon: 'ðŸ‹ï¸', label: 'Gymnasium' },
    { icon: 'ðŸ”’', label: '24/7 Security' },
    { icon: 'ðŸ…¿ï¸', label: 'Covered Parking' },
    { icon: 'âš¡', label: 'Power Backup' },
    { icon: 'ðŸŒ¿', label: 'Garden / Park' },
    { icon: 'ðŸŽ®', label: 'Clubhouse' },
    { icon: 'ðŸƒ', label: 'Jogging Track' },
    { icon: 'ðŸ“¡', label: 'Intercom' },
    { icon: 'ðŸŒŠ', label: 'Water Supply 24/7' },
    { icon: 'ðŸ”¥', label: 'Gas Pipeline' },
    { icon: 'ðŸ§¹', label: 'Housekeeping' },
    { icon: 'ðŸ›', label: 'Kids Play Area' },
    { icon: 'ðŸŽ¾', label: 'Sports Court' },
    { icon: 'ðŸ¾', label: 'Pet Friendly' },
    { icon: 'ðŸ“¶', label: 'High Speed Internet' },
    { icon: 'ðŸš¿', label: 'Rainwater Harvesting' },
  ],
  villa: [
    { icon: 'ðŸŒ¿', label: 'Private Garden' },
    { icon: 'ðŸŠ', label: 'Private Pool' },
    { icon: 'ðŸ…¿ï¸', label: 'Private Parking' },
    { icon: 'ðŸ”’', label: '24/7 Security' },
    { icon: 'âš¡', label: 'Power Backup' },
    { icon: 'ðŸ‹ï¸', label: 'Home Gym' },
    { icon: 'ðŸŽ®', label: 'Clubhouse' },
    { icon: 'ðŸ”¥', label: 'Gas Pipeline' },
    { icon: 'ðŸŒŠ', label: 'Water Supply 24/7' },
    { icon: 'ðŸ“¡', label: 'Intercom' },
    { icon: 'ðŸ¾', label: 'Pet Friendly' },
    { icon: 'ðŸ“¶', label: 'High Speed Internet' },
    { icon: 'ðŸ›', label: 'Kids Play Area' },
    { icon: 'ðŸŽ¾', label: 'Sports Court' },
  ],
  bungalow: [
    { icon: 'ðŸŒ¿', label: 'Private Garden' },
    { icon: 'ðŸ…¿ï¸', label: 'Private Parking' },
    { icon: 'ðŸ”’', label: '24/7 Security' },
    { icon: 'âš¡', label: 'Power Backup' },
    { icon: 'ðŸ”¥', label: 'Gas Pipeline' },
    { icon: 'ðŸŒŠ', label: 'Water Supply 24/7' },
    { icon: 'ðŸ“¡', label: 'Intercom' },
    { icon: 'ðŸ¾', label: 'Pet Friendly' },
    { icon: 'ðŸ“¶', label: 'High Speed Internet' },
    { icon: 'ðŸŠ', label: 'Swimming Pool' },
  ],
  rowhouse: [
    { icon: 'ðŸŒ¿', label: 'Garden' },
    { icon: 'ðŸ…¿ï¸', label: 'Parking' },
    { icon: 'ðŸ”’', label: '24/7 Security' },
    { icon: 'âš¡', label: 'Power Backup' },
    { icon: 'ðŸ”¥', label: 'Gas Pipeline' },
    { icon: 'ðŸŒŠ', label: 'Water Supply 24/7' },
    { icon: 'ðŸ“¡', label: 'Intercom' },
    { icon: 'ðŸŽ®', label: 'Clubhouse' },
    { icon: 'ðŸ›', label: 'Kids Play Area' },
    { icon: 'ðŸ“¶', label: 'High Speed Internet' },
  ],
  plot: [
    { icon: 'ðŸŒŠ', label: 'Water Connection' },
    { icon: 'âš¡', label: 'Electricity Connection' },
    { icon: 'ðŸ›£ï¸', label: 'Road Access' },
    { icon: 'ðŸ”’', label: 'Gated Community' },
    { icon: 'ðŸŒ¿', label: 'Landscaping' },
    { icon: 'ðŸš¿', label: 'Drainage' },
    { icon: 'ðŸ“¶', label: 'Internet Ready' },
  ],
  office: [
    { icon: '<i class="fa-solid fa-square-parking"></i>', label: 'Parking' },
    { icon: '<i class="fa-solid fa-car"></i>', label: 'Visitor Parking' },
    { icon: '<i class="fa-solid fa-square-parking"></i>', label: 'Reserved Parking' },
    { icon: '<i class="fa-solid fa-elevator"></i>', label: 'Lift(s)' },
    { icon: '<i class="fa-solid fa-elevator"></i>', label: 'Service Lift' },
    { icon: '<i class="fa-solid fa-bolt"></i>', label: 'Power Back-up' },
    { icon: '<i class="fa-solid fa-shield-halved"></i>', label: 'Security Guard' },
    { icon: '<i class="fa-solid fa-video"></i>', label: 'CCTV Surveillance' },
    { icon: '<i class="fa-solid fa-snowflake"></i>', label: 'Central AC' },
    { icon: '<i class="fa-solid fa-wifi"></i>', label: 'High Speed Internet' },
    { icon: '<i class="fa-solid fa-utensils"></i>', label: 'Cafeteria / Food Court' },
    { icon: '<i class="fa-solid fa-person-booth"></i>', label: 'Reception Area' },
    { icon: '<i class="fa-solid fa-phone-volume"></i>', label: 'Intercom Facility' },
    { icon: '<i class="fa-solid fa-fire-extinguisher"></i>', label: 'Fire Extinguisher' },
    { icon: '<i class="fa-solid fa-bell"></i>', label: 'Fire Sensors' },
    { icon: '<i class="fa-solid fa-shower"></i>', label: 'Sprinklers' },
    { icon: '<i class="fa-solid fa-building-columns"></i>', label: 'Grade A Building' },
    { icon: '<i class="fa-solid fa-door-open"></i>', label: 'Emergency Exit' },
    { icon: '<i class="fa-solid fa-wheelchair"></i>', label: 'WheelChair Accessibility' },
    { icon: '<i class="fa-solid fa-restroom"></i>', label: 'Washroom' },
    { icon: '<i class="fa-solid fa-droplet"></i>', label: '24x7 Water' },
    { icon: '<i class="fa-solid fa-water"></i>', label: 'Water Storage' },
    { icon: '<i class="fa-solid fa-trash"></i>', label: 'Waste Disposal' },
    { icon: '<i class="fa-solid fa-users"></i>', label: 'Maintenance Staff' },
    { icon: '<i class="fa-solid fa-landmark"></i>', label: 'ATM' },
    { icon: '<i class="fa-solid fa-store"></i>', label: 'Shopping Centre' },
    { icon: '<i class="fa-solid fa-basket-shopping"></i>', label: 'Grocery Shop' },
    { icon: '<i class="fa-solid fa-generator"></i>', label: 'DG Availability' },
    { icon: '<i class="fa-solid fa-om"></i>', label: 'Vaastu Compliant' },
  ],
  shop: [
    { icon: 'ðŸ…¿ï¸', label: 'Parking' },
    { icon: 'âš¡', label: 'Power Backup' },
    { icon: 'ðŸ”’', label: 'Security' },
    { icon: 'â„ï¸', label: 'AC' },
    { icon: 'ðŸŽ¥', label: 'CCTV' },
    { icon: 'ðŸ›—', label: 'Lift' },
    { icon: 'ðŸ”¥', label: 'Fire Safety' },
    { icon: 'ðŸ“¶', label: 'Internet Ready' },
    { icon: 'ðŸš¿', label: 'Washroom' },
  ],
  warehouse: [
    { icon: 'ðŸ…¿ï¸', label: 'Loading Dock' },
    { icon: 'âš¡', label: '3-Phase Power' },
    { icon: 'ðŸ”’', label: '24/7 Security' },
    { icon: 'ðŸŽ¥', label: 'CCTV' },
    { icon: 'ðŸ”¥', label: 'Fire Safety' },
    { icon: 'ðŸš¿', label: 'Washroom' },
    { icon: 'ðŸ›£ï¸', label: 'Highway Access' },
    { icon: 'ðŸ“¦', label: 'Storage Racks' },
    { icon: 'â„ï¸', label: 'Cold Storage' },
  ],
  showroom: [
    { icon: 'ðŸ…¿ï¸', label: 'Parking' },
    { icon: 'âš¡', label: 'Power Backup' },
    { icon: 'ðŸ”’', label: 'Security' },
    { icon: 'â„ï¸', label: 'Central AC' },
    { icon: 'ðŸŽ¥', label: 'CCTV' },
    { icon: 'ðŸ›—', label: 'Lift' },
    { icon: 'ðŸ”¥', label: 'Fire Safety' },
    { icon: 'ðŸ“¶', label: 'High Speed Internet' },
    { icon: 'ðŸš¿', label: 'Washroom' },
    { icon: 'ðŸ¢', label: 'Reception Area' },
    { icon: 'ðŸ’¡', label: 'Display Lighting' },
    { icon: 'â™¿', label: 'Wheelchair Access' },
  ],
  factory: [
    { icon: 'âš¡', label: '3-Phase Power' },
    { icon: 'ðŸ…¿ï¸', label: 'Loading / Unloading' },
    { icon: 'ðŸ”’', label: '24/7 Security' },
    { icon: 'ðŸŽ¥', label: 'CCTV' },
    { icon: 'ðŸ”¥', label: 'Fire Safety' },
    { icon: 'ðŸš¿', label: 'Washroom' },
    { icon: 'ðŸ›£ï¸', label: 'Highway Access' },
    { icon: 'ðŸŒŠ', label: 'Water Supply' },
    { icon: 'ðŸ­', label: 'Overhead Crane' },
    { icon: 'ðŸ“¦', label: 'Storage Area' },
    { icon: 'â™»ï¸', label: 'Effluent Treatment' },
  ],
  coworking: [
    { icon: 'ðŸ“¶', label: 'High Speed Internet' },
    { icon: 'â„ï¸', label: 'Central AC' },
    { icon: 'ðŸ…¿ï¸', label: 'Parking' },
    { icon: 'ðŸ›—', label: 'Lift' },
    { icon: 'âš¡', label: 'Power Backup' },
    { icon: 'ðŸ”’', label: '24/7 Security' },
    { icon: 'ðŸŽ¥', label: 'CCTV' },
    { icon: 'ðŸ½ï¸', label: 'Cafeteria' },
    { icon: 'ðŸ–¨ï¸', label: 'Printer / Scanner' },
    { icon: 'ðŸ“¹', label: 'Conference Room' },
    { icon: 'ðŸ›‹ï¸', label: 'Lounge Area' },
    { icon: 'ðŸ”¥', label: 'Fire Safety' },
  ],
  industrial_land: [
    { icon: 'ðŸŒŠ', label: 'Water Connection' },
    { icon: 'âš¡', label: '3-Phase Power' },
    { icon: 'ðŸ›£ï¸', label: 'Road Access' },
    { icon: 'ðŸ”’', label: 'Gated / Fenced' },
    { icon: 'ðŸš¿', label: 'Drainage' },
    { icon: 'ðŸ­', label: 'GIDC Zone' },
    { icon: 'ðŸ“¦', label: 'Warehouse Permitted' },
    { icon: 'â™»ï¸', label: 'ETP Facility' },
  ],
};

function initAmenitiesGrid(selected) {
  const grid = document.getElementById('amenitiesGrid');
  if (!grid) return;
  selected = selected || [];
  const type = document.getElementById('pType') ? document.getElementById('pType').value : '';
  const list = AMENITIES_BY_TYPE[type] || AMENITIES_BY_TYPE['apartment'];
  grid.innerHTML = list.map(a => {
    const checked = selected.includes(a.label);
    return '<label style="display:inline-flex;align-items:center;gap:6px;padding:6px 12px;border:1.5px solid ' + (checked ? '#E53935' : '#e8e8e8') + ';border-radius:20px;cursor:pointer;font-size:0.8rem;margin:3px;background:' + (checked ? '#fff5f5' : '#fff') + ';transition:all 0.2s">' +
      '<input type="checkbox" name="amenity" value="' + a.label + '" style="accent-color:#E53935"' + (checked ? ' checked' : '') + ' onchange="this.closest(\'label\').style.borderColor=this.checked?\'#E53935\':\'#e8e8e8\';this.closest(\'label\').style.background=this.checked?\'#fff5f5\':\'#fff\'"/>' +
      a.icon + ' ' + a.label + '</label>';
  }).join('');
}

function getSelectedAmenities() {
  return Array.from(document.querySelectorAll('#amenitiesGrid input[name="amenity"]:checked')).map(i => i.value);
}


function filterPropertyTypeByCategory(cat) {
  var pTypeEl = document.getElementById('pType');
  if (!pTypeEl) return;
  // Reset selection
  pTypeEl.value = '';
  var groups = pTypeEl.querySelectorAll('optgroup');
  groups.forEach(function(g) {
    var isRes = g.label.indexOf('Residential') !== -1;
    var isComm = g.label.indexOf('Commercial') !== -1;
    var show = (cat === 'residential' && isRes) || (cat === 'commercial' && isComm);
    g.style.display = show ? '' : 'none';
    g.querySelectorAll('option').forEach(function(o) { o.disabled = !show; });
  });
  // Reset dependent fields
  var rf = document.getElementById('residentialFields');
  if (rf) rf.style.display = 'none';
  var of2 = document.getElementById('officeFields');
  if (of2) of2.style.display = 'none';
  updateAdminScore();
}

function hsToggle(btn, fieldId, val) {
  btn.closest('.hs-toggle').querySelectorAll('.hs-toggle-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById(fieldId).value = val;
  if (fieldId === 'pCategory') filterPropertyTypeByCategory(val);
  if (fieldId === 'pCategory' || fieldId === 'pStatus') updateAdminScore();
}

function hsChip(chip, fieldId, val) {
  chip.closest('.hs-chips').querySelectorAll('.hs-chip').forEach(c => c.classList.remove('active'));
  chip.classList.add('active');
  document.getElementById(fieldId).value = val;
  updateAdminScore();
}

function updateStepperProgress(currentStep) {
  const fill = document.getElementById('stepProgressFill');
  if (!fill) return;
  const pct = ((currentStep - 1) / 4) * 100;
  fill.style.height = pct + '%';
  // Update header badges
  for (let i = 1; i <= 5; i++) {
    const b = document.getElementById('hbadge-' + i);
    if (!b) continue;
    if (i < currentStep) {
      b.style.background = 'rgba(16,185,129,0.2)';
      b.style.borderColor = '#10b981';
      b.style.color = '#34d399';
      b.style.boxShadow = '0 0 8px rgba(16,185,129,0.3)';
      b.innerHTML = '<i class="fa-solid fa-check" style="font-size:0.55rem"></i>';
    } else if (i === currentStep) {
      b.style.background = 'linear-gradient(135deg,#E53935,#b71c1c)';
      b.style.borderColor = '#E53935';
      b.style.color = '#fff';
      b.style.boxShadow = '0 0 12px rgba(229,57,53,0.6)';
      b.textContent = i;
    } else {
      b.style.background = 'rgba(255,255,255,0.06)';
      b.style.borderColor = 'rgba(255,255,255,0.1)';
      b.style.color = 'rgba(255,255,255,0.3)';
      b.style.boxShadow = 'none';
      b.textContent = i;
    }
  }
}

function hsValidateStep(step) {
  document.querySelectorAll('.hs-field-error').forEach(el => el.classList.remove('hs-field-error'));
  document.querySelectorAll('.hs-error-msg').forEach(el => el.remove());

  var firstErr = null;

  function markErr(fieldId, msg) {
    var el = document.getElementById(fieldId);
    if (!el) return;
    var wrap = el.closest('.hs-field');
    if (wrap) {
      wrap.classList.add('hs-field-error');
      var err = document.createElement('div');
      err.className = 'hs-error-msg';
      err.innerHTML = '<i class="fa-solid fa-circle-exclamation"></i> ' + msg;
      wrap.appendChild(err);
    }
    if (!firstErr) firstErr = el;
  }

  function v(id) { var e = document.getElementById(id); return e ? e.value.trim() : ''; }
  function n(id) { var e = document.getElementById(id); return e ? Number(e.value) : 0; }

  var type = v('pType');
  var isResNoPlot = ['apartment','villa','bungalow','rowhouse'].indexOf(type) !== -1;
  var status = v('pStatus');

  if (step === 1) {
    if (!v('pCitySelect'))  markErr('pCitySelect', 'City is required');
    if (!v('pAreaSelect') || v('pAreaSelect') === '__other__') markErr('pAreaSelect', 'Locality is required');
    if (!type) markErr('pType', 'Property type is required');
    if (isResNoPlot) {
      if (!v('pBeds'))    markErr('pBeds',    'BHK selection is required');
      if (!v('rBeds'))    markErr('rBeds',    'Bedrooms is required');
      if (!v('rBaths'))   markErr('rBaths',   'Bathrooms is required');
      if (!n('rCarpet'))  markErr('rCarpet',  'Carpet Area is required');
      if (!n('rSBA'))     markErr('rSBA',     'Super Built-up Area is required');
      if (!v('rFurnishing')) markErr('rFurnishing', 'Furnishing status is required');
      if (!v('rAge'))     markErr('rAge',     'Property age is required');
      if (!v('rFacing'))  markErr('rFacing',  'Facing is required');
      if (!v('rOwnership')) markErr('rOwnership', 'Ownership type is required');
    }
  }

  if (step === 2) {
    var photos = document.querySelectorAll('#pImagePreview div').length;
    if (photos === 0) {
      var ua = document.querySelector('.hs-upload-area');
      if (ua) { ua.style.border = '2px dashed #FF4D4D'; ua.style.background = '#fff5f5'; }
      var pe = document.getElementById('photoErr');
      if (pe) pe.remove();
      var errDiv = document.createElement('div');
      errDiv.className = 'hs-error-msg'; errDiv.id = 'photoErr';
      errDiv.style.cssText = 'margin-top:8px;justify-content:center;font-size:0.82rem;';
      errDiv.innerHTML = '<i class="fa-solid fa-circle-exclamation"></i> At least 1 photo is required';
      if (ua) ua.parentNode.insertBefore(errDiv, ua.nextSibling);
      if (ua) ua.scrollIntoView({ behavior:'smooth', block:'center' });
      toast('Please upload at least 1 photo', 'error');
      return false;
    } else {
      var ua2 = document.querySelector('.hs-upload-area');
      if (ua2) { ua2.style.border = ''; ua2.style.background = ''; }
      var pe2 = document.getElementById('photoErr');
      if (pe2) pe2.remove();
    }
  }

  if (step === 3) {
    if (!(n('pPrice') > 0)) markErr('pPrice', 'Price is required');
  }

  if (step === 4) {
    if (v('pTitle').length < 5) markErr('pTitle', 'Title must be at least 5 characters');
    if (v('pDesc').length < 20) markErr('pDesc', 'Description is required (min 20 chars)');
  }

  if (firstErr) {
    firstErr.scrollIntoView({ behavior: 'smooth', block: 'center' });
    toast('Please fill all required fields', 'error');
    return false;
  }
  return true;
}

function hsNextStep(current) {
  if (!hsValidateStep(current)) return;
  const curPanel = document.getElementById('step-' + current);
  const nextPanel = document.getElementById('step-' + (current + 1));
  curPanel.classList.remove('active');
  document.getElementById('step-tab-' + current).classList.remove('active');
  document.getElementById('step-tab-' + current).classList.add('done');
  nextPanel.classList.remove('slide-back');
  nextPanel.classList.add('active');
  document.getElementById('step-tab-' + (current + 1)).classList.add('active');
  updateStepperProgress(current + 1);
  // Scroll form area to top
  var fa = document.querySelector('.prop-form-area');
  if (fa) fa.scrollTop = 0;
  if (current + 1 === 5) buildReviewGrid();
}

function hsPrevStep(current) {
  const curPanel = document.getElementById('step-' + current);
  const prevPanel = document.getElementById('step-' + (current - 1));
  curPanel.classList.remove('active');
  document.getElementById('step-tab-' + current).classList.remove('active');
  prevPanel.classList.add('slide-back');
  prevPanel.classList.add('active');
  document.getElementById('step-tab-' + (current - 1)).classList.add('active');
  updateStepperProgress(current - 1);
  var fa = document.querySelector('.prop-form-area');
  if (fa) fa.scrollTop = 0;
}

function buildReviewGrid() {
  var grid = document.getElementById('reviewGrid');
  if (!grid) return;

  function g(id) { var e = document.getElementById(id); return e ? e.value.trim() : ''; }
  function gn(id) { var e = document.getElementById(id); return e ? Number(e.value) : 0; }

  var type = g('pType'), status = g('pStatus'), city = g('pCitySelect');
  var area = g('pAreaSelect'), subArea = g('pSubAreaSelect'), project = g('pProject');
  var bhk = g('pBeds'), beds = g('rBeds'), baths = g('rBaths'), balc = g('rBalconies');
  var carpet = g('rCarpet'), sba = g('rSBA') || g('pSqft');
  var floor = g('rFloor'), totalFloors = g('rTotalFloors');
  var furnish = g('rFurnishing') || g('pFurnished');
  var age = g('rAge') || g('pAgeOfProperty'), facing = g('rFacing'), ownership = g('rOwnership');
  var covPark = g('rCoveredParking') || '0', openPark = g('rOpenParking') || '0';
  var lift = g('rLift'), price = gn('pPrice'), priceLabel = g('pPriceLabel');
  var title = g('pTitle'), desc = g('pDesc'), possession = g('pPossession');
  var rera = g('pReraNo'), agent = g('pAgentName'), agentPh = g('pAgentPhone');
  var photos = document.querySelectorAll('#pImagePreview div').length;
  var amenities = getSelectedAmenities();
  var score = parseInt((document.getElementById('ascNum')||{textContent:'0'}).textContent) || 0;

  var typeMap = { apartment:'Apartment / Flat', villa:'Villa', bungalow:'Bungalow', rowhouse:'Row House', plot:'Plot', office:'Office Space', shop:'Shop', showroom:'Showroom', warehouse:'Warehouse', factory:'Factory', coworking:'Co-working', industrial_land:'Industrial Land' };
  var statusMap = { 'for-sale':'For Sale', 'for-rent':'For Rent', 'new-launch':'New Launch' };
  var isRes = ['apartment','villa','bungalow','rowhouse'].indexOf(type) !== -1;

  function priceStr(p) {
    if (!p) return 'Ã¢â‚¬â€';
    if (p >= 10000000) return 'Ã¢â€šÂ¹' + (p/10000000).toFixed(2) + ' Cr';
    if (p >= 100000)   return 'Ã¢â€šÂ¹' + (p/100000).toFixed(2) + ' L';
    return 'Ã¢â€šÂ¹' + p.toLocaleString('en-IN');
  }

  function row(icon, label, value, hi) {
    if (!value) value = '';
    var bg = hi ? 'linear-gradient(135deg,#fff5f5,#fff)' : '#f8f9fb';
    var br = hi ? '1.5px solid #ffcdd2' : '1.5px solid #f0f0f0';
    var vc = hi ? '#E53935' : '#333';
    return '<div style="display:flex;align-items:center;gap:10px;padding:10px 14px;background:' + bg + ';border:' + br + ';border-radius:10px;margin-bottom:7px;">' +
      '<span style="font-size:1rem;flex-shrink:0;">' + icon + '</span>' +
      '<div style="flex:1;min-width:0;">' +
        '<div style="font-size:0.68rem;font-weight:700;color:#999;text-transform:uppercase;letter-spacing:0.5px;">' + label + '</div>' +
        '<div style="font-size:0.88rem;font-weight:700;color:' + vc + ';margin-top:2px;">' + (value || '<span style="color:#ccc;font-weight:400;">Ã¢â‚¬â€</span>') + '</div>' +
      '</div></div>';
  }

  function sec(title, content) {
    return '<div style="margin-bottom:14px;">' +
      '<div style="font-size:0.7rem;font-weight:800;color:#E53935;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;display:flex;align-items:center;gap:6px;">' +
        '<div style="width:3px;height:12px;background:#E53935;border-radius:2px;flex-shrink:0;"></div>' + title +
      '</div>' + content + '</div>';
  }

  var html = '';

  // Header
  html += '<div style="background:linear-gradient(135deg,#E53935,#b71c1c);border-radius:14px;padding:16px 18px;margin-bottom:16px;color:#fff;">' +
    '<div style="font-size:0.68rem;font-weight:700;opacity:0.7;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;">Ã°Å¸â€œâ€¹ Review Before Posting</div>' +
    '<div style="font-size:1rem;font-weight:800;margin-bottom:10px;line-height:1.4;">' + (title || '<span style="opacity:0.5">Title not set</span>') + '</div>' +
    '<div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px;">' +
      '<span style="background:rgba(255,255,255,0.2);padding:3px 10px;border-radius:20px;font-size:0.72rem;font-weight:700;">' + (statusMap[status]||status||'Ã¢â‚¬â€') + '</span>' +
      '<span style="background:rgba(255,255,255,0.2);padding:3px 10px;border-radius:20px;font-size:0.72rem;font-weight:700;">' + (typeMap[type]||type||'Ã¢â‚¬â€') + '</span>' +
      '<span style="background:rgba(255,255,255,0.2);padding:3px 10px;border-radius:20px;font-size:0.72rem;font-weight:700;">Ã°Å¸â€œÂ¸ ' + photos + ' Photos</span>' +
    '</div>' +
    '<div style="background:rgba(255,255,255,0.15);border-radius:8px;padding:8px 12px;display:flex;align-items:center;justify-content:space-between;">' +
      '<span style="font-size:0.72rem;font-weight:600;">Listing Score</span>' +
      '<div style="display:flex;align-items:center;gap:8px;">' +
        '<div style="width:80px;height:5px;background:rgba(255,255,255,0.2);border-radius:4px;overflow:hidden;"><div style="width:' + score + '%;height:100%;background:#fff;border-radius:4px;"></div></div>' +
        '<span style="font-size:0.85rem;font-weight:800;">' + score + '/100</span>' +
      '</div>' +
    '</div>' +
  '</div>';

  // Location
  html += sec('Ã°Å¸â€œÂ Location',
    row('Ã°Å¸Ââ„¢Ã¯Â¸Â', 'City', city) +
    row('Ã°Å¸â€œÅ’', 'Locality', area) +
    (subArea && subArea !== '__other__' ? row('Ã°Å¸â€”ÂºÃ¯Â¸Â', 'Sub Area', subArea) : '') +
    (project ? row('Ã°Å¸Ââ€”Ã¯Â¸Â', 'Building / Society', project) : '')
  );

  // Property Info
  var propInfo = row('Ã°Å¸ÂÂ ', 'Property Type', typeMap[type]||type, true) +
    row('Ã°Å¸â€œâ€¹', 'Listing Type', statusMap[status]||status, true);
  if (isRes && bhk) propInfo += row('Ã°Å¸â€ºÂÃ¯Â¸Â', 'BHK', bhk + ' BHK', false);
  if (isRes) propInfo += row('Ã°Å¸â€ºÅ’', 'Bedrooms', beds) + row('Ã°Å¸Å¡Â¿', 'Bathrooms', baths) + row('Ã°Å¸ÂÂ ', 'Balconies', balc);
  html += sec('Ã°Å¸ÂÂ  Property Info', propInfo);

  // Area
  if (isRes && (carpet || sba)) {
    var loading = (carpet && sba) ? Math.round((Number(sba)/Number(carpet) - 1)*100) + '%' : '';
    html += sec('Ã°Å¸â€œÂ Area Details',
      row('Ã°Å¸â€œÂ', 'Carpet Area', carpet ? carpet + ' sq.ft' : '') +
      row('Ã°Å¸â€œÂ', 'Super Built-up Area', sba ? sba + ' sq.ft' : '') +
      (loading ? row('Ã°Å¸â€œÅ ', 'Loading Factor', loading) : '')
    );
  }

  // Building
  if (isRes) {
    html += sec('Ã°Å¸ÂÂ¢ Building Details',
      row('Ã°Å¸ÂÂ¢', 'Floor', floor ? 'Floor ' + floor + (totalFloors ? ' / ' + totalFloors : '') : '') +
      row('Ã°Å¸â€ºâ€”', 'Lift', lift) +
      row('Ã°Å¸Å¡â€”', 'Parking', covPark + ' Covered + ' + openPark + ' Open') +
      row('Ã°Å¸Â§Â­', 'Facing', facing) +
      row('Ã°Å¸â€œâ€¹', 'Ownership', ownership) +
      row('Ã°Å¸Ââ€”Ã¯Â¸Â', 'Property Age', age) +
      row('Ã°Å¸â€ºâ€¹Ã¯Â¸Â', 'Furnishing', furnish)
    );
  }

  // Pricing
  html += sec('Ã°Å¸â€™Â° Pricing',
    row('Ã°Å¸â€™Â°', 'Expected Price', priceStr(price) + (priceLabel ? '  (' + priceLabel + ')' : ''), true) +
    (possession ? row('Ã°Å¸â€â€˜', 'Possession', possession) : '') +
    (rera ? row('Ã°Å¸â€œÅ“', 'RERA No.', rera) : '')
  );

  // Amenities
  if (amenities.length) {
    html += sec('Ã¢Å“â€¦ Amenities (' + amenities.length + ')',
      '<div style="display:flex;flex-wrap:wrap;gap:6px;padding:4px 0;">' +
      amenities.map(function(a) {
        return '<span style="background:#e8f5e9;color:#2e7d32;font-size:0.73rem;font-weight:600;padding:4px 10px;border-radius:20px;border:1px solid #c8e6c9;">Ã¢Å“â€œ ' + a + '</span>';
      }).join('') + '</div>'
    );
  }

  // Agent
  if (agent) {
    html += sec('Ã°Å¸â€˜Â¤ Agent Details',
      row('Ã°Å¸â€˜Â¤', 'Agent Name', agent) +
      row('Ã°Å¸â€œÅ¾', 'Phone', agentPh)
    );
  }

  // Description
  if (desc) {
    html += sec('Ã°Å¸â€œÂ Description Preview',
      '<div style="background:#f8f9fb;border:1.5px solid #f0f0f0;border-radius:10px;padding:12px 14px;font-size:0.82rem;color:#555;line-height:1.7;">' +
      desc.substring(0,250) + (desc.length > 250 ? '...' : '') + '</div>'
    );
  }

  grid.innerHTML = html;
}

// ===== AI TITLE / DESC STUBS =====
function aiGenerateTitle() {
  const type = document.getElementById('pType').value;
  const city = document.getElementById('pCitySelect').value;
  const area = document.getElementById('pAreaSelect').value || document.getElementById('pSubArea').value;
  const beds = document.getElementById('pBeds').value;
  const status = document.getElementById('pStatus').value;
  if (!type || !city) { toast('Select Type and City first', 'error'); return; }
  const bhk = beds ? beds + ' BHK ' : '';
  const typeMap = { apartment:'Apartment', villa:'Villa', bungalow:'Bungalow', rowhouse:'Row House', plot:'Plot', office:'Office Space', shop:'Shop', warehouse:'Warehouse' };
  const statusMap = { 'for-sale':'for Sale', 'for-rent':'for Rent', 'new-launch':'New Launch' };
  const loc = area ? area + ', ' + city : city;
  document.getElementById('pTitle').value = bhk + (typeMap[type]||type) + ' ' + (statusMap[status]||'for Sale') + ' in ' + loc;
  updateAdminScore();
}

function aiGenerateDesc() {
  const type = document.getElementById('pType').value;
  const city = document.getElementById('pCitySelect').value;
  const area = document.getElementById('pAreaSelect').value || document.getElementById('pSubArea').value;
  const beds = document.getElementById('pBeds').value;
  const sqft = document.getElementById('pSqft').value;
  const status = document.getElementById('pStatus').value;
  if (!type || !city) { toast('Select Type and City first', 'error'); return; }
  const bhk = beds ? beds + ' BHK ' : '';
  const typeMap = { apartment:'Apartment', villa:'Villa', bungalow:'Bungalow', rowhouse:'Row House', plot:'Plot', office:'Office Space', shop:'Shop', warehouse:'Warehouse' };
  const loc = area ? area + ', ' + city : city;
  const sqftStr = sqft ? ' with ' + sqft + ' sq.ft' : '';
  const rentSale = status === 'for-rent' ? 'rent' : 'sale';
  document.getElementById('pDesc').value =
    'Premium ' + bhk + (typeMap[type]||type) + ' available for ' + rentSale + ' in ' + loc + sqftStr + '. ' +
    'Well-maintained property with modern amenities. Prime location, close to schools, hospitals, and shopping centers. ' +
    'Ready to move in. Contact City Real Space for a free site visit. RERA Registered. NTC Reg No: 12376.';
  updateAdminScore();
}

// ===== DRAFTS =====
// ===== DRAFT: Collect ALL form fields =====
function collectDraftData() {
  function g(id) { var e = document.getElementById(id); return e ? e.value : ''; }
  function gc(id) { var e = document.getElementById(id); return e ? e.checked : false; }
  return {
    id: Date.now(),
    savedAt: new Date().toISOString(),
    // Basic
    title: g('pTitle') || 'Untitled Draft',
    type: g('pType'), category: g('pCategory'), status: g('pStatus'),
    // Location
    city: g('pCitySelect'), area: g('pAreaSelect'), subArea: g('pSubAreaSelect'), project: g('pProject'),
    // BHK
    beds: g('pBeds'), rBeds: g('rBeds'), rBaths: g('rBaths'), rBalconies: g('rBalconies'),
    // Area
    carpetArea: g('rCarpet'), superBuiltUp: g('rSBA'), sqft: g('pSqft'),
    // Building
    floor: g('rFloor'), totalFloors: g('rTotalFloors'), lift: g('rLift'),
    coveredParking: g('rCoveredParking'), openParking: g('rOpenParking'),
    facing: g('rFacing'), ownership: g('rOwnership'), ageOfProperty: g('rAge') || g('pAgeOfProperty'),
    furnished: g('rFurnishing') || g('pFurnished'), availFrom: g('rAvailFrom'), suitableFor: g('rSuitableFor'),
    // Amenities toggles
    security: g('rSecurity'), cctv: g('rCCTV'), water: g('rWater'),
    powerBackup: g('rPowerBackup'), garden: g('rGarden'), gymPool: g('rGymPool'),
    // Pricing
    price: g('pPrice'), priceLabel: g('pPriceLabel'), possession: g('pPossession'), reraNo: g('pReraNo'),
    allInclusive: g('pAllInclusive'), negotiable: g('pNegotiable'), taxCharges: g('pTaxCharges'),
    bookingAmount: g('pBookingAmount'), maintenance: g('pMaintenance'),
    annualDues: g('pAnnualDues'), membershipCharge: g('pMembershipCharge'),
    // Rent
    maintenanceRent: g('rMaintenance'), lockIn: g('rLockIn'), noticePeriod: g('rNoticePeriod'), brokerage: g('rBrokerage'),
    // Highlights
    desc: g('pDesc'), agentName: g('pAgentName'), agentPhone: g('pAgentPhone'),
    featured: gc('pFeatured'), approved: gc('pApproved'),
    // Amenities checkboxes
    amenities: getSelectedAmenities(),
    // Images (existing URLs only)
    images: Array.from(document.querySelectorAll('#pImagePreview div[data-existing-url]')).map(function(d){ return d.dataset.existingUrl; })
  };
}

function saveDraft() {
  var draft = collectDraftData();
  var drafts = JSON.parse(localStorage.getItem('adminDrafts') || '[]');
  drafts.unshift(draft);
  if (drafts.length > 20) drafts = drafts.slice(0, 20); // max 20 drafts
  localStorage.setItem('adminDrafts', JSON.stringify(drafts));
  var badge = document.getElementById('draftBadge');
  if (badge) badge.textContent = drafts.length;
  showDraftSavedToast();
  closeModal('propModal');
}

// Auto-save draft on page unload/refresh while modal is open
var _autoSaveInterval = null;
function startAutoSave() {
  _autoSaveInterval = setInterval(function() {
    var modal = document.getElementById('propModal');
    if (!modal || !modal.classList.contains('open')) return;
    var titleVal = document.getElementById('pTitle') ? document.getElementById('pTitle').value : '';
    var typeVal  = document.getElementById('pType')  ? document.getElementById('pType').value  : '';
    if (!typeVal && !titleVal) return; // nothing to save
    var draft = collectDraftData();
    draft.id = 'autosave';
    draft.title = (draft.title || 'Auto-saved Draft');
    localStorage.setItem('adminAutoSaveDraft', JSON.stringify(draft));
  }, 10000); // every 10 seconds
}
startAutoSave();

// On page load Ã¢â‚¬â€ check for auto-saved draft
window.addEventListener('load', function() {
  var autoSave = localStorage.getItem('adminAutoSaveDraft');
  if (!autoSave) return;
  try {
    var d = JSON.parse(autoSave);
    if (!d.type && !d.title) return;
    // Show recovery toast after 2 seconds
    setTimeout(function() {
      showDraftRecoveryToast(d);
    }, 2000);
  } catch(e) {}
});

function showDraftRecoveryToast(d) {
  var existing = document.getElementById('draftRecoveryToast');
  if (existing) existing.remove();

  // Use maximum z-index so nothing blocks it
  var MAX_Z = 2147483647;

  var t = document.createElement('div');
  t.id = 'draftRecoveryToast';
  t.style.position   = 'fixed';
  t.style.bottom     = '24px';
  t.style.left       = '50%';
  t.style.transform  = 'translateX(-50%) translateY(80px)';
  t.style.zIndex     = MAX_Z;
  t.style.background = 'linear-gradient(135deg,#0D1B2A,#1a3a5c)';
  t.style.border     = '1.5px solid rgba(99,102,241,0.4)';
  t.style.borderRadius = '16px';
  t.style.padding    = '16px 20px';
  t.style.boxShadow  = '0 20px 60px rgba(0,0,0,0.5)';
  t.style.display    = 'flex';
  t.style.alignItems = 'center';
  t.style.gap        = '14px';
  t.style.minWidth   = '320px';
  t.style.maxWidth   = '480px';
  t.style.opacity    = '0';
  t.style.fontFamily = 'Poppins,sans-serif';
  t.style.transition = 'transform 0.4s cubic-bezier(0.34,1.56,0.64,1),opacity 0.4s';
  t.style.pointerEvents = 'all';

  // Icon
  var icon = document.createElement('div');
  icon.style.cssText = 'width:42px;height:42px;background:linear-gradient(135deg,#6366f1,#8b5cf6);border-radius:12px;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:1.3rem;pointer-events:none;';
  icon.textContent = '\uD83D\uDCBE';

  // Info
  var info = document.createElement('div');
  info.style.cssText = 'flex:1;min-width:0;pointer-events:none;';
  var h = document.createElement('div');
  h.style.cssText = 'font-size:0.85rem;font-weight:700;color:#f1f5f9;margin-bottom:2px;';
  h.textContent = 'Unsaved Draft Found!';
  var sub = document.createElement('div');
  sub.style.cssText = 'font-size:0.75rem;color:#94a3b8;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;';
  sub.textContent = (d.title || 'Untitled') + (d.city ? ' - ' + d.city : '');
  info.appendChild(h);
  info.appendChild(sub);

  // Recover button
  var recoverBtn = document.createElement('button');
  recoverBtn.textContent = 'Recover';
  recoverBtn.style.background    = 'linear-gradient(135deg,#6366f1,#8b5cf6)';
  recoverBtn.style.color         = '#fff';
  recoverBtn.style.border        = 'none';
  recoverBtn.style.padding       = '10px 18px';
  recoverBtn.style.borderRadius  = '8px';
  recoverBtn.style.fontSize      = '0.82rem';
  recoverBtn.style.fontWeight    = '700';
  recoverBtn.style.cursor        = 'pointer';
  recoverBtn.style.fontFamily    = 'Poppins,sans-serif';
  recoverBtn.style.flexShrink    = '0';
  recoverBtn.style.position      = 'relative';
  recoverBtn.style.zIndex        = MAX_Z;
  recoverBtn.style.pointerEvents = 'all';
  recoverBtn.onclick = function(e) { e.stopPropagation(); recoverAutoDraft(); };

  // Dismiss button
  var dismissBtn = document.createElement('button');
  dismissBtn.textContent = 'Dismiss';
  dismissBtn.style.background    = 'rgba(255,255,255,0.1)';
  dismissBtn.style.color         = '#94a3b8';
  dismissBtn.style.border        = '1px solid rgba(255,255,255,0.15)';
  dismissBtn.style.padding       = '10px 14px';
  dismissBtn.style.borderRadius  = '8px';
  dismissBtn.style.fontSize      = '0.82rem';
  dismissBtn.style.cursor        = 'pointer';
  dismissBtn.style.fontFamily    = 'Poppins,sans-serif';
  dismissBtn.style.flexShrink    = '0';
  dismissBtn.style.position      = 'relative';
  dismissBtn.style.zIndex        = MAX_Z;
  dismissBtn.style.pointerEvents = 'all';
  dismissBtn.onclick = function(e) { e.stopPropagation(); dismissDraftRecovery(); };

  var btns = document.createElement('div');
  btns.style.cssText = 'display:flex;gap:8px;flex-shrink:0;';
  btns.appendChild(recoverBtn);
  btns.appendChild(dismissBtn);

  t.appendChild(icon);
  t.appendChild(info);
  t.appendChild(btns);
  document.body.appendChild(t);

  setTimeout(function() {
    t.style.transform = 'translateX(-50%) translateY(0)';
    t.style.opacity   = '1';
  }, 50);
}

function recoverAutoDraft() {
  var autoSave = localStorage.getItem('adminAutoSaveDraft');
  if (!autoSave) return;
  try {
    var d = JSON.parse(autoSave);
    dismissDraftRecovery();
    loadDraftData(d);
    goPage('properties');
    setTimeout(function() { openModal('propModal'); }, 200);
  } catch(e) {}
}

function dismissDraftRecovery() {
  localStorage.removeItem('adminAutoSaveDraft');
  var t = document.getElementById('draftRecoveryToast');
  if (t) { t.style.transform = 'translateX(-50%) translateY(80px)'; t.style.opacity = '0'; setTimeout(function(){ t.remove(); }, 400); }
}

function showDraftSavedToast() {
  var existing = document.getElementById('draftSavedToast');
  if (existing) existing.remove();
  var t = document.createElement('div');
  t.id = 'draftSavedToast';
  t.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%) translateY(80px);z-index:99999;background:linear-gradient(135deg,#064e3b,#065f46);border:1.5px solid rgba(16,185,129,0.4);border-radius:16px;padding:16px 24px;box-shadow:0 20px 60px rgba(0,0,0,0.4);display:flex;align-items:center;gap:12px;font-family:Poppins,sans-serif;transition:transform 0.4s cubic-bezier(0.34,1.56,0.64,1),opacity 0.4s;opacity:0;';
  t.innerHTML = '<div style="width:38px;height:38px;background:rgba(16,185,129,0.2);border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:1.2rem;flex-shrink:0;">Ã°Å¸â€™Â¾</div>' +
    '<div>' +
      '<div style="font-size:0.88rem;font-weight:700;color:#6ee7b7;">Draft Saved!</div>' +
      '<div style="font-size:0.75rem;color:rgba(110,231,183,0.6);margin-top:1px;">All details saved. Continue anytime.</div>' +
    '</div>' +
    '<div style="width:32px;height:32px;border-radius:50%;background:rgba(16,185,129,0.15);display:flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0;" onclick="this.closest(\'#draftSavedToast\').remove()"><i class="fa-solid fa-xmark" style="color:#6ee7b7;font-size:0.8rem;"></i></div>';
  document.body.appendChild(t);
  setTimeout(function() { t.style.transform = 'translateX(-50%) translateY(0)'; t.style.opacity = '1'; }, 50);
  setTimeout(function() { if (t.parentNode) { t.style.transform = 'translateX(-50%) translateY(80px)'; t.style.opacity = '0'; setTimeout(function(){ t.remove(); }, 400); } }, 4000);
}

function loadDrafts() {
  var drafts = JSON.parse(localStorage.getItem('adminDrafts') || '[]');
  var grid = document.getElementById('draftsGrid');
  var badge = document.getElementById('draftBadge');
  if (badge) badge.textContent = drafts.length || '';
  if (!drafts.length) {
    grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:60px 20px;color:var(--text3)"><i class="fa-regular fa-floppy-disk" style="font-size:2.5rem;display:block;margin-bottom:12px;opacity:0.3"></i><p style="font-size:0.9rem">No saved drafts yet.<br><small>Click "Save Draft" while adding a property.</small></p></div>';
    return;
  }
  var typeIcon  = { apartment:'Ã°Å¸ÂÂ¢', villa:'Ã°Å¸ÂÂ¡', bungalow:'Ã°Å¸ÂÂ ', rowhouse:'Ã°Å¸ÂËœÃ¯Â¸Â', plot:'Ã°Å¸Å’Â¿', office:'Ã°Å¸ÂÂ¢', shop:'Ã°Å¸ÂÂª', showroom:'Ã°Å¸Å¡â€”', warehouse:'Ã°Å¸ÂÂ­', factory:'Ã¢Å¡â„¢Ã¯Â¸Â', coworking:'Ã°Å¸â€™Â»', industrial_land:'Ã°Å¸Å’Â' };
  var typeLabel = { apartment:'Apartment', villa:'Villa', bungalow:'Bungalow', rowhouse:'Row House', plot:'Plot', office:'Office', shop:'Shop', showroom:'Showroom', warehouse:'Warehouse', factory:'Factory', coworking:'Co-working', industrial_land:'Industrial Land' };
  grid.innerHTML = drafts.map(function(d, idx) {
    var icon   = typeIcon[d.type]  || 'Ã°Å¸ÂÂ ';
    var tLabel = typeLabel[d.type] || d.type || 'Property';
    var loc    = [d.area, d.city].filter(Boolean).join(', ') || 'Ã¢â‚¬â€';
    var price  = d.price ? 'Ã¢â€šÂ¹' + Number(d.price).toLocaleString('en-IN') : 'Ã¢â‚¬â€';
    var beds   = d.rBeds || d.beds ? (d.rBeds || d.beds) + ' BHK' : '';
    var sqft   = d.superBuiltUp || d.sqft ? (d.superBuiltUp || d.sqft) + ' sq.ft' : '';
    var saved  = new Date(d.savedAt).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' });
    var score  = 0;
    if (d.title && d.title !== 'Untitled Draft') score += 15;
    if (d.type)  score += 10;
    if (d.city && d.area) score += 15;
    if (d.price) score += 15;
    if (d.superBuiltUp || d.sqft) score += 10;
    if (d.desc)  score += 20;
    var sc = score >= 75 ? '#10b981' : score >= 50 ? '#3b82f6' : '#f59e0b';
    return '<div style="background:var(--card);border:1px solid var(--border);border-radius:16px;padding:20px;display:flex;flex-direction:column;gap:12px;transition:all 0.25s;position:relative;overflow:hidden;animation:fadeIn 0.3s ease ' + (idx*0.05) + 's both;" ' +
      'onmouseover="this.style.borderColor=\'rgba(99,102,241,0.4)\';this.style.transform=\'translateY(-2px)\'" ' +
      'onmouseout="this.style.borderColor=\'var(--border)\';this.style.transform=\'\'">' +
      '<div style="position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,var(--accent),var(--accent2))"></div>' +
      '<div style="display:flex;align-items:flex-start;justify-content:space-between;gap:8px">' +
        '<div style="display:flex;align-items:center;gap:10px">' +
          '<div style="width:40px;height:40px;background:rgba(99,102,241,0.12);border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:1.3rem;flex-shrink:0">' + icon + '</div>' +
          '<div>' +
            '<div style="font-size:0.88rem;font-weight:700;color:var(--text);line-height:1.3;max-width:160px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + (d.title || 'Untitled Draft') + '</div>' +
            '<div style="font-size:0.72rem;color:var(--text3);margin-top:2px">' + tLabel + '</div>' +
            '<div style="display:inline-flex;align-items:center;gap:3px;background:rgba(99,102,241,0.1);color:' + sc + ';font-size:0.62rem;font-weight:700;padding:2px 7px;border-radius:20px;margin-top:3px;">' + score + '/100</div>' +
          '</div>' +
        '</div>' +
        '<button onclick="deleteDraft(' + idx + ')" style="width:26px;height:26px;border-radius:8px;border:none;background:rgba(239,68,68,0.12);color:#f87171;cursor:pointer;font-size:0.75rem;display:flex;align-items:center;justify-content:center;flex-shrink:0"><i class="fa-solid fa-trash"></i></button>' +
      '</div>' +
      '<div style="display:flex;flex-direction:column;gap:6px">' +
        '<div style="display:flex;align-items:center;gap:6px;font-size:0.78rem;color:var(--text2)"><i class="fa-solid fa-location-dot" style="color:var(--accent);width:14px"></i>' + loc + '</div>' +
        (price !== 'Ã¢â‚¬â€' ? '<div style="display:flex;align-items:center;gap:6px;font-size:0.78rem;color:var(--text2)"><i class="fa-solid fa-indian-rupee-sign" style="color:#10b981;width:14px"></i>' + price + '</div>' : '') +
        ([beds, sqft].filter(Boolean).length ? '<div style="display:flex;align-items:center;gap:6px;font-size:0.78rem;color:var(--text2)"><i class="fa-solid fa-ruler-combined" style="color:#f59e0b;width:14px"></i>' + [beds, sqft].filter(Boolean).join(' Ã¢â‚¬Â¢ ') + '</div>' : '') +
        (d.desc ? '<div style="font-size:0.72rem;color:var(--text3);line-height:1.5;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical">' + d.desc.substring(0,100) + (d.desc.length > 100 ? '...' : '') + '</div>' : '') +
      '</div>' +
      '<div style="display:flex;align-items:center;justify-content:space-between;padding-top:10px;border-top:1px solid var(--border)">' +
        '<span style="font-size:0.68rem;color:var(--text3)"><i class="fa-regular fa-clock" style="margin-right:4px"></i>' + saved + '</span>' +
        '<button onclick="loadDraftIntoForm(' + idx + ')" style="background:linear-gradient(135deg,var(--accent),var(--accent2));color:#fff;border:none;padding:6px 14px;border-radius:8px;font-size:0.75rem;font-weight:700;cursor:pointer;font-family:Poppins,sans-serif;display:flex;align-items:center;gap:5px"><i class="fa-solid fa-pen"></i> Continue</button>' +
      '</div>' +
    '</div>';
  }).join('');
}

function deleteDraft(idx) {
  var drafts = JSON.parse(localStorage.getItem('adminDrafts') || '[]');
  drafts.splice(idx, 1);
  localStorage.setItem('adminDrafts', JSON.stringify(drafts));
  toast('Draft deleted.');
  loadDrafts();
}

function loadDraftData(d) {
  document.getElementById('propModalTitle').textContent = 'Continue Draft';
  document.getElementById('propForm').reset();
  document.getElementById('propId').value = '';
  document.getElementById('pApproved').checked = true;
  document.getElementById('pImagePreview').innerHTML = '';
  document.querySelectorAll('.step-panel').forEach(function(p) { p.classList.remove('active','slide-back'); });
  document.querySelectorAll('.stepper-step').forEach(function(t) { t.classList.remove('active','done'); });
  document.getElementById('step-1').classList.add('active');
  document.getElementById('step-tab-1').classList.add('active');
  updateStepperProgress(1);

  function s(id, val) { var e = document.getElementById(id); if (e && val !== undefined && val !== null) e.value = val; }
  function setToggleBtn(fieldId, val) {
    s(fieldId, val);
    document.querySelectorAll('.hs-toggle-btn').forEach(function(b) {
      var oc = b.getAttribute('onclick') || '';
      if (oc.indexOf("'" + fieldId + "'") !== -1) b.classList.toggle('active', oc.indexOf("'" + val + "'") !== -1);
    });
  }

  setTimeout(function() {
    // Category + filter
    if (d.category) { setToggleBtn('pCategory', d.category); filterPropertyTypeByCategory(d.category); }
    if (d.status)   setToggleBtn('pStatus', d.status);
    if (d.type)     { s('pType', d.type); onAdminTypeChange(); }

    // Location
    if (d.city) { s('pCitySelect', d.city); document.getElementById('pCitySelect').dispatchEvent(new Event('change')); }
    setTimeout(function() {
      if (d.area) { s('pAreaSelect', d.area); document.getElementById('pAreaSelect').dispatchEvent(new Event('change')); }
      setTimeout(function() {
        s('pSubAreaSelect', d.subArea); s('pProject', d.project);
        // BHK
        if (d.beds) { s('pBeds', d.beds); document.querySelectorAll('#bhkChips .hs-chip').forEach(function(c){ c.classList.toggle('active', c.textContent.trim().startsWith(d.beds)); }); }
        // Residential
        s('rBeds', d.rBeds); s('rBaths', d.rBaths); s('rBalconies', d.rBalconies || '0');
        s('rCarpet', d.carpetArea); s('rSBA', d.superBuiltUp); s('pSqft', d.sqft || d.superBuiltUp);
        s('rFloor', d.floor); s('rTotalFloors', d.totalFloors);
        s('rFacing', d.facing); s('rOwnership', d.ownership);
        s('rAge', d.ageOfProperty); s('pAgeOfProperty', d.ageOfProperty);
        s('rAvailFrom', d.availFrom);
        if (d.lift)        setToggleBtn('rLift', d.lift);
        if (d.suitableFor) setToggleBtn('rSuitableFor', d.suitableFor);
        if (d.security)    setToggleBtn('rSecurity', d.security);
        if (d.cctv)        setToggleBtn('rCCTV', d.cctv);
        if (d.water)       setToggleBtn('rWater', d.water);
        if (d.powerBackup) setToggleBtn('rPowerBackup', d.powerBackup);
        if (d.garden)      setToggleBtn('rGarden', d.garden);
        if (d.gymPool)     setToggleBtn('rGymPool', d.gymPool);
        // Parking counters
        if (d.coveredParking !== undefined) { s('rCoveredParking', d.coveredParking); var cd = document.getElementById('rCoveredParkingDisplay'); if (cd) cd.textContent = d.coveredParking; }
        if (d.openParking   !== undefined) { s('rOpenParking',    d.openParking);    var od = document.getElementById('rOpenParkingDisplay');    if (od) od.textContent = d.openParking; }
        // Furnishing
        if (d.furnished) {
          s('rFurnishing', d.furnished); s('pFurnished', d.furnished);
          document.querySelectorAll('.hs-toggle-btn').forEach(function(b) {
            var oc = b.getAttribute('onclick') || '';
            if (oc.indexOf('setResFurnishing') !== -1) b.classList.toggle('active', oc.indexOf("'" + d.furnished + "'") !== -1);
          });
          var fi = document.getElementById('furnishingItems');
          if (fi) fi.style.display = (d.furnished === 'Unfurnished') ? 'none' : 'block';
        }
        // Pricing
        s('pPrice', d.price); s('pPriceLabel', d.priceLabel); s('pPossession', d.possession); s('pReraNo', d.reraNo);
        if (d.allInclusive) setToggleBtn('pAllInclusive', d.allInclusive);
        if (d.negotiable)   setToggleBtn('pNegotiable',   d.negotiable);
        if (d.taxCharges)   setToggleBtn('pTaxCharges',   d.taxCharges);
        s('pBookingAmount', d.bookingAmount); s('pMaintenance', d.maintenance);
        s('pAnnualDues', d.annualDues); s('pMembershipCharge', d.membershipCharge);
        s('rMaintenance', d.maintenanceRent); s('rLockIn', d.lockIn);
        s('rNoticePeriod', d.noticePeriod);
        if (d.brokerage) setToggleBtn('rBrokerage', d.brokerage);
        // Highlights
        s('pTitle', d.title !== 'Untitled Draft' ? d.title : '');
        s('pDesc', d.desc); s('pAgentName', d.agentName); s('pAgentPhone', d.agentPhone);
        if (d.featured !== undefined) document.getElementById('pFeatured').checked = d.featured;
        // Amenities
        initAmenitiesGrid(d.amenities || []);
        // Images
        if (d.images && d.images.length) {
          var preview = document.getElementById('pImagePreview');
          d.images.forEach(function(url) {
            var item = document.createElement('div');
            item.style.cssText = 'position:relative;width:90px;height:70px;border-radius:8px;overflow:hidden;border:1.5px solid #e8e8e8;flex-shrink:0';
            item.dataset.existingUrl = url;
            item.innerHTML = '<img src="' + url + '" style="width:100%;height:100%;object-fit:cover"/>' +
              '<button type="button" onclick="this.parentElement.remove()" style="position:absolute;top:3px;right:3px;background:rgba(0,0,0,0.6);border:none;color:#fff;border-radius:50%;width:20px;height:20px;cursor:pointer;font-size:0.65rem;display:flex;align-items:center;justify-content:center"><i class="fa-solid fa-xmark"></i></button>';
            preview.appendChild(item);
          });
        }
        _ascPrev = -1;
        updateAdminScore();
      }, 150);
    }, 150);
  }, 50);
}

function loadDraftIntoForm(idx) {
  var drafts = JSON.parse(localStorage.getItem('adminDrafts') || '[]');
  var d = drafts[idx];
  if (!d) return;
  loadDraftData(d);
  openModal('propModal');
}

function clearAllDrafts() {
  if (!confirm('Clear all saved drafts?')) return;
  localStorage.removeItem('adminDrafts');
  var badge = document.getElementById('draftBadge');
  if (badge) badge.textContent = '';
  loadDrafts();
  toast('All drafts cleared.');
}

// ===== NOTIFICATIONS =====
function toggleNotifPanel() {
  const panel = document.getElementById('notifPanel');
  const isOpen = panel.style.display === 'block';
  panel.style.display = isOpen ? 'none' : 'block';
  if (!isOpen) loadNotifications();
}

async function loadNotifications() {
  const list = document.getElementById('notifList');
  list.innerHTML = '<div style="text-align:center;padding:20px;color:#475569"><i class="fa-solid fa-spinner fa-spin"></i></div>';

  try {
    // Load pending user submissions + new inquiries + new requirements in parallel
    const [subRes, inqRes, reqRes] = await Promise.all([
      api('GET', '/user-properties'),
      api('GET', '/inquiries'),
      api('GET', '/requirements')
    ]);

    const notifs = [];

    // Pending user property submissions
    if (subRes.success && subRes.properties) {
      const pending = subRes.properties.filter(p => !p.isApproved);
      pending.slice(0, 5).forEach(p => {
        notifs.push({
          icon: 'fa-building',
          color: '#6366f1',
          bg: 'rgba(99,102,241,0.12)',
          title: 'New Property Submission',
          sub: (p.postedBy ? (p.postedBy.firstName || p.postedBy.name || 'User') : 'User') + ' posted: ' + (p.title || 'Untitled'),
          time: p.createdAt,
          action: function() { goPage('submissions'); toggleNotifPanel(); }
        });
      });
    }

    // New inquiries
    if (inqRes.success && inqRes.inquiries) {
      const newInq = inqRes.inquiries.filter(i => i.status === 'new').slice(0, 3);
      newInq.forEach(i => {
        notifs.push({
          icon: 'fa-message',
          color: '#10b981',
          bg: 'rgba(16,185,129,0.12)',
          title: 'New Inquiry',
          sub: (i.name || 'Someone') + ' â€” ' + (i.lookingFor || 'Property inquiry'),
          time: i.createdAt,
          action: function() { goPage('inquiries'); toggleNotifPanel(); }
        });
      });
    }

    // New requirements
    if (reqRes.success && reqRes.inquiries) {
      const newReq = reqRes.inquiries.filter(r => r.status === 'new').slice(0, 3);
      newReq.forEach(r => {
        notifs.push({
          icon: 'fa-bell',
          color: '#f59e0b',
          bg: 'rgba(245,158,11,0.12)',
          title: 'New Requirement',
          sub: (r.name || 'Someone') + ' needs: ' + (r.propertyType || 'Property') + (r.city ? ' in ' + r.city : ''),
          time: r.createdAt,
          action: function() { goPage('requirements'); toggleNotifPanel(); }
        });
      });
    }

    // Sort by time (newest first)
    notifs.sort((a, b) => new Date(b.time) - new Date(a.time));

    // Update bell dot
    const dot = document.getElementById('notifDot');
    if (dot) {
      if (notifs.length > 0) {
        dot.style.display = 'flex';
        dot.textContent = notifs.length > 9 ? '9+' : notifs.length;
      } else {
        dot.style.display = 'none';
      }
    }

    if (!notifs.length) {
      list.innerHTML = '<div style="text-align:center;padding:32px 20px;color:#475569;"><i class="fa-solid fa-bell-slash" style="font-size:1.8rem;margin-bottom:8px;display:block;opacity:0.4;"></i><p style="font-size:0.8rem;">No new notifications</p></div>';
      return;
    }

    list.innerHTML = notifs.map(function(n, idx) {
      const timeStr = n.time ? new Date(n.time).toLocaleString('en-IN', { day:'2-digit', month:'short', hour:'2-digit', minute:'2-digit' }) : '';
      return '<div onclick="_notifActions[' + idx + ']()" style="display:flex;align-items:flex-start;gap:10px;padding:12px 16px;border-bottom:1px solid rgba(255,255,255,0.06);cursor:pointer;transition:background 0.2s" onmouseover="this.style.background=\'rgba(255,255,255,0.04)\'" onmouseout="this.style.background=\'\'">' +
        '<div style="width:34px;height:34px;border-radius:10px;background:' + n.bg + ';display:flex;align-items:center;justify-content:center;flex-shrink:0">' +
        '<i class="fa-solid ' + n.icon + '" style="color:' + n.color + ';font-size:0.85rem"></i></div>' +
        '<div style="flex:1;min-width:0">' +
        '<div style="font-size:0.78rem;font-weight:700;color:#f1f5f9;margin-bottom:2px">' + n.title + '</div>' +
        '<div style="font-size:0.72rem;color:#64748b;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' + n.sub + '</div>' +
        (timeStr ? '<div style="font-size:0.65rem;color:#475569;margin-top:3px">' + timeStr + '</div>' : '') +
        '</div></div>';
    }).join('');

    // Store action callbacks
    window._notifActions = notifs.map(n => n.action);

  } catch(e) {
    list.innerHTML = '<div style="text-align:center;padding:20px;color:#475569;font-size:0.8rem">Could not load notifications</div>';
  }
}

function clearNotifs() {
  localStorage.removeItem('adminNotifs');
  document.getElementById('notifList').innerHTML = '<div style="text-align:center;padding:32px 20px;color:#475569;"><i class="fa-solid fa-bell-slash" style="font-size:1.8rem;margin-bottom:8px;display:block;opacity:0.4;"></i><p style="font-size:0.8rem;">No notifications yet</p></div>';
  document.getElementById('notifDot').style.display = 'none';
}
async function sendTestWA() {
  try {
    const data = await api('POST', '/send-wa', { message: 'Test notification from City Real Space Admin Panel!' });
    if (data.success) toast('WhatsApp sent! âœ…');
    else toast(data.message || 'WA Error', 'error');
  } catch(e) { toast('Error sending WA', 'error'); }
}
// ===== API STATUS CHECK =====
let _apiCheckInterval = null;
let _prevApiStatus = null;

async function checkAllServices() {
  const dot    = document.getElementById('apiStatusDot');
  const text   = document.getElementById('apiStatusText');
  const detail = document.getElementById('apiStatusDetail');
  const ping   = document.getElementById('apiStatusPing');
  const btn    = document.getElementById('apiRefreshBtn');

  if (btn) { btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Checking...'; btn.disabled = true; }

  const start = Date.now();
  try {
    const res  = await fetch(API + '/health', { signal: AbortSignal.timeout(8000) });
    const ms   = Date.now() - start;
    const data = await res.json().catch(() => ({}));

    if (res.ok) {
      if (dot)    { dot.style.background = '#10b981'; dot.style.boxShadow = '0 0 0 3px rgba(16,185,129,0.25)'; }
      if (text)   { text.style.color = '#34d399'; text.textContent = 'API Online'; }
      if (detail) detail.textContent = data.message || 'Server is running';
      if (ping)   ping.textContent = ms + 'ms';
      hideApiWarning();
      // Notify only when coming back online
      if (_prevApiStatus === 'offline') toast('API Server is back online!', 'success');
      _prevApiStatus = 'online';
    } else {
      throw new Error('HTTP ' + res.status);
    }
  } catch(e) {
    const ms = Date.now() - start;
    const msg = e.name === 'AbortError' ? 'Timeout' : e.message;
    if (dot)    { dot.style.background = '#ef4444'; dot.style.boxShadow = '0 0 0 3px rgba(239,68,68,0.25)'; }
    if (text)   { text.style.color = '#f87171'; text.textContent = 'API Offline'; }
    if (detail) detail.textContent = msg;
    if (ping)   ping.textContent = ms + 'ms';
    showApiWarning();
    // Notify only when going offline (not on every check)
    if (_prevApiStatus !== 'offline') toast('API Server is offline! Check backend.', 'error');
    _prevApiStatus = 'offline';
  } finally {
    if (btn) { btn.innerHTML = '<i class="fa-solid fa-rotate-right"></i> Test API'; btn.disabled = false; }
  }
}

async function checkApiStatus() { await checkAllServices(); }
async function testApiConnection() { await checkAllServices(); }

function showApiWarning() {
  if (document.getElementById('apiWarningBanner')) return;
  var b = document.createElement('div');
  b.id = 'apiWarningBanner';
  b.style.cssText = 'position:fixed;top:64px;left:240px;right:0;z-index:999;background:linear-gradient(135deg,#7f1d1d,#991b1b);border-bottom:1px solid rgba(239,68,68,0.4);padding:10px 20px;display:flex;align-items:center;gap:12px;font-family:Poppins,sans-serif;font-size:0.82rem;color:#fca5a5;animation:slideDown 0.3s ease';
  b.innerHTML = '<i class="fa-solid fa-triangle-exclamation" style="color:#f87171;font-size:1rem;flex-shrink:0"></i><span><strong>Backend Offline:</strong> API server not reachable. Website data may not load.</span><button onclick="checkAllServices()" style="margin-left:auto;background:rgba(239,68,68,0.2);border:1px solid rgba(239,68,68,0.4);color:#fca5a5;padding:5px 14px;border-radius:8px;font-size:0.75rem;font-weight:700;cursor:pointer;font-family:Poppins,sans-serif;flex-shrink:0">Retry</button><button onclick="this.parentElement.remove()" style="background:none;border:none;color:#f87171;cursor:pointer;font-size:1rem;flex-shrink:0"><i class="fa-solid fa-xmark"></i></button>';
  document.body.appendChild(b);
}

function hideApiWarning() {
  var b = document.getElementById('apiWarningBanner');
  if (b) b.remove();
}

setTimeout(checkAllServices, 1200);
_apiCheckInterval = setInterval(checkAllServices, 60000);

(function(){
  var s = document.createElement('style');
  s.textContent = '@keyframes slideDown{from{transform:translateY(-100%);opacity:0}to{transform:translateY(0);opacity:1}}';
  document.head.appendChild(s);
})();

// ===== INIT =====
document.body.style.visibility = 'visible';
loadStats();
// Load notification badge count on startup
setTimeout(loadNotifications, 1500);
// Set draft badge on load
(function() {
  const drafts = JSON.parse(localStorage.getItem('adminDrafts') || '[]');
  const badge = document.getElementById('draftBadge');
  if (badge && drafts.length) badge.textContent = drafts.length;
})();

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
        '<td>' + (c.email || 'â€”') + '</td>' +
        '<td>' + (c.subject || 'â€”') + '</td>' +
        '<td style="max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + c.message + '</td>' +
        '<td><select onchange="updateContactStatus(\'' + c._id + '\', this.value)" style="border:1.5px solid #e8e8e8;border-radius:7px;padding:4px 8px;font-size:0.78rem;font-family:Poppins,sans-serif;outline:none;cursor:pointer;">' +
        '<option value="new"'     + (c.status==='new'     ? ' selected' : '') + '>ðŸ”´ New</option>' +
        '<option value="read"'    + (c.status==='read'    ? ' selected' : '') + '>ðŸŸ¡ Read</option>' +
        '<option value="replied"' + (c.status==='replied' ? ' selected' : '') + '>ðŸŸ¢ Replied</option>' +
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
  await fetch(API + '/contact/' + id + '/status', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + adminToken },
    body: JSON.stringify({ status })
  });
  toast('Status updated!');
  loadContacts();
}

async function deleteContact(id) {
  if (!confirm('Delete this message?')) return;
  await fetch(API + '/contact/' + id, {
    method: 'DELETE',
    headers: { 'Authorization': 'Bearer ' + adminToken }
  });
  toast('Deleted.'); loadContacts();
}


// ===== OFFICE SPACE LOGIC =====
(function() {
  var _orig = window.onAdminTypeChange;
  window.onAdminTypeChange = function() {
    if (_orig) _orig();
    var type = document.getElementById('pType').value;
    var isOffice = type === 'office' || type === 'coworking';
    var isComm = ['office','shop','showroom','warehouse','factory','coworking','industrial_land'].indexOf(type) !== -1;
    var catEl = document.getElementById('pCategory');
    if (catEl) {
      catEl.value = isComm ? 'commercial' : 'residential';
      document.querySelectorAll('.hs-toggle-btn').forEach(function(b) {
        var oc = b.getAttribute('onclick') || '';
        if (oc.indexOf('pCategory') !== -1) b.classList.toggle('active', oc.indexOf(isComm ? 'commercial' : 'residential') !== -1);
      });
    }
    var of2 = document.getElementById('officeFields');
    if (of2) of2.style.display = isOffice ? 'block' : 'none';
    // Show commercial lift section for ALL commercial types
    var cls = document.getElementById('commercialLiftSection');
    if (cls) cls.style.display = (isComm && !isOffice) ? 'block' : 'none';
    var lt = document.getElementById('leaseTermsSection');
    if (lt) lt.style.display = isComm ? 'block' : 'none';
    // Show Fire & Legal section only for office SELL
    var osf = document.getElementById('officeSellFields');
    var pStatus = document.getElementById('pStatus') ? document.getElementById('pStatus').value : '';
    if (osf) osf.style.display = (isOffice && pStatus === 'for-sale') ? 'block' : 'none';
    document.querySelectorAll('.hs-field').forEach(function(f) {
      var lbl = f.querySelector('label');
      if (lbl && lbl.textContent.indexOf('Tenant Preference') !== -1) {
        var row = f.closest('.hs-row'); if (row) row.style.display = isComm ? 'none' : '';
      }
    });
  };
})();

function setMeetingRooms(btn, val) {
  btn.closest('div').querySelectorAll('.hs-toggle-btn').forEach(function(b){ b.classList.remove('active'); });
  btn.classList.add('active');
  document.getElementById('oMeetingRooms').value = val;
}


// ===== RESIDENTIAL FIELDS LOGIC =====
(function() {
  var _orig2 = window.onAdminTypeChange;
  window.onAdminTypeChange = function() {
    if (_orig2) _orig2();
    var type = document.getElementById('pType').value;
    var isRes = ['apartment','villa','bungalow','rowhouse'].indexOf(type) !== -1;
    var isRent = document.getElementById('pStatus') ? document.getElementById('pStatus').value === 'for-rent' : false;

    var rf = document.getElementById('residentialFields');
    if (rf) rf.style.display = isRes ? 'block' : 'none';

    var rd = document.getElementById('rentalDetailsSection');
    if (rd) rd.style.display = (isRes && isRent) ? 'block' : 'none';
    var sd = document.getElementById('sellPricingSection');
    if (sd) sd.style.display = (isRes && !isRent) ? 'block' : 'none';
    var sfRow = document.getElementById('rSuitableForRow');
    if (sfRow) sfRow.style.display = (isRes && isRent) ? '' : 'none';
  };

  // Also trigger on status change
  var statusEl = document.getElementById('pStatus');
  if (statusEl) {
    statusEl.addEventListener('change', function() {
      var type = document.getElementById('pType').value;
      var isRes = ['apartment','villa','bungalow','rowhouse'].indexOf(type) !== -1;
      var rd = document.getElementById('rentalDetailsSection');
      if (rd) rd.style.display = (isRes && this.value === 'for-rent') ? 'block' : 'none';
      var sd = document.getElementById('sellPricingSection');
      if (sd) sd.style.display = (isRes && this.value !== 'for-rent') ? 'block' : 'none';
    });
  }
})();

// Also hook into hsToggle for pStatus buttons
var _origHsToggle = window.hsToggle;
window.hsToggle = function(btn, fieldId, val) {
  if (_origHsToggle) _origHsToggle(btn, fieldId, val);
  if (fieldId === 'pStatus') {
    var type = document.getElementById('pType').value;
    var isRes = ['apartment','villa','bungalow','rowhouse'].indexOf(type) !== -1;
    var rd = document.getElementById('rentalDetailsSection');
    if (rd) rd.style.display = (isRes && val === 'for-rent') ? 'block' : 'none';
    var sd = document.getElementById('sellPricingSection');
    if (sd) sd.style.display = (isRes && (val === 'for-sale' || val === 'new-launch')) ? 'block' : 'none';
    var sfRow = document.getElementById('rSuitableForRow');
    if (sfRow) sfRow.style.display = (isRes && val === 'for-rent') ? '' : 'none';
  }
};

function hsChipRes(chip, fieldId, val) {
  chip.closest('.hs-chips').querySelectorAll('.hs-chip').forEach(function(c){ c.classList.remove('active'); });
  chip.classList.add('active');
  document.getElementById(fieldId).value = val;
}

function setResFurnishing(btn, val) {
  btn.closest('.hs-toggle').querySelectorAll('.hs-toggle-btn').forEach(function(b){ b.classList.remove('active'); });
  btn.classList.add('active');
  document.getElementById('rFurnishing').value = val;
  var pf = document.getElementById('pFurnished');
  if (pf) pf.value = val;
  var items = document.getElementById('furnishingItems');
  if (items) items.style.display = (val === 'Unfurnished') ? 'none' : 'block';
}

function calcSBA() {
  var carpet = parseFloat(document.getElementById('rCarpet').value) || 0;
  var sba = document.getElementById('rSBA');
  if (carpet > 0 && !sba.value) sba.value = Math.round(carpet * 1.25);
  var pSqft = document.getElementById('pSqft');
  if (pSqft && !pSqft.value && sba.value) pSqft.value = sba.value;
  updateAdminScore();
}



