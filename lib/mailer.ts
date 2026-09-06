import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

export const RECIPIENT_EMAIL = process.env.RECIPIENT_EMAIL || 'jabirihtisham101@gmail.com';

interface SendMailOptions {
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
  metadata?: Record<string, any>;
  type: 'contact' | 'newsletter';
}

/**
 * Persist every submission to a local file backup so no inquiry is ever lost
 */
function persistSubmission(type: 'contact' | 'newsletter', data: Record<string, any>) {
  try {
    const dirPath = path.join(process.cwd(), 'data', 'submissions');
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    const filePath = path.join(dirPath, `${type}.json`);
    const existing: any[] = fs.existsSync(filePath)
      ? JSON.parse(fs.readFileSync(filePath, 'utf8') || '[]')
      : [];

    existing.unshift({
      timestamp: new Date().toISOString(),
      ...data,
    });

    // Keep up to latest 500 records
    fs.writeFileSync(filePath, JSON.stringify(existing.slice(0, 500), null, 2), 'utf8');
  } catch (err) {
    console.error(`[Mailer] Error persisting ${type} submission:`, err);
  }
}

/**
 * Send an email notification to the site owner (jabirihtisham101@gmail.com)
 */
export async function sendEmailNotification(options: SendMailOptions): Promise<{ success: boolean; mode: string; error?: string }> {
  const { subject, html, text, replyTo, metadata = {}, type } = options;

  // 1. Always record in local persistence backup
  persistSubmission(type, { subject, replyTo, ...metadata });

  const gmailUser = process.env.GMAIL_USER || RECIPIENT_EMAIL;
  const gmailPass = process.env.GMAIL_APP_PASSWORD || process.env.SMTP_PASS;
  const web3FormsKey = process.env.WEB3FORMS_ACCESS_KEY;

  // 2. Direct Gmail SMTP via Nodemailer
  if (gmailPass) {
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: gmailUser,
          pass: gmailPass,
        },
      });

      await transporter.sendMail({
        from: `"Grow Here Notifications" <${gmailUser}>`,
        to: RECIPIENT_EMAIL,
        replyTo: replyTo || gmailUser,
        subject,
        text,
        html,
      });

      console.log(`[Mailer] Successfully sent ${type} email via Gmail SMTP to ${RECIPIENT_EMAIL}`);
      return { success: true, mode: 'gmail-smtp' };
    } catch (err: any) {
      console.error('[Mailer] Gmail SMTP delivery failed:', err?.message || err);
      // Fall through to other delivery methods or persisted mode
    }
  }

  // 3. Web3Forms fallback (if configured)
  if (web3FormsKey) {
    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: web3FormsKey,
          to: RECIPIENT_EMAIL,
          subject,
          from_name: 'Grow Here Web Dispatch',
          reply_to: replyTo,
          message: text,
          ...metadata,
        }),
      });

      if (response.ok) {
        console.log(`[Mailer] Successfully forwarded ${type} via Web3Forms to ${RECIPIENT_EMAIL}`);
        return { success: true, mode: 'web3forms' };
      }
    } catch (err: any) {
      console.error('[Mailer] Web3Forms fallback failed:', err?.message || err);
    }
  }

  // 4. Log development notice when credentials are not yet configured
  console.log(`\n======================================================`);
  console.log(`📧 [NEW GROW HERE ${type.toUpperCase()} SUBMISSION]`);
  console.log(`To: ${RECIPIENT_EMAIL}`);
  console.log(`Subject: ${subject}`);
  if (replyTo) console.log(`Reply-To: ${replyTo}`);
  console.log(`Details:`, JSON.stringify(metadata, null, 2));
  console.log(`Saved locally in: data/submissions/${type}.json`);
  if (!gmailPass) {
    console.log(`ℹ️ [ACTION REQUIRED TO RECEIVE IN GMAIL INBOX]:`);
    console.log(`To receive live emails in ${RECIPIENT_EMAIL}, create a .env.local file:`);
    console.log(`GMAIL_USER="${RECIPIENT_EMAIL}"`);
    console.log(`GMAIL_APP_PASSWORD="your-16-character-google-app-password"`);
  }
  console.log(`======================================================\n`);

  return {
    success: true,
    mode: 'persisted',
  };
}
