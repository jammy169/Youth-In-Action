// Test Firestore connection and permissions
import { db } from '../firebaseConfig';
import { collection, addDoc, getDocs } from 'firebase/firestore';

/**
 * Test Firestore write permissions
 */
export const testFirestoreWrite = async () => {
  try {
    console.log('🧪 Testing Firestore write permissions...');
    
    // Test adding a simple document
    const testData = {
      title: 'Test Event',
      description: 'This is a test event to verify Firestore permissions',
      createdAt: new Date(),
      test: true
    };
    
    const eventsRef = collection(db, 'events');
    const docRef = await addDoc(eventsRef, testData);
    
    console.log('✅ Firestore write test successful! Document ID:', docRef.id);
    return { success: true, docId: docRef.id };
    
  } catch (error) {
    console.error('❌ Firestore write test failed:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Test Firestore read permissions
 */
export const testFirestoreRead = async () => {
  try {
    console.log('🧪 Testing Firestore read permissions...');
    
    const eventsRef = collection(db, 'events');
    const snapshot = await getDocs(eventsRef);
    
    console.log('✅ Firestore read test successful! Found', snapshot.docs.length, 'documents');
    return { success: true, count: snapshot.docs.length };
    
  } catch (error) {
    console.error('❌ Firestore read test failed:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Run all Firestore tests
 */
export const runFirestoreTests = async () => {
  console.log('🚀 Running Firestore permission tests...');
  
  const readTest = await testFirestoreRead();
  const writeTest = await testFirestoreWrite();
  
  console.log('📊 Test Results:');
  console.log('- Read permissions:', readTest.success ? '✅ Working' : '❌ Failed');
  console.log('- Write permissions:', writeTest.success ? '✅ Working' : '❌ Failed');
  
  return {
    read: readTest,
    write: writeTest,
    allWorking: readTest.success && writeTest.success
  };
};

// Make functions available globally for testing
if (typeof window !== 'undefined') {
  window.testFirestoreWrite = testFirestoreWrite;
  window.testFirestoreRead = testFirestoreRead;
  window.runFirestoreTests = runFirestoreTests;
}

export default {
  testFirestoreWrite,
  testFirestoreRead,
  runFirestoreTests
};















