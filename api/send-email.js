// Simple working serverless function for Vercel
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

  console.log('📧 Serverless function called successfully!');
  console.log('📧 To:', to);
  console.log('📧 Subject:', subject);

  // For now, return success to test the connection
  res.status(200).json({
    success: true,
    message: 'Serverless function working - email would be sent',
    to: to,
    subject: subject,
    debug: 'Function is working, ready for real email sending'
  });
}
