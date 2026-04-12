// ===== CITY REAL SPACE — SHARED EMAIL TEMPLATES =====

const BRAND = {
  name:    'City Real Space',
  tagline: "Gujarat's #1 Real Estate Platform",
  website: 'https://cityrealspace.com',
  phone:   '+91 97235 50764',
  email:   'info@cityrealspace.com',
  address: 'Ahmedabad, Gujarat, India',
  // Public URL — works in Gmail, Outlook, all clients
  logo:    'https://cityrealspace.com/images/logo.jpeg',
  primary: '#C62828',
  dark:    '#0d1b2e',
};

// ─── Base wrapper ─────────────────────────────────────────────────────────────
function wrap(bodyHtml) {
  const year = new Date().getFullYear();
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>${BRAND.name}</title>
</head>
<body style="margin:0;padding:0;background:#eef2f7;font-family:'Segoe UI',Helvetica,Arial,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#eef2f7;padding:40px 16px;">
<tr><td align="center" valign="top">

  <!-- OUTER CARD -->
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:580px;width:100%;">

    <!-- ══ HEADER ══ -->
    <tr>
      <td align="center" style="background:linear-gradient(160deg,#b71c1c 0%,#C62828 45%,#7f0000 100%);border-radius:20px 20px 0 0;padding:40px 32px 32px;">

        <!-- Logo circle -->
        <table cellpadding="0" cellspacing="0" border="0" style="margin:0 auto 18px;">
          <tr>
            <td align="center" style="background:#ffffff;border-radius:50%;width:88px;height:88px;padding:4px;box-shadow:0 0 0 4px rgba(255,255,255,0.2);">
              <img src="${BRAND.logo}" alt="${BRAND.name} Logo" width="80" height="80"
                   style="display:block;border-radius:50%;object-fit:cover;width:80px;height:80px;"
                   onerror="this.style.display='none'"/>
            </td>
          </tr>
        </table>

        <h1 style="margin:0 0 6px;color:#ffffff;font-size:24px;font-weight:800;letter-spacing:0.5px;text-align:center;">${BRAND.name}</h1>
        <p style="margin:0;color:rgba(255,255,255,0.7);font-size:12px;letter-spacing:2px;text-transform:uppercase;text-align:center;">Gujarat&#39;s #1 Real Estate Platform</p>

        <!-- Decorative line -->
        <table cellpadding="0" cellspacing="0" border="0" style="margin:20px auto 0;">
          <tr>
            <td style="background:rgba(255,255,255,0.15);height:1px;width:200px;"></td>
            <td style="padding:0 10px;color:rgba(255,255,255,0.5);font-size:14px;">&#9670;</td>
            <td style="background:rgba(255,255,255,0.15);height:1px;width:200px;"></td>
          </tr>
        </table>

      </td>
    </tr>

    <!-- ══ BODY ══ -->
    <tr>
      <td style="background:#ffffff;padding:40px 40px 32px;">
        ${bodyHtml}
      </td>
    </tr>

    <!-- ══ SIGNATURE ══ -->
    <tr>
      <td style="background:${BRAND.dark};padding:28px 40px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td align="center">
              <p style="margin:0 0 4px;color:#ffffff;font-size:15px;font-weight:700;text-align:center;">${BRAND.name}</p>
              <p style="margin:0 0 18px;color:rgba(255,255,255,0.45);font-size:11px;letter-spacing:1.5px;text-transform:uppercase;text-align:center;">Gujarat&#39;s #1 Real Estate Platform</p>

              <!-- Contact row -->
              <table cellpadding="0" cellspacing="0" border="0" style="margin:0 auto 16px;">
                <tr>
                  <td style="padding:0 12px;border-right:1px solid rgba(255,255,255,0.15);">
                    <a href="tel:${BRAND.phone}" style="color:rgba(255,255,255,0.6);text-decoration:none;font-size:12px;">&#128222; ${BRAND.phone}</a>
                  </td>
                  <td style="padding:0 12px;border-right:1px solid rgba(255,255,255,0.15);">
                    <a href="mailto:${BRAND.email}" style="color:rgba(255,255,255,0.6);text-decoration:none;font-size:12px;">&#128231; ${BRAND.email}</a>
                  </td>
                  <td style="padding:0 12px;">
                    <a href="${BRAND.website}" style="color:rgba(255,255,255,0.6);text-decoration:none;font-size:12px;">&#127760; cityrealspace.com</a>
                  </td>
                </tr>
              </table>

              <p style="margin:0;color:rgba(255,255,255,0.3);font-size:11px;text-align:center;">&#128205; ${BRAND.address}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- ══ COPYRIGHT ══ -->
    <tr>
      <td align="center" style="background:#060e1e;border-radius:0 0 20px 20px;padding:14px;">
        <p style="margin:0;color:rgba(255,255,255,0.2);font-size:11px;">&copy; ${year} ${BRAND.name}. All rights reserved.</p>
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
  if (!value || value === 'N/A' || value === 'Not specified') return '';
  return `<tr>
    <td style="padding:10px 14px;color:#64748b;font-size:13px;font-weight:600;white-space:nowrap;width:120px;border-bottom:1px solid #f1f5f9;">${label}</td>
    <td style="padding:10px 14px;color:#1e293b;font-size:13px;border-bottom:1px solid #f1f5f9;">${value}</td>
  </tr>`;
}

