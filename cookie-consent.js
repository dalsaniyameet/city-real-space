// Cookie Consent Banner — auto loads on all pages
(function() {
  if (localStorage.getItem('cookieConsent')) return;
  const banner = document.createElement('div');
  banner.id = 'cookieBanner';
  banner.style.cssText = 'position:fixed;bottom:0;left:0;right:0;z-index:99998;background:#0D1B2A;border-top:1px solid rgba(255,193,7,0.3);padding:14px 24px;display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap;font-family:Poppins,sans-serif;animation:slideUp 0.4s ease;';
  banner.innerHTML = `
    <style>@keyframes slideUp{from{transform:translateY(100%)}to{transform:translateY(0)}}</style>
    <p style="color:rgba(255,255,255,0.75);font-size:0.8rem;margin:0;flex:1;min-width:200px;">
      🍪 We use cookies to improve your experience. By using our site, you agree to our
      <a href="privacy.html" style="color:#FFC107;font-weight:600;">Privacy Policy</a>.
    </p>
    <div style="display:flex;gap:10px;flex-shrink:0;">
      <button onclick="acceptCookies()" style="background:#FFC107;color:#0D1B2A;border:none;padding:8px 20px;border-radius:8px;font-size:0.82rem;font-weight:700;cursor:pointer;font-family:Poppins,sans-serif;">Accept All</button>
      <button onclick="declineCookies()" style="background:rgba(255,255,255,0.08);color:rgba(255,255,255,0.6);border:1px solid rgba(255,255,255,0.15);padding:8px 16px;border-radius:8px;font-size:0.82rem;font-weight:600;cursor:pointer;font-family:Poppins,sans-serif;">Decline</button>
    </div>`;
  document.body.appendChild(banner);
})();

function acceptCookies() {
  localStorage.setItem('cookieConsent', 'accepted');
  document.getElementById('cookieBanner')?.remove();
}
function declineCookies() {
  localStorage.setItem('cookieConsent', 'declined');
  document.getElementById('cookieBanner')?.remove();
}
