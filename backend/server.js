// Separate backend server for email notifications
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware - Allow all origins for CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Email sending endpoint
app.post('/send-email', async (req, res) => {
  try {
    const { to, subject, htmlContent } = req.body;

    if (!to || !subject || !htmlContent) {
      return res.status(400).json({ error: 'Missing parameters' });
    }

    console.log('📧 SENDING REAL EMAIL WITH RESEND API!');
    console.log('📧 To:', to);
    console.log('📧 Subject:', subject);

    // Use Resend API for real email sending
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Youth In Action <noreply@youthinaction.com>',
        to: [to],
        subject: subject,
        html: htmlContent,
      }),
    });

    const result = await response.json();

    if (response.ok) {
      console.log('✅ EMAIL SENT SUCCESSFULLY!');
      res.json({
        success: true,
        message: 'Email sent successfully via Resend API',
        to: to,
        subject: subject,
        timestamp: new Date().toISOString(),
        resendId: result.id
      });
    } else {
      console.log('❌ RESEND API ERROR:', result);
      res.status(500).json({
        success: false,
        message: 'Failed to send email via Resend API',
        error: result
      });
    }
  } catch (error) {
    console.log('❌ ERROR SENDING EMAIL:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending email',
      error: error.message
    });
  }
});

// Test endpoint
app.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'Backend server is working!',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend server running on port ${PORT}`);
});
