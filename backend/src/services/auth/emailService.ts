import nodemailer, { Transporter } from 'nodemailer';
import fs from 'fs';
import path from 'path';
import { env } from '../../config/env';
import { logger } from '../../utils/logger';

let transporter: Transporter | null = null;

// Only create transporter if SMTP is configured
if (env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASS) {
  transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_PORT === 465,
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
  
  transporter.verify((error: Error | null, success: boolean) => {
    if (error) {
      logger.error('Email transporter error:', error);
    } else {
      logger.info('Email service ready');
    }
  });
} else {
  logger.warn('Email service not configured - emails will be logged only');
}

function getEmailTemplate(templateName: string, variables: Record<string, string>): string {
  const templatePath = path.join(__dirname, '../../templates/email', `${templateName}.html`);
  
  try {
    let template = fs.readFileSync(templatePath, 'utf-8');
    
    for (const [key, value] of Object.entries(variables)) {
      template = template.replace(new RegExp(`{{${key}}}`, 'g'), value);
    }
    
    return template;
  } catch (error) {
    logger.error(`Failed to load email template: ${templateName}`, error);
    // Return a simple HTML template as fallback
    return `
      <!DOCTYPE html>
      <html>
      <head><title>${variables.title || 'Email'}</title></head>
      <body>
        <h1>${variables.title || 'Cricket Universe'}</h1>
        <p>${variables.message || 'Please verify your email'}</p>
        <a href="${variables.verificationUrl || variables.resetUrl || '#'}">Click here</a>
      </body>
      </html>
    `;
  }
}

export async function sendVerificationEmail(to: string, token: string): Promise<void> {
  const verificationUrl = `${env.FRONTEND_URL}/verify-email?token=${token}`;
  
  const html = getEmailTemplate('verification', {
    verificationUrl,
    year: new Date().getFullYear().toString(),
  });
  
  await sendEmail({
    to,
    subject: 'Verify Your Email - Cricket Universe',
    html,
  });
}

export async function sendPasswordResetEmail(to: string, token: string): Promise<void> {
  const resetUrl = `${env.FRONTEND_URL}/reset-password?token=${token}`;
  
  const html = getEmailTemplate('reset-password', {
    resetUrl,
    year: new Date().getFullYear().toString(),
  });
  
  await sendEmail({
    to,
    subject: 'Reset Your Password - Cricket Universe',
    html,
  });
}

export async function sendWelcomeEmail(to: string, username: string): Promise<void> {
  const html = getEmailTemplate('welcome', {
    username,
    year: new Date().getFullYear().toString(),
  });
  
  await sendEmail({
    to,
    subject: 'Welcome to Cricket Universe!',
    html,
  });
}

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

async function sendEmail(options: SendEmailOptions): Promise<void> {
  if (!transporter) {
    // Log instead of sending email
    logger.info('Email would be sent:', {
      to: options.to,
      subject: options.subject,
      html: options.html.substring(0, 200),
    });
    return;
  }
  
  try {
    await transporter.sendMail({
      from: options.from || env.EMAIL_FROM,
      to: options.to,
      subject: options.subject,
      html: options.html,
    });
    logger.info(`Email sent to ${options.to}: ${options.subject}`);
  } catch (error) {
    logger.error('Failed to send email:', error);
    // Don't throw error - email failure shouldn't break the app
  }
}