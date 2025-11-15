-- V10: Add availability schedules for all doctors

-- Doctor 1 (อรรณพ แสงศิลา) - Internal Medicine (Mon-Fri 9:00-17:00)
INSERT INTO availabilities (doctor_id, day_of_week, start_time, end_time, is_active, created_at)
SELECT d.id, 1, '09:00:00', '17:00:00', true, NOW()
FROM doctors d JOIN users u ON d.user_id = u.id WHERE u.email = 'doctor1@doctora.com';

INSERT INTO availabilities (doctor_id, day_of_week, start_time, end_time, is_active, created_at)
SELECT d.id, 2, '09:00:00', '17:00:00', true, NOW()
FROM doctors d JOIN users u ON d.user_id = u.id WHERE u.email = 'doctor1@doctora.com';

INSERT INTO availabilities (doctor_id, day_of_week, start_time, end_time, is_active, created_at)
SELECT d.id, 3, '09:00:00', '17:00:00', true, NOW()
FROM doctors d JOIN users u ON d.user_id = u.id WHERE u.email = 'doctor1@doctora.com';

INSERT INTO availabilities (doctor_id, day_of_week, start_time, end_time, is_active, created_at)
SELECT d.id, 4, '09:00:00', '17:00:00', true, NOW()
FROM doctors d JOIN users u ON d.user_id = u.id WHERE u.email = 'doctor1@doctora.com';

INSERT INTO availabilities (doctor_id, day_of_week, start_time, end_time, is_active, created_at)
SELECT d.id, 5, '09:00:00', '17:00:00', true, NOW()
FROM doctors d JOIN users u ON d.user_id = u.id WHERE u.email = 'doctor1@doctora.com';

-- Doctor 2 (พงศกร) - Pediatrics (Mon-Fri 8:00-16:00)
INSERT INTO availabilities (doctor_id, day_of_week, start_time, end_time, is_active, created_at)
SELECT d.id, 1, '08:00:00', '16:00:00', true, NOW()
FROM doctors d JOIN users u ON d.user_id = u.id WHERE u.email = 'doctor2@doctora.com';

INSERT INTO availabilities (doctor_id, day_of_week, start_time, end_time, is_active, created_at)
SELECT d.id, 2, '08:00:00', '16:00:00', true, NOW()
FROM doctors d JOIN users u ON d.user_id = u.id WHERE u.email = 'doctor2@doctora.com';

INSERT INTO availabilities (doctor_id, day_of_week, start_time, end_time, is_active, created_at)
SELECT d.id, 3, '08:00:00', '16:00:00', true, NOW()
FROM doctors d JOIN users u ON d.user_id = u.id WHERE u.email = 'doctor2@doctora.com';

INSERT INTO availabilities (doctor_id, day_of_week, start_time, end_time, is_active, created_at)
SELECT d.id, 4, '08:00:00', '16:00:00', true, NOW()
FROM doctors d JOIN users u ON d.user_id = u.id WHERE u.email = 'doctor2@doctora.com';

INSERT INTO availabilities (doctor_id, day_of_week, start_time, end_time, is_active, created_at)
SELECT d.id, 5, '08:00:00', '16:00:00', true, NOW()
FROM doctors d JOIN users u ON d.user_id = u.id WHERE u.email = 'doctor2@doctora.com';

-- Doctor 3 (กิตติศักดิ์) - Cardiology (Mon-Sat 9:00-18:00)
INSERT INTO availabilities (doctor_id, day_of_week, start_time, end_time, is_active, created_at)
SELECT d.id, day_num, '09:00:00', '18:00:00', true, NOW()
FROM doctors d
JOIN users u ON d.user_id = u.id
CROSS JOIN generate_series(1, 6) AS day_num
WHERE u.email = 'doctor3@doctora.com';

-- Doctor 4 (ธนพล) - Emergency Medicine (Every day 24h)
INSERT INTO availabilities (doctor_id, day_of_week, start_time, end_time, is_active, created_at)
SELECT d.id, day_num, '00:00:00', '23:59:00', true, NOW()
FROM doctors d
JOIN users u ON d.user_id = u.id
CROSS JOIN generate_series(1, 7) AS day_num
WHERE u.email = 'doctor4@doctora.com';

