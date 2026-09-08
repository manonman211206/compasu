const nodemailer = require('nodemailer');
const logger = require('./logger');

const createTransporter = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    logger.warn('Email credentials not configured in .env. Emails will be logged to console.');
    return null;
  }

  return nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

const sendVerificationEmail = async (email, token) => {
  const transporter = createTransporter();
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  const verifyUrl = `${clientUrl}/verify-email?token=${token}`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; rounded: 8px;">
      <h2 style="color: #4f46e5; text-align: center;">Welcome to Compasu!</h2>
      <p>Thank you for registering. Please click the button below to verify your email address:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${verifyUrl}" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Verify Email</a>
      </div>
      <p style="color: #666; font-size: 14px;">If the button doesn't work, copy and paste this link into your browser:</p>
      <p style="color: #4f46e5; font-size: 14px; word-break: break-all;">${verifyUrl}</p>
    </div>
  `;

  if (!transporter) {
    logger.info(`[MOCK EMAIL] Verification email to ${email}: ${verifyUrl}`);
    return;
  }

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"Compasu" <noreply@compasu.com>',
      to: email,
      subject: 'Compasu - Verify Your Email Address',
      html,
    });
    logger.info(`Verification email sent to ${email}`);
  } catch (error) {
    logger.error(`Failed to send verification email to ${email}: ${error.message}`);
  }
};

const sendPasswordResetEmail = async (email, token) => {
  const transporter = createTransporter();
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  const resetUrl = `${clientUrl}/reset-password?token=${token}`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; rounded: 8px;">
      <h2 style="color: #4f46e5; text-align: center;">Password Reset Request</h2>
      <p>You requested a password reset for your Compasu account. Click the button below to set a new password:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetUrl}" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Reset Password</a>
      </div>
      <p style="color: #666; font-size: 14px;">This link will expire in 1 hour. If you did not request this, please ignore this email.</p>
      <p style="color: #4f46e5; font-size: 14px; word-break: break-all;">${resetUrl}</p>
    </div>
  `;

  if (!transporter) {
    logger.info(`[MOCK EMAIL] Password reset email to ${email}: ${resetUrl}`);
    return;
  }

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"Compasu" <noreply@compasu.com>',
      to: email,
      subject: 'Compasu - Password Reset Request',
      html,
    });
    logger.info(`Password reset email sent to ${email}`);
  } catch (error) {
    logger.error(`Failed to send password reset email to ${email}: ${error.message}`);
  }
};

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail,
};
