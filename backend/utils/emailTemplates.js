// ===== CITY REAL SPACE — SHARED EMAIL TEMPLATES =====
const fs   = require('fs');
const path = require('path');

// Logo Base64 embed — works in all email clients without external URL
let LOGO_SRC;
try {
  const logoPath = path.join(__dirname, '../../images/logo.jpeg');
  const logoB64  = fs.readFileSync(logoPath).toString('base64');
  LOGO_SRC = `data:image/jpeg;base64,${logoB64}`;
} catch {
  LOGO_SRC = 'https://cityrealspace.com/images/logo.jpeg'; // fallback
}

const BRAND = {
  name:    'City Real Space',
  tagline: "Gujarat's #1 Real Estate Platform",
  website: 'https://cityrealspace.com',
  phone:   '+91 97235 50764',
  email:   'info@cityrealspace.com',
  address: 'Ahmedabad, Gujarat, India',
  logo:    LOGO_SRC,
  primary: '#C62828',
  dark:    '#0a1628',
  card:    '#111d35',
};

// ─── Base wrapper ────────────────────────────────────────────────────────────
function wrap(bodyHtml) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>${BRAND.name}</title>
</head>
<body style="margin:0;padding:0;background:#f0f4f8;font-family:'Segoe UI',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f4f8;padding:32px 16px;">
  <tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 8px 40px rgba(0,0,0,0.12);">

      <!-- HEADER -->
      <tr>
        <td align="center" style="background:linear-gradient(135deg,${BRAND.primary} 0%,#8B0000 100%);padding:36px 32px 28px;">
          <img src="${BRAND.logo}" alt="${BRAND.name}" width="72" height="72"
               style="border-radius:16px;border:3px solid rgba(255,255,255,0.3);display:block;margin:0 auto 14px;object-fit:cover;"/>
          <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:800;letter-spacing:0.5px;">${BRAND.name}</h1>
          <p style="margin:5px 0 0;color:rgba(255,255,255,0.75);font-size:12px;letter-spacing:1px;text-transform:uppercase;">${BRAND.tagline}</p>
        </td>
      </tr>

      <!-- BODY -->
      <tr>
        <td style="padding:36px 40px;background:#ffffff;">
          ${bodyHtml}
        </td>
      </tr>

      <!-- SIGNATURE / FOOTER -->
      <tr>
        <td style="background:${BRAND.dark};padding:28px 40px;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td>
                <p style="margin:0 0 4px;color:#ffffff;font-size:14px;font-weight:700;">${BRAND.name}</p>
                <p style="margin:0 0 12px;color:rgba(255,255,255,0.5);font-size:11px;">${BRAND.tagline}</p>
                <p style="margin:0 0 4px;color:rgba(255,255,255,0.6);font-size:12px;">
                  📞 <a href="tel:${BRAND.phone}" style="color:rgba(255,255,255,0.6);text-decoration:none;">${BRAND.phone}</a>
                </p>
                <p style="margin:0 0 4px;color:rgba(255,255,255,0.6);font-size:12px;">
                  📧 <a href="mailto:${BRAND.email}" style="color:rgba(255,255,255,0.6);text-decoration:none;">${BRAND.email}</a>
                </p>
                <p style="margin:0 0 12px;color:rgba(255,255,255,0.6);font-size:12px;">
                  🌐 <a href="${BRAND.website}" style="color:rgba(255,255,255,0.6);text-decoration:none;">${BRAND.website}</a>
                </p>
                <p style="margin:0;color:rgba(255,255,255,0.35);font-size:11px;">📍 ${BRAND.address}</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- COPYRIGHT -->
      <tr>
        <td align="center" style="background:#060e1e;padding:14px;">
          <p style="margin:0;color:rgba(255,255,255,0.25);font-size:11px;">&copy; ${new Date().getFullYear()} ${BRAND.name}. All rights reserved.</p>
        </td>
      </tr>

    </table>
  </td></tr>
</table>
</body>
</html>`;
}

// ─── Info row helper ─────────────────────────────────────────────────────────
function infoRow(label, value) {
  if (!value || value === 'N/A') return '';
  return `<tr>
    <td style="padding:8px 12px;color:#64748b;font-size:13px;font-weight:600;white-space:nowrap;width:130px;">${label}</td>
    <td style="padding:8px 12px;color:#1e293b;font-size:13px;">${value}</td>
  </tr>`;
}

// ─── Info table helper ────────────────────────────────────────────────────────
function infoTable(rows) {
  return `<table width="100%" cellpadding="0" cellspacing="0"
    style="background:#f8fafc;border-radius:12px;border:1px solid #e2e8f0;overflow:hidden;margin:20px 0;">
    ${rows}
  </table>`;
}

// ─── Divider ─────────────────────────────────────────────────────────────────
const divider = `<hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0;"/>`;

// ─── CTA Button ──────────────────────────────────────────────────────────────
function ctaBtn(text, href) {
  return `<div style="text-align:center;margin:28px 0 8px;">
    <a href="${href}" style="display:inline-block;background:linear-gradient(135deg,${BRAND.primary},#8B0000);
      color:#ffffff;text-decoration:none;padding:14px 36px;border-radius:10px;
      font-size:14px;font-weight:700;letter-spacing:0.5px;">
      ${text}
    </a>
  </div>`;
}

