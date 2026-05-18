// ===== LOGO SPLASH SCREEN =====
(function () {
  const splash = document.createElement('div');
  splash.id = 'logoSplash';
  splash.innerHTML = `
    <style>
      #logoSplash {
        position: fixed; inset: 0; z-index: 9999999;
        background: linear-gradient(180deg, #0a1628 0%, #0D1B2A 40%, #1a2a1a 100%);
        display: flex; flex-direction: column; align-items: center; justify-content: center;
        transition: opacity 0.6s ease;
        overflow: hidden;
        cursor: pointer;
      }

      /* Sky gradient */
      #splashSky {
        position: absolute; inset: 0;
        background: linear-gradient(180deg,
          #0a0f1e 0%,
          #0d1b35 30%,
          #1a2a4a 60%,
          #1e3a2a 85%,
          #0d1b2a 100%
        );
      }

      /* Stars */
      #splashStars {
        position: absolute; inset: 0; overflow: hidden;
      }
      .sstar {
        position: absolute; background: #fff; border-radius: 50%;
        animation: starTwinkle 2s ease-in-out infinite alternate;
      }

      /* Moon */
      #splashMoon {
        position: absolute; top: 8%; right: 15%;
        width: 48px; height: 48px;
        background: radial-gradient(circle at 35% 35%, #fffde7, #FFC107);
        border-radius: 50%;
        box-shadow: 0 0 30px rgba(255,193,7,0.5), 0 0 60px rgba(255,193,7,0.2);
        animation: moonGlow 3s ease-in-out infinite alternate;
      }

      /* River / water reflection at bottom */
      #splashRiver {
        position: absolute; bottom: 0; left: 0; right: 0;
        height: 28%;
        background: linear-gradient(180deg,
          rgba(13,27,42,0) 0%,
          rgba(10,20,50,0.7) 30%,
          rgba(8,18,45,0.95) 100%
        );
        overflow: hidden;
      }
      #splashRiverWater {
        position: absolute; bottom: 0; left: 0; right: 0; height: 100%;
        background: linear-gradient(180deg,
          rgba(20,40,80,0.4) 0%,
          rgba(10,25,60,0.8) 50%,
          rgba(5,15,40,1) 100%
        );
      }
      /* Water shimmer lines */
      .wline {
        position: absolute; left: 0; right: 0; height: 1px;
        background: linear-gradient(90deg, transparent, rgba(255,193,7,0.15), rgba(100,150,255,0.1), transparent);
        animation: waterShimmer 3s ease-in-out infinite;
      }

      /* Skyline silhouette */
      #splashSkyline {
        position: absolute; bottom: 0; left: 0; right: 0;
        height: 70%;
        pointer-events: none;
        filter: blur(2px);
        opacity: 0.85;
      }

      /* Logo area */
      #splashLogoWrap {
        position: relative; z-index: 10;
        display: flex; flex-direction: column; align-items: center; gap: 14px;
        margin-bottom: 0;
        animation: splashLogoIn 0.9s cubic-bezier(0.175,0.885,0.32,1.275) 0.3s both;
      }
      #splashLogo {
        width: min(160px, 35vw);
        border-radius: 18px;
        box-shadow: 0 0 40px rgba(255,193,7,0.5), 0 8px 32px rgba(0,0,0,0.5);
        filter: drop-shadow(0 0 20px rgba(255,193,7,0.4));
      }
      #splashBrand {
        font-family: Poppins, sans-serif;
        font-size: clamp(1.1rem, 4vw, 1.5rem);
        font-weight: 800;
        color: #fff;
        letter-spacing: 1px;
        text-shadow: 0 2px 16px rgba(0,0,0,0.6);
      }
      #splashBrand span { color: #FFC107; }
      #splashTagline {
        font-family: Poppins, sans-serif;
        font-size: clamp(0.62rem, 2vw, 0.78rem);
        color: rgba(255,255,255,0.55);
        letter-spacing: 2px;
        text-transform: uppercase;
        margin-top: -8px;
      }

      /* Loading bar */
      #splashBar {
        position: absolute; bottom: 0; left: 0; right: 0; height: 3px;
        background: rgba(255,255,255,0.08);
      }
      #splashBarFill {
        height: 100%;
        background: linear-gradient(90deg, #E53935, #FFC107);
        width: 0%;
        animation: barLoad 2s ease forwards;
        border-radius: 0 2px 2px 0;
      }

      /* Animations */
      @keyframes splashLogoIn {
        0%  { transform: translateY(30px) scale(0.8); opacity: 0; }
        100%{ transform: translateY(0) scale(1); opacity: 1; }
      }
      @keyframes starTwinkle {
        0%  { opacity: 0.2; transform: scale(0.8); }
        100%{ opacity: 1;   transform: scale(1.2); }
      }
      @keyframes moonGlow {
        0%  { box-shadow: 0 0 20px rgba(255,193,7,0.4), 0 0 40px rgba(255,193,7,0.15); }
        100%{ box-shadow: 0 0 40px rgba(255,193,7,0.7), 0 0 80px rgba(255,193,7,0.3); }
      }
      @keyframes waterShimmer {
        0%,100% { opacity: 0.3; transform: scaleX(0.8) translateX(-5%); }
        50%     { opacity: 0.8; transform: scaleX(1.1) translateX(3%); }
      }
      @keyframes barLoad {
        0%  { width: 0%; }
        100%{ width: 100%; }
      }

    </style>

    <div id="splashSky"></div>

    <!-- Stars -->
    <div id="splashStars"></div>

    <!-- Moon -->
    <div id="splashMoon"></div>

    <!-- Patang Hotel + Riverfront Silhouette -->
    <div id="splashSkyline">
      <svg viewBox="0 0 1000 400" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;display:block" preserveAspectRatio="xMidYMax meet">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>

        <!-- Far bg buildings -->
        <rect x="0" y="220" width="50" height="180" fill="#0a1e3a"/>
        <rect x="48" y="200" width="38" height="200" fill="#0b2040"/>
        <rect x="84" y="230" width="30" height="170" fill="#091c38"/>
        <rect x="112" y="210" width="42" height="190" fill="#0a1e3a"/>
        <rect x="152" y="195" width="35" height="205" fill="#0b2040"/>
        <rect x="185" y="225" width="28" height="175" fill="#091c38"/>
        <rect x="210" y="205" width="40" height="195" fill="#0a1e3a"/>
        <rect x="248" y="215" width="32" height="185" fill="#0b2040"/>

        <!-- Right far bg -->
        <rect x="950" y="220" width="50" height="180" fill="#0a1e3a"/>
        <rect x="914" y="200" width="38" height="200" fill="#0b2040"/>
        <rect x="886" y="230" width="30" height="170" fill="#091c38"/>
        <rect x="846" y="210" width="42" height="190" fill="#0a1e3a"/>
        <rect x="808" y="195" width="35" height="205" fill="#0b2040"/>
        <rect x="775" y="225" width="28" height="175" fill="#091c38"/>
        <rect x="742" y="205" width="35" height="195" fill="#0a1e3a"/>
        <rect x="710" y="215" width="32" height="185" fill="#0b2040"/>

        <!-- PATANG HOTEL - center, tall, iconic -->
        <!-- Wide podium base -->
        <rect x="330" y="260" width="340" height="140" fill="#0f2a50"/>
        <!-- Mid section -->
        <rect x="360" y="190" width="280" height="75" fill="#112d55"/>
        <!-- Upper tower -->
        <rect x="400" y="110" width="200" height="85" fill="#132f58"/>
        <!-- Narrow top -->
        <rect x="440" y="55" width="120" height="60" fill="#162e55"/>
        <!-- Crown -->
        <rect x="470" y="30" width="60" height="30" fill="#1a3460"/>

        <!-- PATANG (Kite) on top - iconic shape -->
        <polygon points="500,0 545,48 500,36 455,48" fill="#1e3d70"/>
        <polygon points="500,36 545,48 500,80 455,48" fill="#162e55"/>
        <!-- Kite cross lines -->
        <line x1="455" y1="48" x2="545" y2="48" stroke="#2a4a80" stroke-width="1.5" opacity="0.8"/>
        <line x1="500" y1="0" x2="500" y2="80" stroke="#2a4a80" stroke-width="1.5" opacity="0.8"/>
        <!-- Spire -->
        <rect x="498" y="78" width="4" height="35" fill="#c0392b" opacity="0.8"/>
        <circle cx="500" cy="78" r="4" fill="#e74c3c" opacity="0.9" filter="url(#glow)"/>

        <!-- Hotel floor accent lines -->
        <rect x="330" y="260" width="340" height="2" fill="#1e4a80" opacity="0.6"/>
        <rect x="360" y="190" width="280" height="2" fill="#1e4a80" opacity="0.6"/>
        <rect x="400" y="110" width="200" height="2" fill="#1e4a80" opacity="0.5"/>
        <rect x="440" y="55" width="120" height="2" fill="#1e4a80" opacity="0.5"/>

        <!-- Windows - podium floor -->
        <rect x="345" y="275" width="12" height="16" fill="#FFC107" opacity="0.45"/>
        <rect x="365" y="275" width="12" height="16" fill="#FFC107" opacity="0.3"/>
        <rect x="385" y="275" width="12" height="16" fill="#FFC107" opacity="0.5"/>
        <rect x="405" y="275" width="12" height="16" fill="#FFC107" opacity="0.35"/>
        <rect x="425" y="275" width="12" height="16" fill="#FFC107" opacity="0.45"/>
        <rect x="445" y="275" width="12" height="16" fill="#FFC107" opacity="0.25"/>
        <rect x="465" y="275" width="12" height="16" fill="#FFC107" opacity="0.5"/>
        <rect x="485" y="275" width="12" height="16" fill="#FFC107" opacity="0.4"/>
        <rect x="505" y="275" width="12" height="16" fill="#FFC107" opacity="0.3"/>
        <rect x="525" y="275" width="12" height="16" fill="#FFC107" opacity="0.5"/>
        <rect x="545" y="275" width="12" height="16" fill="#FFC107" opacity="0.35"/>
        <rect x="565" y="275" width="12" height="16" fill="#FFC107" opacity="0.45"/>
        <rect x="585" y="275" width="12" height="16" fill="#FFC107" opacity="0.3"/>
        <rect x="605" y="275" width="12" height="16" fill="#FFC107" opacity="0.5"/>
        <rect x="625" y="275" width="12" height="16" fill="#FFC107" opacity="0.4"/>
        <rect x="645" y="275" width="12" height="16" fill="#FFC107" opacity="0.3"/>

        <!-- Windows - mid floor -->
        <rect x="375" y="205" width="10" height="13" fill="#FFC107" opacity="0.35"/>
        <rect x="395" y="205" width="10" height="13" fill="#FFC107" opacity="0.5"/>
        <rect x="415" y="205" width="10" height="13" fill="#FFC107" opacity="0.3"/>
        <rect x="435" y="205" width="10" height="13" fill="#FFC107" opacity="0.45"/>
        <rect x="455" y="205" width="10" height="13" fill="#FFC107" opacity="0.4"/>
        <rect x="475" y="205" width="10" height="13" fill="#FFC107" opacity="0.3"/>
        <rect x="495" y="205" width="10" height="13" fill="#FFC107" opacity="0.5"/>
        <rect x="515" y="205" width="10" height="13" fill="#FFC107" opacity="0.35"/>
        <rect x="535" y="205" width="10" height="13" fill="#FFC107" opacity="0.45"/>
        <rect x="555" y="205" width="10" height="13" fill="#FFC107" opacity="0.3"/>
        <rect x="575" y="205" width="10" height="13" fill="#FFC107" opacity="0.4"/>
        <rect x="595" y="205" width="10" height="13" fill="#FFC107" opacity="0.5"/>
        <rect x="615" y="205" width="10" height="13" fill="#FFC107" opacity="0.35"/>

        <!-- Windows - upper tower -->
        <rect x="415" y="125" width="9" height="12" fill="#60a5fa" opacity="0.35"/>
        <rect x="432" y="125" width="9" height="12" fill="#60a5fa" opacity="0.5"/>
        <rect x="449" y="125" width="9" height="12" fill="#60a5fa" opacity="0.3"/>
        <rect x="466" y="125" width="9" height="12" fill="#60a5fa" opacity="0.45"/>
        <rect x="483" y="125" width="9" height="12" fill="#60a5fa" opacity="0.4"/>
        <rect x="500" y="125" width="9" height="12" fill="#60a5fa" opacity="0.3"/>
        <rect x="517" y="125" width="9" height="12" fill="#60a5fa" opacity="0.5"/>
        <rect x="534" y="125" width="9" height="12" fill="#60a5fa" opacity="0.35"/>
        <rect x="551" y="125" width="9" height="12" fill="#60a5fa" opacity="0.45"/>
        <rect x="568" y="125" width="9" height="12" fill="#60a5fa" opacity="0.3"/>

        <!-- Riverfront promenade -->
        <rect x="0" y="340" width="1000" height="8" fill="#1a3a6a" opacity="0.7"/>
        <rect x="0" y="348" width="1000" height="52" fill="#071828" opacity="0.95"/>

        <!-- Sabarmati river water -->
        <rect x="0" y="355" width="1000" height="45" fill="#050f1e"/>
        <!-- Water light reflections -->
        <ellipse cx="500" cy="365" rx="120" ry="5" fill="#FFC107" opacity="0.08" filter="url(#glow)"/>
        <ellipse cx="500" cy="375" rx="90" ry="4" fill="#FFC107" opacity="0.05"/>
        <ellipse cx="250" cy="368" rx="60" ry="3" fill="#4a90d9" opacity="0.06"/>
        <ellipse cx="750" cy="368" rx="60" ry="3" fill="#4a90d9" opacity="0.06"/>
        <!-- Riverfront lamps -->
        <rect x="280" y="332" width="3" height="12" fill="#FFC107" opacity="0.5"/>
        <circle cx="281" cy="331" r="4" fill="#FFC107" opacity="0.6" filter="url(#glow)"/>
        <rect x="380" y="332" width="3" height="12" fill="#FFC107" opacity="0.5"/>
        <circle cx="381" cy="331" r="4" fill="#FFC107" opacity="0.6" filter="url(#glow)"/>
        <rect x="480" y="332" width="3" height="12" fill="#FFC107" opacity="0.5"/>
        <circle cx="481" cy="331" r="4" fill="#FFC107" opacity="0.6" filter="url(#glow)"/>
        <rect x="580" y="332" width="3" height="12" fill="#FFC107" opacity="0.5"/>
        <circle cx="581" cy="331" r="4" fill="#FFC107" opacity="0.6" filter="url(#glow)"/>
        <rect x="680" y="332" width="3" height="12" fill="#FFC107" opacity="0.5"/>
        <circle cx="681" cy="331" r="4" fill="#FFC107" opacity="0.6" filter="url(#glow)"/>
      </svg>
    </div>

    <!-- River -->
    <div id="splashRiver">
      <div id="splashRiverWater"></div>
      <div class="wline" style="bottom:60%;animation-delay:0s"></div>
      <div class="wline" style="bottom:45%;animation-delay:0.8s"></div>
      <div class="wline" style="bottom:30%;animation-delay:1.6s"></div>
      <div class="wline" style="bottom:15%;animation-delay:0.4s"></div>
    </div>

    <!-- Logo + Brand -->
    <div id="splashLogoWrap">
      <img src="/images/logo.jpeg" alt="City Real Space" id="splashLogo"/>
    </div>

    <!-- Loading bar -->
    <div id="splashBar"><div id="splashBarFill"></div></div>
  `;

  document.body.appendChild(splash);

  // Generate stars
  const starsEl = splash.querySelector('#splashStars');
  for (let i = 0; i < 60; i++) {
    const s = document.createElement('div');
    s.className = 'sstar';
    const size = Math.random() * 2.5 + 0.5;
    s.style.cssText = `
      width:${size}px; height:${size}px;
      top:${Math.random() * 55}%;
      left:${Math.random() * 100}%;
      animation-delay:${Math.random() * 3}s;
      animation-duration:${1.5 + Math.random() * 2}s;
      opacity:${0.3 + Math.random() * 0.7};
    `;
    starsEl.appendChild(s);
  }

  function dismissSplash() {
    if (splash.parentNode) {
      splash.style.opacity = '0';
      setTimeout(() => { if (splash.parentNode) splash.remove(); }, 600);
    }
  }

  const autoTimer = setTimeout(dismissSplash, 1500);

  splash.addEventListener('click', function () {
    clearTimeout(autoTimer);
    dismissSplash();
  });

  document.addEventListener('focusin', function onFocus(e) {
    const tag = e.target.tagName;
    if (tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA') {
      clearTimeout(autoTimer);
      dismissSplash();
      document.removeEventListener('focusin', onFocus);
    }
  });
})();
