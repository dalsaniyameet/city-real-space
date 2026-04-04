const express      = require('express');
const router       = express.Router();
const Inquiry      = require('../models/Inquiry');
const { protect, adminOnly } = require('../middleware/auth');
const twilio       = require('twilio');
const nodemailer   = require('nodemailer');

const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: false,
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
});

async function sendWA(to, body) {
  try {
    await twilioClient.messages.create({ from: process.env.TWILIO_WA_FROM, to, body });
  } catch (e) {
    console.error('WhatsApp error:', e.message);
  }
}

async function sendEmail(to, subject, text) {
  try {
    await transporter.sendMail({ from: `"City Real Space" <${process.env.EMAIL_USER}>`, to, subject, text });
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
    if (email) await sendEmail(email, 'Inquiry Received - City Real Space',
      `Hello ${name},\n\nThank you for your inquiry! ✅\nWe have received your inquiry for *${propertyName || 'property'}* and our team will contact you shortly.\n\nProperty: ${propertyName || 'N/A'}\nType: ${propertyType || 'N/A'}\nBudget: ${budget || 'N/A'}\nCity: ${city || 'N/A'}\n\n- City Real Space Team`);

    // WhatsApp to owner
    await sendWA(process.env.CITY_WA_NUMBER,
      `📩 New Inquiry!\nName: ${name}\nPhone: ${phone}\nEmail: ${email || 'N/A'}\nProperty: ${propertyName || 'N/A'}\nType: ${propertyType || 'N/A'}\nLooking For: ${lookingFor || 'N/A'}\nCity: ${city || 'N/A'}\nBudget: ${budget || 'N/A'}\nMessage: ${message || 'N/A'}`);

    res.status(201).json({ success: true, message: 'Inquiry submitted successfully', inquiry });
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
