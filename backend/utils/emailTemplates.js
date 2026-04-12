// ===== CITY REAL SPACE — EMAIL TEMPLATES =====

const BRAND = {
  name:    'City Real Space',
  sub:     'Ahmedabad, Gujarat',
  tagline: 'Premium Real Estate Platform',
  website: 'https://cityrealspace.com',
  phone:   '+91 97235 50764',
  email:   'info@cityrealspace.com',
  address: 'Ahmedabad, Gujarat, India',
  logo:    'https://city-real-space.vercel.app/images/logo.jpeg',
  year:    new Date().getFullYear(),
};

// ─── WRAPPER ──────────────────────────────────────────────────────────────────
function wrap(bodyRows, accentColor = '#C62828') {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>${BRAND.name}</title>
<style>
  @keyframes slideDown { from{opacity:0;transform:translateY(-20px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeIn    { from{opacity:0} to{opacity:1} }
  @keyframes popUp     { from{opacity:0;transform:scale(0.85)} to{opacity:1;transform:scale(1)} }
  .card  { animation: slideDown 0.5s cubic-bezier(0.22,1,0.36,1) both; }
  .body  { animation: fadeIn 0.5s 0.15s ease both; }
  .otpbox{ animation: popUp 0.4s 0.25s cubic-bezier(0.22,1,0.36,1) both; }
</style>
</head>
<body style="margin:0;padding:0;background:#dde3ec;font-family:'Segoe UI',Arial,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#dde3ec;padding:28px 12px;">
<tr><td align="center">

  <table class="card" width="100%" cellpadding="0" cellspacing="0" border="0"
    style="max-width:520px;width:100%;border-radius:20px;overflow:hidden;box-shadow:0 16px 48px rgba(0,0,0,0.18);">

    <!-- ══ HEADER ══ -->
    <tr>
      <td align="center" style="background:linear-gradient(150deg,#7f0000 0%,#C62828 50%,#8B0000 100%);padding:28px 24px 22px;">
        <!-- Logo circle -->
        <div style="width:72px;height:72px;border-radius:50%;background:#fff;border:3px solid rgba(255,255,255,0.4);box-shadow:0 0 0 6px rgba(255,255,255,0.12);overflow:hidden;margin:0 auto 12px;display:block;">
          <img src="${BRAND.logo}" alt="CRS" width="72" height="72"
            style="display:block;width:72px;height:72px;border-radius:50%;object-fit:cover;"/>
        </div>
        <div style="color:#fff;font-size:18px;font-weight:800;letter-spacing:0.3px;margin:0 0 3px;font-family:'Segoe UI',Arial,sans-serif;">${BRAND.name}</div>
        <div style="color:rgba(255,255,255,0.65);font-size:10px;letter-spacing:2.5px;text-transform:uppercase;font-family:'Segoe UI',Arial,sans-serif;">${BRAND.tagline}</div>
      </td>
    </tr>

    <!-- ══ BODY ══ -->
    <tr>
      <td class="body" style="background:#ffffff;padding:28px 32px 24px;">
        ${bodyRows}
      </td>
    </tr>

    <!-- ══ FOOTER with real estate bg ══ -->
    <tr>
      <td style="position:relative;background:#0d1b2e;padding:0;overflow:hidden;">
        <!-- Real estate background image -->
        <div style="position:absolute;inset:0;background:url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&q=60') center/cover no-repeat;opacity:0.08;"></div>
        <div style="position:relative;padding:20px 28px;text-align:center;">
          <div style="color:#fff;font-size:13px;font-weight:700;margin:0 0 2px;font-family:'Segoe UI',Arial,sans-serif;">${BRAND.name}</div>
          <div style="color:rgba(255,255,255,0.4);font-size:10px;letter-spacing:1.5px;text-transform:uppercase;margin:0 0 14px;font-family:'Segoe UI',Arial,sans-serif;">${BRAND.sub}</div>
          <table cellpadding="0" cellspacing="0" border="0" align="center" style="margin:0 auto 12px;">
            <tr>
              <td style="padding:0 10px;border-right:1px solid rgba(255,255,255,0.1);">
                <a href="tel:${BRAND.phone}" style="color:rgba(255,255,255,0.5);text-decoration:none;font-size:11px;font-family:'Segoe UI',Arial,sans-serif;">&#128222; ${BRAND.phone}</a>
              </td>
              <td style="padding:0 10px;border-right:1px solid rgba(255,255,255,0.1);">
                <a href="mailto:${BRAND.email}" style="color:rgba(255,255,255,0.5);text-decoration:none;font-size:11px;font-family:'Segoe UI',Arial,sans-serif;">&#128231; ${BRAND.email}</a>
              </td>
              <td style="padding:0 10px;">
                <a href="${BRAND.website}" style="color:rgba(255,255,255,0.5);text-decoration:none;font-size:11px;font-family:'Segoe UI',Arial,sans-serif;">&#127760; cityrealspace.com</a>
              </td>
            </tr>
          </table>
          <div style="color:rgba(255,255,255,0.2);font-size:10px;font-family:'Segoe UI',Arial,sans-serif;">&copy; ${BRAND.year} ${BRAND.name}. All rights reserved.</div>
        </div>
      </td>
    </tr>

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
    <td style="padding:8px 14px;color:#64748b;font-size:12px;font-weight:600;white-space:nowrap;width:110px;border-bottom:1px solid #f1f5f9;font-family:'Segoe UI',Arial,sans-serif;">${label}</td>
    <td style="padding:8px 14px;color:#1e293b;font-size:12px;border-bottom:1px solid #f1f5f9;font-family:'Segoe UI',Arial,sans-serif;">${value}</td>
  </tr>`;
}

function infoTable(rows) {
  const r = rows.replace(/^\s*$/gm,'').trim();
  if (!r) return '';
  return `<table width="100%" cellpadding="0" cellspacing="0" border="0"
    style="background:#f8fafc;border-radius:10px;border:1px solid #e2e8f0;overflow:hidden;margin:14px 0;">${r}</table>`;
}

function ctaBtn(text, href, color = '#C62828') {
  return `<table cellpadding="0" cellspacing="0" border="0" align="center" style="margin:20px auto 0;">
    <tr>
      <td align="center" style="background:linear-gradient(135deg,${color},#7f0000);border-radius:9px;box-shadow:0 4px 14px rgba(198,40,40,0.3);">
        <a href="${href}" style="display:inline-block;color:#fff;text-decoration:none;padding:12px 36px;font-size:13px;font-weight:700;letter-spacing:0.4px;font-family:'Segoe UI',Arial,sans-serif;">${text} &#8594;</a>
      </td>
    </tr>
  </table>`;
}

const divider = `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:18px 0;"><tr><td style="border-top:1px solid #eef2f7;"></td></tr></table>`;

// ═══════════════════════════════════════════════════════════════════════════════
// 1. OTP EMAIL — Register / Login / Forgot
// ═══════════════════════════════════════════════════════════════════════════════
function otpHtml({ name, otp, type }) {
  const cfg = {
    register: { heading:'Activate Your Account', msg:'Enter the OTP below to verify your email.', color:'#059669', bg:'#ecfdf5', border:'#6ee7b7', icon:'&#127881;', badge:'#059669', badgeTxt:'REGISTRATION' },
    login:    { heading:'Verify Your Login',      msg:'Enter the OTP below to complete your login.', color:'#2563eb', bg:'#eff6ff', border:'#93c5fd', icon:'&#128274;', badge:'#2563eb', badgeTxt:'LOGIN' },
    forgot:   { heading:'Reset Your Password',    msg:'Enter the OTP below to reset your password.', color:'#d97706', bg:'#fffbeb', border:'#fcd34d', icon:'&#128273;', badge:'#d97706', badgeTxt:'PASSWORD RESET' },
  };
  const c = cfg[type] || cfg.login;

  const body = `
    <!-- Badge -->
    <table cellpadding="0" cellspacing="0" border="0" align="center" style="margin:0 auto 16px;">
      <tr><td style="background:${c.badge};color:#fff;font-size:9px;font-weight:800;letter-spacing:2px;padding:4px 12px;border-radius:50px;font-family:'Segoe UI',Arial,sans-serif;">${c.badgeTxt}</td></tr>
    </table>

    <!-- Icon -->
    <table cellpadding="0" cellspacing="0" border="0" align="center" style="margin:0 auto 12px;">
      <tr><td align="center" style="background:${c.bg};border:2px solid ${c.border};border-radius:50%;width:60px;height:60px;font-size:26px;line-height:60px;text-align:center;">${c.icon}</td></tr>
    </table>

    <h2 style="margin:0 0 6px;color:#1e293b;font-size:19px;font-weight:800;text-align:center;font-family:'Segoe UI',Arial,sans-serif;">${c.heading}</h2>
    <p style="margin:0 0 18px;color:#64748b;font-size:13px;text-align:center;line-height:1.6;font-family:'Segoe UI',Arial,sans-serif;">Hi <strong style="color:#1e293b;">${name}</strong>, ${c.msg}</p>

    <!-- OTP Box -->
    <table class="otpbox" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:0 0 16px;">
      <tr>
        <td align="center" style="background:${c.bg};border:2px dashed ${c.border};border-radius:14px;padding:20px 16px;">
          <div style="color:#94a3b8;font-size:9px;letter-spacing:4px;text-transform:uppercase;font-weight:700;margin:0 0 8px;font-family:'Segoe UI',Arial,sans-serif;">YOUR OTP CODE</div>
          <div style="font-size:44px;font-weight:900;letter-spacing:18px;color:${c.color};font-family:'Courier New',monospace;line-height:1;">${otp}</div>
          <div style="color:#94a3b8;font-size:11px;margin:8px 0 0;font-family:'Segoe UI',Arial,sans-serif;">&#9201; Valid for <strong>10 minutes</strong> only</div>
        </td>
      </tr>
    </table>

    <!-- Warning -->
    <table cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr><td style="background:#fff8f0;border-left:3px solid #f59e0b;border-radius:0 7px 7px 0;padding:10px 14px;">
        <span style="color:#92400e;font-size:11px;font-family:'Segoe UI',Arial,sans-serif;">&#9888;&#65039; <strong>Never share this OTP</strong> with anyone. ${BRAND.name} will never ask for your OTP.</span>
      </td></tr>
    </table>`;

  return wrap(body, c.color);
}

// ═══════════════════════════════════════════════════════════════════════════════
// 2. REGISTER WELCOME
// ═══════════════════════════════════════════════════════════════════════════════
function registerWelcomeHtml({ name }) {
  const body = `
    <p style="margin:0 0 4px;color:#1e293b;font-size:20px;font-weight:800;font-family:'Segoe UI',Arial,sans-serif;">Welcome, ${name}! &#127881;</p>
    <p style="margin:0 0 18px;color:#64748b;font-size:13px;line-height:1.7;font-family:'Segoe UI',Arial,sans-serif;">Your account has been <strong style="color:#059669;">successfully activated</strong>. Welcome to Ahmedabad's most trusted real estate platform.</p>
    ${divider}
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 4px;">
      <tr><td style="padding:6px 0;color:#475569;font-size:12px;font-family:'Segoe UI',Arial,sans-serif;">&#127968; Browse 12,000+ verified properties</td></tr>
      <tr><td style="padding:6px 0;color:#475569;font-size:12px;font-family:'Segoe UI',Arial,sans-serif;">&#128200; Save &amp; compare properties</td></tr>
      <tr><td style="padding:6px 0;color:#475569;font-size:12px;font-family:'Segoe UI',Arial,sans-serif;">&#128222; Book free consultation</td></tr>
      <tr><td style="padding:6px 0;color:#475569;font-size:12px;font-family:'Segoe UI',Arial,sans-serif;">&#128276; Get new launch alerts</td></tr>
    </table>
    ${ctaBtn('Explore Properties', BRAND.website + '/properties.html')}`;
  return wrap(body);
}

// ═══════════════════════════════════════════════════════════════════════════════
// 3. CONTACT CONFIRMATION
// ═══════════════════════════════════════════════════════════════════════════════
function contactConfirmHtml({ name, subject, message }) {
  const body = `
    <p style="margin:0 0 4px;color:#1e293b;font-size:20px;font-weight:800;font-family:'Segoe UI',Arial,sans-serif;">Hello, ${name}! &#128075;</p>
    <p style="margin:0 0 18px;color:#64748b;font-size:13px;line-height:1.7;font-family:'Segoe UI',Arial,sans-serif;">&#9989; We received your message. Our team will get back to you within <strong style="color:#C62828;">30 minutes</strong>.</p>
    ${divider}
    ${infoTable(`${infoRow('Subject', subject || 'General Inquiry')}${infoRow('Message', message)}`)}
    <p style="margin:14px 0 0;color:#64748b;font-size:12px;font-family:'Segoe UI',Arial,sans-serif;">For urgent queries call <strong style="color:#1e293b;">${BRAND.phone}</strong></p>
    ${ctaBtn('Visit Website', BRAND.website)}`;
  return wrap(body);
}

// ═══════════════════════════════════════════════════════════════════════════════
// 4. INQUIRY CONFIRMATION
// ═══════════════════════════════════════════════════════════════════════════════
function inquiryConfirmHtml({ name, propertyName, propertyType, budget, city, lookingFor, message }) {
  const body = `
    <p style="margin:0 0 4px;color:#1e293b;font-size:20px;font-weight:800;font-family:'Segoe UI',Arial,sans-serif;">Hello, ${name}! &#128075;</p>
    <p style="margin:0 0 18px;color:#64748b;font-size:13px;line-height:1.7;font-family:'Segoe UI',Arial,sans-serif;">&#127968; Your property inquiry has been received. Our expert team will contact you shortly.</p>
    ${divider}
    ${infoTable(`${infoRow('Property',propertyName)}${infoRow('Type',propertyType)}${infoRow('Looking For',lookingFor)}${infoRow('City',city)}${infoRow('Budget',budget)}${infoRow('Message',message)}`)}
    <p style="margin:14px 0 0;color:#64748b;font-size:12px;font-family:'Segoe UI',Arial,sans-serif;">Call us at <strong style="color:#1e293b;">${BRAND.phone}</strong></p>
    ${ctaBtn('Browse Properties', BRAND.website + '/properties.html')}`;
  return wrap(body);
}

module.exports = { otpHtml, contactConfirmHtml, inquiryConfirmHtml, registerWelcomeHtml };
