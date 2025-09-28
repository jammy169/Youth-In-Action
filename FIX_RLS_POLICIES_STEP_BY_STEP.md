# Fix RLS Policies - Step by Step Guide

Since you've created the `event-images` bucket but are still getting RLS policy errors, we need to set up the Row Level Security policies manually through the Supabase dashboard.

## 🎯 **Step-by-Step RLS Policy Setup**

### **Step 1: Go to Storage Policies**
1. **Open your Supabase Dashboard**
2. **Click "Storage"** in the left sidebar
3. **Click on your `event-images` bucket**
4. **Click the "Policies" tab** (next to "Files")

### **Step 2: Create Upload Policy (INSERT)**
1. **Click "New policy"**
2. **Select "Create a policy from scratch"**
3. **Fill in these details:**
   - **Name**: `Allow public uploads`
   - **For**: `INSERT`
   - **Target roles**: `anon` (check this box)
   - **Using expression**: Leave empty
   - **With check expression**: Leave empty
4. **Click "Review"** then **"Save policy"**

### **Step 3: Create Read Policy (SELECT)**
1. **Click "New policy"** again
2. **Select "Create a policy from scratch"**
3. **Fill in these details:**
   - **Name**: `Allow public read access`
   - **For**: `SELECT`
   - **Target roles**: `anon` (check this box)
   - **Using expression**: Leave empty
   - **With check expression**: Leave empty
4. **Click "Review"** then **"Save policy"**

### **Step 4: Create Update Policy (UPDATE)**
1. **Click "New policy"** again
2. **Select "Create a policy from scratch"**
3. **Fill in these details:**
   - **Name**: `Allow public updates`
   - **For**: `UPDATE`
   - **Target roles**: `anon` (check this box)
   - **Using expression**: Leave empty
   - **With check expression**: Leave empty
4. **Click "Review"** then **"Save policy"**

### **Step 5: Create Delete Policy (DELETE)**
1. **Click "New policy"** again
2. **Select "Create a policy from scratch"**
3. **Fill in these details:**
   - **Name**: `Allow public deletes`
   - **For**: `DELETE`
   - **Target roles**: `anon` (check this box)
   - **Using expression**: Leave empty
   - **With check expression**: Leave empty
4. **Click "Review"** then **"Save policy"**

## 🧪 **Test After Setup**

After creating all 4 policies:

1. **Refresh your web app**
2. **Try uploading an image**
3. **Check browser console** - you should see:
   - ✅ "Uploading file: event-[timestamp].png"
   - ✅ "Upload successful: [data]"
   - ✅ "Public URL: [url]"

## 🚨 **If Still Not Working**

### **Alternative: Use Firebase Storage Instead**

If Supabase storage continues to have issues, we can switch to Firebase Storage (which you already have set up). This would be more reliable since you already have Firebase configured.

### **Check Your Supabase Plan**
- **Free tier**: May have storage limitations
- **Pro tier**: Full storage access
- **Go to**: Settings → Billing to check your plan

## 📞 **Need Help?**

If you're still having issues after setting up the policies, let me know and I can:
1. **Switch to Firebase Storage** (more reliable)
2. **Use a different image hosting service**
3. **Debug the specific error** you're seeing

The key is making sure the `anon` role has permissions for all operations (INSERT, SELECT, UPDATE, DELETE) on the `event-images` bucket!

