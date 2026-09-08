const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const { authenticateToken } = require('../../middleware/auth');
const asyncHandler = require('../../utils/asyncHandler');
const { sendSuccessResponse, sendErrorResponse } = require('../../utils/response');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

router.use(authenticateToken);

router.get(
  '/profile',
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.userId).select('-password -refreshTokens -emailVerificationToken -passwordResetToken');
    if (!user) {
      return sendErrorResponse(res, 'User not found', 404);
    }
    sendSuccessResponse(res, user, 200);
  })
);

router.put(
  '/profile',
  asyncHandler(async (req, res) => {
    const { firstName, lastName, bio, campus, profilePicture } = req.body;
    const user = await User.findByIdAndUpdate(
      req.userId,
      { firstName, lastName, bio, campus, profilePicture },
      { new: true, runValidators: true }
    ).select('-password -refreshTokens -emailVerificationToken -passwordResetToken');

    sendSuccessResponse(res, user, 200);
  })
);

router.post(
  '/avatar',
  upload.single('avatar'),
  asyncHandler(async (req, res) => {
    if (!req.file) {
      return sendErrorResponse(res, 'No image file provided', 400);
    }

    const b64 = Buffer.from(req.file.buffer).toString('base64');
    const dataURI = `data:${req.file.mimetype};base64,${b64}`;

    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'compasu_avatars',
      transformation: [{ width: 300, height: 300, crop: 'fill' }],
    });

    const user = await User.findByIdAndUpdate(
      req.userId,
      { profilePicture: result.secure_url },
      { new: true }
    ).select('-password -refreshTokens -emailVerificationToken -passwordResetToken');

    sendSuccessResponse(res, { profilePicture: result.secure_url, user }, 200);
  })
);

router.put(
  '/password',
  asyncHandler(async (req, res) => {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return sendErrorResponse(res, 'Current password and new password are required', 400);
    }

    if (newPassword !== confirmPassword) {
      return sendErrorResponse(res, 'Passwords do not match', 400);
    }

    const user = await User.findById(req.userId);
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

    if (!isPasswordValid) {
      return sendErrorResponse(res, 'Current password is incorrect', 401);
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    sendSuccessResponse(res, { message: 'Password updated successfully' }, 200);
  })
);

router.put(
  '/privacy-settings',
  asyncHandler(async (req, res) => {
    const { privacySettings } = req.body;
    const user = await User.findByIdAndUpdate(
      req.userId,
      { privacySettings },
      { new: true, runValidators: true }
    ).select('-password -refreshTokens -emailVerificationToken -passwordResetToken');

    sendSuccessResponse(res, user, 200);
  })
);

router.put(
  '/notification-preferences',
  asyncHandler(async (req, res) => {
    const { notificationPreferences } = req.body;
    const user = await User.findByIdAndUpdate(
      req.userId,
      { notificationPreferences },
      { new: true, runValidators: true }
    ).select('-password -refreshTokens -emailVerificationToken -passwordResetToken');

    sendSuccessResponse(res, user, 200);
  })
);

router.delete(
  '/account',
  asyncHandler(async (req, res) => {
    const { password } = req.body;
    if (!password) {
      return sendErrorResponse(res, 'Password is required', 400);
    }

    const user = await User.findById(req.userId);
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return sendErrorResponse(res, 'Invalid password', 401);
    }

    await User.deleteOne({ _id: req.userId });
    sendSuccessResponse(res, { message: 'Account deleted successfully' }, 200);
  })
);

module.exports = router;