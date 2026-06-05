// Auth Controller - Handles registration, login, logout
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const UserModel = require('../models/userModel');

class AuthController {
  // Register
  static async register(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { firstName, lastName, email, password, educationLevel } = req.body;

      // Check if email already exists
      const existingUser = await UserModel.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Email already registered'
        });
      }

      // Check if email was deleted less than 90 days ago
      const deletionDaysPassed = await UserModel.checkEmailDeleted(email);
      if (deletionDaysPassed !== null) {
        return res.status(400).json({
          success: false,
          message: `Email cannot be reused yet. Try again in ${90 - deletionDaysPassed} days`
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const studentId = await UserModel.create({
        firstName,
        lastName,
        email,
        hashedPassword,
        educationLevel
      });

      // Generate JWT token
      const token = jwt.sign(
        { userId: studentId, studentId },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE || '7d' }
      );

      res.status(201).json({
        success: true,
        message: 'Registration successful',
        token,
        user: {
          studentId,
          firstName,
          lastName,
          email,
          educationLevel
        }
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: 'Registration failed',
        error: err.message
      });
    }
  }

  // Login
  static async login(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { email, password } = req.body;

      // Find user by email
      const user = await UserModel.findByEmail(email);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Email or password is incorrect'
        });
      }

      // Check if account is deleted
      if (user.deleted_at) {
        return res.status(401).json({
          success: false,
          message: 'This account has been deleted'
        });
      }

      // Compare password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Email or password is incorrect'
        });
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.student_id, studentId: user.student_id },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE || '7d' }
      );

      res.json({
        success: true,
        message: 'Login successful',
        token,
        user: {
          studentId: user.student_id,
          firstName: user.first_name,
          lastName: user.last_name,
          email: user.email,
          educationLevel: user.education_level
        }
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: 'Login failed',
        error: err.message
      });
    }
  }

  // Logout (client-side token invalidation)
  static async logout(req, res) {
    try {
      res.json({
        success: true,
        message: 'Logout successful. Please remove the token from client storage.'
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: 'Logout failed',
        error: err.message
      });
    }
  }
}

module.exports = AuthController;
