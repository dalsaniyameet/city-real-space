const express    = require('express');
const router     = require('express').Router();
const jwt        = require('jsonwebtoken');
const User       = require('../models/User');
const { protect } = require('../middleware/auth');
const { otpLimiter } = require('../middleware/limiters');
const { OAuth2Client } = require('google-auth-library');
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const twilio = require('twilio');
const genToken = (id, role) => jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
function genOTP() { return Math.floor(100000 + Math.random() * 900000).toString(); }

// ===== SEND WHATSAPP NOTIFICATION TO CITY REAL SPACE =====
async function notifyWhatsApp(user, type = 'register') {
  try {
    const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    const now = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    const isOwner = ['owner','seller','agent','builder'].includes(user.role);

    if (type === 'register') {
      // 1. Welcome message to USER/OWNER on their own number
      const userMsg = isOwner
        ? `🏢 *Welcome to City Real Space!*

Namaste *${user.firstName} ${user.lastName}* ji! 🙏

Aapka Owner/Agent account successfully create ho gaya hai.

📋 *Aapki Details:*
👤 Name: ${user.firstName} ${user.lastName}
📱 Phone: +91${user.phone}
🌆 City: ${user.city || 'Not specified'}

🏠 *Ab aap kar sakte hain:*
✅ Apni properties list karein
✅ Inquiries manage karein
✅ Dashboard access karein

🌐 *Website:* https://cityrealspace.com
📞 *Support:* +91 97235 50764
📧 *Email:* info@cityrealspace.com

_City Real Space – Gujarat's Most Trusted Real Estate Platform_ 🏆`
        : `🏠 *Welcome to City Real Space!*

Namaste *${user.firstName} ${user.lastName}* ji! 🙏

Aapka account successfully create ho gaya hai.

📋 *Aapki Details:*
👤 Name: ${user.firstName} ${user.lastName}
📱 Phone: +91${user.phone}
🌆 City: ${user.city || 'Not specified'}

🔍 *Ab aap kar sakte hain:*
✅ 12,000+ verified properties browse karein
✅ Properties save & compare karein
✅ Free consultation book karein
✅ New launch alerts paaein

🌐 *Website:* https://cityrealspace.com
📞 *Helpline:* +91 97235 50764
📧 *Email:* info@cityrealspace.com

_City Real Space – Gujarat's Most Trusted Real Estate Platform_ 🏆`;

      // Send to user's own WhatsApp number
      if (user.phone && user.phone !== '0000000000') {
        await client.messages.create({
          from: process.env.TWILIO_WA_FROM,
          to:   `whatsapp:+91${user.phone}`,
          body: userMsg
        });
      }

      // 2. Admin notification
      const adminMsg = `🔔 *New Registration – City Real Space*

👤 *Name:* ${user.firstName} ${user.lastName}
📱 *Phone:* +91${user.phone}
📧 *Email:* ${user.email}
🏷️ *Role:* ${isOwner ? '🏢 Owner/Agent' : '👤 User'}
🌆 *City:* ${user.city || 'Not specified'}
🕐 *Time:* ${now}

✅ Account verified & activated.`;

      await client.messages.create({
        from: process.env.TWILIO_WA_FROM,
        to:   process.env.CITY_WA_NUMBER,
        body: adminMsg
      });

    } else if (type === 'login') {
      // Login alert — only to admin
      const loginMsg = `🔐 *User Login – City Real Space*

👤 *Name:* ${user.firstName} ${user.lastName}
📱 *Phone:* +91${user.phone}
📧 *Email:* ${user.email}
🏷️ *Role:* ${user.role}
🌆 *City:* ${user.city || 'Not specified'}
🕐 *Time:* ${now}

✅ Successfully logged in.`;

      await client.messages.create({
        from: process.env.TWILIO_WA_FROM,
        to:   process.env.CITY_WA_NUMBER,
        body: loginMsg
      });
    }
  } catch (err) {
    console.error('WhatsApp notify failed:', err.message);
  }
}