-- Doctor 5 (ศุภกฤต) - Internal Medicine (Tue-Sat 10:00-18:00)
INSERT INTO availabilities (doctor_id, day_of_week, start_time, end_time, is_active, created_at)
SELECT d.id, day_num, '10:00:00', '18:00:00', true, NOW()
FROM doctors d
JOIN users u ON d.user_id = u.id
CROSS JOIN generate_series(2, 6) AS day_num
WHERE u.email = 'doctor5@doctora.com';

-- Doctor 6 (ชยพล) - Pediatrics (Mon-Fri split shifts 8-12, 13-17)
INSERT INTO availabilities (doctor_id, day_of_week, start_time, end_time, is_active, created_at)
SELECT d.id, day_num, '08:00:00', '12:00:00', true, NOW()
FROM doctors d
JOIN users u ON d.user_id = u.id
CROSS JOIN generate_series(1, 5) AS day_num
WHERE u.email = 'doctor6@doctora.com';

INSERT INTO availabilities (doctor_id, day_of_week, start_time, end_time, is_active, created_at)
SELECT d.id, day_num, '13:00:00', '17:00:00', true, NOW()
FROM doctors d
JOIN users u ON d.user_id = u.id
CROSS JOIN generate_series(1, 5) AS day_num
WHERE u.email = 'doctor6@doctora.com';

-- Doctor 7 (วีรภัทร) - Surgery (Mon-Fri 7:00-15:00)
INSERT INTO availabilities (doctor_id, day_of_week, start_time, end_time, is_active, created_at)
SELECT d.id, day_num, '07:00:00', '15:00:00', true, NOW()
FROM doctors d
JOIN users u ON d.user_id = u.id
CROSS JOIN generate_series(1, 5) AS day_num
WHERE u.email = 'doctor7@doctora.com';

-- Doctor 8 (ปริญญา) - Cardiology (Mon, Wed, Fri 9:00-17:00)
INSERT INTO availabilities (doctor_id, day_of_week, start_time, end_time, is_active, created_at)
SELECT d.id, 1, '09:00:00', '17:00:00', true, NOW()
FROM doctors d JOIN users u ON d.user_id = u.id WHERE u.email = 'doctor8@doctora.com';

INSERT INTO availabilities (doctor_id, day_of_week, start_time, end_time, is_active, created_at)
SELECT d.id, 3, '09:00:00', '17:00:00', true, NOW()
FROM doctors d JOIN users u ON d.user_id = u.id WHERE u.email = 'doctor8@doctora.com';

INSERT INTO availabilities (doctor_id, day_of_week, start_time, end_time, is_active, created_at)
SELECT d.id, 5, '09:00:00', '17:00:00', true, NOW()
FROM doctors d JOIN users u ON d.user_id = u.id WHERE u.email = 'doctor8@doctora.com';

-- Doctor 9 (ภาณุวัฒน์) - Emergency Medicine (Every day 24h)
INSERT INTO availabilities (doctor_id, day_of_week, start_time, end_time, is_active, created_at)
SELECT d.id, day_num, '00:00:00', '23:59:00', true, NOW()
FROM doctors d
JOIN users u ON d.user_id = u.id
CROSS JOIN generate_series(1, 7) AS day_num
WHERE u.email = 'doctor9@doctora.com';

-- Doctor 10 (สุรเดช) - Internal Medicine afternoon shift (Mon-Fri 13:00-21:00)
INSERT INTO availabilities (doctor_id, day_of_week, start_time, end_time, is_active, created_at)
SELECT d.id, day_num, '13:00:00', '21:00:00', true, NOW()
FROM doctors d
JOIN users u ON d.user_id = u.id
CROSS JOIN generate_series(1, 5) AS day_num
WHERE u.email = 'doctor10@doctora.com';

-- Doctor 11 (อภิสิทธิ์) - Pediatrics (Tue-Sat 9:00-17:00)
INSERT INTO availabilities (doctor_id, day_of_week, start_time, end_time, is_active, created_at)
SELECT d.id, day_num, '09:00:00', '17:00:00', true, NOW()
FROM doctors d
JOIN users u ON d.user_id = u.id
CROSS JOIN generate_series(2, 6) AS day_num
WHERE u.email = 'doctor11@doctora.com';
