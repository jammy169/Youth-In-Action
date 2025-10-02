// Real email sending with Resend API
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { to, subject, htmlContent } = req.body;

  if (!to || !subject || !htmlContent) {
    return res.status(400).json({ error: 'Missing parameters' });
  }

  try {
    console.log('📧 Sending real email via Resend API...');
    console.log('📧 To:', to);
    console.log('📧 Subject:', subject);

    // Use Resend API for reliable email delivery
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'YouthInAction <noreply@youthinaction.com>',
        to: [to],
        subject: subject,
        html: htmlContent,
      })
    });

    const result = await response.json();

    if (response.ok) {
      console.log('✅ Real email sent successfully via Resend!');
      console.log('📧 Email ID:', result.id);
      
      return res.status(200).json({ 
        success: true, 
        message: 'Real email sent successfully',
        emailId: result.id,
        service: 'Resend'
      });
    } else {
      console.error('❌ Resend API error:', result);
      throw new Error(result.message || 'Resend API failed');
    }
  } catch (error) {
    console.error('❌ Error sending real email:', error);
    
    // Fallback: Return error but don't crash
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to send email',
      error: error.message
    });
  }
}
