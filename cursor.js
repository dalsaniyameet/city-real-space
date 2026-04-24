// ===== CUSTOM CURSOR =====
(function () {
  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return;

  const dot  = document.createElement('div'); dot.className  = 'cursor-dot';
  const ring = document.createElement('div'); ring.className = 'cursor-ring';
  dot.style.pointerEvents  = 'none';
  ring.style.pointerEvents = 'none';
  document.body.append(dot, ring);

  let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate(calc(${e.clientX}px - 50%), calc(${e.clientY}px - 50%))`;
    dot.style.left = '0';
    dot.style.top  = '0';
  }, { passive: true });

  function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    ring.style.transform = `translate(calc(${ringX}px - 50%), calc(${ringY}px - 50%))`;
    ring.style.left = '0';
    ring.style.top  = '0';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  const inputTags = ['INPUT', 'TEXTAREA', 'SELECT'];

  document.addEventListener('mouseover', e => {
    const target = e.target;

    // Input/textarea pe — text cursor dikhao, custom cursor hide karo
    if (inputTags.includes(target.tagName) || target.isContentEditable) {
      dot.style.opacity  = '0';
      ring.style.opacity = '0';
      document.body.classList.remove('cursor-hover');
      document.body.style.cursor = '';
      return;
    }

    // Wapas dikhao
    dot.style.opacity  = '1';
    ring.style.opacity = '1';
    document.body.style.cursor = 'none';

    // Link/button pe hover effect
    const isInteractive = target.closest('a, button, [onclick], [role="button"]');
    document.body.classList.toggle('cursor-hover', !!isInteractive);
  }, { passive: true });

  document.addEventListener('mousedown', () => document.body.classList.add('cursor-click'),    { passive: true });
  document.addEventListener('mouseup',   () => document.body.classList.remove('cursor-click'), { passive: true });
})();
