import React, { useState } from 'react';
import { notifyAllUsers } from '../utils/emailNotifications';

const EmailTest = () => {
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState(null);

  const testEmailNotifications = async () => {
    setTesting(true);
    setResult(null);

    try {
      // Create a test event
      const testEvent = {
        title: 'Test Event - Beach Cleanup',
        description: 'Join us for a community beach cleanup event. Help keep our beaches clean and beautiful!',
        startDateTime: '2024-02-15T10:00:00',
        endDateTime: '2024-02-15T14:00:00',
        location: 'Sunset Beach, California',
        organizer: 'YouthInAction Team',
        category: 'COMMUNITY CLEANUPS',
        image: 'https://example.com/beach-cleanup.jpg'
      };

      console.log('🧪 Testing email notifications with event:', testEvent);
      
      const result = await notifyAllUsers(testEvent);
      setResult(result);
      
      console.log('📧 Test result:', result);
    } catch (error) {
      console.error('❌ Test failed:', error);
      setResult({ success: false, message: error.message });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>Email Notification Test</h2>
      <p>This component tests the email notification system.</p>
      
      <button 
        onClick={testEmailNotifications}
        disabled={testing}
        style={{
          padding: '10px 20px',
          backgroundColor: testing ? '#ccc' : '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: testing ? 'not-allowed' : 'pointer'
        }}
      >
        {testing ? 'Testing...' : 'Test Email Notifications'}
      </button>

      {result && (
        <div style={{ 
          marginTop: '20px', 
          padding: '15px', 
          backgroundColor: result.success ? '#d4edda' : '#f8d7da',
          border: `1px solid ${result.success ? '#c3e6cb' : '#f5c6cb'}`,
          borderRadius: '5px'
        }}>
          <h3>{result.success ? '✅ Success!' : '❌ Failed'}</h3>
          <p><strong>Message:</strong> {result.message}</p>
          {result.results && (
            <div>
              <strong>Results:</strong>
              <pre style={{ fontSize: '12px', marginTop: '10px' }}>
                {JSON.stringify(result.results, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}

      <div style={{ marginTop: '30px', fontSize: '14px', color: '#666' }}>
        <h4>How to Test:</h4>
        <ol>
          <li>Click "Test Email Notifications" button</li>
          <li>Check the browser console for detailed logs</li>
          <li>Look for messages starting with 📧 and 🔔</li>
          <li>Verify that test emails are logged</li>
        </ol>
        
        <h4>Expected Output:</h4>
        <ul>
          <li>Console should show "📧 Getting notification emails..."</li>
          <li>Console should show "🔔 Notifying all users about new event..."</li>
          <li>Console should show email details for each test email</li>
          <li>Success message should appear above</li>
        </ul>
      </div>
    </div>
  );
};

export default EmailTest;
