// ===== CUSTOM CURSOR (performance optimized) =====
(function () {
  // Mobile pe cursor disable
  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return;

  const dot  = document.createElement('div'); dot.className  = 'cursor-dot';
  const ring = document.createElement('div'); ring.className = 'cursor-ring';
  dot.style.pointerEvents  = 'none';
  ring.style.pointerEvents = 'none';
  document.body.append(dot, ring);

  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;
  let ticking = false;

  // dot: direct CSS transform (no layout thrash)
  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate(calc(${e.clientX}px - 50%), calc(${e.clientY}px - 50%))`;
    dot.style.left = '0';
    dot.style.top  = '0';
  }, { passive: true });

  // ring: rAF throttled
  function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    ring.style.transform = `translate(calc(${ringX}px - 50%), calc(${ringY}px - 50%))`;
    ring.style.left = '0';
    ring.style.top  = '0';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  document.addEventListener('mouseover', e => {
    const isInteractive = e.target.closest('a, button, input, select, textarea, [onclick]');
    document.body.classList.toggle('cursor-hover', !!isInteractive);
  }, { passive: true });

  document.addEventListener('mousedown', () => document.body.classList.add('cursor-click'), { passive: true });
  document.addEventListener('mouseup',   () => document.body.classList.remove('cursor-click'), { passive: true });
})();
