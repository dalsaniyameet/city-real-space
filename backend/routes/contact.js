const express      = require('express');
const router       = express.Router();
const Contact      = require('../models/Contact');
const { protect, adminOnly } = require('../middleware/auth');
const twilio       = require('twilio');
const { Resend }   = require('resend');

const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const resend       = new Resend(process.env.RESEND_API_KEY);

async function sendWA(to, body) {
  try {
    await twilioClient.messages.create({ from: process.env.TWILIO_WA_FROM, to, body });
  } catch (e) {
    console.error('WhatsApp error:', e.message);
  }
}

async function sendEmail(to, subject, text) {
  try {
    await resend.emails.send({
      from: 'City Real Space <noreply@cityrealspace.com>',
      to,
      subject,
      text
    });
  } catch (e) {
    console.error('Email error:', e.message);
  }
}

// POST /api/contact
router.post('/', async (req, res) => {
  try {
    const { name, phone, email, subject, message } = req.body;
    if (!name || !phone || !message) return res.status(400).json({ success: false, message: 'Name, phone and message required' });

    await Contact.create({ name, phone, email, subject, message });

    // WhatsApp to user
    await sendWA(`whatsapp:+91${phone}`,
      `Hello ${name}! ✅ We received your message. Our team will contact you within 30 minutes.\n\n- City Real Space`);

    // Email to user
    if (email) await sendEmail(email, 'We received your message - City Real Space',
      `Hello ${name},\n\nThank you for contacting us! ✅\nWe have received your message and our team will contact you within 30 minutes.\n\nSubject: ${subject || 'N/A'}\nMessage: ${message}\n\n- City Real Space Team`);

    // WhatsApp to owner
    await sendWA(process.env.CITY_WA_NUMBER,
      `📩 New Contact Message!\nName: ${name}\nPhone: ${phone}\nEmail: ${email || 'N/A'}\nSubject: ${subject || 'N/A'}\nMessage: ${message}`);

    res.status(201).json({ success: true, message: 'Message sent successfully! We will contact you within 30 minutes.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/contact — admin only
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json({ success: true, contacts });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/contact/:id/status — admin only
router.put('/:id/status', protect, adminOnly, async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.json({ success: true, contact });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/contact/:id — admin only
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