// ===== SEND OTP via WhatsApp (Twilio) =====
async function sendOTPWhatsApp(phone, otp, name, type) {
  if (!phone || phone === '0000000000') return false;
  try {
    const twilio = require('twilio');
    const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    const typeLabel = type === 'register' ? 'Account Verification'
                    : type === 'login'    ? 'Login Verification'
                    :                       'Password Reset';
    await client.messages.create({
      from: process.env.TWILIO_WA_FROM,
      to:   `whatsapp:+91${phone}`,
      body: `🔐 *City Real Space – ${typeLabel}*\n\nHi ${name},\n\nYour OTP is:\n\n*${otp}*\n\nValid for 10 minutes only. Do not share with anyone.\n\n_City Real Space Team_`
    });
    console.log(`✅ OTP sent via WhatsApp to +91${phone}`);
    return true;
  } catch (err) {
    console.error('WhatsApp OTP failed:', err.message);
    return false;
  }
}

// ===== SEND OTP EMAIL via Gmail SMTP (Nodemailer) =====
const nodemailer = require('nodemailer');
const { Resend } = require('resend');
const { otpHtml, registerWelcomeHtml } = require('../utils/emailTemplates');

function getTransporter() {
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
}

async function sendOTPEmail(email, otp, name, type) {
  const subjects = {
    register: 'Verify Your Email – City Real Space',
    login:    'Login OTP – City Real Space',
    forgot:   'Password Reset OTP – City Real Space',
  };
  const subject = subjects[type] || subjects.login;

  // Simple clean HTML — no domain dependency
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>City Real Space OTP</title>
<style>
  @keyframes fadeInDown { from{opacity:0;transform:translateY(-24px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeInUp   { from{opacity:0;transform:translateY(24px)}  to{opacity:1;transform:translateY(0)} }
  @keyframes popUp      { from{opacity:0;transform:scale(0.7)}        to{opacity:1;transform:scale(1)} }
  @keyframes floatLogo  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
  @keyframes shimmer    { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
  @keyframes pulse      { 0%,100%{box-shadow:0 0 0 0 rgba(255,255,255,0.4)} 70%{box-shadow:0 0 0 14px rgba(255,255,255,0)} }
</style>
</head>
<body style="margin:0;padding:0;background:#e8edf5;font-family:'Segoe UI',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#e8edf5;padding:32px 12px;">
<tr><td align="center">

  <table width="100%" cellpadding="0" cellspacing="0" border="0"
    style="max-width:520px;width:100%;border-radius:24px;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,0.18);animation:fadeInDown 0.6s cubic-bezier(0.22,1,0.36,1) both;">

    <!-- HEADER -->
    <tr>
      <td align="center"
        style="background:linear-gradient(135deg,#0D1B2A 0%,#1a3a5c 50%,#0d2137 100%);padding:36px 24px 28px;">
        <!-- Logo centered -->
        <table cellpadding="0" cellspacing="0" border="0" align="center" style="margin:0 auto 14px;">
          <tr>
            <td align="center">
              <img src="https://city-real-space.vercel.app/images/logo.jpeg" alt="CRS"
                width="72" height="72"
                style="display:block;width:72px;height:72px;border-radius:18px;object-fit:contain;background:#ffffff;padding:6px;box-shadow:0 8px 28px rgba(0,0,0,0.4);border:3px solid rgba(255,255,255,0.2);"/>
            </td>
          </tr>
        </table>
        <!-- Brand name centered -->
        <div style="color:#ffffff;font-size:22px;font-weight:800;letter-spacing:0.5px;margin:0 0 4px;font-family:'Segoe UI',Arial,sans-serif;text-align:center;">City Real Space</div>
        <div style="color:rgba(255,255,255,0.5);font-size:10px;letter-spacing:2.5px;text-transform:uppercase;font-family:'Segoe UI',Arial,sans-serif;text-align:center;margin:0 0 14px;">Gujarat's Most Trusted Real Estate Platform</div>
        <!-- Admin Access Only badge centered -->
        <table cellpadding="0" cellspacing="0" border="0" align="center" style="margin:0 auto;">
          <tr>
            <td align="center" style="background:rgba(255,255,255,0.12);border:1px solid rgba(255,255,255,0.25);border-radius:50px;padding:5px 16px;">
              <span style="color:#FFC107;font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;font-family:'Segoe UI',Arial,sans-serif;">&#128274; Admin Access Only</span>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- BODY -->
    <tr>
      <td style="background:#ffffff;padding:32px 36px 28px;animation:fadeInUp 0.6s 0.15s both;">
        <p style="margin:0 0 6px;color:#0D1B2A;font-size:16px;font-weight:700;text-align:center;font-family:'Segoe UI',Arial,sans-serif;">Hello <strong>${name}</strong>,</p>
        <p style="margin:0 0 24px;color:#666;font-size:13px;text-align:center;line-height:1.6;font-family:'Segoe UI',Arial,sans-serif;">${type === 'register' ? 'Verify your email to activate your account.' : type === 'forgot' ? 'Use this OTP to reset your password.' : 'Use this OTP to complete your login.'}</p>

        <!-- OTP Box -->
        <table cellpadding="0" cellspacing="0" border="0" width="100%"
          style="background:linear-gradient(135deg,#f8f9fa,#fff);border:2px dashed #E53935;border-radius:16px;margin:0 0 24px;animation:popUp 0.5s 0.3s cubic-bezier(0.175,0.885,0.32,1.275) both;">
          <tr>
            <td align="center" style="padding:24px 16px;">
              <div style="color:#999;font-size:10px;letter-spacing:3px;text-transform:uppercase;font-weight:700;margin:0 0 10px;font-family:'Segoe UI',Arial,sans-serif;">Your OTP</div>
              <div style="font-size:48px;font-weight:900;letter-spacing:16px;color:#E53935;font-family:'Courier New',monospace;line-height:1;">${otp}</div>
              <div style="color:#aaa;font-size:12px;margin:10px 0 0;font-family:'Segoe UI',Arial,sans-serif;">&#9201; Valid for <strong style="color:#555;">10 minutes</strong> only</div>
            </td>
          </tr>
        </table>

        <!-- Warning -->
        <table cellpadding="0" cellspacing="0" border="0" width="100%">
          <tr><td style="background:#fff8f0;border-left:4px solid #f59e0b;border-radius:0 10px 10px 0;padding:12px 16px;">
            <span style="color:#92400e;font-size:12px;font-family:'Segoe UI',Arial,sans-serif;">&#9888;&#65039; <strong>Do not share this OTP</strong> with anyone. City Real Space will never ask for your OTP.</span>
          </td></tr>
        </table>
        <p style="margin:16px 0 0;color:#bbb;font-size:11px;text-align:center;font-family:'Segoe UI',Arial,sans-serif;">If you didn't request this, ignore this email.</p>
      </td>
    </tr>

    <!-- FOOTER -->
    <tr>
      <td style="background:#0D1B2A;padding:20px 28px;text-align:center;">
        <div style="color:#ffffff;font-size:13px;font-weight:700;margin:0 0 3px;font-family:'Segoe UI',Arial,sans-serif;">City Real Space</div>
        <div style="color:rgba(255,255,255,0.35);font-size:10px;letter-spacing:1.5px;text-transform:uppercase;margin:0 0 10px;font-family:'Segoe UI',Arial,sans-serif;">Ahmedabad, Gujarat</div>
        <table cellpadding="0" cellspacing="0" border="0" align="center" style="margin:0 auto 10px;">
          <tr>
            <td style="padding:0 10px;border-right:1px solid rgba(255,255,255,0.1);">
              <a href="mailto:info@cityrealspace.com" style="color:rgba(255,255,255,0.5);text-decoration:none;font-size:11px;font-family:'Segoe UI',Arial,sans-serif;">&#128231; info@cityrealspace.com</a>
            </td>
            <td style="padding:0 10px;">
              <a href="https://cityrealspace.com" style="color:rgba(255,255,255,0.5);text-decoration:none;font-size:11px;font-family:'Segoe UI',Arial,sans-serif;">&#127760; cityrealspace.com</a>
            </td>
          </tr>
        </table>
        <div style="color:rgba(255,255,255,0.2);font-size:10px;font-family:'Segoe UI',Arial,sans-serif;">&copy; 2026 City Real Space. All rights reserved.</div>
      </td>
    </tr>

  </table>
</td></tr>
</table>
</body>
</html>`;

  try {
    console.log(`📧 Sending ${type} OTP to ${email} via Gmail SMTP`);
    const transporter = getTransporter();
    await transporter.sendMail({
      from: `"City Real Space" <${process.env.EMAIL_USER}>`,
      to: email,
      subject,
      html
    });
    console.log(`✅ OTP email sent to ${email}`);
    return true;
  } catch (err) {
    console.error(`❌ Gmail SMTP failed for ${email}:`, err.message);
    return false;
  }
}

// ===== SEND OTP — Email try karo, fail ho toh WhatsApp =====
async function sendOTP(email, phone, otp, name, type) {
  const emailSent = await sendOTPEmail(email, otp, name, type);
  if (!emailSent && phone && phone !== '0000000000') {
    console.log(`📱 Email failed, trying WhatsApp OTP to +91${phone}`);
    await sendOTPWhatsApp(phone, otp, name, type);
  }
}

// ===== EMAIL DOMAIN VALIDATION =====
const dns = require('dns').promises;
async function isValidEmailDomain(email) {
  if (!email || !email.includes('@')) return false;
  const domain = email.split('@')[1];
  try {
    const mx = await dns.resolveMx(domain);
    return mx && mx.length > 0;
  } catch {
    return false;
  }
}

// ===== GET /api/auth/check-email?email= — MX record check =====
router.get('/check-email', async (req, res) => {
  const { email } = req.query;
  const valid = await isValidEmailDomain(email);
  res.json({ valid });
});

// ===== POST /api/auth/register — send OTP, don't create account yet =====
router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, phone, password, role, city } = req.body;
    if (!firstName || !lastName || !email || !phone || !password)
      return res.status(400).json({ success: false, message: 'All fields required' });

    const emailValid = await isValidEmailDomain(email);
    if (!emailValid)
      return res.status(400).json({ success: false, message: 'Invalid email address. Please check and try again.' });

    const exists = await User.findOne({ email });
    if (exists && exists.isVerified)
      return res.status(400).json({ success: false, message: 'Email already registered' });

    // Map frontend role cards to valid DB roles
    const roleMap = { 'user': 'buyer', 'owner': 'seller' };
    const validRoles = ['buyer', 'seller', 'agent', 'builder', 'investor', 'admin'];
    const mappedRole = roleMap[role] || (validRoles.includes(role) ? role : 'buyer');

    const otp     = genOTP();
    const expires = Date.now() + 1 * 60 * 1000; // 1 minute

    if (exists && !exists.isVerified) {
      exists.resetOTP = otp;
      exists.resetOTPExpire = expires;
      await exists.save();
    } else {
      await User.create({
        firstName, lastName, email, phone, password,
        role: mappedRole, city: city || '',
        isVerified: false,
        resetOTP: otp,
        resetOTPExpire: expires
      });
    }

    await sendOTP(email, phone, otp, firstName, 'register');
    res.status(201).json({ success: true, message: 'OTP sent to your email/WhatsApp. Please verify.' });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ===== POST /api/auth/verify-register — verify OTP and activate account =====
router.post('/verify-register', otpLimiter, async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    if (user.resetOTP !== otp || Date.now() > user.resetOTPExpire)
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });

    user.isVerified    = true;
    user.resetOTP      = undefined;
    user.resetOTPExpire = undefined;
    await user.save();

    try { notifyWhatsApp(user); } catch(e) {}

    // Welcome email after account activation
    try {
      const transporter = getTransporter();
      await transporter.sendMail({
        from: `"City Real Space" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: 'Welcome to City Real Space! 🏠',
        html: `<div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto"><div style="background:linear-gradient(135deg,#0D1B2A,#1a3a5c);padding:28px;text-align:center"><h2 style="color:#FFC107;margin:0">Welcome, ${user.firstName}! 🎉</h2></div><div style="padding:28px;text-align:center"><p style="color:#333">Your City Real Space account is now active.</p><p style="color:#666;font-size:0.88rem">Start exploring 12,500+ verified properties across Gujarat.</p><a href="https://cityrealspace.com" style="display:inline-block;background:#E53935;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:700;margin-top:16px">Explore Properties</a></div></div>`
      });
    } catch(e) { console.error('Welcome email failed:', e.message); }

    res.json({
      success: true,
      message: 'Email verified! Account activated.',
      token: genToken(user._id, user.role),
      user: { id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email, role: user.role, phone: user.phone, city: user.city }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ===== POST /api/auth/login =====
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, message: 'Email and password required' });

    const emailValid = await isValidEmailDomain(email);
    if (!emailValid)
      return res.status(400).json({ success: false, message: 'Invalid email address. Please check and try again.' });

    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ success: false, message: 'Invalid email or password' });

    // Admin — OTP bhejo (DB mein role admin hai toh allowed hai)
    if (user.role === 'admin') {
      const otp = genOTP();
      user.resetOTP = otp;
      user.resetOTPExpire = Date.now() + 10 * 60 * 1000;
      await user.save();
      await sendOTP(user.email, user.phone, otp, user.firstName, 'login');
      res.json({ success: true, needsOTP: true, email: user.email, isAdmin: true });
      return;
    }

    // Normal user — OTP bhejo
    const otp = genOTP();
    user.resetOTP = otp;
    user.resetOTPExpire = Date.now() + 10 * 60 * 1000;
    await user.save();
    
    await sendOTP(email, user.phone, otp, user.firstName, 'login');
    res.json({ success: true, needsOTP: true, email, isAdmin: false });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ===== POST /api/auth/verify-login =====
