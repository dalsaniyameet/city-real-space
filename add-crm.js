const fs = require('fs');

const CRM_URL = 'https://crs-crm.vercel.app/api/webhooks/website';

let code = fs.readFileSync('script.original.js', 'utf8');

// 1. Offer modal - CRLF line endings
const offerOld = "body: JSON.stringify({ name, phone, propertyName: title, propertyType: title, lookingFor: 'Get Offer', city: loc, message: 'Get Offer request for: ' + title + ' (' + loc + ')' })\r\n      });\r\n    } catch(e) {}";

const offerNew = "body: JSON.stringify({ name, phone, propertyName: title, propertyType: title, lookingFor: 'Get Offer', city: loc, message: 'Get Offer request for: ' + title + ' (' + loc + ')' })\r\n      });\r\n      fetch('" + CRM_URL + "', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ name, phone, requirements: 'Get Offer: ' + title + ' (' + loc + ')', source: 'offer-modal' }) }).catch(()=>{});\r\n    } catch(e) {}";

// 2. Inquiry form - CRLF line endings
const inqOld = "    const data = await res.json();\r\n    const refId = data.inquiry?.refId || ('CRS-' + Math.floor(100000 + Math.random() * 900000));\r\n    document.getElementById('inqRefId').textContent = refId;\r\n  } catch {\r\n    document.getElementById('inqRefId').textContent = 'CRS-' + Math.floor(100000 + Math.random() * 900000);\r\n  }";

const inqNew = "    const data = await res.json();\r\n    const refId = data.inquiry?.refId || ('CRS-' + Math.floor(100000 + Math.random() * 900000));\r\n    document.getElementById('inqRefId').textContent = refId;\r\n    fetch('" + CRM_URL + "', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ name: body.name, phone: body.phone, email: body.email, requirements: (body.lookingFor || '') + (body.message ? ': ' + body.message : ''), budget: body.budget, source: 'inquiry-form' }) }).catch(()=>{});\r\n  } catch {\r\n    document.getElementById('inqRefId').textContent = 'CRS-' + Math.floor(100000 + Math.random() * 900000);\r\n  }";

if (code.includes(offerOld)) {
  code = code.replace(offerOld, offerNew);
  console.log('✅ Offer modal CRM webhook added');
} else {
  console.log('❌ Offer modal pattern not found');
}

if (code.includes(inqOld)) {
  code = code.replace(inqOld, inqNew);
  console.log('✅ Inquiry form CRM webhook added');
} else {
  console.log('❌ Inquiry form pattern not found');
}

fs.writeFileSync('script.original.js', code, 'utf8');
console.log('Done!');
