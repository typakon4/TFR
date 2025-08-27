CREATE DATABASE IF NOT EXISTS ctf_database;
USE ctf_database;

CREATE TABLE IF NOT EXISTS ctf_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    unique_param VARCHAR(16) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    telegram_user_id BIGINT,
    username VARCHAR(255),
    INDEX idx_unique_param (unique_param),
    INDEX idx_telegram_user_id (telegram_user_id)
);
