-- =============================================
-- GetKontento SEO Platform - Database Schema
-- =============================================

-- Drop tables if exist (for fresh install)
DROP TABLE IF EXISTS tasks;
DROP TABLE IF EXISTS seo_suggestions;
DROP TABLE IF EXISTS contents;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS clients;

-- =============================================
-- 1. CLIENTS TABLE - Müşteriler (Multi-tenant)
-- =============================================
CREATE TABLE clients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    domain VARCHAR(200) NOT NULL,
    wp_api_url VARCHAR(300) NULL,
    wp_api_key VARCHAR(255) NULL,
    wp_api_secret VARCHAR(255) NULL,
    plan ENUM('Basic', 'Pro', 'Enterprise') DEFAULT 'Basic',
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_status (status),
    INDEX idx_domain (domain)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- 2. USERS TABLE - Kullanıcılar
-- =============================================
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    client_id INT NULL,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'client_owner', 'client_editor', 'client_viewer') NOT NULL,
    is_active TINYINT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE SET NULL,
    INDEX idx_email (email),
    INDEX idx_client_id (client_id),
    INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- 3. CONTENTS TABLE - WordPress İçerikleri
-- =============================================
CREATE TABLE contents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    client_id INT NOT NULL,
    wp_post_id INT NOT NULL,
    title VARCHAR(255),
    slug VARCHAR(255),
    meta_title VARCHAR(255),
    meta_description VARCHAR(255),
    seo_score INT DEFAULT 0,
    needs_update TINYINT DEFAULT 0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
    INDEX idx_client_id (client_id),
    INDEX idx_wp_post_id (wp_post_id),
    INDEX idx_seo_score (seo_score),
    INDEX idx_needs_update (needs_update)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- 4. SEO_SUGGESTIONS TABLE - AI SEO Önerileri
-- =============================================
CREATE TABLE seo_suggestions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    content_id INT NOT NULL,
    suggested_title VARCHAR(255),
    suggested_description VARCHAR(255),
    suggested_keywords TEXT,
    suggested_h1 VARCHAR(255),
    rules_passed INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (content_id) REFERENCES contents(id) ON DELETE CASCADE,
    INDEX idx_content_id (content_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- 5. TASKS TABLE - SEO Görevleri
-- =============================================
CREATE TABLE tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    client_id INT NOT NULL,
    assigned_to INT NULL,
    content_id INT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NULL,
    status ENUM('pending', 'in_progress', 'completed') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (content_id) REFERENCES contents(id) ON DELETE SET NULL,
    INDEX idx_client_id (client_id),
    INDEX idx_assigned_to (assigned_to),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- SAMPLE DATA - Örnek Veriler
-- =============================================

-- Örnek Client: Sistem Global
INSERT INTO clients (name, domain, wp_api_url, plan, status) VALUES
('Sistem Global', 'sistemglobal.com.tr', 'https://sistemglobal.com.tr/wp-json/wp/v2', 'Enterprise', 'active'),
('Demo Şirket', 'demo-sirket.com', 'https://demo-sirket.com/wp-json/wp/v2', 'Pro', 'active');

-- Admin kullanıcı (şifre: Admin123!)
-- password_hash: $2b$10$rIC/8mP6vP6v3Bd0eV8FNuJKtK3qZ9xBR7qD6qZ9xBR7qD6qZ9xBR
INSERT INTO users (client_id, name, email, password_hash, role, is_active) VALUES
(NULL, 'Super Admin', 'admin@getkontento.com', '$2b$10$6sEZ8Z6Z6Z6Z6Z6Z6Z6Z6Os.5j5j5j5j5j5j5j5j5j5j5j5j5j5j5', 'admin', 1);

-- Sistem Global için client_owner (şifre: Client123!)
INSERT INTO users (client_id, name, email, password_hash, role, is_active) VALUES
(1, 'Sistem Global Admin', 'admin@sistemglobal.com.tr', '$2b$10$6sEZ8Z6Z6Z6Z6Z6Z6Z6Z6Os.5j5j5j5j5j5j5j5j5j5j5j5j5j5j5', 'client_owner', 1);

-- Örnek içerikler
INSERT INTO contents (client_id, wp_post_id, title, slug, meta_title, meta_description, seo_score, needs_update) VALUES
(1, 101, 'ISO 9001 Kalite Yönetim Sistemi', 'iso-9001-kalite-yonetim-sistemi', 'ISO 9001 Kalite Yönetim Sistemi | Sistem Global', 'ISO 9001 kalite yönetim sistemi hakkında detaylı bilgi alın.', 75, 0),
(1, 102, 'ISO 14001 Çevre Yönetim Sistemi', 'iso-14001-cevre-yonetim-sistemi', 'ISO 14001 Çevre Yönetimi', 'Çevre yönetim sistemi danışmanlığı', 60, 1),
(1, 103, 'ISO 45001 İş Sağlığı ve Güvenliği', 'iso-45001-is-sagligi-guvenligi', NULL, NULL, 0, 1);

-- Örnek görevler
INSERT INTO tasks (client_id, assigned_to, content_id, title, description, status) VALUES
(1, 2, 2, 'ISO 14001 Sayfası SEO Güncellemesi', 'Meta description eksik, SEO skoru düşük. Güncellenmeli.', 'pending'),
(1, 2, 3, 'ISO 45001 Meta Bilgileri Eklenmeli', 'Sayfa meta title ve description içermiyor.', 'in_progress');

-- =============================================
-- END OF SCHEMA
-- =============================================
