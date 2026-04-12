// ===== CITY REAL SPACE — EMAIL TEMPLATES =====

const BRAND = {
  name:    'City Real Space',
  sub:     'Ahmedabad, Gujarat',
  tagline: 'Premium Real Estate Platform',
  website: 'https://cityrealspace.com',
  phone:   '+91 97235 50764',
  email:   'info@cityrealspace.com',
  address: 'Ahmedabad, Gujarat, India',
  logo:    'https://cityrealspace.com/images/logo.jpeg',
  year:    new Date().getFullYear(),
};

// ─── HEADER (logo + brand) ────────────────────────────────────────────────────
function header() {
  return `
  <tr>
    <td align="center" style="
      background: linear-gradient(160deg, #7f0000 0%, #b71c1c 40%, #C62828 70%, #8B0000 100%);
      border-radius: 18px 18px 0 0;
      padding: 44px 32px 36px;
      text-align: center;
    ">
      <!-- Logo with fallback -->
      <div style="
        display: inline-block;
        width: 90px; height: 90px;
        border-radius: 50%;
        background: #ffffff;
        border: 4px solid rgba(255,255,255,0.35);
        box-shadow: 0 0 0 8px rgba(255,255,255,0.1), 0 8px 32px rgba(0,0,0,0.3);
        overflow: hidden;
        margin: 0 auto 18px;
        line-height: 90px;
        text-align: center;
        font-size: 28px;
        font-weight: 900;
        color: #C62828;
        font-family: Georgia, serif;
      ">
        <img src="${BRAND.logo}"
             alt="CRS"
             width="90" height="90"
             style="display:block; width:90px; height:90px; border-radius:50%; object-fit:cover;"
        />
      </div>

      <h1 style="
        margin: 0 0 6px;
        color: #ffffff;
        font-size: 26px;
        font-weight: 900;
        letter-spacing: 0.5px;
        font-family: 'Segoe UI', Arial, sans-serif;
        text-shadow: 0 2px 8px rgba(0,0,0,0.2);
      ">${BRAND.name}</h1>

      <p style="
        margin: 0 0 20px;
        color: rgba(255,255,255,0.75);
        font-size: 12px;
        letter-spacing: 2.5px;
        text-transform: uppercase;
        font-family: 'Segoe UI', Arial, sans-serif;
      ">${BRAND.tagline}</p>

      <!-- Decorative divider -->
      <table cellpadding="0" cellspacing="0" border="0" align="center" style="margin: 0 auto;">
        <tr>
          <td style="background: rgba(255,255,255,0.2); height: 1px; width: 80px;"></td>
          <td style="padding: 0 10px; color: rgba(255,255,255,0.5); font-size: 12px; line-height: 1;">&#9670;</td>
          <td style="background: rgba(255,255,255,0.2); height: 1px; width: 80px;"></td>
        </tr>
      </table>
    </td>
  </tr>`;
}

// ─── FOOTER (signature) ───────────────────────────────────────────────────────
function footer() {
  return `
  <tr>
    <td style="background: #0d1b2e; padding: 30px 40px 24px; border-radius: 0 0 0 0;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td align="center">
            <p style="margin: 0 0 4px; color: #ffffff; font-size: 15px; font-weight: 800; font-family: 'Segoe UI', Arial, sans-serif;">${BRAND.name}</p>
            <p style="margin: 0 0 20px; color: rgba(255,255,255,0.4); font-size: 11px; letter-spacing: 2px; text-transform: uppercase; font-family: 'Segoe UI', Arial, sans-serif;">${BRAND.sub}</p>

            <table cellpadding="0" cellspacing="0" border="0" align="center" style="margin: 0 auto 16px;">
              <tr>
                <td style="padding: 0 14px; border-right: 1px solid rgba(255,255,255,0.12);">
                  <a href="tel:${BRAND.phone}" style="color: rgba(255,255,255,0.55); text-decoration: none; font-size: 12px; font-family: 'Segoe UI', Arial, sans-serif;">
                    &#128222;&nbsp;${BRAND.phone}
                  </a>
                </td>
                <td style="padding: 0 14px; border-right: 1px solid rgba(255,255,255,0.12);">
                  <a href="mailto:${BRAND.email}" style="color: rgba(255,255,255,0.55); text-decoration: none; font-size: 12px; font-family: 'Segoe UI', Arial, sans-serif;">
                    &#128231;&nbsp;${BRAND.email}
                  </a>
                </td>
                <td style="padding: 0 14px;">
                  <a href="${BRAND.website}" style="color: rgba(255,255,255,0.55); text-decoration: none; font-size: 12px; font-family: 'Segoe UI', Arial, sans-serif;">
                    &#127760;&nbsp;cityrealspace.com
                  </a>
                </td>
              </tr>
            </table>

            <p style="margin: 0; color: rgba(255,255,255,0.25); font-size: 11px; font-family: 'Segoe UI', Arial, sans-serif;">
              &#128205;&nbsp;${BRAND.address}
            </p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
  <tr>
    <td align="center" style="background: #060e1e; border-radius: 0 0 18px 18px; padding: 12px;">
      <p style="margin: 0; color: rgba(255,255,255,0.18); font-size: 11px; font-family: 'Segoe UI', Arial, sans-serif;">
        &copy; ${BRAND.year} ${BRAND.name}. All rights reserved.
      </p>
    </td>
  </tr>`;
}

