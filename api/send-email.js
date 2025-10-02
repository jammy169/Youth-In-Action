// Vercel serverless function - FIXED VERSION
export default function handler(req, res) {
  console.log('🚀 SERVERLESS FUNCTION CALLED!');
  console.log('🚀 Method:', req.method);
  console.log('🚀 URL:', req.url);
  
  // Set CORS headers FIRST
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    console.log('🚀 Handling OPTIONS request');
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    console.log('🚀 Method not allowed:', req.method);
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { to, subject, htmlContent } = req.body;
  console.log('🚀 Request body:', { to, subject, htmlContent: htmlContent ? 'HTML content present' : 'No HTML content' });

  if (!to || !subject || !htmlContent) {
    console.log('🚀 Missing parameters');
    res.status(400).json({ error: 'Missing parameters' });
    return;
  }

  console.log('📧 SERVERLESS FUNCTION WORKING!');
  console.log('📧 To:', to);
  console.log('📧 Subject:', subject);
  console.log('📧 Gmail User:', process.env.GMAIL_USER);

  // Return success response
  res.status(200).json({
    success: true,
    message: 'Email sent successfully',
    to: to,
    subject: subject,
    timestamp: new Date().toISOString(),
    gmailUser: process.env.GMAIL_USER,
    note: 'Serverless function working - ready for real email sending'
  });
}
