# 📧 Email Sender Setup Guide

## Problem
When you create an event as admin, emails are being sent from your personal Gmail account (jamestellore@gmail.com) instead of the organization account.

## Solution
Gmail's compose URL cannot change the "From" address automatically. You need to configure Gmail to allow sending from your organization email.

## How to Change the Sender Email

### Step 1: Update the Organization Email in Code

Open `src/config/emailConfig.js` and update the organization email:

```javascript
settings: {
  // ... other settings
  organizationEmail: 'youthinaction.ph@gmail.com' // ← CHANGE THIS to your organization email
}
```

### Step 2: Set Up Gmail "Send mail as" Feature

You have **TWO options**:

#### Option A: Log into Organization Gmail Account (Easiest)
1. **Log out** of your personal Gmail (jamestellore@gmail.com)
2. **Log into** the organization Gmail account (youthinaction.ph@gmail.com)
3. Now when you create events, the emails will send from the organization account

#### Option B: Use "Send mail as" Feature (Recommended)
This allows you to send from the organization email while logged into your personal account:

1. **Log into Gmail** with the account you normally use (jamestellore@gmail.com)

2. **Go to Gmail Settings**:
   - Click the gear icon (⚙️) in top right
   - Click "See all settings"

3. **Go to "Accounts and Import"** tab:
   - Find the "Send mail as" section
   - Click "Add another email address"

4. **Add Organization Email**:
   - **Name**: YouthInAction (or your organization name)
   - **Email address**: youthinaction.ph@gmail.com (your organization email)
   - ✅ Check "Treat as an alias"
   - Click "Next Step"

5. **Verify the Email**:
   - Gmail will send a verification code to the organization email
   - Check that email and enter the verification code
   - Click "Verify"

6. **When Composing Emails**:
   - In the Gmail compose window, click the "From" dropdown (next to your email address)
   - Select "YouthInAction <youthinaction.ph@gmail.com>"
   - The email will now send from the organization account

### Step 3: Test It

1. Create a new event as admin
2. When Gmail compose windows open, check the "From" field
3. If you used Option B, select the organization email from the dropdown
4. Send a test email to yourself
5. Verify it shows as sent from the organization account

## Important Notes

⚠️ **Gmail Limitations**:
- The `from` parameter in Gmail URLs doesn't work
- Gmail always uses the account you're logged into OR the "Send mail as" account you select
- You must manually select the "From" address in each compose window if using "Send mail as"

💡 **Recommendation**:
- Use **Option A** (separate Gmail account) if you want the simplest solution
- Use **Option B** (Send mail as) if you want to manage everything from one account

## Troubleshooting

**Q: Emails still sending from personal account?**
- Make sure you're logged into the organization Gmail account (Option A), OR
- Make sure you selected the organization email in the "From" dropdown (Option B)

**Q: "Send mail as" option not appearing?**
- Make sure you verified the email address
- Check that you're logged into Gmail (not just signed in)

**Q: Can I automate this?**
- No, Gmail doesn't allow changing the sender via URL parameters for security reasons
- You must manually select the sender address each time, OR
- Use a dedicated email service like EmailJS, SendGrid, or AWS SES



