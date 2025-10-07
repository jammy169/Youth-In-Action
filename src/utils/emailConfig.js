// EmailJS Configuration
// Replace these with your actual EmailJS credentials

export const EMAIL_CONFIG = {
  // Your EmailJS public key
  publicKey: 'siG0BlxQyXnJq8JCw',
  
  // Your EmailJS service ID
  serviceId: 'service_5tr2hqf',
  
  // Your EmailJS templates
  templates: {
    registrationConfirmation: 'YOUR_TEMPLATE_ID_HERE',
    eventNotification: 'YOUR_TEMPLATE_ID_HERE',
    testEmail: 'YOUR_TEMPLATE_ID_HERE'
  }
};

// Fallback configuration (if EmailJS fails)
export const FALLBACK_EMAIL_CONFIG = {
  enabled: true,
  logToConsole: true
};