function infoTable(rows) {
  const filtered = rows.trim();
  if (!filtered) return '';
  return `<table width="100%" cellpadding="0" cellspacing="0" border="0"
    style="background:#f8fafc;border-radius:12px;border:1px solid #e2e8f0;overflow:hidden;margin:20px 0;">
    ${filtered}
  </table>`;
}

function ctaBtn(text, href) {
  return `<table cellpadding="0" cellspacing="0" border="0" style="margin:28px auto 8px;">
    <tr>
      <td align="center" style="background:linear-gradient(135deg,#C62828,#7f0000);border-radius:10px;">
        <a href="${href}" style="display:inline-block;color:#ffffff;text-decoration:none;padding:14px 40px;font-size:14px;font-weight:700;letter-spacing:0.5px;">${text}</a>
      </td>
    </tr>
  </table>`;
}

const divider = `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:24px 0;">
  <tr><td style="border-top:1px solid #e2e8f0;"></td></tr>
</table>`;

// ═══════════════════════════════════════════════════════════════════════════════
// 1. CONTACT CONFIRMATION
// ═══════════════════════════════════════════════════════════════════════════════
function contactConfirmHtml({ name, subject, message }) {
  const body = `
    <p style="margin:0 0 6px;color:#1e293b;font-size:20px;font-weight:800;">Hello, ${name}! &#128075;</p>
    <p style="margin:0 0 24px;color:#64748b;font-size:14px;line-height:1.7;">
      Thank you for contacting us! &#9989; We have received your message and our team will get back to you within <strong style="color:#C62828;">30 minutes</strong>.
    </p>
    ${divider}
    <p style="margin:0 0 12px;color:#1e293b;font-size:14px;font-weight:700;">&#128203; Your Message Details</p>
    ${infoTable(`
      ${infoRow('Subject', subject || 'General Inquiry')}
      ${infoRow('Message', message)}
    `)}
    ${divider}
    <p style="margin:0 0 4px;color:#64748b;font-size:13px;line-height:1.7;">
      For urgent queries, call us at <strong style="color:#1e293b;">${BRAND.phone}</strong>
    </p>
    ${ctaBtn('Visit Our Website', BRAND.website)}
  `;
  return wrap(body);
}

