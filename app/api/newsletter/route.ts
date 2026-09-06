import { NextResponse } from 'next/server';
import { sendEmailNotification, RECIPIENT_EMAIL } from '@/lib/mailer';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    // Validation
    if (!email?.trim()) {
      return NextResponse.json(
        { error: 'Please provide an email address.' },
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

    const safeEmail = email.trim();
    const formattedDate = new Date().toLocaleString('en-US', {
      timeZone: 'UTC',
      dateStyle: 'full',
      timeStyle: 'medium',
    });

    const emailSubject = `[Grow Here] New Newsletter Subscriber: ${safeEmail}`;

    const textContent = `
New Newsletter Subscription on Grow Here!

Subscriber: ${safeEmail}
Source: Homepage "Join Grow Here" Editorial Dispatch
Date: ${formattedDate} UTC

To send an email directly to this subscriber, reply to this notification.
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
    .content { padding: 32px 28px; text-align: center; }
    .badge { display: inline-block; background-color: #FAF3DC; color: #785A10; font-size: 11px; font-weight: 600; text-transform: uppercase; padding: 4px 14px; border-radius: 20px; letter-spacing: 0.08em; }
    h2 { color: #061A14; font-size: 22px; margin: 16px 0 8px; font-weight: 600; }
    p { color: #556B5D; font-size: 14px; line-height: 1.6; margin: 0 0 24px; }
    .subscriber-card { background: #f9faf7; border: 1px solid #e6ece4; border-radius: 12px; padding: 20px; margin: 20px auto; max-width: 440px; text-align: left; }
    .field-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #edf1eb; font-size: 13px; }
    .field-row:last-child { border-bottom: none; }
    .field-label { color: #7b8d81; font-weight: 600; text-transform: uppercase; font-size: 11px; }
    .field-value { color: #061A14; font-weight: 500; }
    .cta-btn { display: inline-block; background-color: #E8C75A; color: #04120D; font-weight: bold; font-size: 13px; text-decoration: none; padding: 12px 28px; border-radius: 30px; text-transform: uppercase; letter-spacing: 0.05em; margin-top: 16px; }
    .footer { background: #fafaf7; padding: 20px 24px; font-size: 11px; color: #88998d; text-align: center; border-top: 1px solid #eef0ea; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 class="logo">GROW HERE</h1>
      <div class="tagline">Weekly Editorial Dispatch</div>
    </div>
    <div class="content">
      <span class="badge">🌱 New Subscriber</span>
      <h2>Someone joined Grow Here!</h2>
      <p>A new reader has subscribed to the weekly editorial dispatch.</p>
      
      <div class="subscriber-card">
        <div class="field-row">
          <span class="field-label">Subscriber Email</span>
          <span class="field-value"><strong>${safeEmail}</strong></span>
        </div>
        <div class="field-row">
          <span class="field-label">Source</span>
          <span class="field-value">Homepage "Join Grow Here" CTA</span>
        </div>
        <div class="field-row">
          <span class="field-label">Date &amp; Time</span>
          <span class="field-value">${formattedDate} UTC</span>
        </div>
      </div>

      <a href="mailto:${safeEmail}?subject=Welcome%20to%20Grow%20Here" class="cta-btn">Send Welcome Note to ${safeEmail}</a>
    </div>
    <div class="footer">
      Sent to ${RECIPIENT_EMAIL} &bull; Grow Here Community Updates<br/>
      Practical ideas for greener spaces, smarter homes, lower energy use, and mindful living.
    </div>
  </div>
</body>
</html>
    `.trim();

    const result = await sendEmailNotification({
      type: 'newsletter',
      subject: emailSubject,
      html: htmlContent,
      text: textContent,
      replyTo: safeEmail,
      metadata: {
        email: safeEmail,
        source: 'Homepage Newsletter Section',
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Thank you for joining Grow Here.',
      mode: result.mode,
    });
  } catch (error: any) {
    console.error('[API /api/newsletter] Error processing subscription:', error);
    return NextResponse.json(
      { error: 'An error occurred while joining the newsletter. Please try again.' },
      { status: 500 }
    );
  }
}
