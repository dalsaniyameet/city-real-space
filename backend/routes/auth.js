const express    = require('express');
const router     = express.Router();
const jwt        = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User       = require('../models/User');
const { protect } = require('../middleware/auth');

const twilio = require('twilio');
const genToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
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
async function sendOTPEmail(email, otp, name, type) {
  const isRegister = type === 'register';
  const isLogin    = type === 'login';
  const subject = isRegister ? 'Verify Your Email – City Real Space' : isLogin ? 'Login OTP – City Real Space' : 'Password Reset OTP – City Real Space';
  const heading  = isRegister ? 'Verify Your Email' : isLogin ? 'Your Login OTP' : 'Reset Your Password';
  const msg      = isRegister
    ? 'Welcome to City Real Space! Use the OTP below to verify your email and activate your account.'
    : isLogin
    ? 'Use the OTP below to complete your login. Valid for 10 minutes. Do not share it with anyone.'
    : 'Use the OTP below to reset your password. Do not share it with anyone.';

  await getTransporter().sendMail({
    from: `"City Real Space" <${process.env.EMAIL_USER}>`,
    to: email,
    subject,
    html: `
    <div style="font-family:Poppins,Arial,sans-serif;max-width:500px;margin:auto;background:#0D1B2A;border-radius:16px;overflow:hidden">
      <div style="background:linear-gradient(135deg,#E53935,#c62828);padding:28px 32px;text-align:center">
        <h1 style="color:#fff;margin:0;font-size:1.5rem;font-weight:800">City Real Space</h1>
        <p style="color:rgba(255,255,255,0.8);margin:6px 0 0;font-size:0.85rem">Gujarat's Most Trusted Real Estate Platform</p>
      </div>
      <div style="padding:32px">
        <h2 style="color:#FFC107;margin:0 0 12px;font-size:1.2rem">${heading}</h2>
        <p style="color:rgba(255,255,255,0.75);font-size:0.9rem;line-height:1.6">Hi <strong style="color:#fff">${name}</strong>,</p>
        <p style="color:rgba(255,255,255,0.75);font-size:0.9rem;line-height:1.6">${msg}</p>
        <div style="background:rgba(255,255,255,0.06);border:2px dashed rgba(255,193,7,0.4);border-radius:12px;padding:24px;text-align:center;margin:24px 0">
          <p style="color:rgba(255,255,255,0.5);font-size:0.75rem;margin:0 0 8px;letter-spacing:2px;text-transform:uppercase">Your OTP</p>
          <div style="font-size:2.8rem;font-weight:900;letter-spacing:14px;color:#FFC107">${otp}</div>
          <p style="color:rgba(255,255,255,0.4);font-size:0.75rem;margin:10px 0 0">Valid for <strong style="color:#fff">10 minutes</strong></p>
        </div>
        <p style="color:rgba(255,255,255,0.4);font-size:0.78rem">If you didn't request this, please ignore this email.</p>
      </div>
      <div style="background:rgba(0,0,0,0.3);padding:16px 32px;text-align:center">
        <p style="color:rgba(255,255,255,0.3);font-size:0.75rem;margin:0">© 2025 City Real Space · Ahmedabad, Gujarat</p>
      </div>
    </div>`
  });
}

// ===== GET /api/auth/check-email?email= — MX record check =====
const dns = require('dns').promises;
router.get('/check-email', async (req, res) => {
  const { email } = req.query;
  if (!email || !email.includes('@')) return res.json({ valid: false });
  const domain = email.split('@')[1];
  try {
    const mx = await dns.resolveMx(domain);
    res.json({ valid: mx && mx.length > 0 });
  } catch {
    res.json({ valid: false });
  }
});

