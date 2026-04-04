// ===== CUSTOM CURSOR =====
(function () {
  const dot  = document.createElement('div'); dot.className  = 'cursor-dot';
  const ring = document.createElement('div'); ring.className = 'cursor-ring';
  document.body.append(dot, ring);

  // Spotlight element
  const spotlight = document.createElement('div');
  spotlight.style.cssText = 'position:fixed;pointer-events:none;z-index:0;width:320px;height:320px;border-radius:50%;background:radial-gradient(circle,rgba(99,102,241,0.04) 0%,transparent 70%);transform:translate(-50%,-50%);transition:opacity 0.3s;opacity:0;';
  document.body.appendChild(spotlight);

  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = e.clientX + 'px';
    dot.style.top  = e.clientY + 'px';
    spotlight.style.left = e.clientX + 'px';
    spotlight.style.top  = e.clientY + 'px';
    spotlight.style.opacity = '1';
  });

  // Smooth ring follow
  function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  document.addEventListener('mouseleave', () => spotlight.style.opacity = '0');

  document.addEventListener('mouseover', e => {
    if (e.target.closest('a, button, input, select, textarea, [onclick]'))
      document.body.classList.add('cursor-hover');
    else
      document.body.classList.remove('cursor-hover');
  });

  document.addEventListener('mousedown', () => document.body.classList.add('cursor-click'));
  document.addEventListener('mouseup',   () => document.body.classList.remove('cursor-click'));
})();
