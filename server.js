const express = require('express');
const nodemailer = require('nodemailer');
const multer = require('multer');
const cors = require('cors');
require('dotenv').config();

const app = express();
const upload = multer();

app.use(cors());
app.use(express.json());

// ... existing routes and middleware ...

app.post('/send-email', upload.single('attachment'), async (req, res) => {
  const { recipient, subject, message } = req.body;
  const attachment = req.file;

  try {
    let transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    let info = await transporter.sendMail({
      from: `"Snag It" <${process.env.SMTP_USER}>`,
      to: recipient,
      subject: subject,
      text: message,
      attachments: [
        {
          filename: 'snag_report.pdf',
          content: attachment.buffer,
        },
      ],
    });

    console.log('Message sent: %s', info.messageId);
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Failed to send email' });
  }
});

// ... rest of your server code ...
