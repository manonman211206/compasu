const express = require('express');
const router = express.Router();
const authService = require('../../services/authService');
const { authenticateToken, refreshAccessToken } = require('../../middleware/auth');
const { validateRegisterInput, validateLoginInput } = require('../../middleware/validation');
const { authLimiter } = require('../../middleware/rateLimiter');
const asyncHandler = require('../../utils/asyncHandler');
const { sendSuccessResponse, sendErrorResponse } = require('../../utils/response');

router.post(
  '/register',
  authLimiter,
  validateRegisterInput,
  asyncHandler(async (req, res) => {
    const { username, email, password, confirmPassword } = req.body;
    const result = await authService.register(username, email, password, confirmPassword);
    sendSuccessResponse(res, result, 201);
  })
);

router.post(
  '/login',
  authLimiter,
  validateLoginInput,
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    sendSuccessResponse(res, result, 200);
  })
);

router.post(
  '/refresh-token',
  refreshAccessToken,
  asyncHandler(async (req, res) => {
    sendSuccessResponse(res, { accessToken: req.newAccessToken }, 200);
  })
);

router.post(
  '/logout',
  authenticateToken,
  asyncHandler(async (req, res) => {
    const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
    await authService.logout(req.userId, refreshToken);
    res.clearCookie('refreshToken');
    sendSuccessResponse(res, { message: 'Logged out successfully' }, 200);
  })
);

router.post(
  '/forgot-password',
  asyncHandler(async (req, res) => {
    const { email } = req.body;
    if (!email) {
      return sendErrorResponse(res, 'Email is required', 400);
    }
    const result = await authService.requestPasswordReset(email);
    sendSuccessResponse(res, result, 200);
  })
);

router.post(
  '/reset-password',
  asyncHandler(async (req, res) => {
    const { resetToken, password, confirmPassword } = req.body;
    if (!resetToken || !password) {
      return sendErrorResponse(res, 'Reset token and password are required', 400);
    }
    const result = await authService.resetPassword(resetToken, password, confirmPassword);
    sendSuccessResponse(res, result, 200);
  })
);

router.post(
  '/verify-email',
  asyncHandler(async (req, res) => {
    const { token } = req.body;
    if (!token) {
      return sendErrorResponse(res, 'Verification token is required', 400);
    }
    const result = await authService.verifyEmail(token);
    sendSuccessResponse(res, result, 200);
  })
);

router.get(
  '/me',
  authenticateToken,
  asyncHandler(async (req, res) => {
    sendSuccessResponse(
      res,
      {
        userId: req.userId,
        user: req.user,
      },
      200
    );
  })
);

module.exports = router;