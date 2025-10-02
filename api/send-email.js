// Vercel Edge Function - send-email endpoint
export const config = {
  runtime: 'edge',
}

export default async function handler(request) {
  // Set CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }

  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders })
  }

  // Only allow POST requests
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  try {
    const { to, subject, htmlContent } = await request.json()

    if (!to || !subject || !htmlContent) {
      return new Response(JSON.stringify({ error: 'Missing parameters' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    console.log('📧 SENDING REAL EMAIL WITH RESEND API!')
    console.log('📧 To:', to)
    console.log('📧 Subject:', subject)

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
    })

    const result = await response.json()

    if (response.ok) {
      console.log('✅ EMAIL SENT SUCCESSFULLY!')
      return new Response(JSON.stringify({
        success: true,
        message: 'Email sent successfully via Resend API',
        to: to,
        subject: subject,
        timestamp: new Date().toISOString(),
        resendId: result.id
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    } else {
      console.log('❌ RESEND API ERROR:', result)
      return new Response(JSON.stringify({
        success: false,
        message: 'Failed to send email via Resend API',
        error: result
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }
  } catch (error) {
    console.log('❌ ERROR SENDING EMAIL:', error)
    return new Response(JSON.stringify({
      success: false,
      message: 'Error sending email',
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
}
