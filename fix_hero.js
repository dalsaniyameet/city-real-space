const fs = require('fs');
const file = 'c:/Users/meetd/Downloads/City Real Space/index.html';
let html = fs.readFileSync(file, 'utf8');

const si = html.indexOf('<div class="hero-slides">');
const ei = html.indexOf('</div>', html.lastIndexOf('hero-slide', html.indexOf('</div>', si + 100)));

// Find the closing </div> of hero-slides
let depth = 0;
let pos = si;
let heroEnd = -1;
for (let i = si; i < html.length; i++) {
  if (html.substring(i, i+4) === '<div') depth++;
  if (html.substring(i, i+6) === '</div>') {
    depth--;
    if (depth === 0) { heroEnd = i + 6; break; }
  }
}

console.log('si='+si+' heroEnd='+heroEnd);

const newSlides = `<div class="hero-slides">
    <div class="hero-slide active" style="background-image:url('/images/banner.png');background-size:cover;background-position:center top;filter:brightness(0.75)" role="img" aria-label="City Real Space Banner"></div>
    <div class="hero-slide" style="background-image:url('/images/banner2.png');background-size:cover;background-position:center top;filter:brightness(0.75)" role="img" aria-label="City Real Space Banner 2"></div>
  </div>`;

html = html.substring(0, si) + newSlides + html.substring(heroEnd);

// Also fix preload tag
html = html.replace("href=\"/images/banner.png\" as=\"image\"", "href=\"/images/banner.png\" as=\"image\"");

fs.writeFileSync(file, html, 'utf8');
console.log('Done');
