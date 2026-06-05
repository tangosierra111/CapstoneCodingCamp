// User Routes
const express = require('express');
const { body } = require('express-validator');
const UserController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Get profile - GET /api/user/profile
router.get('/profile', UserController.getProfile);

// Update profile - PUT /api/user/update
router.put('/update', [
  body('newPassword')
    .optional()
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('educationLevel')
    .optional()
    .isIn(['SMP', 'SMA']).withMessage('Invalid education level'),
  body('currentPassword')
    .if(() => body('newPassword').notEmpty())
    .notEmpty().withMessage('Current password is required to change password')
], UserController.updateProfile);

// Delete account - DELETE /api/user/delete
router.delete('/delete', UserController.deleteAccount);

module.exports = router;
