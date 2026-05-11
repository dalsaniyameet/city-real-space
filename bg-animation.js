// bg-animation.js

// Null-safe openFc override — fixes "Cannot read properties of null" error
(function() {
  var _t = null;
  window.openFc = function() {
    clearTimeout(_t);
    var fcTabEl   = document.getElementById('fcTab');
    var b         = document.getElementById('fcBannerWrap');
    var fcPopupEl = document.getElementById('fcPopup');
    if (!fcTabEl || !b || !fcPopupEl) return;
    fcTabEl.style.display = 'none';
    b.style.transition = 'none';
    b.style.transform  = 'rotateX(-90deg)';
    b.style.opacity    = '0';
    fcPopupEl.classList.add('open');
    setTimeout(function() {
      b.style.transition = 'transform 0.55s cubic-bezier(0.175,0.885,0.32,1.275), opacity 0.4s ease';
      b.style.transform  = 'rotateX(0deg)';
      b.style.opacity    = '1';
    }, 950);
    _t = setTimeout(function() { if (window.closeFc) window.closeFc(); }, 4000);
  };

  window.closeFc = function() {
    clearTimeout(_t);
    var fcPopupEl = document.getElementById('fcPopup');
    var fcTabEl   = document.getElementById('fcTab');
    if (fcPopupEl) fcPopupEl.classList.remove('open');
    setTimeout(function() {
      if (fcTabEl) fcTabEl.style.display = 'flex';
    }, 500);
  };
})();
