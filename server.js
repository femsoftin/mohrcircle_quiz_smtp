require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Health check
app.get('/health', (_, res) => res.json({ ok: true }));

// Quiz submission endpoint
app.post('/submit', async (req, res) => {
  const { email, score, total, answers } = req.body || {};

  if (!email || !score?.toString || !total?.toString) {
    return res.status(400).json({ success: false, message: 'Missing required fields.' });
  }

  try {
    // Transporter configuration via ENV
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT) || 465,
      secure: (process.env.SMTP_SECURE || 'true') === 'true', // true for 465, false for 587
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Verify transporter (optional)
    // await transporter.verify();

    const receiver = process.env.RECEIVER_EMAIL || process.env.EMAIL_USER;

    const textBody = [
      `Mohr's Circle Quiz Submission`,
      `----------------------------------`,
      `User Email: ${email}`,
      `Score: ${score} / ${total}`,
      ``,
      `Answers:`,
      ...(answers || []).map(a => `Q${a.q}: selected=${a.selected || 'None'}, correct=${a.correct}`)
    ].join('\n');

    await transporter.sendMail({
      from: `"Mohr Quiz" <${process.env.EMAIL_USER}>`,
      to: receiver,
      subject: `Quiz Results: ${email} scored ${score}/${total}`,
      text: textBody
    });

    res.json({ success: true, message: 'Results sent successfully.' });
  } catch (err) {
    console.error('Email error:', err);
    res.status(500).json({ success: false, message: 'Email failed to send.' });
  }
});

// Fallback to index.html for root
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
