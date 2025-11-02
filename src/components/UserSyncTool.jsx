// UserSyncTool.jsx
// Component to sync Firebase Authentication with Firestore users collection

import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { db } from '../firebaseConfig';
import { collection, getDocs, doc, setDoc, getDoc } from 'firebase/firestore';
import { syncAuthWithFirestore, compareAuthWithFirestore } from '../utils/syncAuthWithFirestore';

const UserSyncTool = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [firestoreUsers, setFirestoreUsers] = useState([]);
  const [authUsers, setAuthUsers] = useState([]);

  // Get current authenticated user
  const auth = getAuth();
  const currentUser = auth.currentUser;

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      
      // Get Firestore users
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const users = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setFirestoreUsers(users);
      
      // Get Auth users (limited in frontend)
      const authUsers = currentUser ? [currentUser] : [];
      setAuthUsers(authUsers);
      
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    try {
      setLoading(true);
      setResults(null);
      
      console.log('🔄 Starting user sync...');
      const result = await syncAuthWithFirestore();
      setResults(result);
      
    } catch (error) {
      console.error('Sync error:', error);
      setResults({
        success: false,
        error: error.message,
        message: 'Sync failed!'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCompare = async () => {
    try {
      setLoading(true);
      setResults(null);
      
      console.log('🔍 Comparing users...');
      const comparison = await compareAuthWithFirestore();
      setResults({
        success: true,
        comparison,
        message: 'Comparison completed!'
      });
      
    } catch (error) {
      console.error('Compare error:', error);
      setResults({
        success: false,
        error: error.message,
        message: 'Comparison failed!'
      });
    } finally {
      setLoading(false);
    }
  };

  const createUserDocument = async (email, uid) => {
    try {
      const userDocRef = doc(db, 'users', uid);
      const userDoc = await getDoc(userDocRef);
      
      if (!userDoc.exists()) {
        await setDoc(userDocRef, {
          email: email,
          displayName: email.split('@')[0],
          createdAt: new Date().toISOString(),
          uid: uid,
          emailVerified: false
        });
        console.log(`✅ Created user document for: ${email}`);
        return { success: true, message: `Created document for ${email}` };
      } else {
        console.log(`⚠️ User document already exists: ${email}`);
        return { success: false, message: `Document already exists for ${email}` };
      }
    } catch (error) {
      console.error(`❌ Error creating document for ${email}:`, error);
      return { success: false, error: error.message };
    }
  };

  return (
    <div style={{ 
      padding: '20px', 
      maxWidth: '800px', 
      margin: '0 auto',
      background: '#f8f9fa',
      borderRadius: '8px',
      marginTop: '20px'
    }}>
      <h2 style={{ color: '#333', marginBottom: '20px' }}>🔄 User Sync Tool</h2>
      
      <div style={{ 
        background: '#e3f2fd', 
        padding: '15px', 
        borderRadius: '5px',
        marginBottom: '20px'
      }}>
        <h4 style={{ color: '#1976d2', margin: '0 0 10px 0' }}>📋 Current Status:</h4>
        <p style={{ margin: '5px 0', color: '#333' }}>
          <strong>Firestore Users:</strong> {firestoreUsers.length}
        </p>
        <p style={{ margin: '5px 0', color: '#333' }}>
          <strong>Auth Users (accessible):</strong> {authUsers.length}
        </p>
        <p style={{ margin: '5px 0', color: '#333' }}>
          <strong>Current User:</strong> {currentUser ? currentUser.email : 'Not signed in'}
        </p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>Quick Actions:</h3>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button 
            onClick={handleCompare}
            disabled={loading}
            style={{
              background: '#ff9800',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '5px',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            🔍 Compare Users
          </button>
          
          <button 
            onClick={handleSync}
            disabled={loading}
            style={{
              background: '#4caf50',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '5px',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            🔄 Sync Users
          </button>
          
          <button 
            onClick={loadUsers}
            disabled={loading}
            style={{
              background: '#2196f3',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '5px',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            🔄 Refresh Data
          </button>
        </div>
      </div>

      {loading && (
        <div style={{ 
          padding: '15px', 
          background: '#fff3cd', 
          borderRadius: '5px',
          marginBottom: '10px'
        }}>
          <strong>Status:</strong> {loading ? 'Processing...' : 'Ready'}
        </div>
      )}

      {results && (
        <div style={{ 
          padding: '15px', 
          background: results.success ? '#d4edda' : '#f8d7da',
          border: `1px solid ${results.success ? '#c3e6cb' : '#f5c6cb'}`,
          borderRadius: '5px',
          marginBottom: '10px'
        }}>
          <h4 style={{ 
            color: results.success ? '#155724' : '#721c24',
            margin: '0 0 10px 0'
          }}>
            {results.success ? '✅ Success!' : '❌ Error'}
          </h4>
          <p style={{ 
            color: results.success ? '#155724' : '#721c24',
            margin: '0 0 10px 0'
          }}>
            {results.message}
          </p>
          
          {results.comparison && (
            <div style={{ marginTop: '10px' }}>
              <h5>📊 Comparison Results:</h5>
              <ul style={{ margin: '5px 0', paddingLeft: '20px' }}>
                <li>Auth Users: {results.comparison.authUsers}</li>
                <li>Firestore Users: {results.comparison.firestoreUsers}</li>
                <li>Missing in Firestore: {results.comparison.missingInFirestore?.length || 0}</li>
                <li>Missing in Auth: {results.comparison.missingInAuth?.length || 0}</li>
              </ul>
            </div>
          )}
          
          {results.error && (
            <p style={{ 
              color: '#721c24',
              fontSize: '12px',
              margin: '5px 0 0 0'
            }}>
              Error: {results.error}
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
        <h4 style={{ color: '#856404', margin: '0 0 10px 0' }}>💡 Why This Happens:</h4>
        <ul style={{ color: '#856404', margin: '0', paddingLeft: '20px' }}>
          <li>Users created manually in Firebase Auth console</li>
          <li>Incomplete signup process (Auth created, Firestore failed)</li>
          <li>Different email addresses in Auth vs Firestore</li>
          <li>Orphaned data from deleted accounts</li>
        </ul>
      </div>
    </div>
  );
};

export default UserSyncTool;




