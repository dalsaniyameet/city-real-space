const express      = require('express');
const router       = express.Router();
const Inquiry      = require('../models/Inquiry');
const { protect, adminOnly } = require('../middleware/auth');
const twilio       = require('twilio');
const { Resend }   = require('resend');
const { inquiryConfirmHtml } = require('../utils/emailTemplates');

const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const resend       = new Resend(process.env.RESEND_API_KEY);

async function sendWA(to, body) {
  try {
    await twilioClient.messages.create({ from: process.env.TWILIO_WA_FROM, to, body });
  } catch (e) {
    console.error('WhatsApp error:', e.message);
  }
}

async function sendEmail(to, subject, html) {
  try {
    await resend.emails.send({
      from: 'City Real Space <noreply@cityrealspace.com>',
      to,
      subject,
      html
    });
  } catch (e) {
    console.error('Email error:', e.message);
  }
}

// POST /api/inquiry — submit inquiry
router.post('/', async (req, res) => {
  try {
    const { name, phone, email, propertyName, propertyType, interestedIn, lookingFor, city, budget, area, message } = req.body;
    if (!name || !phone) return res.status(400).json({ success: false, message: 'Name and phone required' });

    const inquiry = await Inquiry.create({ name, phone, email, propertyName, propertyType, interestedIn, lookingFor, city, budget, area, message });

    // WhatsApp to user
    await sendWA(`whatsapp:+91${phone}`,
      `Hello ${name}! ✅ Your inquiry for *${propertyName || 'property'}* has been received. Our team will contact you shortly.\n\n- City Real Space`);

    // Email to user
    if (email) await sendEmail(email, 'Inquiry Received – City Real Space',
      inquiryConfirmHtml({ name, propertyName, propertyType, budget, city, lookingFor, message }));

    // WhatsApp to owner
    await sendWA(process.env.CITY_WA_NUMBER,
      `📩 New Inquiry!\nName: ${name}\nPhone: ${phone}\nEmail: ${email || 'N/A'}\nProperty: ${propertyName || 'N/A'}\nType: ${propertyType || 'N/A'}\nLooking For: ${lookingFor || 'N/A'}\nCity: ${city || 'N/A'}\nBudget: ${budget || 'N/A'}\nMessage: ${message || 'N/A'}`);

    res.status(201).json({ success: true, message: 'Inquiry submitted successfully', inquiry });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/inquiry/mine — user: apni inquiries dekho (phone se match)
router.get('/mine', protect, async (req, res) => {
  try {
    const phone = req.user.phone ? req.user.phone.replace('+91', '').trim() : '';
    const inquiries = await Inquiry.find({
      $or: [
        { phone: phone },
        { phone: '+91' + phone },
        { email: req.user.email }
      ]
    }).sort({ createdAt: -1 }).limit(50);
    res.json({ success: true, inquiries });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/inquiry — admin: get all inquiries
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = status ? { status } : {};
    const total = await Inquiry.countDocuments(query);
    const inquiries = await Inquiry.find(query).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(Number(limit));
    res.json({ success: true, total, inquiries });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/inquiry/:id/status — admin: update status
router.put('/:id/status', protect, adminOnly, async (req, res) => {
  try {
    const inquiry = await Inquiry.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.json({ success: true, inquiry });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
