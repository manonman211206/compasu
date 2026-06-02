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

module.exports = router;