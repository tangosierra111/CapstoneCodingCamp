// User Controller - Handles profile, update, delete
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const UserModel = require('../models/userModel');

class UserController {
  // Get profile
  static async getProfile(req, res) {
    try {
      const { studentId } = req;

      const user = await UserModel.findById(studentId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.json({
        success: true,
        user: {
          studentId: user.student_id,
          firstName: user.first_name,
          lastName: user.last_name,
          email: user.email,
          educationLevel: user.education_level,
          createdAt: user.created_at
        }
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch profile',
        error: err.message
      });
    }
  }

  // Update profile (password and/or education level)
  static async updateProfile(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { studentId } = req;
      const { currentPassword, newPassword, educationLevel } = req.body;

      const user = await UserModel.findById(studentId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // If changing password, verify current password
      if (newPassword) {
        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordValid) {
          return res.status(401).json({
            success: false,
            message: 'Current password is incorrect'
          });
        }
      }

      // Hash new password if provided
      const hashedPassword = newPassword ? await bcrypt.hash(newPassword, 10) : user.password;

      // Update user
      await UserModel.update(studentId, {
        password: hashedPassword,
        educationLevel: educationLevel || user.education_level
      });

      res.json({
        success: true,
        message: 'Profile updated successfully'
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: 'Failed to update profile',
        error: err.message
      });
    }
  }

  // Delete account (soft delete)
  static async deleteAccount(req, res) {
    try {
      const { studentId } = req;

      const user = await UserModel.findById(studentId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // Soft delete
      await UserModel.softDelete(studentId);

      res.json({
        success: true,
        message: 'Account deleted successfully. You can register again with this email after 90 days.'
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: 'Failed to delete account',
        error: err.message
      });
    }
  }
}

module.exports = UserController;
