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
      hamburger.innerHTML = isOpen
        ? '<i class="fa-solid fa-xmark"></i>'
        : '<i class="fa-solid fa-bars"></i>';
    });

    // Dropdown buttons
    var dropBtns = nav.querySelectorAll('.nav-drop-btn');
    dropBtns.forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        var parent = btn.closest('.nav-dropdown');
        // close others
        nav.querySelectorAll('.nav-dropdown').forEach(function(d) {
          if (d !== parent) d.classList.remove('open');
        });
        parent.classList.toggle('open');
      });
    });

    // Close nav on outside click
    document.addEventListener('click', function(e) {
      if (!nav.contains(e.target) && !hamburger.contains(e.target)) {
        nav.classList.remove('open');
        hamburger.innerHTML = '<i class="fa-solid fa-bars"></i>';
        nav.querySelectorAll('.nav-dropdown').forEach(function(d) {
          d.classList.remove('open');
        });
      }
    });

    // Close nav on regular link click
    nav.querySelectorAll('a:not(.nav-drop-btn)').forEach(function(a) {
      a.addEventListener('click', function() {
        nav.classList.remove('open');
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
