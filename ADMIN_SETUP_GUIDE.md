# 🔧 Admin Setup Guide - Fix Event Addition Error

## 🚨 **Current Issue:**
You're getting "Missing or insufficient permissions" error when trying to add events because the admin is not authenticated.

## 🛠️ **Quick Fix (Temporary):**

### **Option 1: Update Firestore Rules (Recommended)**

1. **Go to Firebase Console:**
   - Visit [https://console.firebase.google.com](https://console.firebase.google.com)
   - Select your project: `youthinaction-e1920`

2. **Navigate to Firestore Database:**
   - Click "Firestore Database" in the left sidebar
   - Click the "Rules" tab

3. **Replace the rules with this temporary permissive version:**
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
    
    // TEMPORARY: Allow public write access to events (for testing)
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

4. **Click "Publish" to save the rules**

### **Option 2: Create Admin User Account**

1. **Go to Firebase Authentication:**
   - In Firebase Console, click "Authentication"
   - Click "Users" tab
   - Click "Add user"

2. **Create Admin User:**
   - Email: `admin@youthinaction.com` (or your preferred admin email)
   - Password: Create a strong password
   - Click "Add user"

3. **Sign in as Admin:**
   - Go to your app's sign-in page
   - Use the admin credentials you just created
   - You should now be able to add events

## 🔐 **Proper Admin Authentication Setup:**

### **Step 1: Create Admin User**
```bash
# In Firebase Console > Authentication > Users
# Add user with email: admin@youthinaction.com
# Set a strong password
```

### **Step 2: Update Admin Email List**
Edit `src/utils/adminAuth.js` and add your admin email:
```javascript
const ADMIN_EMAILS = [
  'admin@youthinaction.com',
  'your-admin-email@gmail.com', // Add your email here
];
```

### **Step 3: Use Admin Sign-in**
- Navigate to `/admin-signin` in your app
- Sign in with admin credentials
- You should now be able to add events

## 🧪 **Test the Fix:**

1. **Try adding an event again**
2. **Check the browser console** - you should see "Admin authenticated: [email]"
3. **Verify the event appears** on both public and user events pages

## 🔒 **Security Note:**

The temporary permissive rules (Option 1) allow anyone to write to events. This is fine for development but should be changed to proper authentication rules for production.

## 📞 **If Still Having Issues:**

1. **Check browser console** for any error messages
2. **Verify Firebase project** is correct (`youthinaction-e1920`)
3. **Clear browser cache** and try again
4. **Check Firebase Console** for any error logs

## ✅ **Expected Result:**

After implementing either fix, you should be able to:
- ✅ Add events without permission errors
- ✅ See events on both public and user pages
- ✅ Real-time updates when events are added/modified
- ✅ Proper admin authentication flow