// ═══════════════════════════════════════════════════════════════════════════════
// 2. INQUIRY CONFIRMATION
// ═══════════════════════════════════════════════════════════════════════════════
function inquiryConfirmHtml({ name, propertyName, propertyType, budget, city, lookingFor, message }) {
  const body = `
    <p style="margin:0 0 6px;color:#1e293b;font-size:20px;font-weight:800;">Hello, ${name}! &#128075;</p>
    <p style="margin:0 0 24px;color:#64748b;font-size:14px;line-height:1.7;">
      Your property inquiry has been received! &#127968; Our expert team will contact you shortly with the best options matching your requirements.
    </p>
    ${divider}
    <p style="margin:0 0 12px;color:#1e293b;font-size:14px;font-weight:700;">&#128203; Inquiry Summary</p>
    ${infoTable(`
      ${infoRow('Property', propertyName)}
      ${infoRow('Type', propertyType)}
      ${infoRow('Looking For', lookingFor)}
      ${infoRow('City', city)}
      ${infoRow('Budget', budget)}
      ${infoRow('Message', message)}
    `)}
    ${divider}
    <p style="margin:0 0 4px;color:#64748b;font-size:13px;line-height:1.7;">
      Browse more properties or call us at <strong style="color:#1e293b;">${BRAND.phone}</strong>
    </p>
    ${ctaBtn('Browse Properties', `${BRAND.website}/properties.html`)}
  `;
  return wrap(body);
}

// ═══════════════════════════════════════════════════════════════════════════════
// 3. OTP EMAIL
// ═══════════════════════════════════════════════════════════════════════════════
function otpHtml({ name, otp, type }) {
  const config = {
    register: { heading: 'Activate Your Account',  msg: 'Use the OTP below to verify your email and activate your account.', color: '#059669', bg: '#ecfdf5', border: '#6ee7b7', icon: '&#127881;' },
    login:    { heading: 'Verify Your Login',       msg: 'Use the OTP below to complete your login. Valid for 10 minutes.',    color: '#2563eb', bg: '#eff6ff', border: '#93c5fd', icon: '&#128274;' },
    forgot:   { heading: 'Reset Your Password',     msg: 'Use the OTP below to reset your password. Valid for 10 minutes.',    color: '#d97706', bg: '#fffbeb', border: '#fcd34d', icon: '&#128273;' },
  };
  const { heading, msg, color, bg, border, icon } = config[type] || config.login;

  const body = `
    <!-- Icon -->
    <table cellpadding="0" cellspacing="0" border="0" style="margin:0 auto 20px;">
      <tr>
        <td align="center" style="background:${bg};border:2px solid ${border};border-radius:50%;width:72px;height:72px;font-size:32px;line-height:72px;text-align:center;">
          ${icon}
        </td>
      </tr>
    </table>

    <h2 style="margin:0 0 8px;color:#1e293b;font-size:22px;font-weight:800;text-align:center;">${heading}</h2>
    <p style="margin:0 0 4px;color:#64748b;font-size:14px;text-align:center;">Hi <strong style="color:#1e293b;">${name}</strong>,</p>
    <p style="margin:0 0 28px;color:#64748b;font-size:14px;text-align:center;">${msg}</p>

    <!-- OTP Box -->
    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:0 0 24px;">
      <tr>
        <td align="center" style="background:${bg};border:2px dashed ${border};border-radius:16px;padding:28px 20px;">
          <p style="margin:0 0 10px;color:#94a3b8;font-size:11px;letter-spacing:3px;text-transform:uppercase;font-weight:700;">Your OTP Code</p>
          <p style="margin:0;font-size:48px;font-weight:900;letter-spacing:18px;color:${color};font-family:'Courier New',Courier,monospace;line-height:1;">${otp}</p>
          <p style="margin:14px 0 0;color:#94a3b8;font-size:12px;">&#9201; Valid for <strong>10 minutes</strong> only</p>
        </td>
      </tr>
    </table>

    <!-- Warning -->
    <table cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr>
        <td style="background:#fff8f0;border-left:4px solid #f59e0b;border-radius:0 8px 8px 0;padding:12px 16px;">
          <p style="margin:0;color:#92400e;font-size:12px;">&#9888;&#65039; <strong>Never share this OTP</strong> with anyone. ${BRAND.name} will never ask for your OTP.</p>
        </td>
      </tr>
    </table>
  `;
  return wrap(body);
}

module.exports = { contactConfirmHtml, inquiryConfirmHtml, otpHtml };
