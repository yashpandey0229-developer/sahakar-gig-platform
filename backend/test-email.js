import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const recipient = process.argv[2] || process.env.SMTP_USER;

console.log('--- SahakarGig Email Authenticator Diagnostics ---');
const user = (process.env.SMTP_USER || process.env.GMAIL_USER || '').trim();
const pass = (process.env.SMTP_PASS || process.env.GMAIL_APP_PASS || process.env.GMAIL_PASSWORD || '').replace(/\s+/g, '');

if (!user || !pass) {
  console.log('❌ STATUS: SMTP credentials NOT set in backend/.env');
  console.log('To send real emails to ANY address (including Sir):');
  console.log('1. Add SMTP_USER=your-email@gmail.com');
  console.log('2. Add SMTP_PASS=your-16-char-app-password');
  process.exit(1);
}

console.log(`✓ Sender configured: ${user}`);
console.log(`Sending test email to: ${recipient}...`);

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user, pass }
});

const testOtp = Math.floor(100000 + Math.random() * 900000).toString();

transporter.sendMail({
  from: `"SahakarGig Security" <${user}>`,
  to: recipient,
  subject: `[SahakarGig] ${testOtp} is your test verification passcode`,
  html: `
    <div style="font-family: sans-serif; padding: 20px; text-align: center;">
      <h2>SahakarGig Live Email Test</h2>
      <p>This confirms that real emails can be delivered to ANY recipient in the world!</p>
      <div style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #1B4D3E; padding: 20px; background: #f0fdf4; border-radius: 12px; margin: 20px 0;">
        ${testOtp}
      </div>
    </div>
  `
}, (err, info) => {
  if (err) {
    console.error('❌ Failed to send email:', err.message);
    if (err.code === 'EAUTH') {
      console.error('Hint: Gmail authentication failed. Make sure you generated an App Password from https://myaccount.google.com/apppasswords');
    }
    process.exit(1);
  }
  console.log('🎉 SUCCESS! Real email dispatched successfully!');
  console.log('Message ID:', info.messageId);
});
