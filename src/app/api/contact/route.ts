import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
  try {
    const { name, email, subject, message } = await req.json();

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Create transporter — configure with your SMTP credentials
    // For production, set these environment variables:
    //   SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASS || '',
      },
    });

    // Build the email
    const mailOptions = {
      from: `"BlazeUp Contact Form" <${process.env.SMTP_USER || 'noreply@blazeup.app'}>`,
      to: 'contact@blazeup.app',
      replyTo: email,
      subject: `[BlazeUp Contact] ${subject}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #0f0f0f; color: #fff; border-radius: 12px;">
          <div style="border-bottom: 2px solid #1a1a1a; padding-bottom: 20px; margin-bottom: 24px;">
            <h2 style="margin: 0; font-size: 22px; color: #ff6b35;">New Contact Form Submission</h2>
          </div>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px 0; color: #888; font-size: 13px; width: 80px; vertical-align: top;">Name</td>
              <td style="padding: 10px 0; color: #fff; font-size: 15px;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #888; font-size: 13px; vertical-align: top;">Email</td>
              <td style="padding: 10px 0; color: #fff; font-size: 15px;"><a href="mailto:${email}" style="color: #3b82f6;">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #888; font-size: 13px; vertical-align: top;">Subject</td>
              <td style="padding: 10px 0; color: #fff; font-size: 15px;">${subject}</td>
            </tr>
          </table>
          <div style="margin-top: 20px; padding: 20px; background: #1a1a1a; border-radius: 8px; border-left: 3px solid #ff6b35;">
            <p style="margin: 0 0 8px 0; color: #888; font-size: 13px;">Message</p>
            <p style="margin: 0; color: #e5e7eb; font-size: 15px; line-height: 1.7; white-space: pre-wrap;">${message}</p>
          </div>
          <p style="margin-top: 24px; color: #555; font-size: 12px;">Sent from blazeup.app contact form</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to send email. Please try again later.' },
      { status: 500 }
    );
  }
}
