import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

type RegistrationPayload = {
  email?: string;
  fullName?: string;
  userType?: string;
  metadata?: Record<string, unknown>;
};

const OWNER_EMAIL = process.env.REGISTRATION_ALERT_EMAIL || 'js.sepanta@gmail.com';
const EMAIL_FROM = process.env.EMAIL_FROM || process.env.SMTP_USER || OWNER_EMAIL;

function ensureEmailConfiguration() {
  const requiredVars = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS'] as const;
  const missing = requiredVars.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    console.error(
      '❌ Email notification skipped – missing SMTP configuration:',
      missing.join(', ')
    );
    return {
      ok: false,
      error: `SMTP configuration is incomplete. Missing: ${missing.join(', ')}`,
    } as const;
  }

  return { ok: true } as const;
}

function createTransport() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

export async function POST(request: Request) {
  try {
    const body: RegistrationPayload = await request.json();
    const { email, fullName, userType = 'student', metadata } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'email is required' },
        { status: 400 }
      );
    }

    const configStatus = ensureEmailConfiguration();
    if (!configStatus.ok) {
      return NextResponse.json(
        { error: configStatus.error },
        { status: 500 }
      );
    }

    const transporter = createTransport();
    const roleLabel = userType === 'teacher' ? 'معلم' : 'دانش‌آموز';
    const subject = `ثبت‌نام جدید ${roleLabel}: ${email}`;

    const metadataContent =
      metadata && Object.keys(metadata).length > 0
        ? `<pre style="background:#f5f5f5;padding:12px;border-radius:8px;font-size:13px;line-height:1.4;direction:ltr;overflow:auto;">${JSON.stringify(
            metadata,
            null,
            2
          )}</pre>`
        : '';

    await transporter.sendMail({
      from: EMAIL_FROM,
      to: OWNER_EMAIL,
      subject,
      text: [
        `یک ${roleLabel} جدید ثبت‌نام کرده است.`,
        `نام کامل: ${fullName || 'نامشخص'}`,
        `ایمیل: ${email}`,
        `نوع کاربر: ${userType}`,
        metadata
          ? `اطلاعات تکمیلی:\n${JSON.stringify(metadata, null, 2)}`
          : undefined,
      ]
        .filter(Boolean)
        .join('\n'),
      html: `
        <div style="font-family:Arial, sans-serif; direction:rtl; text-align:right;">
          <h2 style="color:#2b3a67;">ثبت‌نام جدید ${roleLabel}</h2>
          <p><strong>نام کامل:</strong> ${fullName || 'نامشخص'}</p>
          <p><strong>ایمیل:</strong> <a href="mailto:${email}" style="color:#1d4ed8;">${email}</a></p>
          <p><strong>نوع کاربر:</strong> ${userType}</p>
          ${metadataContent}
          <hr style="margin:16px 0;border:none;border-top:1px solid #e5e7eb;" />
          <p style="font-size:12px;color:#6b7280;direction:ltr;text-align:left;">
            این پیام به صورت خودکار از سامانه ثبت‌نام آکادمی ارسال شده است.
          </p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('💥 Failed to send owner registration email:', error);
    return NextResponse.json(
      { error: 'Failed to send notification email' },
      { status: 500 }
    );
  }
}

