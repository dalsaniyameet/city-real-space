const fs = require('fs');
let h = fs.readFileSync('c:/Users/meetd/Downloads/City Real Space/index.html', 'utf8');

// Find hero-slides start and end
const start = h.indexOf('<div class="hero-slides">');
const end = h.indexOf('</div>', start) + 6; // first closing div = end of hero-slides

// Replace entire hero-slides block
const newSlides = `<div class="hero-slides">
    <div class="hero-slide active" style="background-image:url('/images/banner.png');background-size:cover;background-position:center center" role="img" aria-label="City Real Space Banner"></div>
    <div class="hero-slide" style="background-image:url('/images/banner2.png');background-size:cover;background-position:center center" role="img" aria-label="City Real Space Banner 2"></div>
  </div>`;

// Find real end of hero-slides (after all nested divs)
// hero-slides has only 2 direct children now, so first </div> after start is correct
// But there are leftover slides - find hero-overlay to cut properly
const heroOverlayPos = h.indexOf('<div class="hero-overlay">');

h = h.substring(0, start) + newSlides + '\n\n  ' + h.substring(heroOverlayPos);

fs.writeFileSync('c:/Users/meetd/Downloads/City Real Space/index.html', h, 'utf8');
fs.writeFileSync('c:/Users/meetd/Downloads/City Real Space/debug.txt', 'start='+start+' heroOverlay='+heroOverlayPos+'\nDone size='+h.length);
