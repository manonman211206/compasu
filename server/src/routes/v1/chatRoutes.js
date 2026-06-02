const express = require('express');
const router = express.Router();
const chatService = require('../../services/chatService');
const { authenticateToken } = require('../../middleware/auth');
const { messageLimiter } = require('../../middleware/rateLimiter');
const asyncHandler = require('../../utils/asyncHandler');
const { sendSuccessResponse, sendErrorResponse } = require('../../utils/response');

router.use(authenticateToken);

router.post(
  '/send',
  messageLimiter,
  asyncHandler(async (req, res) => {
    const { recipientId, content } = req.body;
    if (!recipientId || !content) {
      return sendErrorResponse(res, 'Recipient ID and content are required', 400);
    }
    const result = await chatService.sendMessage(req.userId, recipientId, content);
    sendSuccessResponse(res, result, 201);
  })
);

router.get(
  '/conversation/:otherUserId',
  asyncHandler(async (req, res) => {
    const { page = 1, limit = 50 } = req.query;
    const result = await chatService.getConversation(
      req.userId,
      req.params.otherUserId,
      parseInt(page),
      parseInt(limit)
    );
    sendSuccessResponse(res, result, 200);
  })
);

router.post(
  '/mark-as-read',
  asyncHandler(async (req, res) => {
    const { messageIds } = req.body;
    if (!Array.isArray(messageIds)) {
      return sendErrorResponse(res, 'Message IDs must be an array', 400);
    }
    const result = await chatService.markAsRead(messageIds, req.userId);
    sendSuccessResponse(res, result, 200);
  })
);

router.delete(
  '/:messageId',
  asyncHandler(async (req, res) => {
    const result = await chatService.deleteMessage(req.params.messageId, req.userId);
    sendSuccessResponse(res, result, 200);
  })
);

router.get(
  '/unread-count',
  asyncHandler(async (req, res) => {
    const result = await chatService.getUnreadCount(req.userId);
    sendSuccessResponse(res, result, 200);
  })
);

router.get(
  '/conversations-list',
  asyncHandler(async (req, res) => {
    const result = await chatService.getConversationList(req.userId);
    sendSuccessResponse(res, result, 200);
  })
);

module.exports = router;