// Serverless function for sending real emails
// This runs on Vercel/Netlify and handles actual email sending

import nodemailer from 'nodemailer';
import { EMAIL_CONFIG } from '../email-config.js';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { to, subject, htmlContent } = req.body;

  // Validate required fields
  if (!to || !subject || !htmlContent) {
    return res.status(400).json({ 
      success: false, 
      message: 'Missing required email parameters' 
    });
  }

  try {
    console.log('📧 Serverless Function: Starting email send...');
    console.log('To:', to);
    console.log('Subject:', subject);

    // Gmail SMTP configuration
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: EMAIL_CONFIG.GMAIL_USER,
        pass: EMAIL_CONFIG.GMAIL_APP_PASSWORD
      }
    });

    const mailOptions = {
      from: EMAIL_CONFIG.GMAIL_USER,
      to: to,
      subject: subject,
      html: htmlContent,
    };

    console.log('📧 Serverless Function: Sending real Gmail...');
    
    const result = await transporter.sendMail(mailOptions);
    
    console.log('✅ Serverless Function: Email sent successfully!');
    console.log('📧 Message ID:', result.messageId);

    return res.status(200).json({ 
      success: true, 
      message: 'Email sent successfully',
      messageId: result.messageId
    });

  } catch (error) {
    console.error('❌ Serverless Function: Error sending email:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to send email', 
      error: error.message 
    });
  }
}
