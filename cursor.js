// cursor.js — click impact effect disabled
(function () {
  // Remove any click/impact effect elements added dynamically
  const observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      mutation.addedNodes.forEach(function (node) {
        if (node.nodeType === 1) {
          const style = node.getAttribute && node.getAttribute('style') || '';
          const id = node.id || '';
          const cls = node.className || '';
          // Remove any fixed/absolute positioned small divs added on click (impact effects)
          if (
            (style.includes('border-radius: 50%') || style.includes('border-radius:50%')) &&
            (style.includes('position: fixed') || style.includes('position:fixed') ||
             style.includes('position: absolute') || style.includes('position:absolute')) &&
            (style.includes('pointer-events: none') || style.includes('pointer-events:none'))
          ) {
            node.remove();
          }
        }
      });
    });
  });
  observer.observe(document.body || document.documentElement, { childList: true, subtree: true });
})();
