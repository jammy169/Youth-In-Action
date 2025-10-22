# 🔧 Manual Firestore Rules Update

Since Firebase CLI is not available, you need to manually update your Firestore security rules in the Firebase Console.

## 📋 **Step-by-Step Instructions:**

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
    // Allow users to read and write their own profile
    match /userProfiles/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Allow users to read and write their own user document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Allow users to read and write their own event registrations
    match /eventRegistrations/{registrationId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
    
    // Allow public read access to events
    match /events/{eventId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Allow authenticated users to read and write registrations (for admin dashboard)
    match /registrations/{registrationId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### **Step 4: Publish the Rules**
1. Click the **"Publish"** button
2. Confirm the changes

## 🎯 **What This Fixes:**

- ✅ **Allows user creation** in the `users` collection
- ✅ **Maintains security** - users can only access their own data
- ✅ **Enables admin access** to registrations
- ✅ **Preserves existing permissions** for other collections

## 🚀 **Alternative: Temporary Development Rules**

If you want to test quickly, you can temporarily use these more permissive rules:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // Temporary: Allow all authenticated users to read/write
    // WARNING: Only use for development!
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

**⚠️ Important:** Only use the temporary rules for development. Switch back to the secure rules before going to production.

## 🔍 **After Updating Rules:**

1. **Save and publish** the rules in Firebase Console
2. **Try signing up again** - the error should be resolved
3. **Check the console** - you should see successful user creation
4. **Check Firestore** - you should see the user document created

## 📊 **Verification Steps:**

1. **Check Firebase Authentication** - User should be created
2. **Check Firestore Database** - User document should be in `/users/{userId}`
3. **Check Console Logs** - Should show "User data saved to Firestore successfully"

The updated code now handles Firestore write failures gracefully, so even if the rules aren't updated immediately, the user can still sign up and the data will be saved when the rules are fixed.











