// Simple Gmail Test - Guaranteed to work
// This creates a simple Gmail test function that will definitely be available

console.log('📧 Loading Simple Gmail Test...');

// Create a simple Gmail test function
window.testGmailSimple = () => {
  console.log('🧪 Testing Gmail email functionality...');
  
  try {
    const testEmail = 'jamestellore@gmail.com';
    const testSubject = 'Test Email from YouthInAction (Gmail)';
    const testMessage = 'This is a test email to verify the Gmail system is working!';
    
    // Create Gmail compose URL
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(testEmail)}&su=${encodeURIComponent(testSubject)}&body=${encodeURIComponent(testMessage)}`;
    
    console.log('📧 Opening Gmail with URL:', gmailUrl);
    
    // Open Gmail in new tab
    if (typeof window !== 'undefined') {
      window.open(gmailUrl, '_blank');
      console.log('✅ GMAIL OPENED IN NEW TAB!');
    }
    
    return { 
      success: true, 
      message: 'Gmail opened in new tab',
      gmailUrl: gmailUrl
    };
  } catch (error) {
    console.error('❌ Error opening Gmail:', error);
    return { success: false, message: error.message };
  }
};

// Also create a direct Gmail function
window.openGmail = (to, subject, message) => {
  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(to)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
  window.open(gmailUrl, '_blank');
  console.log('✅ Gmail opened:', gmailUrl);
  return gmailUrl;
};

console.log('✅ Simple Gmail Test loaded!');
console.log('Available functions:');
console.log('- testGmailSimple() - Test Gmail functionality');
console.log('- openGmail(to, subject, message) - Open Gmail with custom content');





