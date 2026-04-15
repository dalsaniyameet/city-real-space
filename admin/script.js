const API = (function() {
  if (window.location.protocol === 'file:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:5000/api';
  }
  return 'https://city-real-space.vercel.app/api';
})();

console.log('🔒 Admin Panel Script - API Endpoint:', API);

// ===== CITY → LOCALITY DATA =====
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

// City change → populate locality
document.getElementById('pCitySelect').addEventListener('change', function() {
  const city = this.value;
  const areaEl = document.getElementById('pAreaSelect');
  const subEl  = document.getElementById('pSubAreaSelect');
  const projEl = document.getElementById('pProjectSelect');
  const locs   = Object.keys(cityLocalities[city] || {});
  areaEl.innerHTML = '<option value="">-- Select Locality --</option>' +
    locs.map(l => '<option value="' + l + '">' + l + '</option>').join('') +
    '<option value="__other__">Other (Type Manually)</option>';
  subEl.innerHTML  = '<option value="">-- Select Locality First --</option>';
  projEl.innerHTML = '<option value="">-- Select Locality First --</option>';
  document.getElementById('pSubArea').value  = '';
  document.getElementById('pProject').value  = '';
});

// Locality change → populate sub-area + projects
document.getElementById('pAreaSelect').addEventListener('change', function() {
  const city  = document.getElementById('pCitySelect').value;
  const area  = this.value;
  const subEl = document.getElementById('pSubAreaSelect');
  const projEl = document.getElementById('pProjectSelect');
  if (area === '__other__') {
    subEl.innerHTML  = '<option value="">-- N/A --</option>';
    projEl.innerHTML = '<option value="">-- N/A --</option>';
    return;
  }
  const subs     = (cityLocalities[city] && cityLocalities[city][area]) || [];
  const projects = (cityData[city] && cityData[city][area] && cityData[city][area].projects) || [];
  subEl.innerHTML = '<option value="">-- Select Sub Area --</option>' +
    subs.map(s => '<option value="' + s + '">' + s + '</option>').join('') +
    '<option value="__other__">Other (Type Manually)</option>';
  projEl.innerHTML = '<option value="">-- Select Project --</option>' +
    projects.map(p => '<option value="' + p + '">' + p + '</option>').join('') +
    '<option value="__other__">Other (Type Manually)</option>';
  document.getElementById('pSubArea').value = '';
  document.getElementById('pProject').value = '';
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

// Project select → fill text input
function onProjectSelectChange() {
  const sel = document.getElementById('pProjectSelect');
  const txt = document.getElementById('pProject');
  if (sel.value && sel.value !== '__other__') {
    txt.value = sel.value;
  } else if (sel.value === '__other__') {
    txt.value = '';
    txt.focus();
  }
}

// cityData reference for projects — real Ahmedabad societies/projects
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

// ===== AUTH GUARD — instant check before anything loads =====
const adminToken = localStorage.getItem('adminToken');
const adminUser  = JSON.parse(localStorage.getItem('adminUser') || 'null');
if (!adminToken || !adminUser || adminUser.role !== 'admin') {
  window.location.replace('login.html');
  throw new Error('Unauthorized');
}

// ===== SESSION TIMEOUT — 24 hours =====
const SESSION_TIMEOUT = 24 * 60 * 60 * 1000;
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
  const isCommercial = p.category === 'commercial' || ['office','shop','showroom','warehouse','factory','coworking','industrial_land'].includes(p.type);
  const typeLabel = { apartment:'Apartment', villa:'Villa', bungalow:'Bungalow', rowhouse:'Row House', plot:'Plot', office:'Office', shop:'Shop', showroom:'Showroom', warehouse:'Warehouse', factory:'Factory', coworking:'Co-working', industrial_land:'Industrial Land' };
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
  // Reset stepper to step 1
  document.querySelectorAll('.step-panel').forEach(function(p) { p.classList.remove('active','slide-back'); });
  document.querySelectorAll('.stepper-step').forEach(function(t) { t.classList.remove('active','done'); });
  document.getElementById('step-1').classList.add('active');
  document.getElementById('step-tab-1').classList.add('active');
  updateStepperProgress(1);
  initAmenitiesGrid([]);
  _ascPrev = -1;
  updateAdminScore();
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
  // Populate project dropdown
  const projects = (cityData[city] && cityData[city][area] && cityData[city][area].projects) || [];
  const projEl = document.getElementById('pProjectSelect');
  projEl.innerHTML = '<option value="">-- Select Project --</option>' +
    projects.map(pr => '<option value="' + pr + '">' + pr + '</option>').join('') +
    '<option value="__other__">Other (Type Manually)</option>';
  const projVal = (p.extraDetails && p.extraDetails.project) || '';
  projEl.value = projects.includes(projVal) ? projVal : '';
  document.getElementById('pProject').value = projVal;

  document.getElementById('pBeds').value = p.specs ? p.specs.beds : 0;
  // Restore BHK chip active state
  const bedsVal = String(p.specs && p.specs.beds ? (p.specs.beds >= 4 ? '4' : p.specs.beds) : '');
  document.querySelectorAll('#bhkChips .hs-chip').forEach(function(c) {
    c.classList.toggle('active', c.textContent.trim().startsWith(bedsVal));
  });
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
  initAmenitiesGrid(p.amenities || []);
  // Reset stepper to step 1
  document.querySelectorAll('.step-panel').forEach(function(p2) { p2.classList.remove('active','slide-back'); });
  document.querySelectorAll('.stepper-step').forEach(function(t) { t.classList.remove('active','done'); });
  document.getElementById('step-1').classList.add('active');
  document.getElementById('step-tab-1').classList.add('active');
  updateStepperProgress(1);
  _ascPrev = -1;
  updateAdminScore();
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
    amenities: getSelectedAmenities(),
    extraDetails: {
      balconies: Number(document.getElementById('pBalconies').value) || 0,
      floor: document.getElementById('pFloor').value,
      totalFloors: document.getElementById('pTotalFloors').value,
      furnished: document.getElementById('pFurnished').value,
      possession: document.getElementById('pPossession').value,
      project: document.getElementById('pProject').value || (document.getElementById('pProjectSelect').value !== '__other__' ? document.getElementById('pProjectSelect').value : ''),
      tokenAmount: document.getElementById('pToken').value,
      subArea: document.getElementById('pSubArea').value || (document.getElementById('pSubAreaSelect').value !== '__other__' ? document.getElementById('pSubAreaSelect').value : '')
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
  const pending = data.properties.filter(function(p){return !p.isApproved;}).length;
  document.getElementById('subBadge').textContent = pending || '';
  tbody.innerHTML = data.properties.map(function(p) {
    const postedName = p.postedBy ? ((p.postedBy.firstName || '') + ' ' + (p.postedBy.lastName || '')).trim() || p.postedBy.name || '—' : '—';
    const postedPhone = p.postedBy ? (p.postedBy.phone || '—') : '—';
    const postedRole  = p.postedBy ? (p.postedBy.role || '') : '';
    return '<tr>' +
      '<td><div style="display:flex;align-items:center;gap:10px">' +
      (p.images && p.images[0] ? '<img src="' + p.images[0] + '" class="prop-thumb"/>' : '<div style="width:48px;height:36px;background:#f0f0f0;border-radius:6px;display:flex;align-items:center;justify-content:center;color:#ccc"><i class="fa-solid fa-image"></i></div>') +
      '<div class="prop-info"><strong>' + (p.title || 'Untitled') + '</strong><span style="color:var(--text3);font-size:0.7rem">' + (p.type || '') + (p.category ? ' • ' + p.category : '') + '</span></div></div></td>' +
      '<td><strong style="color:var(--text)">' + postedName + '</strong>' + (postedRole ? '<br><span style="font-size:0.68rem;color:var(--text3)">' + postedRole + '</span>' : '') + '</td>' +
      '<td><a href="tel:' + postedPhone + '" style="color:#60a5fa;font-weight:600;font-size:0.82rem">' + postedPhone + '</a></td>' +
      '<td>' + (p.location ? (p.location.area || '') + (p.location.city ? ', ' + p.location.city : '') : '—') + '</td>' +
      '<td><strong>' + (p.priceLabel || (p.price ? '₹' + Number(p.price).toLocaleString('en-IN') : '—')) + '</strong></td>' +
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
  if (data.success) { toast('Approved! ✅'); loadSubmissions(); loadStats(); loadNotifications(); }
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
    document.getElementById('propModalTitle').textContent = 'Add Property — For ' + name;
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

// ===== BHK SQFT AUTO-SUGGEST DATA =====
const BHK_SQFT = {
  apartment: { '1': [450,650],  '2': [850,1200],  '3': [1200,1800], '4': [1800,2800] },
  villa:     { '1': [1200,1800],'2': [1800,2500],  '3': [2500,3500], '4': [3500,5000] },
  bungalow:  { '1': [1500,2000],'2': [2000,3000],  '3': [3000,4500], '4': [4500,7000] },
  rowhouse:  { '1': [800,1200], '2': [1200,1800],  '3': [1800,2800], '4': [2800,4000] },
  plot: {}, office: {}, shop: {}, showroom: {}, warehouse: {}, factory: {}, coworking: {}, industrial_land: {},
};

const TYPE_AREA_LABEL = {
  apartment:       '📐 Super Built-up Area (sq.ft)',
  villa:           '📐 Built-up Area (sq.ft)',
  bungalow:        '📐 Built-up Area (sq.ft)',
  rowhouse:        '📐 Built-up Area (sq.ft)',
  plot:            '📐 Plot Area (sq.ft)',
  office:          '📐 Carpet Area (sq.ft)',
  shop:            '📐 Carpet Area (sq.ft)',
  showroom:        '📐 Carpet Area (sq.ft)',
  warehouse:       '📐 Built-up Area (sq.ft)',
  factory:         '📐 Built-up / Plot Area (sq.ft)',
  coworking:       '📐 Carpet Area (sq.ft)',
  industrial_land: '📐 Land Area (sq.ft)',
};

function onAdminTypeChange() {
  updateAdminTypeFields();
  showSqftSuggest();
}

function hsChipBhk(chip, val) {
  chip.closest('.hs-chips').querySelectorAll('.hs-chip').forEach(c => c.classList.remove('active'));
  chip.classList.add('active');
  document.getElementById('pBeds').value = val;
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

  hint.textContent = '💡 Typical ' + beds + ' BHK ' + (type||'') + ': ' + lo + '–' + hi + ' sq.ft';
  hint.style.display = 'block';

  box.innerHTML = suggestions.map(s =>
    '<div onclick="document.getElementById(\'pSqft\').value=' + s + ';document.getElementById(\'sqftSuggest\').style.display=\'none\';updateAdminScore()" ' +
    'style="padding:8px 14px;cursor:pointer;font-size:0.82rem;font-weight:600;color:#FF4D4D;border-bottom:1px solid #fff5f5;transition:background 0.15s" ' +
    'onmouseover="this.style.background=\'#fff5f5\'" onmouseout="this.style.background=\'\'">📐 ' + s + ' sq.ft</div>'
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
  const type = document.getElementById('pType').value;
  const cfg  = ADMIN_TYPE_CONFIG[type] || { residential: false, plot: false, commercial: false, floor: false, carpet: false, build: false };
  const bedsRow   = document.getElementById('adminBedsRow');       if (bedsRow)   bedsRow.style.display       = cfg.residential ? '' : 'none';
  const seatsRow  = document.getElementById('adminSeatsRow');      if (seatsRow)  seatsRow.style.display      = cfg.commercial  ? '' : 'none';
  const plotRow   = document.getElementById('adminPlotRow');       if (plotRow)   plotRow.style.display       = cfg.plot        ? '' : 'none';
  const commRow   = document.getElementById('adminCommercialRow'); if (commRow)   commRow.style.display       = cfg.commercial  ? '' : 'none';
  const floorRow  = document.getElementById('adminFloorRow');      if (floorRow)  floorRow.style.display      = cfg.floor       ? '' : 'none';
  const furnRow   = document.getElementById('adminFurnishedRow');  if (furnRow)   furnRow.style.display       = (cfg.residential || cfg.commercial) ? '' : 'none';
  const carpetGrp = document.getElementById('pCarpetGrp');         if (carpetGrp) carpetGrp.style.display     = cfg.carpet      ? '' : 'none';
  const builtGrp  = document.getElementById('pBuiltGrp');          if (builtGrp)  builtGrp.style.display      = cfg.build       ? '' : 'none';
  // Update area label
  const areaLabel = document.getElementById('pSqftLabel');
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
      btn.innerHTML = '<i class="fas fa-fire"></i> High Listing — Publish!';
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
  if (data.success) { toast('Deleted! ✅'); loadContacts(); }
  else toast('Error: ' + (data.message || 'Delete failed'), 'error');
}

// ===== AMENITIES GRID =====
const AMENITIES_BY_TYPE = {
  apartment: [
    { icon: '🛗', label: 'Lift' },
    { icon: '🏊', label: 'Swimming Pool' },
    { icon: '🏋️', label: 'Gymnasium' },
    { icon: '🔒', label: '24/7 Security' },
    { icon: '🅿️', label: 'Covered Parking' },
    { icon: '⚡', label: 'Power Backup' },
    { icon: '🌿', label: 'Garden / Park' },
    { icon: '🎮', label: 'Clubhouse' },
    { icon: '🏃', label: 'Jogging Track' },
    { icon: '📡', label: 'Intercom' },
    { icon: '🌊', label: 'Water Supply 24/7' },
    { icon: '🔥', label: 'Gas Pipeline' },
    { icon: '🧹', label: 'Housekeeping' },
    { icon: '🛝', label: 'Kids Play Area' },
    { icon: '🎾', label: 'Sports Court' },
    { icon: '🐾', label: 'Pet Friendly' },
    { icon: '📶', label: 'High Speed Internet' },
    { icon: '🚿', label: 'Rainwater Harvesting' },
  ],
  villa: [
    { icon: '🌿', label: 'Private Garden' },
    { icon: '🏊', label: 'Private Pool' },
    { icon: '🅿️', label: 'Private Parking' },
    { icon: '🔒', label: '24/7 Security' },
    { icon: '⚡', label: 'Power Backup' },
    { icon: '🏋️', label: 'Home Gym' },
    { icon: '🎮', label: 'Clubhouse' },
    { icon: '🔥', label: 'Gas Pipeline' },
    { icon: '🌊', label: 'Water Supply 24/7' },
    { icon: '📡', label: 'Intercom' },
    { icon: '🐾', label: 'Pet Friendly' },
    { icon: '📶', label: 'High Speed Internet' },
    { icon: '🛝', label: 'Kids Play Area' },
    { icon: '🎾', label: 'Sports Court' },
  ],
  bungalow: [
    { icon: '🌿', label: 'Private Garden' },
    { icon: '🅿️', label: 'Private Parking' },
    { icon: '🔒', label: '24/7 Security' },
    { icon: '⚡', label: 'Power Backup' },
    { icon: '🔥', label: 'Gas Pipeline' },
    { icon: '🌊', label: 'Water Supply 24/7' },
    { icon: '📡', label: 'Intercom' },
    { icon: '🐾', label: 'Pet Friendly' },
    { icon: '📶', label: 'High Speed Internet' },
    { icon: '🏊', label: 'Swimming Pool' },
  ],
  rowhouse: [
    { icon: '🌿', label: 'Garden' },
    { icon: '🅿️', label: 'Parking' },
    { icon: '🔒', label: '24/7 Security' },
    { icon: '⚡', label: 'Power Backup' },
    { icon: '🔥', label: 'Gas Pipeline' },
    { icon: '🌊', label: 'Water Supply 24/7' },
    { icon: '📡', label: 'Intercom' },
    { icon: '🎮', label: 'Clubhouse' },
    { icon: '🛝', label: 'Kids Play Area' },
    { icon: '📶', label: 'High Speed Internet' },
  ],
  plot: [
    { icon: '🌊', label: 'Water Connection' },
    { icon: '⚡', label: 'Electricity Connection' },
    { icon: '🛣️', label: 'Road Access' },
    { icon: '🔒', label: 'Gated Community' },
    { icon: '🌿', label: 'Landscaping' },
    { icon: '🚿', label: 'Drainage' },
    { icon: '📶', label: 'Internet Ready' },
  ],
  office: [
    { icon: '🅿️', label: 'Parking' },
    { icon: '🛗', label: 'Lift' },
    { icon: '⚡', label: 'Power Backup' },
    { icon: '🔒', label: '24/7 Security' },
    { icon: '❄️', label: 'Central AC' },
    { icon: '📶', label: 'High Speed Internet' },
    { icon: '🍽️', label: 'Cafeteria' },
    { icon: '🚿', label: 'Washroom' },
    { icon: '🎥', label: 'CCTV' },
    { icon: '🏢', label: 'Reception Area' },
    { icon: '🔥', label: 'Fire Safety' },
    { icon: '♿', label: 'Wheelchair Access' },
  ],
  shop: [
    { icon: '🅿️', label: 'Parking' },
    { icon: '⚡', label: 'Power Backup' },
    { icon: '🔒', label: 'Security' },
    { icon: '❄️', label: 'AC' },
    { icon: '🎥', label: 'CCTV' },
    { icon: '🛗', label: 'Lift' },
    { icon: '🔥', label: 'Fire Safety' },
    { icon: '📶', label: 'Internet Ready' },
    { icon: '🚿', label: 'Washroom' },
  ],
  warehouse: [
    { icon: '🅿️', label: 'Loading Dock' },
    { icon: '⚡', label: '3-Phase Power' },
    { icon: '🔒', label: '24/7 Security' },
    { icon: '🎥', label: 'CCTV' },
    { icon: '🔥', label: 'Fire Safety' },
    { icon: '🚿', label: 'Washroom' },
    { icon: '🛣️', label: 'Highway Access' },
    { icon: '📦', label: 'Storage Racks' },
    { icon: '❄️', label: 'Cold Storage' },
  ],
  showroom: [
    { icon: '🅿️', label: 'Parking' },
    { icon: '⚡', label: 'Power Backup' },
    { icon: '🔒', label: 'Security' },
    { icon: '❄️', label: 'Central AC' },
    { icon: '🎥', label: 'CCTV' },
    { icon: '🛗', label: 'Lift' },
    { icon: '🔥', label: 'Fire Safety' },
    { icon: '📶', label: 'High Speed Internet' },
    { icon: '🚿', label: 'Washroom' },
    { icon: '🏢', label: 'Reception Area' },
    { icon: '💡', label: 'Display Lighting' },
    { icon: '♿', label: 'Wheelchair Access' },
  ],
  factory: [
    { icon: '⚡', label: '3-Phase Power' },
    { icon: '🅿️', label: 'Loading / Unloading' },
    { icon: '🔒', label: '24/7 Security' },
    { icon: '🎥', label: 'CCTV' },
    { icon: '🔥', label: 'Fire Safety' },
    { icon: '🚿', label: 'Washroom' },
    { icon: '🛣️', label: 'Highway Access' },
    { icon: '🌊', label: 'Water Supply' },
    { icon: '🏭', label: 'Overhead Crane' },
    { icon: '📦', label: 'Storage Area' },
    { icon: '♻️', label: 'Effluent Treatment' },
  ],
  coworking: [
    { icon: '📶', label: 'High Speed Internet' },
    { icon: '❄️', label: 'Central AC' },
    { icon: '🅿️', label: 'Parking' },
    { icon: '🛗', label: 'Lift' },
    { icon: '⚡', label: 'Power Backup' },
    { icon: '🔒', label: '24/7 Security' },
    { icon: '🎥', label: 'CCTV' },
    { icon: '🍽️', label: 'Cafeteria' },
    { icon: '🖨️', label: 'Printer / Scanner' },
    { icon: '📹', label: 'Conference Room' },
    { icon: '🛋️', label: 'Lounge Area' },
    { icon: '🔥', label: 'Fire Safety' },
  ],
  industrial_land: [
    { icon: '🌊', label: 'Water Connection' },
    { icon: '⚡', label: '3-Phase Power' },
    { icon: '🛣️', label: 'Road Access' },
    { icon: '🔒', label: 'Gated / Fenced' },
    { icon: '🚿', label: 'Drainage' },
    { icon: '🏭', label: 'GIDC Zone' },
    { icon: '📦', label: 'Warehouse Permitted' },
    { icon: '♻️', label: 'ETP Facility' },
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


function hsToggle(btn, fieldId, val) {
  btn.closest('.hs-toggle').querySelectorAll('.hs-toggle-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById(fieldId).value = val;
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
  // 5 steps: 0% at step1, 100% at step5
  const pct = ((currentStep - 1) / 4) * 100;
  fill.style.height = pct + '%';
}

function hsValidateStep(step) {
  // Remove old errors
  document.querySelectorAll('.hs-field-error').forEach(el => el.classList.remove('hs-field-error'));
  document.querySelectorAll('.hs-error-msg').forEach(el => el.remove());

  function markErr(fieldId, msg) {
    const el = document.getElementById(fieldId);
    if (!el) return;
    const wrap = el.closest('.hs-field');
    if (wrap) {
      wrap.classList.add('hs-field-error');
      const err = document.createElement('div');
      err.className = 'hs-error-msg';
      err.innerHTML = '<i class="fa-solid fa-circle-exclamation"></i> ' + msg;
      wrap.appendChild(err);
    }
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  if (step === 1) {
    let ok = true;
    if (!document.getElementById('pCitySelect').value) { markErr('pCitySelect', 'City is required'); ok = false; }
    if (!document.getElementById('pAreaSelect').value || document.getElementById('pAreaSelect').value === '__other__') { markErr('pAreaSelect', 'Locality is required'); ok = false; }
    if (!document.getElementById('pType').value) { markErr('pType', 'Property type is required'); ok = false; }
    return ok;
  }
  if (step === 3) {
    if (!(Number(document.getElementById('pPrice').value) > 0)) { markErr('pPrice', 'Price is required'); return false; }
    return true;
  }
  if (step === 4) {
    if (document.getElementById('pTitle').value.trim().length < 5) { markErr('pTitle', 'Title must be at least 5 characters'); return false; }
    return true;
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
}

function buildReviewGrid() {
  const grid = document.getElementById('reviewGrid');
  if (!grid) return;
  const fields = [
    ['Type', document.getElementById('pType').value],
    ['City', document.getElementById('pCitySelect').value],
    ['Area', document.getElementById('pAreaSelect').value || document.getElementById('pSubArea').value],
    ['Price', document.getElementById('pPrice').value],
    ['Sqft', document.getElementById('pSqft').value],
    ['Title', document.getElementById('pTitle').value],
  ];
  grid.innerHTML = fields.map(([k,v]) =>
    '<div style="padding:8px 12px;background:#f8f9fa;border-radius:8px;margin-bottom:6px;font-size:0.82rem;"><strong>' + k + ':</strong> ' + (v || '<span style="color:#aaa">—</span>') + '</div>'
  ).join('');
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
function saveDraft() {
  const draft = {
    id: Date.now(),
    title: document.getElementById('pTitle').value || 'Untitled Draft',
    type: document.getElementById('pType').value,
    category: document.getElementById('pCategory').value,
    status: document.getElementById('pStatus').value,
    city: document.getElementById('pCitySelect').value,
    area: document.getElementById('pAreaSelect').value,
    subArea: document.getElementById('pSubArea').value,
    project: document.getElementById('pProject').value,
    beds: document.getElementById('pBeds').value,
    sqft: document.getElementById('pSqft').value,
    price: document.getElementById('pPrice').value,
    priceLabel: document.getElementById('pPriceLabel').value,
    desc: document.getElementById('pDesc').value,
    agentName: document.getElementById('pAgentName').value,
    agentPhone: document.getElementById('pAgentPhone').value,
    furnished: document.getElementById('pFurnished').value,
    savedAt: new Date().toISOString()
  };
  const drafts = JSON.parse(localStorage.getItem('adminDrafts') || '[]');
  drafts.unshift(draft);
  localStorage.setItem('adminDrafts', JSON.stringify(drafts));
  const badge = document.getElementById('draftBadge');
  if (badge) badge.textContent = drafts.length;
  toast('✅ Draft saved!');
  closeModal('propModal');
}

function loadDrafts() {
  const drafts = JSON.parse(localStorage.getItem('adminDrafts') || '[]');
  const grid = document.getElementById('draftsGrid');
  const badge = document.getElementById('draftBadge');
  if (badge) badge.textContent = drafts.length || '';
  if (!drafts.length) {
    grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:60px 20px;color:var(--text3)"><i class="fa-regular fa-floppy-disk" style="font-size:2.5rem;display:block;margin-bottom:12px;opacity:0.3"></i><p style="font-size:0.9rem">No saved drafts yet.<br><small>Click "Save Draft" while adding a property.</small></p></div>';
    return;
  }
  const typeIcon = { apartment:'🏢', villa:'🏡', bungalow:'🏠', rowhouse:'🏘️', plot:'🌿', office:'🏢', shop:'🏪', showroom:'🚗', warehouse:'🏭', factory:'⚙️', coworking:'💻', industrial_land:'🌍' };
  const typeLabel = { apartment:'Apartment', villa:'Villa', bungalow:'Bungalow', rowhouse:'Row House', plot:'Plot', office:'Office', shop:'Shop', showroom:'Showroom', warehouse:'Warehouse', factory:'Factory', coworking:'Co-working', industrial_land:'Industrial Land' };
  grid.innerHTML = drafts.map(function(d, idx) {
    const icon  = typeIcon[d.type] || '🏠';
    const tLabel = typeLabel[d.type] || d.type || 'Property';
    const loc   = [d.area, d.city].filter(Boolean).join(', ') || '—';
    const price = d.price ? '₹' + Number(d.price).toLocaleString('en-IN') : '—';
    const beds  = d.beds ? d.beds + ' BHK' : '';
    const sqft  = d.sqft ? d.sqft + ' sq.ft' : '';
    const saved = new Date(d.savedAt).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' });
    return '<div style="background:var(--card);border:1px solid var(--border);border-radius:16px;padding:20px;display:flex;flex-direction:column;gap:12px;transition:all 0.25s;position:relative;overflow:hidden" ' +
      'onmouseover="this.style.borderColor=\'rgba(99,102,241,0.4)\';this.style.transform=\'translateY(-2px)\'" ' +
      'onmouseout="this.style.borderColor=\'var(--border)\';this.style.transform=\'\'">' +
      // Top accent line
      '<div style="position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,var(--accent),var(--accent2))"></div>' +
      // Header
      '<div style="display:flex;align-items:flex-start;justify-content:space-between;gap:8px">' +
        '<div style="display:flex;align-items:center;gap:10px">' +
          '<div style="width:40px;height:40px;background:rgba(99,102,241,0.12);border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:1.3rem;flex-shrink:0">' + icon + '</div>' +
          '<div>' +
            '<div style="font-size:0.88rem;font-weight:700;color:var(--text);line-height:1.3;max-width:160px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + (d.title || 'Untitled Draft') + '</div>' +
            '<div style="font-size:0.72rem;color:var(--text3);margin-top:2px">' + tLabel + '</div>' +
          '</div>' +
        '</div>' +
        '<button onclick="deleteDraft(' + idx + ')" style="width:26px;height:26px;border-radius:8px;border:none;background:rgba(239,68,68,0.12);color:#f87171;cursor:pointer;font-size:0.75rem;display:flex;align-items:center;justify-content:center;flex-shrink:0" title="Delete draft"><i class="fa-solid fa-trash"></i></button>' +
      '</div>' +
      // Details
      '<div style="display:flex;flex-direction:column;gap:6px">' +
        '<div style="display:flex;align-items:center;gap:6px;font-size:0.78rem;color:var(--text2)"><i class="fa-solid fa-location-dot" style="color:var(--accent);width:14px"></i>' + loc + '</div>' +
        (price !== '—' ? '<div style="display:flex;align-items:center;gap:6px;font-size:0.78rem;color:var(--text2)"><i class="fa-solid fa-indian-rupee-sign" style="color:#10b981;width:14px"></i>' + price + '</div>' : '') +
        ([beds, sqft].filter(Boolean).length ? '<div style="display:flex;align-items:center;gap:6px;font-size:0.78rem;color:var(--text2)"><i class="fa-solid fa-ruler-combined" style="color:#f59e0b;width:14px"></i>' + [beds, sqft].filter(Boolean).join(' • ') + '</div>' : '') +
        (d.desc ? '<div style="font-size:0.72rem;color:var(--text3);line-height:1.5;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical">' + d.desc.substring(0, 100) + (d.desc.length > 100 ? '...' : '') + '</div>' : '') +
      '</div>' +
      // Footer
      '<div style="display:flex;align-items:center;justify-content:space-between;padding-top:10px;border-top:1px solid var(--border)">' +
        '<span style="font-size:0.68rem;color:var(--text3)"><i class="fa-regular fa-clock" style="margin-right:4px"></i>' + saved + '</span>' +
        '<button onclick="loadDraftIntoForm(' + idx + ')" style="background:linear-gradient(135deg,var(--accent),var(--accent2));color:#fff;border:none;padding:6px 14px;border-radius:8px;font-size:0.75rem;font-weight:700;cursor:pointer;font-family:Poppins,sans-serif;display:flex;align-items:center;gap:5px"><i class="fa-solid fa-pen"></i> Continue</button>' +
      '</div>' +
    '</div>';
  }).join('');
}

function deleteDraft(idx) {
  const drafts = JSON.parse(localStorage.getItem('adminDrafts') || '[]');
  drafts.splice(idx, 1);
  localStorage.setItem('adminDrafts', JSON.stringify(drafts));
  toast('Draft deleted.');
  loadDrafts();
}

function loadDraftIntoForm(idx) {
  const drafts = JSON.parse(localStorage.getItem('adminDrafts') || '[]');
  const d = drafts[idx];
  if (!d) return;
  // Open modal fresh
  document.getElementById('propModalTitle').textContent = 'Continue Draft';
  document.getElementById('propForm').reset();
  document.getElementById('propId').value = '';
  document.getElementById('pApproved').checked = true;
  document.getElementById('pImagePreview').innerHTML = '';
  // Reset stepper
  document.querySelectorAll('.step-panel').forEach(p => p.classList.remove('active','slide-back'));
  document.querySelectorAll('.stepper-step').forEach(t => t.classList.remove('active','done'));
  document.getElementById('step-1').classList.add('active');
  document.getElementById('step-tab-1').classList.add('active');
  updateStepperProgress(1);
  // Fill saved values
  setTimeout(function() {
    if (d.type)     { document.getElementById('pType').value = d.type; onAdminTypeChange(); }
    if (d.city)     {
      document.getElementById('pCitySelect').value = d.city;
      document.getElementById('pCitySelect').dispatchEvent(new Event('change'));
    }
    setTimeout(function() {
      if (d.area)   { document.getElementById('pAreaSelect').value = d.area; document.getElementById('pAreaSelect').dispatchEvent(new Event('change')); }
      setTimeout(function() {
        if (d.subArea)  document.getElementById('pSubArea').value = d.subArea;
        if (d.project)  document.getElementById('pProject').value = d.project;
        if (d.beds)     {
          document.getElementById('pBeds').value = d.beds;
          document.querySelectorAll('#bhkChips .hs-chip').forEach(c => c.classList.toggle('active', c.textContent.trim().startsWith(d.beds)));
        }
        if (d.sqft)     document.getElementById('pSqft').value = d.sqft;
        if (d.price)    document.getElementById('pPrice').value = d.price;
        if (d.priceLabel) document.getElementById('pPriceLabel').value = d.priceLabel;
        if (d.desc)     document.getElementById('pDesc').value = d.desc;
        if (d.agentName)  document.getElementById('pAgentName').value = d.agentName;
        if (d.agentPhone) document.getElementById('pAgentPhone').value = d.agentPhone;
        if (d.category) {
          document.getElementById('pCategory').value = d.category;
          document.querySelectorAll('.hs-toggle-btn').forEach(b => {
            if (b.getAttribute('onclick') && b.getAttribute('onclick').includes("'pCategory'")) {
              b.classList.toggle('active', b.getAttribute('onclick').includes("'" + d.category + "'"));
            }
          });
        }
        if (d.furnished) {
          document.getElementById('pFurnished').value = d.furnished;
          document.querySelectorAll('.hs-toggle-btn').forEach(b => {
            if (b.getAttribute('onclick') && b.getAttribute('onclick').includes("'pFurnished'")) {
              b.classList.toggle('active', b.getAttribute('onclick').includes("'" + d.furnished + "'"));
            }
          });
        }
        initAmenitiesGrid([]);
        updateAdminScore();
      }, 150);
    }, 150);
  }, 50);
  openModal('propModal');
}

function clearAllDrafts() {
  if (!confirm('Clear all saved drafts?')) return;
  localStorage.removeItem('adminDrafts');
  const badge = document.getElementById('draftBadge');
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
          sub: (i.name || 'Someone') + ' — ' + (i.lookingFor || 'Property inquiry'),
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
    if (data.success) toast('WhatsApp sent! ✅');
    else toast(data.message || 'WA Error', 'error');
  } catch(e) { toast('Error sending WA', 'error'); }
}
async function checkApiStatus() {}
async function testApiConnection() {}

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
