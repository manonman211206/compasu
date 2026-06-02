const express = require('express');
const router = express.Router();
const friendService = require('../../services/friendService');
const { authenticateToken } = require('../../middleware/auth');
const asyncHandler = require('../../utils/asyncHandler');
const { sendSuccessResponse, sendErrorResponse } = require('../../utils/response');

router.use(authenticateToken);

router.post(
  '/request/:recipientId',
  asyncHandler(async (req, res) => {
    const result = await friendService.sendFriendRequest(req.userId, req.params.recipientId);
    sendSuccessResponse(res, result, 201);
  })
);

router.post(
  '/accept/:requestId',
  asyncHandler(async (req, res) => {
    const result = await friendService.acceptFriendRequest(req.params.requestId, req.userId);
    sendSuccessResponse(res, result, 200);
  })
);

router.post(
  '/reject/:requestId',
  asyncHandler(async (req, res) => {
    const result = await friendService.rejectFriendRequest(req.params.requestId, req.userId);
    sendSuccessResponse(res, result, 200);
  })
);

router.delete(
  '/:friendId',
  asyncHandler(async (req, res) => {
    const result = await friendService.removeFriend(req.userId, req.params.friendId);
    sendSuccessResponse(res, result, 200);
  })
);

router.post(
  '/block/:blockedUserId',
  asyncHandler(async (req, res) => {
    const result = await friendService.blockUser(req.userId, req.params.blockedUserId);
    sendSuccessResponse(res, result, 200);
  })
);

router.post(
  '/unblock/:blockedUserId',
  asyncHandler(async (req, res) => {
    const result = await friendService.unblockUser(req.userId, req.params.blockedUserId);
    sendSuccessResponse(res, result, 200);
  })
);

router.get(
  '/requests',
  asyncHandler(async (req, res) => {
    const { status = 'pending' } = req.query;
    const result = await friendService.getFriendRequests(req.userId, status);
    sendSuccessResponse(res, result, 200);
  })
);

router.get(
  '/list',
  asyncHandler(async (req, res) => {
    const result = await friendService.getFriends(req.userId);
    sendSuccessResponse(res, result, 200);
  })
);

router.get(
  '/blocked',
  asyncHandler(async (req, res) => {
    const result = await friendService.getBlockedUsers(req.userId);
    sendSuccessResponse(res, result, 200);
  })
);

router.get(
  '/suggestions',
  asyncHandler(async (req, res) => {
    const { limit = 10 } = req.query;
    const result = await friendService.getFriendSuggestions(req.userId, parseInt(limit));
    sendSuccessResponse(res, result, 200);
  })
);

module.exports = router;