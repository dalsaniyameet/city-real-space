// ===== CITY REAL SPACE — MOBILE NAV =====
(function() {
  function initMobileNav() {
    var hamburger = document.getElementById('hamburger');
    var nav = document.getElementById('nav');
    if (!hamburger || !nav) return;

    // Hamburger toggle
    hamburger.addEventListener('click', function(e) {
      e.stopPropagation();
      var isOpen = nav.classList.toggle('open');
      // Force display via inline style to override any CSS conflict
      if (isOpen) {
        nav.style.display = 'block';
        hamburger.innerHTML = '<i class="fa-solid fa-xmark"></i>';
      } else {
        nav.style.display = 'none';
        hamburger.innerHTML = '<i class="fa-solid fa-bars"></i>';
        nav.querySelectorAll('.nav-dropdown').forEach(function(d) {
          d.classList.remove('open');
        });
      }
    });

    // Dropdown buttons
    nav.querySelectorAll('.nav-drop-btn').forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        var parent = btn.closest('.nav-dropdown');
        var menu = parent.querySelector('.nav-drop-menu');
        var isOpen = parent.classList.toggle('open');
        // Force inline style on dropdown menu
        if (isOpen) {
          menu.style.display = 'block';
          btn.style.color = '#E53935';
          btn.style.background = '#fff5f5';
        } else {
          menu.style.display = 'none';
          btn.style.color = '';
          btn.style.background = '';
        }
        // Close other dropdowns
        nav.querySelectorAll('.nav-dropdown').forEach(function(d) {
          if (d !== parent) {
            d.classList.remove('open');
            var m = d.querySelector('.nav-drop-menu');
            var b = d.querySelector('.nav-drop-btn');
            if (m) m.style.display = 'none';
            if (b) { b.style.color = ''; b.style.background = ''; }
          }
        });
      });
    });

    // Close nav on outside click
    document.addEventListener('click', function(e) {
      if (!nav.contains(e.target) && !hamburger.contains(e.target)) {
        nav.classList.remove('open');
        nav.style.display = 'none';
        hamburger.innerHTML = '<i class="fa-solid fa-bars"></i>';
        nav.querySelectorAll('.nav-dropdown').forEach(function(d) {
          d.classList.remove('open');
          var m = d.querySelector('.nav-drop-menu');
          var b = d.querySelector('.nav-drop-btn');
          if (m) m.style.display = 'none';
          if (b) { b.style.color = ''; b.style.background = ''; }
        });
      }
    });

    // Close nav on regular link click
    nav.querySelectorAll('a:not(.nav-drop-btn)').forEach(function(a) {
      a.addEventListener('click', function() {
        nav.classList.remove('open');
        nav.style.display = 'none';
        hamburger.innerHTML = '<i class="fa-solid fa-bars"></i>';
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMobileNav);
  } else {
    initMobileNav();
  }
})();
