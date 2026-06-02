const express = require('express');
const router = express.Router();
const notificationService = require('../../services/notificationService');
const { authenticateToken } = require('../../middleware/auth');
const asyncHandler = require('../../utils/asyncHandler');
const { sendSuccessResponse, sendErrorResponse } = require('../../utils/response');

router.use(authenticateToken);

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const { page = 1, limit = 20 } = req.query;
    const result = await notificationService.getNotifications(
      req.userId,
      parseInt(page),
      parseInt(limit)
    );
    sendSuccessResponse(res, result, 200);
  })
);

router.get(
  '/unread',
  asyncHandler(async (req, res) => {
    const result = await notificationService.getUnreadNotifications(req.userId);
    sendSuccessResponse(res, result, 200);
  })
);

router.post(
  '/:notificationId/read',
  asyncHandler(async (req, res) => {
    const result = await notificationService.markAsRead(req.params.notificationId, req.userId);
    sendSuccessResponse(res, result, 200);
  })
);

router.post(
  '/mark-all-read',
  asyncHandler(async (req, res) => {
    const result = await notificationService.markAllAsRead(req.userId);
    sendSuccessResponse(res, result, 200);
  })
);

router.delete(
  '/:notificationId',
  asyncHandler(async (req, res) => {
    const result = await notificationService.deleteNotification(req.params.notificationId, req.userId);
    sendSuccessResponse(res, result, 200);
  })
);

router.get(
  '/unread-count',
  asyncHandler(async (req, res) => {
    const result = await notificationService.getUnreadCount(req.userId);
    sendSuccessResponse(res, result, 200);
  })
);

module.exports = router;