// ===== POST /api/auth/register — send OTP, don't create account yet =====
router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, phone, password, role, city } = req.body;
    if (!firstName || !lastName || !email || !phone || !password)
      return res.status(400).json({ success: false, message: 'All fields required' });

    const exists = await User.findOne({ email });
    if (exists && exists.isVerified)
      return res.status(400).json({ success: false, message: 'Email already registered' });

    // Map frontend role cards to valid DB roles
    const roleMap = { 'user': 'buyer', 'owner': 'seller' };
    const validRoles = ['buyer', 'seller', 'agent', 'builder', 'investor', 'admin'];
    const mappedRole = roleMap[role] || (validRoles.includes(role) ? role : 'buyer');

    const otp     = genOTP();
    const expires = Date.now() + 10 * 60 * 1000;

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

    await sendOTPEmail(email, otp, firstName, 'register');
    res.status(201).json({ success: true, message: 'OTP sent to your email. Please verify.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ===== POST /api/auth/verify-register — verify OTP and activate account =====
router.post('/verify-register', async (req, res) => {
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

    notifyWhatsApp(user); // City Real Space ko WA message

    res.json({
      success: true,
      message: 'Email verified! Account activated.',
      token: genToken(user._id),
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

    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ success: false, message: 'Invalid email or password' });

    // Admin — OTP bhejo
    if (user.role === 'admin') {
      const ALLOWED_ADMINS = ['patelshriji72@gmail.com'];
      if (!ALLOWED_ADMINS.includes(user.email)) {
        return res.status(403).json({ success: false, message: 'Access denied. Unauthorized admin account.' });
      }
      const otp = genOTP();
      user.resetOTP = otp;
      user.resetOTPExpire = Date.now() + 10 * 60 * 1000;
      await user.save();
      await sendOTPEmail(user.email, otp, user.firstName, 'login');
      return res.json({ success: true, needsOTP: true, email: user.email });
    }

    // Normal user — seedha login, no OTP
    try { notifyWhatsApp(user, 'login'); } catch(e) {}
    res.json({
      success: true,
      token: genToken(user._id),
      user: { id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email, role: user.role, phone: user.phone, city: user.city }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ===== POST /api/auth/verify-login =====
router.post('/verify-login', async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    if (!user || user.resetOTP !== otp || Date.now() > user.resetOTPExpire)
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    user.resetOTP = undefined;
    user.resetOTPExpire = undefined;
    await user.save();

    notifyWhatsApp(user, 'login'); // Owner ko login alert

    res.json({
      success: true,
      token: genToken(user._id),
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
    await sendOTPEmail(email, otp, user.firstName, user.isVerified ? 'login' : 'register');
    res.json({ success: true, message: 'OTP resent successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ===== POST /api/auth/forgot-password =====
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: 'No account found with this email' });
    const otp = genOTP();
    user.resetOTP = otp;
    user.resetOTPExpire = Date.now() + 10 * 60 * 1000;
    await user.save();
    await sendOTPEmail(email, otp, user.firstName, 'forgot');
    res.json({ success: true, message: 'OTP sent to your email' });
  } catch (err) {
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
router.post('/google', async (req, res) => {
  try {
    const { firstName, lastName, email, googleId, avatar } = req.body;
    if (!email || !googleId) return res.status(400).json({ success: false, message: 'Invalid Google data' });

    let user = await User.findOne({ email });
    if (user) {
      // Already exists — seedha login
      notifyWhatsApp(user, 'login');
    } else {
      // New user — auto register
      const randomPass = googleId + process.env.JWT_SECRET;
      user = await User.create({
        firstName, lastName, email,
        phone: '0000000000',
        password: randomPass,
        role: 'buyer', city: '',
        isVerified: true
      });
      notifyWhatsApp(user, 'register');
    }

    res.json({
      success: true,
      token: genToken(user._id),
      user: { id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email, role: user.role, phone: user.phone, city: user.city }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ===== GET /api/auth/me =====
router.get('/me', protect, async (req, res) => {
  res.json({ success: true, user: req.user });
});

// ===== PUT /api/auth/profile =====
router.put('/profile', protect, async (req, res) => {
  try {
    const { firstName, lastName, phone, city } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { firstName, lastName, phone, city },
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
