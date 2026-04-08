// MOBILE NAV — City Real Space
document.addEventListener('DOMContentLoaded', function() {

  var nav = document.getElementById('mainNav') || document.getElementById('nav');
  var hb  = document.getElementById('hamburger');
  if (!nav || !hb) return;

  // Mobile only
  if (window.innerWidth > 768) return;

  // Style nav as mobile drawer (hidden)
  nav.style.cssText = [
    'display:none',
    'position:fixed',
    'top:97px',
    'left:0',
    'right:0',
    'bottom:0',
    'background:#ffffff',
    'z-index:99999',
    'overflow-y:auto',
    'flex-direction:column',
    'align-items:stretch',
    'padding:0',
    'gap:0',
    'border-top:3px solid #E53935',
    'box-shadow:0 8px 32px rgba(0,0,0,0.2)'
  ].join(';');

  // Style each nav link
  nav.querySelectorAll('a:not(.nav-drop-menu a)').forEach(function(a) {
    a.style.cssText = 'display:block;padding:13px 20px;font-size:0.92rem;font-weight:600;color:#222;border-bottom:1px solid #f0f0f0;background:#fff;';
  });

  // Style dropdown buttons
  nav.querySelectorAll('.nav-drop-btn').forEach(function(btn) {
    btn.style.cssText = 'display:flex;width:100%;padding:13px 20px;font-size:0.92rem;font-weight:600;color:#222;border:none;border-bottom:1px solid #f0f0f0;background:#fff;cursor:pointer;justify-content:space-between;align-items:center;font-family:Poppins,sans-serif;';
  });

  // Style dropdown menus (hidden)
  nav.querySelectorAll('.nav-drop-menu').forEach(function(menu) {
    menu.style.cssText = 'display:none;border-left:3px solid #E53935;margin-left:20px;background:#fafafa;';
    menu.querySelectorAll('a').forEach(function(a) {
      a.style.cssText = 'display:block;padding:11px 16px;font-size:0.86rem;color:#555;border-bottom:1px solid #efefef;';
    });
  });

  // HAMBURGER CLICK
  hb.addEventListener('click', function(e) {
    e.stopPropagation();
    var open = nav.style.display === 'flex';
    nav.style.display = open ? 'none' : 'flex';
    hb.innerHTML = open
      ? '<i class="fa-solid fa-bars"></i>'
      : '<i class="fa-solid fa-xmark"></i>';
  });

  // DROPDOWN CLICK
  nav.querySelectorAll('.nav-drop-btn').forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      var menu = btn.parentElement.querySelector('.nav-drop-menu');
      if (!menu) return;
      var open = menu.style.display === 'block';
      // close all
      nav.querySelectorAll('.nav-drop-menu').forEach(function(m) { m.style.display = 'none'; });
      nav.querySelectorAll('.nav-drop-btn').forEach(function(b) {
        b.style.color = '#222'; b.style.background = '#fff';
        var ic = b.querySelector('i'); if (ic) ic.style.transform = '';
      });
      if (!open) {
        menu.style.display = 'block';
        btn.style.color = '#E53935';
        btn.style.background = '#fff5f5';
        var ic = btn.querySelector('i'); if (ic) ic.style.transform = 'rotate(180deg)';
      }
    });
  });

  // CLOSE on outside click
  document.addEventListener('click', function(e) {
    if (!nav.contains(e.target) && !hb.contains(e.target)) {
      nav.style.display = 'none';
      hb.innerHTML = '<i class="fa-solid fa-bars"></i>';
    }
  });

});