router.post('/verify-login', otpLimiter, async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    if (!user || user.resetOTP !== otp || Date.now() > user.resetOTPExpire)
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    user.resetOTP = undefined;
    user.resetOTPExpire = undefined;
    await user.save();

    try { notifyWhatsApp(user, 'login'); } catch(e) {}

    const token = genToken(user._id, user.role);

    // Admin ke liye httpOnly cookie + single session enforce karo
    if (user.role === 'admin') {
      // Purane saare sessions clear karo — sirf ek hi active session
      user.loginSessions = [{ token, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) }];
      await user.save();
      res.cookie('adminToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });
    }

    res.json({
      success: true,
      token,
      user: { id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email, role: user.role, phone: user.phone, city: user.city }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ===== POST /api/auth/resend-otp =====
router.post('/resend-otp', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    const otp = genOTP();
    user.resetOTP = otp;
    user.resetOTPExpire = Date.now() + 10 * 60 * 1000;
    await user.save();
    
    await sendOTP(email, user.phone, otp, user.firstName, user.isVerified ? 'login' : 'register');
    res.json({ success: true, message: 'OTP resent successfully' });
  } catch (err) {
    console.error('Resend OTP error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ===== POST /api/auth/forgot-password =====
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const emailValid = await isValidEmailDomain(email);
    if (!emailValid)
      return res.status(400).json({ success: false, message: 'Invalid email address. Please check and try again.' });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: 'No account found with this email' });
    const otp = genOTP();
    user.resetOTP = otp;
    user.resetOTPExpire = Date.now() + 10 * 60 * 1000;
    await user.save();
    
    await sendOTP(email, user.phone, otp, user.firstName, 'forgot');
    res.json({ success: true, message: 'OTP sent to your email/WhatsApp' });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ success: false, message: 'Failed to send OTP. Check email config.' });
  }
});

