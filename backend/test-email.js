import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const recipient = process.argv[2] || process.env.SMTP_USER || 'test@example.com';
const testOtp = Math.floor(100000 + Math.random() * 900000).toString();

console.log('--- SahakarGig Email Authenticator Diagnostics ---');
console.log(`Target Recipient: ${recipient}`);

const brevoKey = (process.env.BREVO_API_KEY || '').trim();
const resendKey = (process.env.RESEND_API_KEY || '').trim();
const smtpUser = (process.env.SMTP_USER || process.env.GMAIL_USER || '').trim();
const smtpPass = (process.env.SMTP_PASS || process.env.GMAIL_APP_PASS || '').replace(/\s+/g, '');

if (!brevoKey && !resendKey && (!smtpUser || !smtpPass)) {
  console.log('❌ STATUS: No Email API or SMTP credentials found in .env');
  console.log('\nYou can activate real email delivery using ANY of these 3 ways:');
  console.log('1. Brevo REST API: Add BREVO_API_KEY=xkeysib-... (Free 300 emails/day to any address)');
  console.log('2. Resend API: Add RESEND_API_KEY=re_...');
  console.log('3. Gmail SMTP: Add SMTP_USER=your-email@gmail.com and SMTP_PASS=xxxx-xxxx-xxxx-xxxx');
  process.exit(1);
}

// Test Brevo API
if (brevoKey) {
  console.log('✓ Found BREVO_API_KEY. Testing Brevo REST API dispatch...');
  try {
    const senderEmail = (process.env.BREVO_SENDER_EMAIL || smtpUser || 'sahakar.gig.auth@gmail.com').trim();
    const res = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': brevoKey,
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        sender: { name: 'SahakarGig Security', email: senderEmail },
        to: [{ email: recipient }],
        subject: `[SahakarGig] ${testOtp} is your test verification passcode`,
        htmlContent: `<h2>SahakarGig Live Email Test</h2><p>Passcode: <b>${testOtp}</b></p>`
      })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || res.statusText);
    console.log('🎉 SUCCESS! Real email dispatched via Brevo API!');
    console.log('Message ID:', data.messageId);
    process.exit(0);
  } catch (err) {
    console.error('❌ Brevo API failed:', err.message);
  }
}

// Test Resend API
if (resendKey) {
  console.log('✓ Found RESEND_API_KEY. Testing Resend REST API dispatch...');
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM || 'SahakarGig <onboarding@resend.dev>',
        to: [recipient],
        subject: `[SahakarGig] ${testOtp} is your test verification passcode`,
        html: `<h2>SahakarGig Live Email Test</h2><p>Passcode: <b>${testOtp}</b></p>`
      })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || res.statusText);
    console.log('🎉 SUCCESS! Real email dispatched via Resend API!');
    console.log('Message ID:', data.id);
    process.exit(0);
  } catch (err) {
    console.error('❌ Resend API failed:', err.message);
  }
}

// Test Gmail SMTP
if (smtpUser && smtpPass) {
  console.log(`✓ Found SMTP credentials for ${smtpUser}. Testing Gmail SMTP...`);
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: smtpUser, pass: smtpPass }
  });

  transporter.sendMail({
    from: `"SahakarGig Security" <${smtpUser}>`,
    to: recipient,
    subject: `[SahakarGig] ${testOtp} is your test verification passcode`,
    html: `<h2>SahakarGig Live Email Test</h2><p>Passcode: <b>${testOtp}</b></p>`
  }, (err, info) => {
    if (err) {
      console.error('❌ Gmail SMTP failed:', err.message);
      if (err.code === 'EAUTH') {
        console.error('Hint: Make sure to use a 16-character Google App Password from https://myaccount.google.com/apppasswords');
      }
      process.exit(1);
    }
    console.log('🎉 SUCCESS! Real email dispatched via Gmail SMTP!');
    console.log('Message ID:', info.messageId);
    process.exit(0);
  });
}
