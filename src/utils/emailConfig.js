// EmailJS Configuration
// Replace these with your actual EmailJS credentials

export const EMAIL_CONFIG = {
  // Your EmailJS public key
  publicKey: 'YOUR_PUBLIC_KEY_HERE',
  
  // Your EmailJS service ID
  serviceId: 'YOUR_SERVICE_ID_HERE',
  
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
