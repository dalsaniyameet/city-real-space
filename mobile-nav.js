// ===== CITY REAL SPACE — MOBILE NAV =====
(function() {

  function setup() {
    var nav = document.getElementById('nav');
    var hamburger = document.getElementById('hamburger');
    if (!nav || !hamburger) return;

    // ONLY run on mobile
    if (window.innerWidth > 768) return;

    // Hide nav on mobile load
    nav.style.display = 'none';

    // Hamburger click
    hamburger.addEventListener('click', function(e) {
      e.stopPropagation();
      var isOpen = nav.style.display === 'flex';
      nav.style.display = isOpen ? 'none' : 'flex';
      nav.style.flexDirection = 'column';
      nav.style.alignItems = 'stretch';
      nav.style.position = 'fixed';
      nav.style.top = '97px';
      nav.style.left = '0';
      nav.style.right = '0';
      nav.style.bottom = '0';
      nav.style.background = '#fff';
      nav.style.zIndex = '99999';
      nav.style.overflowY = 'auto';
      nav.style.borderTop = '3px solid #E53935';
      nav.style.padding = '0';
      nav.style.gap = '0';
      this.innerHTML = isOpen
        ? '<i class="fa-solid fa-bars"></i>'
        : '<i class="fa-solid fa-xmark"></i>';
    });

    // Dropdown buttons
    document.querySelectorAll('.nav-drop-btn').forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        var menu = btn.parentElement.querySelector('.nav-drop-menu');
        if (!menu) return;
        var isOpen = menu.style.display === 'block';
        // Close all
        document.querySelectorAll('.nav-drop-menu').forEach(function(m) { m.style.display = 'none'; });
        document.querySelectorAll('.nav-drop-btn').forEach(function(b) {
          b.style.color = ''; b.style.background = '';
          var i = b.querySelector('i'); if (i) i.style.transform = '';
        });
        if (!isOpen) {
          menu.style.cssText = 'display:block;position:static;opacity:1;pointer-events:all;transform:none;box-shadow:none;border:none;border-left:3px solid #E53935;margin-left:20px;background:#fafafa;min-width:unset;padding:0;';
          btn.style.color = '#E53935';
          btn.style.background = '#fff5f5';
          var icon = btn.querySelector('i'); if (icon) icon.style.transform = 'rotate(180deg)';
        }
      });
    });

    // Close on outside click
    document.addEventListener('click', function(e) {
      if (!nav.contains(e.target) && !hamburger.contains(e.target)) {
        nav.style.display = 'none';
        hamburger.innerHTML = '<i class="fa-solid fa-bars"></i>';
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setup);
  } else {
    setup();
  }

})();
