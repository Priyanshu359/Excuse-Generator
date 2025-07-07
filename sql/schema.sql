CREATE DATABASE IF NOT EXISTS excuse_generator;
USE excuse_generator;

-- Users
CREATE TABLE users (
  user_id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Roles
CREATE TABLE user_roles (
  role_id INT PRIMARY KEY AUTO_INCREMENT,
  role_name ENUM('user', 'moderator', 'admin') NOT NULL UNIQUE
);

INSERT INTO user_roles (role_name) VALUES
('user'),
('moderator'),
('admin');

CREATE TABLE user_role_map (
  user_id INT,
  role_id INT,
  PRIMARY KEY (user_id, role_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (role_id) REFERENCES user_roles(role_id) ON DELETE CASCADE
);

-- Excuses
CREATE TABLE excuses (
  excuse_id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  content TEXT NOT NULL,
  status ENUM('pending', 'approved', 'rejected', 'deleted') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Votes
CREATE TABLE excuse_votes (
  vote_id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  excuse_id INT,
  vote_type ENUM('upvote', 'downvote'),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (user_id, excuse_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (excuse_id) REFERENCES excuses(excuse_id) ON DELETE CASCADE
);

-- Usage
CREATE TABLE excuse_usage (
  usage_id INT PRIMARY KEY AUTO_INCREMENT,
  excuse_id INT,
  user_id INT,
  context TEXT,
  used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (excuse_id) REFERENCES excuses(excuse_id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Reports
CREATE TABLE excuse_reports (
  report_id INT PRIMARY KEY AUTO_INCREMENT,
  excuse_id INT,
  reporter_id INT,
  reason TEXT,
  status ENUM('open', 'reviewed', 'dismissed') DEFAULT 'open',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (excuse_id) REFERENCES excuses(excuse_id) ON DELETE CASCADE,
  FOREIGN KEY (reporter_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Moderation
CREATE TABLE moderation_queue (
  mod_id INT PRIMARY KEY AUTO_INCREMENT,
  excuse_id INT,
  reviewer_id INT,
  action ENUM('approved', 'rejected'),
  reason TEXT,
  reviewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (excuse_id) REFERENCES excuses(excuse_id) ON DELETE CASCADE,
  FOREIGN KEY (reviewer_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Marketplace
CREATE TABLE excuse_marketplace (
  listing_id INT PRIMARY KEY AUTO_INCREMENT,
  excuse_id INT,
  seller_id INT,
  price INT NOT NULL,
  is_sold BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (excuse_id) REFERENCES excuses(excuse_id) ON DELETE CASCADE,
  FOREIGN KEY (seller_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Borrowings
CREATE TABLE excuse_borrowings (
  borrow_id INT PRIMARY KEY AUTO_INCREMENT,
  excuse_id INT,
  borrower_id INT,
  lender_id INT,
  expires_at TIMESTAMP,
  status ENUM('active', 'returned', 'expired') DEFAULT 'active',
  FOREIGN KEY (excuse_id) REFERENCES excuses(excuse_id) ON DELETE CASCADE,
  FOREIGN KEY (borrower_id) REFERENCES users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (lender_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Tokens
CREATE TABLE user_tokens (
  token_id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  balance INT DEFAULT 0,
  token_change INT NOT NULL,
  reason TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Transactions
CREATE TABLE transactions (
  txn_id INT PRIMARY KEY AUTO_INCREMENT,
  from_user INT,
  to_user INT,
  excuse_id INT,
  tokens INT,
  type ENUM('buy', 'borrow', 'gift', 'system'),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (from_user) REFERENCES users(user_id) ON DELETE SET NULL,
  FOREIGN KEY (to_user) REFERENCES users(user_id) ON DELETE SET NULL,
  FOREIGN KEY (excuse_id) REFERENCES excuses(excuse_id) ON DELETE SET NULL
);

-- Leaderboard
CREATE TABLE leaderboard_cache (
  rank_id INT PRIMARY KEY AUTO_INCREMENT,
  excuse_id INT,
  score INT,
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (excuse_id) REFERENCES excuses(excuse_id) ON DELETE CASCADE
);

-- Audit Logs
CREATE TABLE audit_logs (
  audit_id INT PRIMARY KEY AUTO_INCREMENT,
  actor_id INT,
  action TEXT,
  resource_type VARCHAR(50),
  resource_id INT,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (actor_id) REFERENCES users(user_id) ON DELETE SET NULL
);
