# 📧 How to Change SENDER Email (From jamestellore@gmail.com to Organization Account)

## Current Situation
- **To (Recipient)**: `jep@gmail.com` ✅ (correct - this is who receives the notification)
- **From (Sender)**: `jamestellore@gmail.com` ❌ (you want to change this)
- **Want**: `youthinaction.ph@gmail.com` ✅ (organization account)

## Solution: Set Up "Send mail as" in Gmail

### Step 1: Add Organization Email to Your Gmail Account

1. **Open Gmail** (while logged in as `jamestellore@gmail.com`)

2. **Click Settings**:
   - Click the gear icon (⚙️) in top right corner
   - Click **"See all settings"**

3. **Go to "Accounts and Import" tab**

4. **Find "Send mail as" section** (scroll down a bit)

5. **Click "Add another email address"**

6. **Enter Organization Email**:
   ```
   Name: YouthInAction
   Email address: youthinaction.ph@gmail.com
   ☑ Treat as an alias
   ```
   - Click **"Next Step"**

7. **Verify Email**:
   - Gmail sends a verification code to `youthinaction.ph@gmail.com`
   - Check that email inbox
   - Copy the verification code
   - Paste it in Gmail verification box
   - Click **"Verify"**

### Step 2: Use Organization Email When Composing

After creating an event, Gmail compose windows will open. In EACH window:

1. **Look at the TOP of the compose window** - you'll see:
   ```
   From: jamestellore@gmail.com ▼
   ```

2. **Click the dropdown arrow (▼)** next to "jamestellore@gmail.com"

3. **Select "YouthInAction <youthinaction.ph@gmail.com>"** from the dropdown

4. **Now the From field shows**:
   ```
   From: YouthInAction <youthinaction.ph@gmail.com> ✅
   ```

5. **The "To" field stays as**:
   ```
   To: jep@gmail.com ✅ (recipient - don't change this)
   ```

6. **Click "Send"** - email will be sent from the organization account! 🎉

## Visual Guide

**BEFORE (what you see now):**
```
┌──────────────────────────────────────┐
│ From: jamestellore@gmail.com ▼      │ ← Your personal account
│ To: jep@gmail.com                   │ ← Recipient
│ Subject: New Volunteer Opportunity... │
└──────────────────────────────────────┘
```

**AFTER (what you want):**
```
┌──────────────────────────────────────┐
│ From: YouthInAction <youthinaction.ph@gmail.com> ▼ │ ← Organization account
│ To: jep@gmail.com                   │ ← Recipient (unchanged)
│ Subject: New Volunteer Opportunity... │
└──────────────────────────────────────┘
```

## ⚠️ Important

- You must **manually select** the organization email from the dropdown in EACH compose window
- Gmail cannot automatically change the sender via URL (security feature)
- Once you set up "Send mail as", the organization email will always be available in the dropdown

## 🚀 Quick Alternative

If you don't want to select it each time:

1. **Open a new incognito/private browser window**
2. **Log into Gmail** with `youthinaction.ph@gmail.com` (organization account)
3. **Create events from that window**
4. Emails will automatically send from the organization account

---

**Summary**: Set up "Send mail as" once, then select the organization email from the "From" dropdown in each compose window.



