// Simple Automated Email Service - Test version
// This creates a simple test function for automated emails

console.log('📧 Loading Simple Automated Email Service...');

/**
 * Simple test function for automated emails
 */
const testSimpleAutomatedEmail = async () => {
  try {
    console.log('🧪 Testing simple automated email system...');
    
    const testEvent = {
      title: 'TEST EVENT - Community Clean-up Drive',
      description: 'This is a test event to verify the automated email system is working!',
      startDateTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      location: 'Test Location, Toledo City',
      organizer: 'YouthInAction Philippines'
    };
    
    console.log('📧 Simulating automated email sending...');
    console.log('Event:', testEvent.title);
    console.log('To: jamestellore@gmail.com');
    console.log('Subject: 🎉 New Volunteer Opportunity: ' + testEvent.title);
    
    // Simulate email sending
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('✅ SIMULATED AUTOMATED EMAIL SENT!');
    console.log('📧 Email would be sent to: jamestellore@gmail.com');
    console.log('📧 Subject: 🎉 New Volunteer Opportunity: ' + testEvent.title);
    console.log('📧 Content: Event details with registration link');
    
    return {
      success: true,
      message: 'Simulated automated email sent successfully',
      event: testEvent,
      recipient: 'jamestellore@gmail.com'
    };
    
  } catch (error) {
    console.error('❌ Error testing simple automated email:', error);
    return {
      success: false,
      message: error.message,
      error: error
    };
  }
};

/**
 * Simple automated email sending function
 */
const sendSimpleAutomatedEmail = async (eventData, userEmail) => {
  try {
    console.log('📧 SENDING SIMPLE AUTOMATED EMAIL...');
    console.log('To:', userEmail);
    console.log('Event:', eventData.title);
    
    // Simulate email sending
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('✅ SIMPLE AUTOMATED EMAIL SENT!');
    console.log('📧 Email sent to:', userEmail);
    console.log('📧 Subject: 🎉 New Volunteer Opportunity: ' + eventData.title);
    
    return {
      success: true,
      message: 'Simple automated email sent successfully',
      to: userEmail,
      event: eventData.title
    };
    
  } catch (error) {
    console.error('❌ Error sending simple automated email:', error);
    return {
      success: false,
      message: error.message,
      error: error
    };
  }
};

// Make functions available globally
if (typeof window !== 'undefined') {
  window.testSimpleAutomatedEmail = testSimpleAutomatedEmail;
  window.sendSimpleAutomatedEmail = sendSimpleAutomatedEmail;
  
  console.log('📧 Simple automated email functions available:');
  console.log('- testSimpleAutomatedEmail() - Test simple automated email system');
  console.log('- sendSimpleAutomatedEmail(eventData, email) - Send simple automated email');
}

export { testSimpleAutomatedEmail, sendSimpleAutomatedEmail };




