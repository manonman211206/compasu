const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const logger = require('../utils/logger');
const crypto = require('crypto');
const { sendVerificationEmail, sendPasswordResetEmail } = require('../utils/email');

class AuthService {
  async register(username, email, password, confirmPassword) {
    if (password !== confirmPassword) {
      throw new Error('Passwords do not match');
    }

    const existingUser = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { username }],
    });

    if (existingUser) {
      throw new Error('User with this email or username already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const emailVerificationToken = crypto.randomBytes(32).toString('hex');
    const emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const user = new User({
      username,
      email: email.toLowerCase(),
      password: hashedPassword,
      emailVerificationToken,
      emailVerificationExpires,
    });

    await user.save();

    logger.info(`New user registered: ${email}`);

    // Send verification email asynchronously
    sendVerificationEmail(user.email, emailVerificationToken).catch((err) =>
      logger.error('Background verification email failed: ' + err.message)
    );

    return {
      id: user._id,
      username: user.username,
      email: user.email,
      message: 'Registration successful. Please verify your email.',
    };
  }

  async login(email, password) {
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    const accessToken = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET || 'supersecretkey',
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.JWT_REFRESH_SECRET || 'refreshsecretkey',
      { expiresIn: '7d' }
    );

    user.refreshTokens.push({
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    user.lastActive = new Date();
    await user.save();

    logger.info(`User logged in: ${email}`);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        profilePicture: user.profilePicture,
      },
    };
  }

  async refreshToken(refreshToken) {
    try {
      const decoded = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET || 'refreshsecretkey'
      );

      const user = await User.findById(decoded.id);
      if (!user) {
        throw new Error('User not found');
      }

      const tokenExists = user.refreshTokens.some((rt) => rt.token === refreshToken);
      if (!tokenExists) {
        throw new Error('Refresh token not found');
      }

      const newAccessToken = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET || 'supersecretkey',
        { expiresIn: '15m' }
      );

      return {
        accessToken: newAccessToken,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
        },
      };
    } catch (error) {
      logger.error('Refresh token error: ' + error.message);
      throw new Error('Invalid refresh token');
    }
  }

  async logout(userId, refreshToken) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    user.refreshTokens = user.refreshTokens.filter((rt) => rt.token !== refreshToken);
    await user.save();

    logger.info(`User logged out: ${user.email}`);

    return { message: 'Logged out successfully' };
  }

  async requestPasswordReset(email) {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      // Don't reveal if user exists
      return { message: 'If user exists, reset email has been sent' };
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');

    user.passwordResetToken = resetTokenHash;
    user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000);
    await user.save();

    logger.info(`Password reset requested for: ${email}`);

    // Send password reset email asynchronously
    sendPasswordResetEmail(user.email, resetToken).catch((err) =>
      logger.error('Background password reset email failed: ' + err.message)
    );

    return {
      message: 'If user exists, reset email has been sent',
    };
  }

  async resetPassword(resetToken, newPassword, confirmPassword) {
    if (newPassword !== confirmPassword) {
      throw new Error('Passwords do not match');
    }

    const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');

    const user = await User.findOne({
      passwordResetToken: resetTokenHash,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      throw new Error('Invalid or expired reset token');
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.passwordResetToken = null;
    user.passwordResetExpires = null;

    await user.save();

    logger.info(`Password reset for: ${user.email}`);

    return { message: 'Password reset successfully' };
  }

  async verifyEmail(token) {
    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: Date.now() },
    });

    if (!user) {
      throw new Error('Invalid or expired verification token');
    }

    user.emailVerified = true;
    user.emailVerificationToken = null;
    user.emailVerificationExpires = null;

    await user.save();

    logger.info(`Email verified for: ${user.email}`);

    return { message: 'Email verified successfully' };
  }
}

module.exports = new AuthService();