// ─── WRAPPER ──────────────────────────────────────────────────────────────────
function wrap(bodyRows) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>${BRAND.name}</title>
<style>
  @keyframes fadeIn { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
  .email-card { animation: fadeIn 0.5s ease both; }
  @media only screen and (max-width:600px) {
    .email-card { border-radius: 0 !important; }
    .body-pad { padding: 28px 20px !important; }
    .footer-pad { padding: 24px 20px !important; }
    .contact-row td { display: block !important; border-right: none !important; padding: 4px 0 !important; }
  }
</style>
</head>
<body style="margin:0; padding:0; background:#e8edf4; font-family:'Segoe UI',Helvetica,Arial,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#e8edf4; padding:40px 16px;">
  <tr><td align="center">

    <table class="email-card" width="100%" cellpadding="0" cellspacing="0" border="0"
      style="max-width:580px; width:100%; border-radius:18px; overflow:hidden; box-shadow:0 12px 48px rgba(0,0,0,0.15);">

      ${header()}

      <tr>
        <td class="body-pad" style="background:#ffffff; padding:40px 44px;">
          ${bodyRows}
        </td>
      </tr>

      ${footer()}

    </table>

  </td></tr>
</table>
</body>
</html>`;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function infoRow(label, value) {
  if (!value) return '';
  return `<tr>
    <td style="padding:10px 16px; color:#64748b; font-size:13px; font-weight:600; white-space:nowrap; width:130px; border-bottom:1px solid #f1f5f9; font-family:'Segoe UI',Arial,sans-serif;">${label}</td>
    <td style="padding:10px 16px; color:#1e293b; font-size:13px; border-bottom:1px solid #f1f5f9; font-family:'Segoe UI',Arial,sans-serif;">${value}</td>
  </tr>`;
}

function infoTable(rows) {
  const r = rows.replace(/^\s*$/gm, '').trim();
  if (!r) return '';
  return `<table width="100%" cellpadding="0" cellspacing="0" border="0"
    style="background:#f8fafc; border-radius:12px; border:1px solid #e2e8f0; overflow:hidden; margin:18px 0;">
    ${r}
  </table>`;
}

function ctaBtn(text, href) {
  return `<table cellpadding="0" cellspacing="0" border="0" align="center" style="margin:28px auto 4px;">
    <tr>
      <td align="center" style="background:linear-gradient(135deg,#C62828 0%,#7f0000 100%); border-radius:10px; box-shadow:0 4px 16px rgba(198,40,40,0.35);">
        <a href="${href}" style="display:inline-block; color:#ffffff; text-decoration:none; padding:14px 44px; font-size:14px; font-weight:700; letter-spacing:0.5px; font-family:'Segoe UI',Arial,sans-serif;">${text} &#8594;</a>
      </td>
    </tr>
  </table>`;
}

const divider = `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:24px 0;">
  <tr><td style="border-top:1px solid #e8edf4;"></td></tr>
</table>`;

// ═══════════════════════════════════════════════════════════════════════════════
// 1. REGISTER — Welcome email after OTP verify
// ═══════════════════════════════════════════════════════════════════════════════
function registerWelcomeHtml({ name, email }) {
  const body = `
    <p style="margin:0 0 6px; color:#1e293b; font-size:22px; font-weight:800; font-family:'Segoe UI',Arial,sans-serif;">
      Welcome, ${name}! &#127881;
    </p>
    <p style="margin:0 0 24px; color:#64748b; font-size:14px; line-height:1.8; font-family:'Segoe UI',Arial,sans-serif;">
      Your account has been <strong style="color:#059669;">successfully activated</strong>. You are now part of Ahmedabad's most trusted real estate platform.
    </p>
    ${divider}
    <p style="margin:0 0 12px; color:#1e293b; font-size:14px; font-weight:700; font-family:'Segoe UI',Arial,sans-serif;">&#9989;&nbsp; What you can do now:</p>
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 20px;">
      <tr><td style="padding:7px 0; color:#475569; font-size:13px; font-family:'Segoe UI',Arial,sans-serif;">&#127968;&nbsp; Browse 12,000+ verified properties</td></tr>
      <tr><td style="padding:7px 0; color:#475569; font-size:13px; font-family:'Segoe UI',Arial,sans-serif;">&#128200;&nbsp; Save &amp; compare properties</td></tr>
      <tr><td style="padding:7px 0; color:#475569; font-size:13px; font-family:'Segoe UI',Arial,sans-serif;">&#128222;&nbsp; Book free consultation</td></tr>
      <tr><td style="padding:7px 0; color:#475569; font-size:13px; font-family:'Segoe UI',Arial,sans-serif;">&#128276;&nbsp; Get new launch alerts</td></tr>
    </table>
    ${divider}
    ${ctaBtn('Explore Properties', `${BRAND.website}/properties.html`)}
  `;
  return wrap(body);
}

// ═══════════════════════════════════════════════════════════════════════════════
// 2. OTP — Register / Login / Forgot (alag alag design)
// ═══════════════════════════════════════════════════════════════════════════════
function otpHtml({ name, otp, type }) {
  const cfg = {
    register: {
      subject: 'Verify Your Email',
      heading: 'Activate Your Account',
      msg:     'Enter the OTP below to verify your email and activate your account.',
      color:   '#059669',
      bg:      '#ecfdf5',
      border:  '#6ee7b7',
      icon:    '&#127881;',
      badge:   '#059669',
      badgeTxt:'REGISTRATION',
    },
    login: {
      subject: 'Login OTP',
      heading: 'Verify Your Login',
      msg:     'Enter the OTP below to complete your login. Valid for 10 minutes.',
      color:   '#2563eb',
      bg:      '#eff6ff',
      border:  '#93c5fd',
      icon:    '&#128274;',
      badge:   '#2563eb',
      badgeTxt:'LOGIN',
    },
    forgot: {
      subject: 'Reset Password OTP',
      heading: 'Reset Your Password',
      msg:     'Enter the OTP below to reset your password. Valid for 10 minutes.',
      color:   '#d97706',
      bg:      '#fffbeb',
      border:  '#fcd34d',
      icon:    '&#128273;',
      badge:   '#d97706',
      badgeTxt:'PASSWORD RESET',
    },
  };
  const c = cfg[type] || cfg.login;

  const body = `
    <!-- Badge -->
    <table cellpadding="0" cellspacing="0" border="0" align="center" style="margin:0 auto 24px;">
      <tr>
        <td style="background:${c.badge}; color:#fff; font-size:10px; font-weight:800; letter-spacing:2px; padding:5px 14px; border-radius:50px; font-family:'Segoe UI',Arial,sans-serif;">
          ${c.badgeTxt}
        </td>
      </tr>
    </table>

    <!-- Icon -->
    <table cellpadding="0" cellspacing="0" border="0" align="center" style="margin:0 auto 18px;">
      <tr>
        <td align="center" style="background:${c.bg}; border:2px solid ${c.border}; border-radius:50%; width:76px; height:76px; font-size:34px; line-height:76px; text-align:center;">
          ${c.icon}
        </td>
      </tr>
    </table>

    <h2 style="margin:0 0 8px; color:#1e293b; font-size:22px; font-weight:800; text-align:center; font-family:'Segoe UI',Arial,sans-serif;">${c.heading}</h2>
    <p style="margin:0 0 4px; color:#64748b; font-size:14px; text-align:center; font-family:'Segoe UI',Arial,sans-serif;">
      Hi <strong style="color:#1e293b;">${name}</strong>,
    </p>
    <p style="margin:0 0 28px; color:#64748b; font-size:14px; text-align:center; font-family:'Segoe UI',Arial,sans-serif;">${c.msg}</p>

    <!-- OTP Box -->
    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:0 0 20px;">
      <tr>
        <td align="center" style="background:${c.bg}; border:2px dashed ${c.border}; border-radius:16px; padding:30px 20px;">
          <p style="margin:0 0 12px; color:#94a3b8; font-size:10px; letter-spacing:4px; text-transform:uppercase; font-weight:700; font-family:'Segoe UI',Arial,sans-serif;">
            Your OTP Code
          </p>
          <p style="margin:0; font-size:52px; font-weight:900; letter-spacing:20px; color:${c.color}; font-family:'Courier New',Courier,monospace; line-height:1;">
            ${otp}
          </p>
          <p style="margin:14px 0 0; color:#94a3b8; font-size:12px; font-family:'Segoe UI',Arial,sans-serif;">
            &#9201;&nbsp;Valid for <strong>10 minutes</strong> only
          </p>
        </td>
      </tr>
    </table>

    <!-- Warning -->
    <table cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr>
        <td style="background:#fff8f0; border-left:4px solid #f59e0b; border-radius:0 8px 8px 0; padding:12px 16px;">
          <p style="margin:0; color:#92400e; font-size:12px; font-family:'Segoe UI',Arial,sans-serif;">
            &#9888;&#65039;&nbsp;<strong>Never share this OTP</strong> with anyone. ${BRAND.name} will never ask for your OTP.
          </p>
        </td>
      </tr>
    </table>
  `;
  return wrap(body);
}

// ═══════════════════════════════════════════════════════════════════════════════
// 3. CONTACT CONFIRMATION
// ═══════════════════════════════════════════════════════════════════════════════
function contactConfirmHtml({ name, subject, message }) {
  const body = `
    <p style="margin:0 0 6px; color:#1e293b; font-size:22px; font-weight:800; font-family:'Segoe UI',Arial,sans-serif;">
      Hello, ${name}! &#128075;
    </p>
    <p style="margin:0 0 24px; color:#64748b; font-size:14px; line-height:1.8; font-family:'Segoe UI',Arial,sans-serif;">
      Thank you for contacting us! &#9989;&nbsp;We have received your message and our team will get back to you within <strong style="color:#C62828;">30 minutes</strong>.
    </p>
    ${divider}
    <p style="margin:0 0 12px; color:#1e293b; font-size:14px; font-weight:700; font-family:'Segoe UI',Arial,sans-serif;">&#128203;&nbsp;Your Message Details</p>
    ${infoTable(`
      ${infoRow('Subject', subject || 'General Inquiry')}
      ${infoRow('Message', message)}
    `)}
    ${divider}
    <p style="margin:0; color:#64748b; font-size:13px; line-height:1.7; font-family:'Segoe UI',Arial,sans-serif;">
      For urgent queries, call us at <strong style="color:#1e293b;">${BRAND.phone}</strong>
    </p>
    ${ctaBtn('Visit Our Website', BRAND.website)}
  `;
  return wrap(body);
}

// ═══════════════════════════════════════════════════════════════════════════════
// 4. INQUIRY CONFIRMATION
// ═══════════════════════════════════════════════════════════════════════════════
function inquiryConfirmHtml({ name, propertyName, propertyType, budget, city, lookingFor, message }) {
  const body = `
    <p style="margin:0 0 6px; color:#1e293b; font-size:22px; font-weight:800; font-family:'Segoe UI',Arial,sans-serif;">
      Hello, ${name}! &#128075;
    </p>
    <p style="margin:0 0 24px; color:#64748b; font-size:14px; line-height:1.8; font-family:'Segoe UI',Arial,sans-serif;">
      Your property inquiry has been received! &#127968;&nbsp;Our expert team will contact you shortly with the best options.
    </p>
    ${divider}
    <p style="margin:0 0 12px; color:#1e293b; font-size:14px; font-weight:700; font-family:'Segoe UI',Arial,sans-serif;">&#128203;&nbsp;Inquiry Summary</p>
    ${infoTable(`
      ${infoRow('Property', propertyName)}
      ${infoRow('Type', propertyType)}
      ${infoRow('Looking For', lookingFor)}
      ${infoRow('City', city)}
      ${infoRow('Budget', budget)}
      ${infoRow('Message', message)}
    `)}
    ${divider}
    <p style="margin:0; color:#64748b; font-size:13px; line-height:1.7; font-family:'Segoe UI',Arial,sans-serif;">
      Browse more properties or call us at <strong style="color:#1e293b;">${BRAND.phone}</strong>
    </p>
    ${ctaBtn('Browse Properties', `${BRAND.website}/properties.html`)}
  `;
  return wrap(body);
}

module.exports = { otpHtml, contactConfirmHtml, inquiryConfirmHtml, registerWelcomeHtml };
