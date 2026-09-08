const express = require('express');
const router = express.Router();
const locationService = require('../../services/locationService');
const { authenticateToken } = require('../../middleware/auth');
const asyncHandler = require('../../utils/asyncHandler');
const { sendSuccessResponse, sendErrorResponse } = require('../../utils/response');

router.use(authenticateToken);

router.post(
  '/update',
  asyncHandler(async (req, res) => {
    const { latitude, longitude, accuracy, address } = req.body;
    if (latitude === undefined || longitude === undefined) {
      return sendErrorResponse(res, 'Latitude and longitude are required', 400);
    }
    const result = await locationService.updateLocation(
      req.userId,
      parseFloat(latitude),
      parseFloat(longitude),
      accuracy,
      address
    );
    sendSuccessResponse(res, result, 200);
  })
);

router.post(
  '/stop-sharing',
  asyncHandler(async (req, res) => {
    const result = await locationService.stopSharingLocation(req.userId);
    sendSuccessResponse(res, result, 200);
  })
);

router.post(
  '/start-sharing',
  asyncHandler(async (req, res) => {
    const result = await locationService.startSharingLocation(req.userId);
    sendSuccessResponse(res, result, 200);
  })
);

router.get(
  '/friends',
  asyncHandler(async (req, res) => {
    const result = await locationService.getFriendLocations(req.userId);
    sendSuccessResponse(res, result, 200);
  })
);

router.get(
  '/nearby',
  asyncHandler(async (req, res) => {
    const { radius = 5000 } = req.query;
    const result = await locationService.getNearbyFriends(req.userId, parseInt(radius));
    sendSuccessResponse(res, result, 200);
  })
);

router.get(
  '/:userId',
  asyncHandler(async (req, res) => {
    const result = await locationService.getUserLocation(req.params.userId);
    sendSuccessResponse(res, result, 200);
  })
);

// --- Meeting Point Routes ---
router.post(
  '/meeting-point',
  asyncHandler(async (req, res) => {
    const { latitude, longitude, title, address, description, groupId } = req.body;
    if (latitude === undefined || longitude === undefined) {
      return sendErrorResponse(res, 'Latitude and longitude are required for meeting point', 400);
    }

    const result = await locationService.setMeetingPoint(
      req.userId,
      parseFloat(latitude),
      parseFloat(longitude),
      title,
      address,
      description,
      groupId
    );
    sendSuccessResponse(res, result, 201);
  })
);

router.get(
  '/meeting-point/active',
  asyncHandler(async (req, res) => {
    const { groupId = 'default-campus-session' } = req.query;
    const result = await locationService.getActiveMeetingPoint(groupId);
    sendSuccessResponse(res, result, 200);
  })
);

router.delete(
  '/meeting-point/active',
  asyncHandler(async (req, res) => {
    const { groupId = 'default-campus-session' } = req.query;
    const result = await locationService.clearMeetingPoint(groupId);
    sendSuccessResponse(res, result, 200);
  })
);

module.exports = router;