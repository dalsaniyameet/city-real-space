const express    = require('express');
const router     = express.Router();
const jwt        = require('jsonwebtoken');
const nodemailer = require('nodemailer');
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

// ===== EMAIL TRANSPORTER =====
function getTransporter() {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: false,
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
  });
}

// ===== SEND OTP EMAIL =====
// ===== SEND OTP EMAIL =====
async function sendOTPEmail(email, otp, name, type) {
  const isRegister = type === 'register';
  const isLogin    = type === 'login';

  const subject = isRegister
    ? 'Verify Your Email – City Real Space'
    : isLogin
    ? 'Login OTP – City Real Space'
    : 'Password Reset OTP – City Real Space';

  // Per-type config
  const config = isRegister ? {
    headerBg:   'linear-gradient(135deg,#1b5e20,#2e7d32)',
    icon:       '&#127968;',
    heading:    'Activate Your Account',
    subheading: 'Email Verification',
    otpColor:   '#69f0ae',
    otpBorder:  'rgba(105,240,174,0.35)',
    msg:        'Welcome to City Real Space! Use the OTP below to verify your email and activate your account.'
  } : isLogin ? {
    headerBg:   'linear-gradient(135deg,#0d47a1,#1565c0)',
    icon:       '&#128274;',
    heading:    'Verify Your Login',
    subheading: 'Secure Login OTP',
    otpColor:   '#82b1ff',
    otpBorder:  'rgba(130,177,255,0.35)',
    msg:        'Use the OTP below to complete your login. Valid for 10 minutes. Do not share it with anyone.'
  } : {
    headerBg:   'linear-gradient(135deg,#e65100,#bf360c)',
    icon:       '&#128273;',
    heading:    'Reset Your Password',
    subheading: 'Password Reset OTP',
    otpColor:   '#ffab40',
    otpBorder:  'rgba(255,171,64,0.35)',
    msg:        'Use the OTP below to reset your password. Do not share it with anyone.'
  };

  try {
    const transporter = getTransporter();
    console.log(`📧 Sending ${type} OTP email to ${email}`);

    await transporter.sendMail({
      from: `"City Real Space" <${process.env.EMAIL_USER}>`,
      to: email,
      subject,
      html: `
      <div style="font-family:Arial,sans-serif;max-width:520px;margin:auto;background:#0a1628;border-radius:20px;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,0.4)">

        <!-- HEADER -->
        <div style="background:${config.headerBg};padding:32px;text-align:center;position:relative">
          <div style="font-size:2.4rem;margin-bottom:10px">${config.icon}</div>
          <h1 style="color:#fff;margin:0;font-size:1.6rem;font-weight:800;letter-spacing:-0.5px">City Real Space</h1>
          <p style="color:rgba(255,255,255,0.75);margin:6px 0 0;font-size:0.82rem;letter-spacing:0.5px">Gujarat's #1 Real Estate Platform &mdash; Ahmedabad West</p>
        </div>

        <!-- BODY -->
        <div style="padding:36px 32px">
          <div style="margin-bottom:24px">
            <p style="color:rgba(255,255,255,0.45);font-size:0.72rem;letter-spacing:2px;text-transform:uppercase;margin:0 0 4px">${config.subheading}</p>
            <h2 style="color:#fff;margin:0;font-size:1.3rem;font-weight:800">${config.heading}</h2>
          </div>

          <p style="color:rgba(255,255,255,0.65);font-size:0.88rem;line-height:1.7;margin:0 0 8px">Hi <strong style="color:#fff">${name}</strong>,</p>
          <p style="color:rgba(255,255,255,0.65);font-size:0.88rem;line-height:1.7;margin:0 0 28px">${config.msg}</p>

          <!-- OTP BOX -->
          <div style="background:rgba(255,255,255,0.05);border:2px solid ${config.otpBorder};border-radius:16px;padding:28px;text-align:center;margin-bottom:28px">
            <p style="color:rgba(255,255,255,0.4);font-size:0.7rem;margin:0 0 12px;letter-spacing:3px;text-transform:uppercase">Your One-Time Password</p>
            <div style="font-size:3rem;font-weight:900;letter-spacing:16px;color:${config.otpColor};font-family:monospace">${otp}</div>
            <div style="margin-top:14px;display:inline-block;background:rgba(255,255,255,0.07);border-radius:20px;padding:5px 16px">
              <p style="color:rgba(255,255,255,0.5);font-size:0.72rem;margin:0">&#9201; Valid for <strong style="color:#fff">10 minutes</strong> only</p>
            </div>
          </div>

          <!-- SECURITY NOTE -->
          <div style="background:rgba(255,255,255,0.04);border-left:3px solid rgba(255,255,255,0.15);border-radius:0 8px 8px 0;padding:12px 16px">
            <p style="color:rgba(255,255,255,0.35);font-size:0.78rem;margin:0;line-height:1.6">&#128274; <strong style="color:rgba(255,255,255,0.5)">Security tip:</strong> City Real Space will never ask for your OTP. If you did not request this, please ignore this email.</p>
          </div>
        </div>

        <!-- FOOTER -->
        <div style="background:rgba(0,0,0,0.35);padding:18px 32px;text-align:center;border-top:1px solid rgba(255,255,255,0.06)">
          <p style="color:rgba(255,255,255,0.25);font-size:0.72rem;margin:0">&copy; 2026 City Real Space &middot; Ahmedabad West, Gujarat</p>
        </div>

      </div>`
    });
    console.log(`✅ Email sent successfully to ${email}`);
  } catch (error) {
    console.error(`❌ Email send failed for ${email}:`, error.message);
    throw new Error(`Email service unavailable: ${error.message}`);
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

    res.status(201).json({ success: true, message: 'OTP sent to your email. Please verify.' });
    sendOTPEmail(email, otp, firstName, 'register')
      .then(() => console.log(`✅ Registration OTP sent to ${email}`))
      .catch(e => console.error(`⚠️ Email failed for ${email}:`, e.message));
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
      res.json({ success: true, needsOTP: true, email: user.email, isAdmin: true });
      sendOTPEmail(user.email, otp, user.firstName, 'login')
        .then(() => console.log(`✅ Admin OTP sent to ${user.email}`))
        .catch(e => console.error(`❌ Admin OTP email failed:`, e.message));
      return;
    }

    // Normal user — OTP bhejo
    const otp = genOTP();
    user.resetOTP = otp;
    user.resetOTPExpire = Date.now() + 10 * 60 * 1000;
    await user.save();
    
    res.json({ success: true, needsOTP: true, email, isAdmin: false });
    sendOTPEmail(email, otp, user.firstName, 'login')
      .then(() => console.log(`✅ OTP email sent to ${email}`))
      .catch(e => console.error(`❌ Email send failed for ${email}:`, e.message));
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
    
    res.json({ success: true, message: 'OTP resent successfully' });
    sendOTPEmail(email, otp, user.firstName, user.isVerified ? 'login' : 'register')
      .then(() => console.log(`✅ Resend OTP sent to ${email}`))
      .catch(e => console.error(`⚠️ Resend email failed for ${email}:`, e.message));
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
    
    res.json({ success: true, message: 'OTP sent to your email' });
    sendOTPEmail(email, otp, user.firstName, 'forgot')
      .then(() => console.log(`✅ Forgot password OTP sent to ${email}`))
      .catch(e => console.error(`⚠️ Forgot password email failed for ${email}:`, e.message));
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
