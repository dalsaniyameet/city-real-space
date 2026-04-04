// ===== LOGO SPLASH SCREEN =====
(function () {
  const splash = document.createElement('div');
  splash.id = 'logoSplash';
  splash.innerHTML = `
    <div id="splashBg"></div>
    <img src="images/logo.jpeg" alt="City Real Space" id="splashLogo"/>
    <style>
      #logoSplash {
        position: fixed; inset: 0; z-index: 9999999;
        background: linear-gradient(135deg, #0D1B2A 0%, #1a3a5c 60%, #0D1B2A 100%);
        display: flex; align-items: center; justify-content: center;
        transition: opacity 0.5s ease;
        overflow: hidden;
      }
      #splashBg {
        position: absolute; inset: 0;
        background: radial-gradient(ellipse at center, rgba(255,193,7,0.08) 0%, transparent 70%);
        animation: splashPulse 1.2s ease-in-out infinite alternate;
      }
      #splashLogo {
        width: min(280px, 65vw);
        position: relative; z-index: 2;
        animation: splashAnim 1s cubic-bezier(0.175,0.885,0.32,1.275) forwards;
        filter: drop-shadow(0 0 30px rgba(255,193,7,0.4));
      }
      @keyframes splashAnim {
        0%  { transform: scale(0.3) rotate(-10deg); opacity: 0; }
        60% { transform: scale(1.08) rotate(2deg); opacity: 1; }
        100%{ transform: scale(1) rotate(0deg); opacity: 1; }
      }
      @keyframes splashPulse {
        0%  { opacity: 0.5; transform: scale(1); }
        100%{ opacity: 1;   transform: scale(1.15); }
      }
    </style>
  `;
  document.body.appendChild(splash);

  setTimeout(() => {
    splash.style.opacity = '0';
    setTimeout(() => splash.remove(), 500);
  }, 1300);
})();