// ─── Greeting ────────────────────────────────────────────────────────────────
function greeting(name) {
  return `<p style="margin:0 0 6px;color:#1e293b;font-size:18px;font-weight:700;">Hello, ${name}! 👋</p>`;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 1. CONTACT CONFIRMATION (to user)
// ═══════════════════════════════════════════════════════════════════════════════
function contactConfirmHtml({ name, subject, message }) {
  const body = `
    ${greeting(name)}
    <p style="margin:4px 0 20px;color:#64748b;font-size:14px;">
      Thank you for reaching out to us! ✅ We've received your message and our team will get back to you within <strong style="color:#1e293b;">30 minutes</strong>.
    </p>
    ${divider}
    <p style="margin:0 0 10px;color:#1e293b;font-size:14px;font-weight:600;">Your Message Details</p>
    ${infoTable(`
      ${infoRow('Subject', subject || 'General Inquiry')}
      ${infoRow('Message', message)}
    `)}
    ${divider}
    <p style="margin:0;color:#64748b;font-size:13px;line-height:1.7;">
      If you have any urgent queries, feel free to call us directly at <strong>${BRAND.phone}</strong> or visit our website.
    </p>
    ${ctaBtn('Visit Our Website', BRAND.website)}
  `;
  return wrap(body);
}

// ═══════════════════════════════════════════════════════════════════════════════
// 2. INQUIRY CONFIRMATION (to user)
// ═══════════════════════════════════════════════════════════════════════════════
function inquiryConfirmHtml({ name, propertyName, propertyType, budget, city, lookingFor, message }) {
  const body = `
    ${greeting(name)}
    <p style="margin:4px 0 20px;color:#64748b;font-size:14px;">
      Your property inquiry has been received! 🏠 Our expert team will contact you shortly with the best options matching your requirements.
    </p>
    ${divider}
    <p style="margin:0 0 10px;color:#1e293b;font-size:14px;font-weight:600;">Inquiry Summary</p>
    ${infoTable(`
      ${infoRow('Property', propertyName || 'Not specified')}
      ${infoRow('Type', propertyType || 'Not specified')}
      ${infoRow('Looking For', lookingFor || 'Not specified')}
      ${infoRow('City', city || 'Not specified')}
      ${infoRow('Budget', budget || 'Not specified')}
      ${infoRow('Message', message || 'Not specified')}
    `)}
    ${divider}
    <p style="margin:0;color:#64748b;font-size:13px;line-height:1.7;">
      Browse more properties on our website or call us at <strong>${BRAND.phone}</strong> for immediate assistance.
    </p>
    ${ctaBtn('Browse Properties', `${BRAND.website}/properties.html`)}
  `;
  return wrap(body);
}

// ═══════════════════════════════════════════════════════════════════════════════
// 3. OTP EMAIL (register / login / forgot)
// ═══════════════════════════════════════════════════════════════════════════════
function otpHtml({ name, otp, type }) {
  const config = {
    register: { heading: 'Activate Your Account',  msg: 'Use the OTP below to verify your email and activate your account.', color: '#10b981', icon: '🎉' },
    login:    { heading: 'Verify Your Login',       msg: 'Use the OTP below to complete your login. Valid for 10 minutes.',    color: '#3b82f6', icon: '🔐' },
    forgot:   { heading: 'Reset Your Password',     msg: 'Use the OTP below to reset your password. Valid for 10 minutes.',    color: '#f59e0b', icon: '🔑' },
  };
  const { heading, msg, color, icon } = config[type] || config.login;

  const body = `
    <div style="text-align:center;margin-bottom:24px;">
      <div style="display:inline-block;background:${color}18;border-radius:50%;width:64px;height:64px;line-height:64px;font-size:28px;">${icon}</div>
    </div>
    <h2 style="margin:0 0 8px;color:#1e293b;font-size:20px;font-weight:800;text-align:center;">${heading}</h2>
    <p style="margin:0 0 6px;color:#64748b;font-size:14px;text-align:center;">Hi <strong style="color:#1e293b;">${name}</strong>,</p>
    <p style="margin:0 0 28px;color:#64748b;font-size:14px;text-align:center;">${msg}</p>

    <div style="background:#f8fafc;border:2px dashed ${color};border-radius:16px;padding:28px;text-align:center;margin:0 0 24px;">
      <p style="margin:0 0 8px;color:#94a3b8;font-size:11px;letter-spacing:3px;text-transform:uppercase;font-weight:600;">Your OTP Code</p>
      <div style="font-size:42px;font-weight:900;letter-spacing:16px;color:${color};font-family:'Courier New',monospace;line-height:1;">${otp}</div>
      <p style="margin:12px 0 0;color:#94a3b8;font-size:12px;">⏱ Valid for <strong>10 minutes</strong> only</p>
    </div>

    <div style="background:#fff8f0;border-left:4px solid #f59e0b;border-radius:0 8px 8px 0;padding:12px 16px;margin-bottom:8px;">
      <p style="margin:0;color:#92400e;font-size:12px;">⚠️ <strong>Never share this OTP</strong> with anyone. ${BRAND.name} will never ask for your OTP.</p>
    </div>
  `;
  return wrap(body);
}

module.exports = { contactConfirmHtml, inquiryConfirmHtml, otpHtml };
