const sendSuccessResponse = (res, data, statusCode = 200) => {
  res.status(statusCode).json({
    success: true,
    data,
    statusCode,
  });
};

const sendErrorResponse = (res, message, statusCode = 500) => {
  res.status(statusCode).json({
    success: false,
    message,
    statusCode,
  });
};

const sendPaginatedResponse = (res, data, page, limit, total, statusCode = 200) => {
  res.status(statusCode).json({
    success: true,
    data,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
    statusCode,
  });
};

module.exports = {
  sendSuccessResponse,
  sendErrorResponse,
  sendPaginatedResponse,
};