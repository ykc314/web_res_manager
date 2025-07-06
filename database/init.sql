-- =====================================
-- WEB RESERVATION MANAGER DATABASE
-- =====================================

-- データベースの作成（念の為）
CREATE DATABASE IF NOT EXISTS web_res_manager CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE web_res_manager;

-- =====================================
-- USERS TABLE (システムログイン用)
-- =====================================
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =====================================
-- CREDENTIALS TABLE (外部サイトのID・PASS)
-- =====================================
CREATE TABLE credentials (
    id INT AUTO_INCREMENT PRIMARY KEY,
    site_name VARCHAR(100) NOT NULL,
    username VARCHAR(255) NOT NULL,
    password_encrypted TEXT NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    last_verified_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_site_name (site_name)
);

-- =====================================
-- WOMEN TABLE (女性情報)
-- =====================================
CREATE TABLE women (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    site_name VARCHAR(100) NOT NULL,
    site_id VARCHAR(255),
    profile_url VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    last_sync_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_site_name (site_name),
    INDEX idx_active (is_active),
    UNIQUE KEY unique_woman_site (name, site_name)
);

-- =====================================
-- SHIFTS TABLE (シフト情報)
-- =====================================
CREATE TABLE shifts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    woman_id INT NOT NULL,
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    site_name VARCHAR(100) NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (woman_id) REFERENCES women(id) ON DELETE CASCADE,
    INDEX idx_date (date),
    INDEX idx_woman_date (woman_id, date),
    INDEX idx_site_date (site_name, date)
);

-- =====================================
-- BOOKINGS TABLE (予約情報)
-- =====================================
CREATE TABLE bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    woman_id INT NOT NULL,
    booking_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    site_name VARCHAR(100) NOT NULL,
    customer_info TEXT,
    customer_contact VARCHAR(255),
    status ENUM('confirmed', 'cancelled', 'completed', 'no_show') DEFAULT 'confirmed',
    booking_reference VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (woman_id) REFERENCES women(id) ON DELETE CASCADE,
    INDEX idx_booking_date (booking_date),
    INDEX idx_woman_date (woman_id, booking_date),
    INDEX idx_site_date (site_name, booking_date),
    INDEX idx_status (status)
);

-- =====================================
-- ERROR_LOGS TABLE (エラーログ)
-- =====================================
CREATE TABLE error_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    error_type ENUM('woman_info_error', 'booking_info_error', 'booking_write_error', 'system_error') NOT NULL,
    error_message TEXT NOT NULL,
    site_name VARCHAR(100),
    error_details JSON,
    stack_trace TEXT,
    is_resolved BOOLEAN DEFAULT FALSE,
    resolved_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_error_type (error_type),
    INDEX idx_created_at (created_at),
    INDEX idx_site_name (site_name),
    INDEX idx_resolved (is_resolved)
);

-- =====================================
-- SETTINGS TABLE (システム設定)
-- =====================================
CREATE TABLE settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(255) UNIQUE NOT NULL,
    setting_value TEXT,
    setting_type ENUM('string', 'number', 'boolean', 'json') DEFAULT 'string',
    description TEXT,
    is_editable BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_key (setting_key)
);

-- =====================================
-- SYNC_LOGS TABLE (同期ログ)
-- =====================================
CREATE TABLE sync_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sync_type ENUM('women_info', 'shifts', 'bookings') NOT NULL,
    site_name VARCHAR(100) NOT NULL,
    status ENUM('success', 'error', 'partial') NOT NULL,
    records_processed INT DEFAULT 0,
    error_message TEXT,
    started_at TIMESTAMP NOT NULL,
    completed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_sync_type (sync_type),
    INDEX idx_site_name (site_name),
    INDEX idx_started_at (started_at)
);

-- =====================================
-- 初期データの挿入
-- =====================================

-- デフォルトユーザーの作成 (username: admin, password: admin123)
INSERT INTO users (username, password_hash, email) VALUES
('admin', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin@example.com');

-- システム設定の初期値
INSERT INTO settings (setting_key, setting_value, setting_type, description, is_editable) VALUES
('auto_sync_site', '', 'string', '女性情報・シフト自動吸い取りサイト', TRUE),
('auto_sync_time', '', 'string', '自動吸い取り時刻 (HH:MM形式)', TRUE),
('operation_start_time', '00:00', 'string', 'ネット予約開始時間', TRUE),
('operation_end_time', '23:59', 'string', 'ネット予約終了時間', TRUE),
('scraper_delay', '1000', 'number', 'スクレイピング間隔(ms)', TRUE),
('max_retries', '3', 'number', '最大リトライ回数', TRUE),
('sync_enabled', 'true', 'boolean', '自動同期有効フラグ', TRUE),
('system_version', '1.0.0', 'string', 'システムバージョン', FALSE);

-- サンプルデータ（開発用）
INSERT INTO women (name, site_name, site_id, is_active) VALUES
('A子', 'ヘブンネット', 'heaven_001', TRUE),
('B子', 'ヘブンネット', 'heaven_002', TRUE),
('C子', '駅ちか', 'ekichika_001', TRUE),
('D子', '駅ちか', 'ekichika_002', TRUE);

-- サンプルシフトデータ
INSERT INTO shifts (woman_id, date, start_time, end_time, site_name) VALUES
(1, CURDATE(), '10:00:00', '18:00:00', 'ヘブンネット'),
(2, CURDATE(), '12:00:00', '20:00:00', 'ヘブンネット'),
(3, CURDATE(), '09:00:00', '17:00:00', '駅ちか'),
(4, CURDATE(), '14:00:00', '22:00:00', '駅ちか');

-- サンプル予約データ
INSERT INTO bookings (woman_id, booking_date, start_time, end_time, site_name, customer_info, status) VALUES
(1, CURDATE(), '14:00:00', '15:00:00', 'ヘブンネット', '田中様', 'confirmed'),
(3, CURDATE(), '11:00:00', '12:00:00', '駅ちか', '佐藤様', 'confirmed');

-- =====================================
-- ビューの作成（よく使うクエリ用）
-- =====================================

-- 今日の予約状況ビュー
CREATE VIEW today_bookings AS
SELECT 
    w.name as woman_name,
    b.booking_date,
    b.start_time,
    b.end_time,
    b.site_name,
    b.customer_info,
    b.status
FROM bookings b
JOIN women w ON b.woman_id = w.id
WHERE b.booking_date = CURDATE()
ORDER BY b.start_time;

-- エラーサマリービュー
CREATE VIEW error_summary AS
SELECT 
    error_type,
    COUNT(*) as error_count,
    COUNT(CASE WHEN is_resolved = FALSE THEN 1 END) as unresolved_count,
    MAX(created_at) as latest_error
FROM error_logs
GROUP BY error_type;

-- =====================================
-- 完了メッセージ
-- =====================================
SELECT 'Database initialization completed successfully!' as status;