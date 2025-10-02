// Netlify Function for email sending - WORKING VERSION
exports.handler = async (event, context) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { to, subject, htmlContent } = JSON.parse(event.body);

    if (!to || !subject || !htmlContent) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing parameters' }),
      };
    }

    console.log('📧 NETLIFY FUNCTION SENDING REAL EMAIL!');
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
      console.log('✅ EMAIL SENT SUCCESSFULLY VIA NETLIFY!');
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          message: 'Email sent successfully via Netlify + Resend API',
          to: to,
          subject: subject,
          timestamp: new Date().toISOString(),
          resendId: result.id
        }),
      };
    } else {
      console.log('❌ RESEND API ERROR:', result);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          success: false,
          message: 'Failed to send email via Resend API',
          error: result
        }),
      };
    }
  } catch (error) {
    console.log('❌ ERROR SENDING EMAIL:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        message: 'Error sending email',
        error: error.message
      }),
    };
  }
};
