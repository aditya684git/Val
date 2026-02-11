# EmailJS Setup Guide

Your Valentine Quiz now sends email notifications when someone clicks "Yes!" 💖

## Setup Steps

### 1. Create EmailJS Account
1. Go to [EmailJS.com](https://www.emailjs.com/) and sign up (it's free!)
2. Verify your email address

### 2. Add Email Service
1. Go to **Email Services** in your EmailJS dashboard
2. Click **Add New Service**
3. Choose your email provider (Gmail recommended)
4. Follow the connection steps
5. **Copy your SERVICE_ID** (looks like: `service_abc123`)

### 3. Create Email Template
1. Go to **Email Templates** in dashboard
2. Click **Create New Template**
3. Use this template content:

**Template Name:** Valentine Quiz Response

**Subject:** 
```
New Valentine Quiz Response! 💕
```

**Content:**
```
You received a new response to your Valentine Quiz!

📅 Date: {{submission_date}}

📝 Quiz Responses:
{{quiz_responses}}

Sent with love from your Valentine Quiz app ❤️
```

4. **Copy your TEMPLATE_ID** (looks like: `template_xyz789`)

### 4. Get Your Public Key
1. Go to **Account** → **General**
2. Find your **Public Key** (looks like: `AbC123dEf456gHi`)
3. Copy it

### 5. Update Your Code
Open `src/pages/Index.tsx` and find the `handleYes` function (around line 105).

Replace these placeholders:
```typescript
to_email: "your-email@gmail.com", // ← Change to YOUR email
...
await emailjs.send(
  "YOUR_SERVICE_ID",    // ← Paste your Service ID here
  "YOUR_TEMPLATE_ID",   // ← Paste your Template ID here
  templateParams,
  "YOUR_PUBLIC_KEY"     // ← Paste your Public Key here
);
```

### 6. Test It!
1. Run `npm run dev`
2. Go through the quiz
3. Click "Yes!" on the Valentine question
4. Check your email inbox! 📧

## Example Configuration
```typescript
to_email: "myemail@gmail.com",
...
await emailjs.send(
  "service_abc123def",
  "template_xyz789ghi",
  templateParams,
  "AbC123dEf456gHi789"
);
```

## What Gets Sent?
The email includes:
- All quiz question answers
- The date and time
- The user's text response to the custom question

## Troubleshooting
- ❌ Email not sending? Check browser console for errors
- ❌ Wrong credentials? Double-check Service ID, Template ID, and Public Key
- ❌ Gmail blocking? Make sure you enabled "Less secure app access" in Gmail settings (or use EmailJS's recommended OAuth setup)

## Free Tier Limits
- 200 emails per month (free plan)
- Perfect for a Valentine's quiz! 💝

---

Need help? Check the [EmailJS Documentation](https://www.emailjs.com/docs/)