// ===== POST /api/auth/verify-otp =====
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    if (!user || user.resetOTP !== otp || Date.now() > user.resetOTPExpire)
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    res.json({ success: true, message: 'OTP verified' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ===== POST /api/auth/reset-password =====
router.post('/reset-password', async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const user = await User.findOne({ email });
    if (!user || user.resetOTP !== otp || Date.now() > user.resetOTPExpire)
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    user.password = newPassword;
    user.resetOTP = undefined;
    user.resetOTPExpire = undefined;
    await user.save();
    res.json({ success: true, message: 'Password reset successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ===== POST /api/auth/google — Google OAuth login/register =====
// Google ID token verify karo — bina is check ke koi bhi fake data bhej sakta tha
router.post('/google', async (req, res) => {
  try {
    const { credential } = req.body;  // frontend se Google ID token aata hai
    if (!credential) return res.status(400).json({ success: false, message: 'Google token missing' });

    // Google ke servers se token verify karo
    let payload;
    try {
      const ticket = await googleClient.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID
      });
      payload = ticket.getPayload();
    } catch {
      return res.status(401).json({ success: false, message: 'Invalid Google token. Please try again.' });
    }

    const { sub: googleId, email, given_name: firstName, family_name: lastName, picture: avatar, email_verified } = payload;

    if (!email_verified)
      return res.status(400).json({ success: false, message: 'Google account email not verified' });

    let user = await User.findOne({ email });
    let isNew = false;

    if (user) {
      notifyWhatsApp(user, 'login');
    } else {
      // Secure random password — Google users password se login nahi karte
      const randomPass = googleId + process.env.JWT_SECRET + Date.now();
      user = await User.create({
        firstName: firstName || 'User',
        lastName:  lastName  || '',
        email,
        phone: '0000000000',
        password: randomPass,
        role: 'buyer', city: '',
        isVerified: true
      });
      isNew = true;
    }

    const needsProfile = !user.phone || user.phone === '0000000000' || !user.city;

    res.json({
      success: true,
      needsProfile,
      isNew,
      token: genToken(user._id, user.role),
      user: { id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email, role: user.role, phone: user.phone, city: user.city }
    });

    if (isNew) notifyWhatsApp(user, 'register');
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ===== POST /api/auth/admin-logout =====
router.post('/admin-logout', async (req, res) => {
  try {
    const token = req.cookies && req.cookies.adminToken;
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      await User.findByIdAndUpdate(decoded.id, { loginSessions: [] });
    }
  } catch(e) {}
  res.clearCookie('adminToken');
  res.json({ success: true });
});

// ===== GET /api/auth/me =====
router.get('/me', protect, async (req, res) => {
  res.json({ success: true, user: req.user });
});

// ===== GET /api/auth/saved — get saved properties =====
router.get('/saved', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('savedProperties');
    res.json({ success: true, properties: user.savedProperties || [] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ===== PUT /api/auth/profile =====
router.put('/profile', protect, async (req, res) => {
  try {
    const { firstName, lastName, phone, city, role } = req.body;
    const updateData = { firstName, lastName, phone, city };
    // Role sirf tab update karo jab explicitly bheja ho aur valid ho
    const validRoles = ['buyer', 'seller', 'agent', 'builder', 'investor'];
    if (role && validRoles.includes(role)) updateData.role = role;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ===== PUT /api/auth/change-password =====
router.put('/change-password', protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);
    if (!(await user.matchPassword(currentPassword)))
      return res.status(400).json({ success: false, message: 'Current password incorrect' });
    user.password = newPassword;
    await user.save();
    res.json({ success: true, message: 'Password updated' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
