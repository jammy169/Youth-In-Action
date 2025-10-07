// Console Test - Check what functions are available
// This will help debug what's actually loaded in the console

console.log('🔍 CHECKING AVAILABLE FUNCTIONS IN CONSOLE...');

// Check if window functions exist
console.log('Available window functions:');
console.log('- testGmail:', typeof window.testGmail);
console.log('- testGmailEmail:', typeof window.testGmailEmail);
console.log('- sendGmailEmail:', typeof window.sendGmailEmail);
console.log('- testDirectEmail:', typeof window.testDirectEmail);
console.log('- testFinalEmail:', typeof window.testFinalEmail);

// List all window functions that start with 'test'
console.log('\nAll test functions on window:');
Object.keys(window).filter(key => key.startsWith('test')).forEach(func => {
  console.log(`- ${func}:`, typeof window[func]);
});

// Make a simple test function available
window.simpleTest = () => {
  console.log('✅ Simple test function works!');
  return 'Test successful';
};

console.log('✅ Console test loaded. Try running: simpleTest()');
