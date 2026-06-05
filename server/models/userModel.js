// User Model - Database queries for users table
const pool = require('../config/db');

class UserModel {
  static async findByEmail(email) {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );
      return rows[0] || null;
    } catch (err) {
      throw err;
    }
  }

  static async findById(studentId) {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM users WHERE student_id = ? AND deleted_at IS NULL',
        [studentId]
      );
      return rows[0] || null;
    } catch (err) {
      throw err;
    }
  }

  static async create(userData) {
    try {
      const { firstName, lastName, email, hashedPassword, educationLevel } = userData;
      const [result] = await pool.query(
        'INSERT INTO users (first_name, last_name, email, password, education_level) VALUES (?, ?, ?, ?, ?)',
        [firstName, lastName, email, hashedPassword, educationLevel]
      );
      return result.insertId;
    } catch (err) {
      throw err;
    }
  }

  static async update(studentId, updateData) {
    try {
      const { password, educationLevel } = updateData;
      const [result] = await pool.query(
        'UPDATE users SET password = ?, education_level = ? WHERE student_id = ?',
        [password, educationLevel, studentId]
      );
      return result.affectedRows > 0;
    } catch (err) {
      throw err;
    }
  }

  static async softDelete(studentId) {
    try {
      const [result] = await pool.query(
        'UPDATE users SET deleted_at = NOW() WHERE student_id = ?',
        [studentId]
      );
      return result.affectedRows > 0;
    } catch (err) {
      throw err;
    }
  }

  static async checkEmailDeleted(email) {
    try {
      const [rows] = await pool.query(
        'SELECT deleted_at FROM users WHERE email = ? AND deleted_at IS NOT NULL',
        [email]
      );
      if (rows.length === 0) return null;
      
      const deletedAt = new Date(rows[0].deleted_at);
      const now = new Date();
      const daysPassed = Math.floor((now - deletedAt) / (1000 * 60 * 60 * 24));
      
      return daysPassed < 90 ? daysPassed : null;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = UserModel;
