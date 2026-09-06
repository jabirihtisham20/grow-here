import { NextResponse } from 'next/server';
import { sendEmailNotification, RECIPIENT_EMAIL } from '@/lib/mailer';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, topic, subject, message } = body;

    // Validation
    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json(
        { error: 'Please provide name, email, and message.' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    const safeName = name.trim();
    const safeEmail = email.trim();
    const safeTopic = topic?.trim() || 'General Question';
    const safeSubject = subject?.trim() || safeTopic;
    const safeMessage = message.trim();
    const formattedDate = new Date().toLocaleString('en-US', {
      timeZone: 'UTC',
      dateStyle: 'full',
      timeStyle: 'medium',
    });

    const emailSubject = `[Grow Here Contact] ${safeSubject} — from ${safeName}`;

    const textContent = `
New Contact Inquiry Received on Grow Here

From: ${safeName} (${safeEmail})
Topic: ${safeTopic}
Subject: ${safeSubject}
Date: ${formattedDate} UTC

Message:
----------------------------------------
${safeMessage}
----------------------------------------

You can reply directly to this email to respond to ${safeName}.
    `.trim();

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f5ef; color: #164B38; margin: 0; padding: 24px; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e0e5de; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
    .header { background-color: #061A14; padding: 32px 24px; text-align: center; border-bottom: 3px solid #E8C75A; }
    .logo { color: #FAF9F5; font-size: 24px; font-weight: bold; letter-spacing: 0.15em; text-transform: uppercase; margin: 0; }
    .tagline { color: #E8C75A; font-size: 11px; text-transform: uppercase; letter-spacing: 0.2em; margin-top: 6px; }
    .content { padding: 32px 28px; }
    .badge { display: inline-block; background-color: #EBF3E8; color: #1D6548; font-size: 11px; font-weight: 600; text-transform: uppercase; padding: 4px 12px; border-radius: 20px; letter-spacing: 0.05em; }
    h2 { color: #061A14; font-size: 20px; margin: 16px 0 20px; font-weight: 600; }
    .field-table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
    .field-table td { padding: 10px 12px; border-bottom: 1px solid #f0f2ed; font-size: 14px; }
    .field-label { width: 120px; color: #66786c; font-weight: 600; text-transform: uppercase; font-size: 11px; letter-spacing: 0.05em; }
    .field-value { color: #0c271e; }
    .message-box { background: #fafaf7; border-left: 4px solid #79A96B; border-radius: 4px; padding: 16px 18px; margin: 20px 0; font-size: 14px; line-height: 1.6; color: #1a2e24; white-space: pre-wrap; }
    .cta-btn { display: inline-block; background-color: #E8C75A; color: #04120D; font-weight: bold; font-size: 13px; text-decoration: none; padding: 12px 24px; border-radius: 30px; text-transform: uppercase; letter-spacing: 0.05em; margin-top: 12px; }
    .footer { background: #fafaf7; padding: 20px 24px; font-size: 11px; color: #88998d; text-align: center; border-top: 1px solid #eef0ea; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 class="logo">GROW HERE</h1>
      <div class="tagline">Editorial &amp; Community Dispatch</div>
    </div>
    <div class="content">
      <span class="badge">${safeTopic}</span>
      <h2>New Contact Submission</h2>
      
      <table class="field-table">
        <tr>
          <td class="field-label">Sender</td>
          <td class="field-value"><strong>${safeName}</strong></td>
        </tr>
        <tr>
          <td class="field-label">Email</td>
          <td class="field-value"><a href="mailto:${safeEmail}" style="color:#1D6548;">${safeEmail}</a></td>
        </tr>
        <tr>
          <td class="field-label">Topic</td>
          <td class="field-value">${safeTopic}</td>
        </tr>
        <tr>
          <td class="field-label">Subject</td>
          <td class="field-value">${safeSubject}</td>
        </tr>
        <tr>
          <td class="field-label">Date</td>
          <td class="field-value">${formattedDate} UTC</td>
        </tr>
      </table>

      <div style="font-size: 12px; font-weight: bold; color: #66786c; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px;">Message</div>
      <div class="message-box">${safeMessage}</div>

      <div style="text-align: center; margin-top: 24px;">
        <a href="mailto:${safeEmail}?subject=Re: ${encodeURIComponent(safeSubject)}" class="cta-btn">Reply to ${safeName}</a>
      </div>
    </div>
    <div class="footer">
      Sent to ${RECIPIENT_EMAIL} from the Grow Here Contact Form.<br/>
      Grow Here &bull; Practical ideas for greener spaces, smarter homes, and mindful living.
    </div>
  </div>
</body>
</html>
    `.trim();

    const result = await sendEmailNotification({
      type: 'contact',
      subject: emailSubject,
      html: htmlContent,
      text: textContent,
      replyTo: safeEmail,
      metadata: {
        name: safeName,
        email: safeEmail,
        topic: safeTopic,
        subject: safeSubject,
        message: safeMessage,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Your message has been sent successfully.',
      mode: result.mode,
    });
  } catch (error: any) {
    console.error('[API /api/contact] Error processing submission:', error);
    return NextResponse.json(
      { error: 'An error occurred while submitting your message. Please try again.' },
      { status: 500 }
    );
  }
}
