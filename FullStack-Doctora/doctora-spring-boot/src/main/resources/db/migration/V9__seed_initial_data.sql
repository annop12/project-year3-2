-- V9: Seed initial test data for users, doctors, and their availabilities

-- Insert admin user
INSERT INTO users (email, password, first_name, last_name, role, phone, created_at, updated_at)
VALUES
('admin@doctora.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin', 'User', 'ADMIN', '020-000-0000', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (email) DO NOTHING;

-- Insert test doctor users
INSERT INTO users (email, password, first_name, last_name, role, phone, created_at, updated_at)
VALUES
('doctor1@doctora.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'อรรณพ', 'แสงศิลา', 'DOCTOR', '098-765-4321', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('doctor2@doctora.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'พงศกร', 'สุขสันต์', 'DOCTOR', '098-765-4322', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('doctor3@doctora.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'กิตติศักดิ์', 'วงศ์ใหญ่', 'DOCTOR', '098-765-4323', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('doctor4@doctora.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'ธนพล', 'รักษาชีพ', 'DOCTOR', '098-765-4324', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('doctor5@doctora.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'ศุภกฤต', 'ธรรมดี', 'DOCTOR', '098-765-4325', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('doctor6@doctora.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'ชยพล', 'เด็กดี', 'DOCTOR', '098-765-4326', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('doctor7@doctora.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'วีรภัทร', 'ผ่าตัดเก่ง', 'DOCTOR', '098-765-4327', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('doctor8@doctora.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'ปริญญา', 'หัวใจดี', 'DOCTOR', '098-765-4328', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('doctor9@doctora.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'ภาณุวัฒน์', 'ฉุกเฉิน', 'DOCTOR', '098-765-4329', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('doctor10@doctora.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'สุรเดช', 'บ่ายดี', 'DOCTOR', '098-765-4330', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('doctor11@doctora.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'อภิสิทธิ์', 'เด็กรัก', 'DOCTOR', '098-765-4331', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (email) DO NOTHING;

-- Insert test patient user
INSERT INTO users (email, password, first_name, last_name, role, phone, created_at, updated_at)
VALUES
('patient@doctora.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Patient', 'Test', 'PATIENT', '099-999-9999', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (email) DO NOTHING;

-- Insert doctors (using subqueries to get user_id from email)
-- Assuming specialty_id 1-4 exist from earlier migrations
INSERT INTO doctors (user_id, specialty_id, license_number, bio, experience_years, consultation_fee, room_number, is_active, created_at, updated_at)
SELECT u.id, 1, 'DOC-001-2024', 'แพทย์ผู้เชี่ยวชาญด้านอายุรกรรม', 5, 1500.00, 'A101', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM users u WHERE u.email = 'doctor1@doctora.com'
ON CONFLICT DO NOTHING;

INSERT INTO doctors (user_id, specialty_id, license_number, bio, experience_years, consultation_fee, room_number, is_active, created_at, updated_at)
SELECT u.id, 2, 'DOC-002-2024', 'แพทย์ผู้เชี่ยวชาญด้านกุมารเวชศาสตร์', 8, 1800.00, 'B201', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM users u WHERE u.email = 'doctor2@doctora.com'
ON CONFLICT DO NOTHING;

INSERT INTO doctors (user_id, specialty_id, license_number, bio, experience_years, consultation_fee, room_number, is_active, created_at, updated_at)
SELECT u.id, 3, 'DOC-003-2024', 'แพทย์ผู้เชี่ยวชาญด้านโรคหัวใจ', 10, 2500.00, 'C301', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM users u WHERE u.email = 'doctor3@doctora.com'
ON CONFLICT DO NOTHING;

INSERT INTO doctors (user_id, specialty_id, license_number, bio, experience_years, consultation_fee, room_number, is_active, created_at, updated_at)
SELECT u.id, 4, 'DOC-004-2024', 'แพทย์ผู้เชี่ยวชาญด้านเวชศาสตร์ฉุกเฉิน', 6, 2000.00, 'ER-01', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM users u WHERE u.email = 'doctor4@doctora.com'
ON CONFLICT DO NOTHING;

INSERT INTO doctors (user_id, specialty_id, license_number, bio, experience_years, consultation_fee, room_number, is_active, created_at, updated_at)
SELECT u.id, 1, 'DOC-005-2024', 'แพทย์ผู้เชี่ยวชาญด้านอายุรกรรม', 7, 1600.00, 'A102', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM users u WHERE u.email = 'doctor5@doctora.com'
ON CONFLICT DO NOTHING;

INSERT INTO doctors (user_id, specialty_id, license_number, bio, experience_years, consultation_fee, room_number, is_active, created_at, updated_at)
SELECT u.id, 2, 'DOC-006-2024', 'แพทย์ผู้เชี่ยวชาญด้านกุมารเวชศาสตร์', 9, 1900.00, 'B202', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM users u WHERE u.email = 'doctor6@doctora.com'
ON CONFLICT DO NOTHING;

INSERT INTO doctors (user_id, specialty_id, license_number, bio, experience_years, consultation_fee, room_number, is_active, created_at, updated_at)
SELECT u.id, 5, 'DOC-007-2024', 'แพทย์ผู้เชี่ยวชาญด้านศัลยกรรม', 12, 3000.00, 'OR-01', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM users u WHERE u.email = 'doctor7@doctora.com'
ON CONFLICT DO NOTHING;

INSERT INTO doctors (user_id, specialty_id, license_number, bio, experience_years, consultation_fee, room_number, is_active, created_at, updated_at)
SELECT u.id, 3, 'DOC-008-2024', 'แพทย์ผู้เชี่ยวชาญด้านโรคหัวใจ', 11, 2600.00, 'C302', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM users u WHERE u.email = 'doctor8@doctora.com'
ON CONFLICT DO NOTHING;

INSERT INTO doctors (user_id, specialty_id, license_number, bio, experience_years, consultation_fee, room_number, is_active, created_at, updated_at)
SELECT u.id, 4, 'DOC-009-2024', 'แพทย์ผู้เชี่ยวชาญด้านเวชศาสตร์ฉุกเฉิน', 5, 2100.00, 'ER-02', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM users u WHERE u.email = 'doctor9@doctora.com'
ON CONFLICT DO NOTHING;

INSERT INTO doctors (user_id, specialty_id, license_number, bio, experience_years, consultation_fee, room_number, is_active, created_at, updated_at)
SELECT u.id, 1, 'DOC-010-2024', 'แพทย์ผู้เชี่ยวชาญด้านอายุรกรรม เวรบ่าย', 6, 1700.00, 'A103', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM users u WHERE u.email = 'doctor10@doctora.com'
ON CONFLICT DO NOTHING;

INSERT INTO doctors (user_id, specialty_id, license_number, bio, experience_years, consultation_fee, room_number, is_active, created_at, updated_at)
SELECT u.id, 2, 'DOC-011-2024', 'แพทย์ผู้เชี่ยวชาญด้านกุมารเวชศาสตร์', 7, 1850.00, 'B203', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM users u WHERE u.email = 'doctor11@doctora.com'
ON CONFLICT DO NOTHING;
