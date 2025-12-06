// AdminAccountCreator.jsx
// Component to create admin account programmatically
// USE ONLY FOR DEVELOPMENT

import React, { useState } from 'react';
import { createAdminAccount, testAdminLogin, setupAdminAccount } from '../utils/createAdminAccount';

const AdminAccountCreator = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [step, setStep] = useState('');

  const handleCreateAccount = async () => {
    setLoading(true);
    setStep('Creating admin account...');
    setResult(null);
    
    try {
      const result = await createAdminAccount();
      setResult(result);
      setStep('Account creation complete');
    } catch (error) {
      setResult({
        success: false,
        message: `Error: ${error.message}`
      });
      setStep('Account creation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleTestLogin = async () => {
    setLoading(true);
    setStep('Testing admin login...');
    setResult(null);
    
    try {
      const result = await testAdminLogin();
      setResult(result);
      setStep('Login test complete');
    } catch (error) {
      setResult({
        success: false,
        message: `Error: ${error.message}`
      });
      setStep('Login test failed');
    } finally {
      setLoading(false);
    }
  };

  const handleFullSetup = async () => {
    setLoading(true);
    setStep('Running complete admin setup...');
    setResult(null);
    
    try {
      const result = await setupAdminAccount();
      setResult(result);
      setStep('Complete setup finished');
    } catch (error) {
      setResult({
        success: false,
        message: `Error: ${error.message}`
      });
      setStep('Setup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      padding: '20px', 
      maxWidth: '600px', 
      margin: '0 auto',
      background: '#f8f9fa',
      borderRadius: '8px',
      marginTop: '20px'
    }}>
      <h2 style={{ color: '#333', marginBottom: '20px' }}>🔐 Admin Account Creator</h2>
      <p style={{ color: '#666', marginBottom: '20px' }}>
        This tool will create the admin account: <strong>admin@youthinaction.com</strong>
      </p>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>Quick Actions:</h3>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button 
            onClick={handleCreateAccount}
            disabled={loading}
            style={{
              background: '#007bff',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '5px',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            Create Account
          </button>
          
          <button 
            onClick={handleTestLogin}
            disabled={loading}
            style={{
              background: '#28a745',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '5px',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            Test Login
          </button>
          
          <button 
            onClick={handleFullSetup}
            disabled={loading}
            style={{
              background: '#6f42c1',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '5px',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            Full Setup
          </button>
        </div>
      </div>

      {loading && (
        <div style={{ 
          padding: '10px', 
          background: '#e3f2fd', 
          borderRadius: '5px',
          marginBottom: '10px'
        }}>
          <strong>Status:</strong> {step}
        </div>
      )}

      {result && (
        <div style={{ 
          padding: '15px', 
          background: result.success ? '#d4edda' : '#f8d7da',
          border: `1px solid ${result.success ? '#c3e6cb' : '#f5c6cb'}`,
          borderRadius: '5px',
          marginBottom: '10px'
        }}>
          <h4 style={{ 
            color: result.success ? '#155724' : '#721c24',
            margin: '0 0 10px 0'
          }}>
            {result.success ? '✅ Success!' : '❌ Error'}
          </h4>
          <p style={{ 
            color: result.success ? '#155724' : '#721c24',
            margin: '0'
          }}>
            {result.message}
          </p>
          {result.error && (
            <p style={{ 
              color: '#721c24',
              fontSize: '12px',
              margin: '5px 0 0 0'
            }}>
              Error Code: {result.error}
            </p>
          )}
        </div>
      )}

      <div style={{ 
        background: '#fff3cd',
        border: '1px solid #ffeaa7',
        borderRadius: '5px',
        padding: '15px',
        marginTop: '20px'
      }}>
        <h4 style={{ color: '#856404', margin: '0 0 10px 0' }}>📋 Next Steps:</h4>
        <ol style={{ color: '#856404', margin: '0', paddingLeft: '20px' }}>
          <li>Click "Full Setup" to create and test the admin account</li>
          <li>Go to <code>/admin-signin</code> in your app</li>
          <li>Sign in with: <strong>admin@youthinaction.com</strong></li>
          <li>Password: <strong>YouthAdmin2025!</strong></li>
        </ol>
      </div>
    </div>
  );
};

export default AdminAccountCreator;






