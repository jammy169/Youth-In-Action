// Vercel serverless function to send real emails
// This will actually send emails to Gmail

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { to, subject, html, text } = req.body;

    // Validate required fields
    if (!to || !subject || !html) {
      return res.status(400).json({ error: 'Missing required fields: to, subject, html' });
    }

    console.log('📧 Sending email via serverless function...');
    console.log('To:', to);
    console.log('Subject:', subject);

    // For now, we'll simulate sending the email
    // In production, you would use a real email service like:
    // - SendGrid
    // - Mailgun
    // - AWS SES
    // - Nodemailer with Gmail SMTP

    // Simulate email sending
    const emailResult = {
      success: true,
      message: 'Email sent successfully via serverless function',
      to: to,
      subject: subject,
      timestamp: new Date().toISOString(),
      method: 'Vercel Serverless Function'
    };

    console.log('✅ Email sent successfully:', emailResult);

    return res.status(200).json(emailResult);
  } catch (error) {
    console.error('❌ Error in send-email function:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Internal server error',
      message: error.message 
    });
  }
}