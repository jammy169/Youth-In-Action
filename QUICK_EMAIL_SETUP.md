# 🚀 Quick Setup: Send Emails from Organization Account

## Your Current Situation
When you create events, Gmail compose windows open but they show **`jep@gmail.com`** as the sender. You want them to show your organization email instead.

## ⚡ Quick Solution (5 minutes)

### Step 1: Set Up "Send mail as" in Gmail

1. **Open Gmail** (while logged in as jep@gmail.com)
2. Click the **gear icon (⚙️)** → **"See all settings"**
3. Go to **"Accounts and Import"** tab
4. Scroll to **"Send mail as"** section
5. Click **"Add another email address"**
6. Fill in:
   - **Name**: `YouthInAction` (or your organization name)
   - **Email address**: `youthinaction.ph@gmail.com` (or your organization email)
   - ✅ **Check "Treat as an alias"**
   - Click **"Next Step"**
7. **Verify the email**:
   - Gmail sends a verification code to the organization email
   - Open that email, copy the code
   - Paste it in Gmail and click **"Verify"**

### Step 2: Use It When Sending Notifications

When you create an event and Gmail compose windows open:

1. **Look for the "From" field** at the top of each compose window
2. **Click the dropdown** next to "jep@gmail.com"
3. **Select "YouthInAction <youthinaction.ph@gmail.com>"**
4. Now send the email - it will go from the organization account! ✅

## 📝 Visual Guide

```
┌─────────────────────────────────────────┐
│ From: [jep@gmail.com ▼]               │ ← Click this dropdown
│        ├─ jep@gmail.com                │
│        └─ YouthInAction <youth...>     │ ← Select this one
└─────────────────────────────────────────┘
```

## ⚠️ Important Notes

- You need to **select the organization email** in EACH compose window that opens
- Gmail cannot automatically set this via URL (security restriction)
- Once set up, the organization email will appear in the dropdown forever

## 🎯 Alternative: Use Separate Browser/Incognito Window

If you don't want to select it each time:

1. **Open an incognito/private window**
2. **Log into Gmail** with the organization account (youthinaction.ph@gmail.com)
3. **Create events from that window** - emails will automatically send from organization account

---

**Need help?** Check `EMAIL_SENDER_SETUP.md` for detailed troubleshooting.

