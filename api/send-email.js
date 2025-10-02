// Vercel serverless function - RESEND API VERSION
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { to, subject, htmlContent } = req.body;

  if (!to || !subject || !htmlContent) {
    res.status(400).json({ error: 'Missing parameters' });
    return;
  }

  console.log('📧 SENDING REAL EMAIL WITH RESEND API!');
  console.log('📧 To:', to);
  console.log('📧 Subject:', subject);

  try {
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
      res.status(200).json({
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
}
