-- UI Asset Gallery Database Schema
-- MariaDB 10.11

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(50) NOT NULL UNIQUE,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `role` ENUM('admin', 'editor', 'viewer') DEFAULT 'viewer',
  `is_active` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for categories
-- ----------------------------
DROP TABLE IF EXISTS `categories`;
CREATE TABLE `categories` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL UNIQUE,
  `slug` VARCHAR(100) NOT NULL UNIQUE,
  `description` TEXT,
  `icon` VARCHAR(50),
  `color` VARCHAR(7) DEFAULT '#6366f1',
  `parent_id` INT DEFAULT NULL,
  `sort_order` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`parent_id`) REFERENCES `categories`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for styles
-- ----------------------------
DROP TABLE IF EXISTS `styles`;
CREATE TABLE `styles` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL UNIQUE,
  `slug` VARCHAR(100) NOT NULL UNIQUE,
  `description` TEXT,
  `css_variables` TEXT,
  `preview_image` VARCHAR(255),
  `color_primary` VARCHAR(7) DEFAULT '#6366f1',
  `color_secondary` VARCHAR(7) DEFAULT '#8b5cf6',
  `sort_order` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for showcase_components
-- ----------------------------
DROP TABLE IF EXISTS `showcase_components`;
CREATE TABLE `showcase_components` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(200) NOT NULL,
  `slug` VARCHAR(200) NOT NULL UNIQUE,
  `description` TEXT,
  `category_id` INT NOT NULL,
  `style_id` INT NOT NULL,
  `thumbnail` VARCHAR(255),
  `demo_html` TEXT,
  `is_featured` TINYINT(1) DEFAULT 0,
  `is_premium` TINYINT(1) DEFAULT 0,
  `view_count` INT DEFAULT 0,
  `download_count` INT DEFAULT 0,
  `created_by` INT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`style_id`) REFERENCES `styles`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for variations
-- ----------------------------
DROP TABLE IF EXISTS `variations`;
CREATE TABLE `variations` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `component_id` INT NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `html_code` TEXT NOT NULL,
  `css_code` TEXT,
  `react_code` TEXT,
  `preview_image` VARCHAR(255),
  `is_default` TINYINT(1) DEFAULT 0,
  `sort_order` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`component_id`) REFERENCES `showcase_components`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for tags
-- ----------------------------
DROP TABLE IF EXISTS `tags`;
CREATE TABLE `tags` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(50) NOT NULL UNIQUE,
  `slug` VARCHAR(50) NOT NULL UNIQUE,
  `color` VARCHAR(7) DEFAULT '#6366f1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for component_tags (many-to-many)
-- ----------------------------
DROP TABLE IF EXISTS `component_tags`;
CREATE TABLE `component_tags` (
  `component_id` INT NOT NULL,
  `tag_id` INT NOT NULL,
  PRIMARY KEY (`component_id`, `tag_id`),
  FOREIGN KEY (`component_id`) REFERENCES `showcase_components`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for favorites
-- ----------------------------
DROP TABLE IF EXISTS `favorites`;
CREATE TABLE `favorites` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `component_id` INT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`component_id`) REFERENCES `showcase_components`(`id`) ON DELETE CASCADE,
  UNIQUE KEY `user_component` (`user_id`, `component_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for views
-- ----------------------------
DROP TABLE IF EXISTS `component_views`;
CREATE TABLE `component_views` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `component_id` INT NOT NULL,
  `user_id` INT,
  `ip_address` VARCHAR(45),
  `user_agent` VARCHAR(255),
  `viewed_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`component_id`) REFERENCES `showcase_components`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for settings
-- ----------------------------
DROP TABLE IF EXISTS `settings`;
CREATE TABLE `settings` (
  `key` VARCHAR(100) NOT NULL PRIMARY KEY,
  `value` TEXT,
  `description` VARCHAR(255),
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Insert default admin user (password: admin123)
-- ----------------------------
INSERT INTO `users` (username, email, password, role) VALUES 
('admin', 'admin@ui-gallery.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin');

-- ----------------------------
-- Insert default settings
-- ----------------------------
INSERT INTO `settings` (`key`, `value`, `description`) VALUES
('site_name', 'UI Asset Gallery', 'Website name'),
('site_description', 'A comprehensive gallery for UI components, styles, and assets', 'Website description'),
('items_per_page', '12', 'Number of items to show per page'),
('enable_registrations', 'true', 'Allow new user registrations');

SET FOREIGN_KEY_CHECKS = 1;
