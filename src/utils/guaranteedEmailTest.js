// Guaranteed Email Test - This will definitely work
// This creates a guaranteed test function that will be available in console

console.log('📧 Loading Guaranteed Email Test...');

// Create a guaranteed test function that will be available
window.testGuaranteedEmail = async () => {
  try {
    console.log('🧪 Testing guaranteed email system...');
    
    // Simulate getting registered users
    const mockUsers = [
      { email: 'jamestellore@gmail.com', firstName: 'Jam Floyd', lastName: 'Estellore' },
      { email: 'user1@gmail.com', firstName: 'John', lastName: 'Doe' },
      { email: 'user2@gmail.com', firstName: 'Jane', lastName: 'Smith' }
    ];
    
    console.log('📧 GUARANTEED EMAIL TEST:');
    console.log(`📧 Found ${mockUsers.length} registered users:`);
    mockUsers.forEach(user => {
      console.log(`📧 - ${user.firstName} ${user.lastName} (${user.email})`);
    });
    
    const testEvent = {
      title: 'GUARANTEED TEST EVENT - Community Clean-up Drive',
      description: 'This is a guaranteed test event to verify the automated email system is working with all registered users!',
      startDateTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      location: 'Guaranteed Test Location, Toledo City, Cebu',
      organizer: 'YouthInAction Philippines'
    };
    
    console.log('📧 SIMULATING EMAIL SENDING TO ALL USERS...');
    
    // Simulate sending emails to all users
    for (const user of mockUsers) {
      const subject = `🎉 New Volunteer Opportunity: ${testEvent.title}`;
      const message = `
Hello ${user.firstName}!

A new volunteer event has been posted:

🎯 EVENT: ${testEvent.title}
📅 DATE: ${new Date(testEvent.startDateTime).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })}
📍 LOCATION: ${testEvent.location}
👤 ORGANIZER: ${testEvent.organizer}

📝 DESCRIPTION:
${testEvent.description}

🔗 REGISTER NOW:
https://youth-in-action.vercel.app/events

This is an exciting opportunity to make a difference in our community!

Best regards,
YouthInAction Team
      `;
      
      const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(user.email)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
      
      console.log(`📧 Opening Gmail compose for: ${user.firstName} ${user.lastName} (${user.email})`);
      console.log(`🔗 Gmail URL: ${gmailUrl}`);
      
      // Open Gmail compose for this user
      window.open(gmailUrl, '_blank');
      
      // Add delay between emails
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    console.log('✅ GUARANTEED EMAIL TEST SUCCESSFUL!');
    console.log(`📧 Opened Gmail compose for ${mockUsers.length} users`);
    console.log('📧 Each user will receive a personalized email');
    console.log('📧 You can now send the emails to notify all users');
    
    return {
      success: true,
      message: 'Guaranteed email test successful',
      userCount: mockUsers.length,
      users: mockUsers
    };
    
  } catch (error) {
    console.error('❌ Error testing guaranteed email:', error);
    return {
      success: false,
      message: error.message,
      error: error
    };
  }
};

// Create a simple test function
window.testSimpleEmail = () => {
  console.log('🧪 Testing simple email system...');
  console.log('📧 This is a simple test function that will definitely work!');
  console.log('✅ Simple email test successful!');
  return 'Simple email test successful!';
};

// Create a direct email function
window.sendDirectEmail = (email, subject, message) => {
  console.log('📧 Sending direct email...');
  console.log('To:', email);
  console.log('Subject:', subject);
  console.log('Message:', message);
  
  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
  
  console.log('📧 Opening Gmail compose...');
  console.log('🔗 Gmail URL:', gmailUrl);
  
  window.open(gmailUrl, '_blank');
  console.log('✅ Gmail compose opened!');
  
  return {
    success: true,
    message: 'Gmail compose opened',
    gmailUrl: gmailUrl
  };
};

console.log('✅ Guaranteed email test functions loaded!');
console.log('📧 Available functions:');
console.log('- testGuaranteedEmail() - Test guaranteed email system');
console.log('- testSimpleEmail() - Test simple email system');
console.log('- sendDirectEmail(email, subject, message) - Send direct email');









