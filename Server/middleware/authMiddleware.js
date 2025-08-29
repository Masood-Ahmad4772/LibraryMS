const jwt = require('jsonwebtoken');
const {Signup} = require('../models/userModels');

const authMiddleware = async (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({message: 'Access denied. No token provided.'});
  const accessToken = token.replace('Bearer ', '');
  try {
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
    req.user = decoded;
    await updateLastActive(decoded.userId);
    return next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return refreshAccessToken(req, res, next);
    }
    return res.status(401).json({message: 'Invalid token'});
  }
};

// Refresh the access token
const refreshAccessToken = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.status(401).json({message: 'Refresh Token required'});

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    const user = await Signup.findById(decoded.userId);

    // Check if user has been inactive for more than 1 hour
    const now = new Date();
    const lastActive = new Date(user.lastActive);
    const inactiveTime = (now - lastActive) / (1000 * 60); // Convert to minutes

    if (inactiveTime > 60) {
      return res.status(401).json({message: 'Session expired due to inactivity. Please log in again.'});
    }

    // Generate new Access Token
    const newAccessToken = jwt.sign({userId: user._id}, process.env.JWT_SECRET, {expiresIn: '1h'});

    req.user = {userId: user._id};
    res.setHeader('x-new-access-token', newAccessToken);
    await updateLastActive(user._id);
    return next();
  } catch (err) {
    return res.status(401).json({message: 'Invalid refresh token'});
  }
};

// Update user's last activity timestamp
const updateLastActive = async (userId) => {
  await Signup.findByIdAndUpdate(userId, {lastActive: new Date()});
};

module.exports = {authMiddleware};
