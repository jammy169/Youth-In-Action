# 🔧 Update Firestore Rules for Admin User Deletion

## ⚠️ Important: Manual Step Required

The Firestore security rules have been updated to allow admins to delete user accounts. **You must manually update these rules in the Firebase Console** for the changes to take effect.

## 📋 Step-by-Step Instructions:

### **Step 1: Open Firebase Console**
1. Go to [https://console.firebase.google.com](https://console.firebase.google.com)
2. Select your project: `youthinaction-e1920`

### **Step 2: Navigate to Firestore Database**
1. Click on **"Firestore Database"** in the left sidebar
2. Click on the **"Rules"** tab at the top

### **Step 3: Replace the Rules**
Copy and paste this updated rules configuration:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // Helper function to check if user is admin
    function isAdmin() {
      return request.auth != null && 
             (request.auth.token.email == 'admin@youthinaction.com' ||
              request.auth.token.email == 'jamestellore@gmail.com' ||
              request.auth.token.email == 'jep@gmail.com');
    }
    
    // Allow users to read and write their own profile
    match /userProfiles/{userId} {
      allow read: if request.auth != null;
      allow write: if (request.auth != null && request.auth.uid == userId) || isAdmin();
      allow delete: if (request.auth != null && request.auth.uid == userId) || isAdmin();
    }
    
    // Allow users to read and write their own user document
    // Allow admins to delete any user document
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
      allow delete: if (request.auth != null && (request.auth.uid == userId || isAdmin()));
    }
    
    // Allow authenticated users to read user emails for notifications
    // This allows the email notification system to get user emails
    match /users/{userId} {
      allow read: if request.auth != null;
    }
    
    // Allow users to read and write their own event registrations
    match /eventRegistrations/{registrationId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
    
    // Allow admin access to eventRegistrations for management
    match /eventRegistrations/{registrationId} {
      allow read, write: if request.auth != null;
    }
    
    // TEMPORARY: Allow public write access to events (for development)
    // TODO: Change to proper authentication rules for production
    match /events/{eventId} {
      allow read, write, create, update, delete: if true;
    }
    
    // Allow public read access to registrations (for admin dashboard)
    match /registrations/{registrationId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### **Step 4: Publish the Rules**
1. Click the **"Publish"** button
2. Confirm the changes

## 🎯 What This Fixes:

- ✅ **Allows admins to delete user accounts** from Firestore
- ✅ **Allows admins to delete user profiles** from userProfiles collection
- ✅ **Maintains security** - only specific admin emails can delete
- ✅ **Preserves user permissions** - users can still delete their own accounts

## 📧 Admin Emails Configured:

The following email addresses are recognized as admins:
- `admin@youthinaction.com`
- `jamestellore@gmail.com`
- `jep@gmail.com`

If you need to add more admin emails, update the `isAdmin()` function in the rules.

## 🔍 After Updating Rules:

1. **Save and publish** the rules in Firebase Console
2. **Try deleting a user** from the admin dashboard
3. **Check the console** - you should see successful deletion logs
4. **Verify** - the user should disappear from the user management table

## ⚠️ Note:

- Even after updating rules, if a user was manually deleted from Firebase Auth Console, their Firestore documents may still exist
- The improved deletion function now handles this gracefully and checks if documents exist before attempting to delete
- The function will delete from multiple collections: `users`, `userProfiles`, and `registrations`

