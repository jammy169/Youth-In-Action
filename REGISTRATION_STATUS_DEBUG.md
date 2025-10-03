# Registration Status Debug Guide

## 🔍 **How to Test the Fix**

### **Step 1: Check Browser Console**
1. Open your browser's Developer Tools (F12)
2. Go to the Console tab
3. Look for these debug messages:
   - `"RegistrationStatus: Checking status for event: [eventId]"`
   - `"Checking registration for event: [eventId] user: [userId] email: [email]"`
   - `"User registration found: [registration object]"`

### **Step 2: Test the Flow**

#### **Before Registration:**
- Should see: `"User not registered, checking event status"`
- Button shows: "Join Now" (green, clickable)

#### **After Registration:**
- Should see: `"User is registered, showing status: pending"`
- Button shows: "Pending Review" (orange, not clickable)

#### **After Admin Approval:**
- Should see: `"User is registered, showing status: approved"`
- Button shows: "Approved ✓" (green, not clickable)

#### **After Admin Marks Attended:**
- Should see: `"User is registered, showing status: attended"`
- Button shows: "Attended ✓" (green, not clickable)

## 🐛 **Common Issues & Solutions**

### **Issue 1: Still Shows "Join Now" After Registration**
**Cause**: Registration not found in database
**Solution**: Check console logs for:
- `"User has not registered for this event"`
- `"Total registrations found: 0"`

### **Issue 2: Shows "Join Now" After Admin Approval**
**Cause**: Status not being updated in database
**Solution**: Check admin dashboard to ensure status was actually updated

### **Issue 3: Console Shows Errors**
**Cause**: Firebase permissions or network issues
**Solution**: Check Firestore rules and network connection

## 🔧 **Debugging Steps**

### **1. Check Registration Data**
```javascript
// In browser console, run:
console.log('Current user:', firebase.auth().currentUser);
console.log('User email:', firebase.auth().currentUser?.email);
```

### **2. Check Database Query**
Look for these console messages:
- `"Total registrations found: X"` (should be > 0)
- `"Filtered user registrations for this event: [...]"` (should show your registration)
- `"User registration found: {...}"` (should show your registration object)

### **3. Check Status Values**
The registration object should have:
- `status: "pending"` (after registration)
- `status: "approved"` (after admin approval)
- `status: "attended"` (after admin marks attended)

## 📊 **Expected Console Output**

### **Before Registration:**
```
RegistrationStatus: Checking status for event: event123
Checking registration for event: event123 user: user456 email: user@example.com
Total registrations found: 5
Filtered user registrations for this event: []
User has not registered for this event
RegistrationStatus: User not registered, checking event status
```

### **After Registration:**
```
RegistrationStatus: Checking status for event: event123
Checking registration for event: event123 user: user456 email: user@example.com
Total registrations found: 6
Filtered user registrations for this event: [{ id: "reg789", eventId: "event123", status: "pending", ... }]
User registration found: { id: "reg789", eventId: "event123", status: "pending", ... }
RegistrationStatus: User is registered, showing status: pending
```

### **After Admin Approval:**
```
RegistrationStatus: Checking status for event: event123
Checking registration for event: event123 user: user456 email: user@example.com
Total registrations found: 6
Filtered user registrations for this event: [{ id: "reg789", eventId: "event123", status: "approved", ... }]
User registration found: { id: "reg789", eventId: "event123", status: "approved", ... }
RegistrationStatus: User is registered, showing status: approved
```

## ✅ **Success Indicators**

### **Button Should Show:**
- **Before Registration**: "Join Now" (green, clickable)
- **After Registration**: "Pending Review" (orange, not clickable)
- **After Approval**: "Approved ✓" (green, not clickable)
- **After Attended**: "Attended ✓" (green, not clickable)

### **Console Should Show:**
- No errors in red
- Registration found with correct status
- Status changes properly after admin actions

## 🚨 **If Still Not Working**

### **Check These:**
1. **Firebase Authentication**: User must be logged in
2. **Firestore Rules**: Must allow reading registrations
3. **Network Connection**: Must be able to reach Firebase
4. **Browser Cache**: Try hard refresh (Ctrl+F5)

### **Quick Fix:**
1. Clear browser cache
2. Log out and log back in
3. Check admin dashboard to ensure status was updated
4. Refresh the page

**The system should now properly show registration status instead of "Join Now" after approval!**




