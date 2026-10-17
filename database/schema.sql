-- ============================================================
-- PULSE PLATE – PostgreSQL Schema
-- ============================================================

-- Built-in gen_random_uuid() used

-- User roles: AO | ADMIN | DRIVER | STUDENT
CREATE TYPE user_role AS ENUM ('AO', 'ADMIN', 'DRIVER', 'STUDENT');
CREATE TYPE bus_status AS ENUM ('INSIDE', 'OUTSIDE', 'INACTIVE');
CREATE TYPE attendance_event AS ENUM ('ENTRY', 'EXIT');
CREATE TYPE request_status AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
CREATE TYPE gate_pass_type AS ENUM ('SERVICE', 'FUEL', 'OTHER');
CREATE TYPE notification_target AS ENUM ('ALL', 'BUS', 'USER');

-- ============================================================
-- USERS
-- ============================================================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role user_role NOT NULL,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- ROUTES
-- ============================================================
CREATE TABLE routes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  route_name VARCHAR(100) NOT NULL,
  description TEXT,
  stops JSONB NOT NULL DEFAULT '[]',
  -- stops format: [{"order": 1, "name": "Stop Name", "estimated_minutes": 10}]
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- DRIVERS
-- ============================================================
CREATE TABLE drivers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  photo_path VARCHAR(500),
  license_number VARCHAR(50) UNIQUE NOT NULL,
  phone VARCHAR(20),
  is_present BOOLEAN DEFAULT true,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- BUSES
-- ============================================================
CREATE TABLE buses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bus_number VARCHAR(20) UNIQUE NOT NULL,
  vehicle_number VARCHAR(20) UNIQUE NOT NULL,
  route_id UUID REFERENCES routes(id),
  capacity INTEGER DEFAULT 50,
  current_driver_id UUID REFERENCES drivers(id),
  status bus_status DEFAULT 'OUTSIDE',
  image_path VARCHAR(500),
  is_active BOOLEAN DEFAULT true,
  last_entry_time TIMESTAMP,
  last_exit_time TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Add back-reference from drivers to buses
ALTER TABLE drivers ADD COLUMN assigned_bus_id UUID REFERENCES buses(id);

-- ============================================================
-- STUDENTS
-- ============================================================
CREATE TABLE students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  roll_number VARCHAR(50) UNIQUE NOT NULL,
  selected_bus_id UUID REFERENCES buses(id),
  boarding_stop VARCHAR(255),
  boarding_stop_order INTEGER,
  fcm_token TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- ATTENDANCE LOGS
-- ============================================================
CREATE TABLE attendance_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bus_id UUID REFERENCES buses(id),
  event_type attendance_event NOT NULL,
  timestamp TIMESTAMP DEFAULT NOW(),
  plate_detected VARCHAR(30),
  confidence_score FLOAT,
  image_path VARCHAR(500),
  is_manual BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- DRIVER VERIFICATION LOGS
-- ============================================================
CREATE TABLE driver_verification_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bus_id UUID REFERENCES buses(id),
  driver_id UUID REFERENCES drivers(id),
  attendance_log_id UUID REFERENCES attendance_logs(id),
  face_verified BOOLEAN DEFAULT false,
  face_mismatch_reason TEXT,
  drowsiness_detected BOOLEAN DEFAULT false,
  seatbelt_detected BOOLEAN DEFAULT true,
  image_path VARCHAR(500),
  confidence_score FLOAT,
  timestamp TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- GATE PASS REQUESTS
-- ============================================================
CREATE TABLE gate_pass_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id UUID REFERENCES drivers(id),
  bus_id UUID REFERENCES buses(id),
  reason TEXT NOT NULL,
  request_type gate_pass_type DEFAULT 'SERVICE',
  status request_status DEFAULT 'PENDING',
  requested_at TIMESTAMP DEFAULT NOW(),
  reviewed_by UUID REFERENCES users(id),
  reviewed_at TIMESTAMP,
  review_notes TEXT,
  exit_time TIMESTAMP,
  expected_return TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- ROUTE CHANGE REQUESTS
-- ============================================================
CREATE TABLE route_change_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id UUID REFERENCES drivers(id),
  bus_id UUID REFERENCES buses(id),
  current_route_id UUID REFERENCES routes(id),
  requested_route_id UUID REFERENCES routes(id),
  reason TEXT NOT NULL,
  status request_status DEFAULT 'PENDING',
  requested_at TIMESTAMP DEFAULT NOW(),
  reviewed_by UUID REFERENCES users(id),
  reviewed_at TIMESTAMP,
  review_notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- BUS RANKINGS
-- ============================================================
CREATE TABLE bus_rankings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bus_id UUID REFERENCES buses(id),
  date DATE NOT NULL,
  entry_time TIMESTAMP,
  expected_start TIME DEFAULT '08:00:00',
  expected_end TIME DEFAULT '08:45:00',
  minutes_late INTEGER DEFAULT 0,
  punctuality_score INTEGER DEFAULT 100,
  daily_rank INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(bus_id, date)
);

-- ============================================================
-- NOTIFICATIONS
-- ============================================================
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  target_type notification_target DEFAULT 'ALL',
  target_bus_id UUID REFERENCES buses(id),
  target_user_id UUID REFERENCES users(id),
  sent_at TIMESTAMP DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX idx_attendance_bus_id ON attendance_logs(bus_id);
CREATE INDEX idx_attendance_timestamp ON attendance_logs(timestamp);
CREATE INDEX idx_attendance_event ON attendance_logs(event_type);
CREATE INDEX idx_driver_verification_bus ON driver_verification_logs(bus_id);
CREATE INDEX idx_driver_verification_timestamp ON driver_verification_logs(timestamp);
CREATE INDEX idx_gate_pass_status ON gate_pass_requests(status);
CREATE INDEX idx_route_change_status ON route_change_requests(status);
CREATE INDEX idx_bus_rankings_date ON bus_rankings(date);
CREATE INDEX idx_notifications_bus ON notifications(target_bus_id);
CREATE INDEX idx_students_bus ON students(selected_bus_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_buses_status ON buses(status);
