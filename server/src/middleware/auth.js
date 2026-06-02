const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'No access token provided', statusCode: 401 });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'supersecretkey', (err, decoded) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ success: false, message: 'Access token expired', statusCode: 401 });
      }
      return res.status(401).json({ success: false, message: 'Invalid access token', statusCode: 401 });
    }

    req.userId = decoded.id;
    req.user = decoded;
    next();
  });
};

const refreshAccessToken = (req, res, next) => {
  const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ success: false, message: 'No refresh token provided', statusCode: 401 });
  }

  jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || 'refreshsecretkey', (err, decoded) => {
    if (err) {
      return res.status(401).json({ success: false, message: 'Invalid refresh token', statusCode: 401 });
    }

    const newAccessToken = jwt.sign(
      { id: decoded.id },
      process.env.JWT_SECRET || 'supersecretkey',
      { expiresIn: '15m' }
    );

    req.newAccessToken = newAccessToken;
    req.userId = decoded.id;
    next();
  });
};

module.exports = {
  authenticateToken,
  refreshAccessToken,
};