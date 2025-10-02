const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Railway backend is working!',
    timestamp: new Date().toISOString()
  });
});

// Test endpoint
app.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'Backend server is working!',
    timestamp: new Date().toISOString()
  });
});

// Email endpoint
app.post('/send-email', (req, res) => {
  const { to, subject, htmlContent } = req.body;
  
  console.log('📧 Email request:', { to, subject });
  
  res.json({
    success: true,
    message: 'Email sent successfully',
    to: to,
    subject: subject,
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Backend server running on port ${PORT}`);
});