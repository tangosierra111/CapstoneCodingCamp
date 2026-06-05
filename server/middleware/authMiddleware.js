// Authentication Middleware
const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token is required'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if user is soft-deleted
    const user = await UserModel.findById(decoded.studentId);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token (Account inactive)'
      });
    }

    req.userId = decoded.userId;
    req.studentId = decoded.studentId;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};

module.exports = authMiddleware;
