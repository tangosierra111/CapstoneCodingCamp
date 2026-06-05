-- Database Initialization Script for EduPerform
-- This script creates the database and tables for the EduPerform application

-- Create database if not exists
CREATE DATABASE IF NOT EXISTS codingcamp;
USE codingcamp;

-- Table 1: users
-- Stores user account information
CREATE TABLE IF NOT EXISTS users (
    student_id      INT          NOT NULL PRIMARY KEY AUTO_INCREMENT,
    first_name      VARCHAR(100) NOT NULL,
    last_name       VARCHAR(100) NOT NULL,
    email           VARCHAR(100) NOT NULL UNIQUE,
    password        VARCHAR(255) NOT NULL,       -- Hashed password using bcrypt
    education_level VARCHAR(15)  NOT NULL,       -- 'SMP', 'SMA', 'Mahasiswa'
    deleted_at      DATETIME     DEFAULT NULL,   -- NULL = active, filled when account is deleted
    created_at      DATETIME     DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table 2: dataset
-- Stores each prediction session and results
CREATE TABLE IF NOT EXISTS dataset (
    dataset_id                          INT          NOT NULL PRIMARY KEY AUTO_INCREMENT,
    student_id                          INT          NOT NULL,

    -- Demographic Information
    age                                 INT          NOT NULL,
    grade_level                         INT          NOT NULL,

    -- Study Habits
    study_hours_per_day                 FLOAT        NOT NULL,
    sleep_hours                         FLOAT        NOT NULL,
    social_media_hours                  FLOAT        NOT NULL,
    tutoring_hours                      FLOAT        NOT NULL,
    attendance_percentage               FLOAT        NOT NULL,
    class_participation_score           INT          NOT NULL,
    study_consistency_index             FLOAT        NOT NULL,
    improvement_rate                    FLOAT        NOT NULL,

    -- Academic Performance
    last_exam_score                     INT          NOT NULL,
    assignment_scores_avg               FLOAT        NOT NULL,
    concept_understanding_score         INT          NOT NULL,

    -- AI Usage
    uses_ai                             TINYINT(1)   NOT NULL,
    ai_usage_time_minutes               INT          NOT NULL,
    ai_dependency_score                 INT          NOT NULL,
    ai_generated_content_percentage     INT          NOT NULL,
    ai_prompts_per_week                 INT          NOT NULL,
    ai_ethics_score                     INT          NOT NULL,

    -- Derived Features
    ai_usage_hours                      FLOAT        NOT NULL,
    ai_study_ratio                      FLOAT        NOT NULL,

    -- One-Hot Encoding: AI Tools Used
    ai_tools_used_ChatGPT               TINYINT(1)   NOT NULL DEFAULT 0,
    ai_tools_used_Claude                TINYINT(1)   NOT NULL DEFAULT 0,
    ai_tools_used_Copilot               TINYINT(1)   NOT NULL DEFAULT 0,
    ai_tools_used_Gemini                TINYINT(1)   NOT NULL DEFAULT 0,

    -- One-Hot Encoding: AI Usage Purpose
    ai_usage_purpose_Coding             TINYINT(1)   NOT NULL DEFAULT 0,
    ai_usage_purpose_Doubt_Solving      TINYINT(1)   NOT NULL DEFAULT 0,
    ai_usage_purpose_Exam_Prep          TINYINT(1)   NOT NULL DEFAULT 0,
    ai_usage_purpose_Homework           TINYINT(1)   NOT NULL DEFAULT 0,
    ai_usage_purpose_Notes              TINYINT(1)   NOT NULL DEFAULT 0,

    -- Prediction Result
    performance_category                VARCHAR(10)  NOT NULL,

    -- Timestamp
    created_at                          DATETIME     DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_student
        FOREIGN KEY (student_id) REFERENCES users(student_id)
        ON DELETE CASCADE,
    
    INDEX idx_student_id (student_id),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
