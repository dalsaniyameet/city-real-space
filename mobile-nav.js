// ===== CITY REAL SPACE — MOBILE NAV =====
(function() {

  function isMobile() {
    return window.innerWidth <= 768;
  }

  function setupNav() {
    var nav = document.getElementById('nav');
    var hamburger = document.getElementById('hamburger');
    if (!nav || !hamburger) return;

    // On mobile: hide nav initially
    if (isMobile()) {
      nav.style.display = 'none';
      nav.style.position = 'fixed';
      nav.style.top = '97px';
      nav.style.left = '0';
      nav.style.right = '0';
      nav.style.bottom = '0';
      nav.style.background = '#fff';
      nav.style.zIndex = '99999';
      nav.style.overflowY = 'auto';
      nav.style.borderTop = '3px solid #E53935';
      nav.style.boxShadow = '0 4px 20px rgba(0,0,0,0.2)';
      nav.style.flexDirection = 'column';
      nav.style.alignItems = 'stretch';
      nav.style.padding = '0';
      nav.style.gap = '0';
    }

    // Hamburger click
    hamburger.onclick = function(e) {
      e.stopPropagation();
      if (!isMobile()) return;
      var isOpen = nav.style.display === 'flex' || nav.style.display === 'block';
      if (isOpen) {
        nav.style.display = 'none';
        hamburger.innerHTML = '<i class="fa-solid fa-bars"></i>';
      } else {
        nav.style.display = 'flex';
        hamburger.innerHTML = '<i class="fa-solid fa-xmark"></i>';
      }
    };

    // Dropdown buttons
    var dropBtns = document.querySelectorAll('.nav-drop-btn');
    dropBtns.forEach(function(btn) {
      btn.onclick = function(e) {
        e.preventDefault();
        e.stopPropagation();
        if (!isMobile()) return;
        var menu = btn.parentElement.querySelector('.nav-drop-menu');
        if (!menu) return;
        var isOpen = menu.style.display === 'block';
        // Close all menus first
        document.querySelectorAll('.nav-drop-menu').forEach(function(m) {
          m.style.display = 'none';
        });
        document.querySelectorAll('.nav-drop-btn').forEach(function(b) {
          b.style.color = '';
          b.style.background = '';
          var icon = b.querySelector('i');
          if (icon) icon.style.transform = '';
        });
        // Toggle clicked menu
        if (!isOpen) {
          menu.style.display = 'block';
          menu.style.position = 'static';
          menu.style.opacity = '1';
          menu.style.pointerEvents = 'all';
          menu.style.transform = 'none';
          menu.style.boxShadow = 'none';
          menu.style.border = 'none';
          menu.style.borderLeft = '3px solid #E53935';
          menu.style.marginLeft = '20px';
          menu.style.background = '#fafafa';
          menu.style.minWidth = 'unset';
          btn.style.color = '#E53935';
          btn.style.background = '#fff5f5';
          var icon = btn.querySelector('i');
          if (icon) icon.style.transform = 'rotate(180deg)';
        }
      };
    });

    // Close on outside click
    document.addEventListener('click', function(e) {
      if (!isMobile()) return;
      if (!nav.contains(e.target) && !hamburger.contains(e.target)) {
        nav.style.display = 'none';
        hamburger.innerHTML = '<i class="fa-solid fa-bars"></i>';
      }
    });

    // Close on resize to desktop
    window.addEventListener('resize', function() {
      if (!isMobile()) {
        nav.style.display = '';
        nav.style.position = '';
        nav.style.top = '';
        nav.style.left = '';
        nav.style.right = '';
        nav.style.bottom = '';
        nav.style.background = '';
        nav.style.zIndex = '';
        nav.style.overflowY = '';
        nav.style.borderTop = '';
        nav.style.boxShadow = '';
        nav.style.flexDirection = '';
        nav.style.alignItems = '';
        hamburger.innerHTML = '<i class="fa-solid fa-bars"></i>';
      } else {
        if (nav.style.display !== 'flex') {
          nav.style.display = 'none';
        }
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupNav);
  } else {
    setupNav();
  }

})();
