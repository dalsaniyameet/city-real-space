const fs = require('fs');
const html = fs.readFileSync('c:/Users/meetd/Downloads/City Real Space/properties.html', 'utf8');
const si = html.indexOf("'<button class=\"card-fav\"");
// Find Contact Now
const ci = html.indexOf('Contact Now', si);
console.log('Contact Now at:', ci);
console.log(JSON.stringify(html.substring(ci - 50, ci + 200)));
