-- ============================================================
-- PULSE PLATE – Seed Data
-- KPRIET College, Coimbatore
-- ============================================================

-- ============================================================
-- USERS (passwords are bcrypt hashed - see note below)
-- Plain passwords: AO@KPRIET, 23EC094, 23EC115, 23ECL03, Driver1..10, Student1..5
-- bcrypt rounds: 10
-- NOTE: Run `node database/hash_passwords.js` to regenerate if needed
-- ============================================================

-- AO
INSERT INTO users (id, email, password_hash, role, name, phone) VALUES
('00000000-0000-0000-0000-000000000001', 'riyashmoorthy@gmail.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'AO', 'Riyash Moorthy', '9876543210');

-- Admins
INSERT INTO users (id, email, password_hash, role, name, phone) VALUES
('00000000-0000-0000-0000-000000000002', '23ec094@kpriet.ac.in', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'ADMIN', 'Admin EC094', '9876543211'),
('00000000-0000-0000-0000-000000000003', '23ec115@kpriet.ac.in', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'ADMIN', 'Admin EC115', '9876543212'),
('00000000-0000-0000-0000-000000000004', '23ecl03@kpriet.ac.in', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'ADMIN', 'Admin ECL03', '9876543213');

-- Drivers (username used as email for login: driver1@kpriet.ac.in)
INSERT INTO users (id, email, password_hash, role, name, phone) VALUES
('00000000-0000-0000-0001-000000000001', 'driver1@kpriet.ac.in', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'DRIVER', 'Murugan K', '9876500001'),
('00000000-0000-0000-0001-000000000002', 'driver2@kpriet.ac.in', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'DRIVER', 'Selvam R', '9876500002'),
('00000000-0000-0000-0001-000000000003', 'driver3@kpriet.ac.in', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'DRIVER', 'Rajan P', '9876500003'),
('00000000-0000-0000-0001-000000000004', 'driver4@kpriet.ac.in', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'DRIVER', 'Arumugam S', '9876500004'),
('00000000-0000-0000-0001-000000000005', 'driver5@kpriet.ac.in', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'DRIVER', 'Karthik V', '9876500005');

-- Students
INSERT INTO users (id, email, password_hash, role, name, phone) VALUES
('00000000-0000-0000-0002-000000000001', 'student1@kpriet.ac.in', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'STUDENT', 'Priya S', '9876501001'),
('00000000-0000-0000-0002-000000000002', 'student2@kpriet.ac.in', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'STUDENT', 'Arun M', '9876501002'),
('00000000-0000-0000-0002-000000000003', 'student3@kpriet.ac.in', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'STUDENT', 'Deepa K', '9876501003'),
('00000000-0000-0000-0002-000000000004', 'student4@kpriet.ac.in', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'STUDENT', 'Vijay R', '9876501004'),
('00000000-0000-0000-0002-000000000005', 'student5@kpriet.ac.in', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'STUDENT', 'Kavitha T', '9876501005');

-- ============================================================
-- ROUTES (Coimbatore areas near KPRIET)
-- ============================================================
INSERT INTO routes (id, route_name, description, stops) VALUES
('10000000-0000-0000-0000-000000000001', 'Route 1 - Gandhipuram', 'Gandhipuram to KPRIET via Peelamedu',
 '[{"order":1,"name":"Gandhipuram","estimated_minutes":0},{"order":2,"name":"RS Puram","estimated_minutes":5},{"order":3,"name":"Peelamedu","estimated_minutes":15},{"order":4,"name":"Avinashi Road","estimated_minutes":22},{"order":5,"name":"KPRIET College","estimated_minutes":35}]'),

('10000000-0000-0000-0000-000000000002', 'Route 2 - Ukkadam', 'Ukkadam to KPRIET via Saibaba Colony',
 '[{"order":1,"name":"Ukkadam","estimated_minutes":0},{"order":2,"name":"Saibaba Colony","estimated_minutes":8},{"order":3,"name":"Race Course","estimated_minutes":15},{"order":4,"name":"Peelamedu","estimated_minutes":22},{"order":5,"name":"KPRIET College","estimated_minutes":35}]'),

('10000000-0000-0000-0000-000000000003', 'Route 3 - Singanallur', 'Singanallur to KPRIET',
 '[{"order":1,"name":"Singanallur","estimated_minutes":0},{"order":2,"name":"Puliakulam","estimated_minutes":7},{"order":3,"name":"Hopes College","estimated_minutes":12},{"order":4,"name":"Peelamedu","estimated_minutes":18},{"order":5,"name":"KPRIET College","estimated_minutes":28}]'),

('10000000-0000-0000-0000-000000000004', 'Route 4 - Podanur', 'Podanur to KPRIET via Ganapathy',
 '[{"order":1,"name":"Podanur","estimated_minutes":0},{"order":2,"name":"Ganapathy","estimated_minutes":10},{"order":3,"name":"Vadavalli","estimated_minutes":18},{"order":4,"name":"Kovaipudur","estimated_minutes":25},{"order":5,"name":"KPRIET College","estimated_minutes":38}]'),

('10000000-0000-0000-0000-000000000005', 'Route 5 - Mettupalayam Road', 'Mettupalayam Road to KPRIET',
 '[{"order":1,"name":"Mettupalayam Road","estimated_minutes":0},{"order":2,"name":"Kalapatti","estimated_minutes":10},{"order":3,"name":"Vilankurichi","estimated_minutes":18},{"order":4,"name":"Neelambur","estimated_minutes":25},{"order":5,"name":"KPRIET College","estimated_minutes":35}]');

-- ============================================================
-- DRIVERS
-- ============================================================
INSERT INTO drivers (id, user_id, name, license_number, phone, is_present) VALUES
('20000000-0000-0000-0000-000000000001', '00000000-0000-0000-0001-000000000001', 'Murugan K', 'TN33-2019-001234', '9876500001', true),
('20000000-0000-0000-0000-000000000002', '00000000-0000-0000-0001-000000000002', 'Selvam R', 'TN33-2018-005678', '9876500002', true),
('20000000-0000-0000-0000-000000000003', '00000000-0000-0000-0001-000000000003', 'Rajan P', 'TN33-2020-009012', '9876500003', true),
('20000000-0000-0000-0000-000000000004', '00000000-0000-0000-0001-000000000004', 'Arumugam S', 'TN33-2017-003456', '9876500004', false),
('20000000-0000-0000-0000-000000000005', '00000000-0000-0000-0001-000000000005', 'Karthik V', 'TN33-2021-007890', '9876500005', true);

-- ============================================================
-- BUSES
-- ============================================================
INSERT INTO buses (id, bus_number, vehicle_number, route_id, capacity, current_driver_id, status) VALUES
('30000000-0000-0000-0000-000000000001', 'Bus 01', 'TN33 AB 1234', '10000000-0000-0000-0000-000000000001', 52, '20000000-0000-0000-0000-000000000001', 'INSIDE'),
('30000000-0000-0000-0000-000000000002', 'Bus 02', 'TN33 CD 5678', '10000000-0000-0000-0000-000000000002', 48, '20000000-0000-0000-0000-000000000002', 'OUTSIDE'),
('30000000-0000-0000-0000-000000000003', 'Bus 03', 'TN33 EF 9012', '10000000-0000-0000-0000-000000000003', 55, '20000000-0000-0000-0000-000000000003', 'INSIDE'),
('30000000-0000-0000-0000-000000000004', 'Bus 04', 'TN33 GH 3456', '10000000-0000-0000-0000-000000000004', 50, '20000000-0000-0000-0000-000000000004', 'OUTSIDE'),
('30000000-0000-0000-0000-000000000005', 'Bus 05', 'TN33 IJ 7890', '10000000-0000-0000-0000-000000000005', 45, '20000000-0000-0000-0000-000000000005', 'INSIDE');

-- Update driver assigned buses
UPDATE drivers SET assigned_bus_id = '30000000-0000-0000-0000-000000000001' WHERE id = '20000000-0000-0000-0000-000000000001';
UPDATE drivers SET assigned_bus_id = '30000000-0000-0000-0000-000000000002' WHERE id = '20000000-0000-0000-0000-000000000002';
UPDATE drivers SET assigned_bus_id = '30000000-0000-0000-0000-000000000003' WHERE id = '20000000-0000-0000-0000-000000000003';
UPDATE drivers SET assigned_bus_id = '30000000-0000-0000-0000-000000000004' WHERE id = '20000000-0000-0000-0000-000000000004';
UPDATE drivers SET assigned_bus_id = '30000000-0000-0000-0000-000000000005' WHERE id = '20000000-0000-0000-0000-000000000005';

-- ============================================================
-- STUDENTS
-- ============================================================
INSERT INTO students (id, user_id, name, roll_number, selected_bus_id, boarding_stop, boarding_stop_order) VALUES
('40000000-0000-0000-0000-000000000001', '00000000-0000-0000-0002-000000000001', 'Priya S', '23EC001', '30000000-0000-0000-0000-000000000001', 'Peelamedu', 3),
('40000000-0000-0000-0000-000000000002', '00000000-0000-0000-0002-000000000002', 'Arun M', '23EC002', '30000000-0000-0000-0000-000000000002', 'Saibaba Colony', 2),
('40000000-0000-0000-0000-000000000003', '00000000-0000-0000-0002-000000000003', 'Deepa K', '23EC003', '30000000-0000-0000-0000-000000000003', 'Singanallur', 1),
('40000000-0000-0000-0000-000000000004', '00000000-0000-0000-0002-000000000004', 'Vijay R', '23EC004', '30000000-0000-0000-0000-000000000001', 'Gandhipuram', 1),
('40000000-0000-0000-0000-000000000005', '00000000-0000-0000-0002-000000000005', 'Kavitha T', '23EC005', '30000000-0000-0000-0000-000000000002', 'Ukkadam', 1);

-- ============================================================
-- SAMPLE ATTENDANCE LOGS (today's morning entries)
-- ============================================================
INSERT INTO attendance_logs (bus_id, event_type, timestamp, plate_detected, confidence_score, is_manual) VALUES
('30000000-0000-0000-0000-000000000001', 'ENTRY', NOW() - INTERVAL '3 hours', 'TN33AB1234', 0.97, false),
('30000000-0000-0000-0000-000000000002', 'ENTRY', NOW() - INTERVAL '3 hours' + INTERVAL '5 minutes', 'TN33CD5678', 0.94, false),
('30000000-0000-0000-0000-000000000003', 'ENTRY', NOW() - INTERVAL '2 hours' + INTERVAL '50 minutes', 'TN33EF9012', 0.98, false),
('30000000-0000-0000-0000-000000000004', 'ENTRY', NOW() - INTERVAL '2 hours' + INTERVAL '30 minutes', 'TN33GH3456', 0.91, false),
('30000000-0000-0000-0000-000000000005', 'ENTRY', NOW() - INTERVAL '2 hours' + INTERVAL '20 minutes', 'TN33IJ7890', 0.96, false),
('30000000-0000-0000-0000-000000000002', 'EXIT', NOW() - INTERVAL '30 minutes', 'TN33CD5678', 0.95, false),
('30000000-0000-0000-0000-000000000004', 'EXIT', NOW() - INTERVAL '1 hour', 'TN33GH3456', 0.93, false);

-- ============================================================
-- SAMPLE GATE PASS REQUESTS
-- ============================================================
INSERT INTO gate_pass_requests (driver_id, bus_id, reason, request_type, status, requested_at) VALUES
('20000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000002', 'Fuel filling required - tank below 25%', 'FUEL', 'APPROVED', NOW() - INTERVAL '2 hours'),
('20000000-0000-0000-0000-000000000004', '30000000-0000-0000-0000-000000000004', 'Tyre puncture repair at service centre', 'SERVICE', 'PENDING', NOW() - INTERVAL '1 hour');

-- ============================================================
-- SAMPLE BUS RANKINGS (today)
-- ============================================================
INSERT INTO bus_rankings (bus_id, date, entry_time, minutes_late, punctuality_score, daily_rank) VALUES
('30000000-0000-0000-0000-000000000003', CURRENT_DATE, NOW() - INTERVAL '2 hours' + INTERVAL '50 minutes', 0, 100, 1),
('30000000-0000-0000-0000-000000000001', CURRENT_DATE, NOW() - INTERVAL '3 hours', 0, 98, 2),
('30000000-0000-0000-0000-000000000005', CURRENT_DATE, NOW() - INTERVAL '2 hours' + INTERVAL '20 minutes', 2, 90, 3),
('30000000-0000-0000-0000-000000000002', CURRENT_DATE, NOW() - INTERVAL '3 hours' + INTERVAL '5 minutes', 5, 75, 4),
('30000000-0000-0000-0000-000000000004', CURRENT_DATE, NOW() - INTERVAL '2 hours' + INTERVAL '30 minutes', 8, 60, 5);
