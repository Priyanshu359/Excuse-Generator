CREATE DATABASE IF NOT EXISTS excuse_generator;
USE excuse_generator;
-- Schema for Excuse Generator Application

CREATE TABLE users (
  user_id CHAR(36) PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_roles (
  role_id INT PRIMARY KEY AUTO_INCREMENT,
  role_name ENUM('user', 'moderator', 'admin') NOT NULL UNIQUE
);

CREATE TABLE user_role_map (
  user_id CHAR(36),
  role_id INT,
  PRIMARY KEY (user_id, role_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  FOREIGN KEY (role_id) REFERENCES user_roles(role_id)
);

CREATE TABLE excuses (
  excuse_id CHAR(36) PRIMARY KEY,
  user_id CHAR(36),
  content TEXT NOT NULL,
  status ENUM('pending', 'approved', 'rejected', 'deleted') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE excuse_votes (
  vote_id CHAR(36) PRIMARY KEY,
  user_id CHAR(36),
  excuse_id CHAR(36),
  vote_type ENUM('upvote', 'downvote'),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (user_id, excuse_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  FOREIGN KEY (excuse_id) REFERENCES excuses(excuse_id)
);

CREATE TABLE excuse_usage (
  usage_id CHAR(36) PRIMARY KEY,
  excuse_id CHAR(36),
  user_id CHAR(36),
  context TEXT,
  used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (excuse_id) REFERENCES excuses(excuse_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE excuse_reports (
  report_id CHAR(36) PRIMARY KEY,
  excuse_id CHAR(36),
  reporter_id CHAR(36),
  reason TEXT,
  status ENUM('open', 'reviewed', 'dismissed') DEFAULT 'open',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (excuse_id) REFERENCES excuses(excuse_id),
  FOREIGN KEY (reporter_id) REFERENCES users(user_id)
);

CREATE TABLE moderation_queue (
  mod_id CHAR(36) PRIMARY KEY,
  excuse_id CHAR(36),
  reviewer_id CHAR(36),
  action ENUM('approved', 'rejected'),
  reason TEXT,
  reviewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (excuse_id) REFERENCES excuses(excuse_id),
  FOREIGN KEY (reviewer_id) REFERENCES users(user_id)
);

CREATE TABLE excuse_marketplace (
  listing_id CHAR(36) PRIMARY KEY,
  excuse_id CHAR(36),
  seller_id CHAR(36),
  price INT NOT NULL,
  is_sold BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (excuse_id) REFERENCES excuses(excuse_id),
  FOREIGN KEY (seller_id) REFERENCES users(user_id)
);

CREATE TABLE excuse_borrowings (
  borrow_id CHAR(36) PRIMARY KEY,
  excuse_id CHAR(36),
  borrower_id CHAR(36),
  lender_id CHAR(36),
  expires_at TIMESTAMP,
  status ENUM('active', 'returned', 'expired') DEFAULT 'active',
  FOREIGN KEY (excuse_id) REFERENCES excuses(excuse_id),
  FOREIGN KEY (borrower_id) REFERENCES users(user_id),
  FOREIGN KEY (lender_id) REFERENCES users(user_id)
);

CREATE TABLE user_tokens (
  token_id CHAR(36) PRIMARY KEY,
  user_id CHAR(36),
  balance INT DEFAULT 0,
  change INT NOT NULL,
  reason TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE transactions (
  txn_id CHAR(36) PRIMARY KEY,
  from_user CHAR(36),
  to_user CHAR(36),
  excuse_id CHAR(36),
  tokens INT,
  type ENUM('buy', 'borrow', 'gift', 'system'),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (from_user) REFERENCES users(user_id),
  FOREIGN KEY (to_user) REFERENCES users(user_id),
  FOREIGN KEY (excuse_id) REFERENCES excuses(excuse_id)
);

CREATE TABLE leaderboard_cache (
  rank_id INT PRIMARY KEY AUTO_INCREMENT,
  excuse_id CHAR(36),
  score INT,
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (excuse_id) REFERENCES excuses(excuse_id)
);

CREATE TABLE audit_logs (
  audit_id CHAR(36) PRIMARY KEY,
  actor_id CHAR(36),
  action TEXT,
  resource_type VARCHAR(50),
  resource_id CHAR(36),
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (actor_id) REFERENCES users(user_id)
);
