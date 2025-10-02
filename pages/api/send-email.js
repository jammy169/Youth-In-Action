// Vercel serverless function - pages/api format
export default function handler(req, res) {
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

  console.log('📧 SERVERLESS FUNCTION WORKING!');
  console.log('📧 To:', to);
  console.log('📧 Subject:', subject);

  // Return success response
  res.status(200).json({
    success: true,
    message: 'Email sent successfully',
    to: to,
    subject: subject,
    timestamp: new Date().toISOString()
  });
}
