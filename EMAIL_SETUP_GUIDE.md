# 📧 Email Notification Setup Guide

This guide will help you set up real email notifications for your YouthInAction app.

## 🚀 Quick Setup (5 minutes)

### Step 1: Create EmailJS Account
1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Click "Sign Up" and create a free account
3. Verify your email address

### Step 2: Create Email Service
1. In EmailJS dashboard, go to "Email Services"
2. Click "Add New Service"
3. Choose "Gmail" (recommended)
4. Connect your Gmail account
5. **Copy the Service ID** (you'll need this)

### Step 3: Create Email Templates
1. Go to "Email Templates"
2. Click "Create New Template"
3. Create these templates:

#### Template 1: Registration Confirmation
- **Template Name**: `registration_confirmation`
- **Subject**: `Registration Confirmation - {{event_title}}`
- **Content**: Use the HTML template from `src/config/emailConfig.js`

#### Template 2: Event Notification
- **Template Name**: `event_notification`
- **Subject**: `New Volunteer Opportunity: {{event_title}}`
- **Content**: Use the HTML template from `src/config/emailConfig.js`

#### Template 3: Status Update
- **Template Name**: `status_update`
- **Subject**: `Registration Status Update - {{event_title}}`
- **Content**: Simple text template for status updates

#### Template 4: Test Email
- **Template Name**: `test_email`
- **Subject**: `Test Email from YouthInAction`
- **Content**: Simple test message

### Step 4: Get Your Credentials
1. Go to "Account" → "General"
2. **Copy your Public Key**
3. **Copy your Service ID** (from Step 2)
4. **Copy your Template IDs** (from Step 3)

### Step 5: Update Configuration
1. Open `src/config/emailConfig.js`
2. Replace the placeholder values:

```javascript
export const EMAIL_CONFIG = {
  serviceId: 'service_xxxxxxxxx', // Your actual service ID
  publicKey: 'xxxxxxxxxxxxxxxx', // Your actual public key
  
  templates: {
    registrationConfirmation: 'template_xxxxxxxxx', // Your template ID
    eventNotification: 'template_xxxxxxxxx', // Your template ID
    statusUpdate: 'template_xxxxxxxxx', // Your template ID
    testEmail: 'template_xxxxxxxxx' // Your template ID
  }
};
```

### Step 6: Test Email Functionality
1. Start your development server: `npm run dev`
2. Register for an event
3. Check your email for confirmation
4. Check browser console for email logs

## 🔧 Troubleshooting

### Common Issues:

1. **"Service not found" error**
   - Check that your Service ID is correct
   - Make sure the service is active in EmailJS dashboard

2. **"Template not found" error**
   - Check that your Template IDs are correct
   - Make sure templates are published in EmailJS dashboard

3. **"Public key invalid" error**
   - Check that your Public Key is correct
   - Make sure it's copied from the right place in EmailJS

4. **Emails not sending**
   - Check browser console for errors
   - Verify all credentials are correct
   - Test with the fallback email system first

### Testing Steps:

1. **Test with fallback emails first**:
   ```javascript
   // In browser console:
   import { sendFallbackEmail } from './src/utils/emailService';
   sendFallbackEmail('your-email@gmail.com', 'Test Subject', 'Test Message');
   ```

2. **Test with EmailJS**:
   ```javascript
   // In browser console:
   import { testEmailService } from './src/utils/emailService';
   testEmailService();
   ```

## 📧 Email Templates

The app includes pre-built email templates in `src/config/emailConfig.js`. You can customize these templates in the EmailJS dashboard.

### Template Variables:
- `{{to_name}}` - Recipient's name
- `{{to_email}}` - Recipient's email
- `{{event_title}}` - Event title
- `{{event_date}}` - Event date
- `{{event_location}}` - Event location
- `{{event_organizer}}` - Event organizer
- `{{event_description}}` - Event description
- `{{website_url}}` - Website URL

## 🎯 What Happens Now:

1. **When users register for events**: They receive confirmation emails
2. **When admins create new events**: All users get notification emails
3. **When registration status changes**: Users get status update emails
4. **Fallback system**: If EmailJS fails, emails are logged to console

## 📱 Production Deployment:

1. Make sure all EmailJS credentials are correct
2. Test email functionality thoroughly
3. Deploy to production
4. Monitor email delivery in EmailJS dashboard

## 💡 Pro Tips:

1. **Start with Gmail**: Easiest to set up and most reliable
2. **Use fallback system**: For development and testing
3. **Monitor usage**: EmailJS has free tier limits
4. **Test thoroughly**: Before going to production

## 🆘 Need Help?

1. Check EmailJS documentation: [https://www.emailjs.com/docs/](https://www.emailjs.com/docs/)
2. Check browser console for error messages
3. Test with fallback email system first
4. Verify all credentials are correct

---

**Your email notification system is now ready! 🎉**

Users will receive proper email notifications instead of just Railway build failure emails.
