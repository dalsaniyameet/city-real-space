const fs = require('fs');
const path = require('path');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

const broken = `<a href="https://maps.google.com/?q=D-102,+Prahlad+Nagar+Trade+Centre,+Radio+Mirchi+Road,+Nr.+Time+of+India+Press,+Satellite,+Ahmedabad-380015 target=_blank rel=noopener style=color:inherit;text-decoration:underline;>D-102, Prahlad Nagar Trade Centre (PNTC), Radio Mirchi Road, Nr. Time of India Press, Satellite, Ahmedabad-380015</a>`;

const fixed = `<a href="https://maps.google.com/?q=D-102,+Prahlad+Nagar+Trade+Centre,+Radio+Mirchi+Road,+Nr.+Time+of+India+Press,+Satellite,+Ahmedabad-380015" target="_blank" rel="noopener" style="color:inherit;text-decoration:underline;">D-102, Prahlad Nagar Trade Centre (PNTC), Radio Mirchi Road, Nr. Time of India Press, Satellite, Ahmedabad-380015</a>`;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes('target=_blank rel=noopener')) {
    content = content.replace(broken, fixed);
    fs.writeFileSync(file, content, 'utf8');
    console.log('Fixed:', file);
  }
});
console.log('Done!');
