// ── PULSE PLATE Mock Data ────────────────────────────────────────────────────
// Realistic demo data for all API endpoints

const today = new Date();
const fmt = (h, m, offset = 0) => {
  const d = new Date(today);
  d.setDate(d.getDate() + offset);
  d.setHours(h, m, 0, 0);
  return d.toISOString();
};

// ── USERS ────────────────────────────────────────────────────────────────────
export const USERS = {
  'riyashmoorthy@gmail.com': {
    id: 1, name: 'Riyash Moorthy', email: 'riyashmoorthy@gmail.com',
    role: 'AO', token: 'mock_token_ao',
  },
  '23ec094@kpriet.ac.in': {
    id: 2, name: 'Admin EC094', email: '23ec094@kpriet.ac.in',
    role: 'ADMIN', token: 'mock_token_admin1',
  },
  '23ec115@kpriet.ac.in': {
    id: 3, name: 'Admin EC115', email: '23ec115@kpriet.ac.in',
    role: 'ADMIN', token: 'mock_token_admin2',
  },
  '23ecl03@kpriet.ac.in': {
    id: 4, name: 'Admin ECL03', email: '23ecl03@kpriet.ac.in',
    role: 'ADMIN', token: 'mock_token_admin3',
  },
  'driver1@kpriet.ac.in': {
    id: 5, name: 'Kumar Selvam', email: 'driver1@kpriet.ac.in',
    role: 'DRIVER', token: 'mock_token_driver1', driver_id: 1,
  },
};

export const PASSWORDS = {
  'riyashmoorthy@gmail.com': 'AO@KPRIET',
  '23ec094@kpriet.ac.in': '23EC094',
  '23ec115@kpriet.ac.in': '23EC115',
  '23ecl03@kpriet.ac.in': '23ECL03',
  'driver1@kpriet.ac.in': 'Driver1',
};

// ── ROUTES ───────────────────────────────────────────────────────────────────
export const ROUTES = [
  {
    id: 1, route_name: 'Route A – Gandhipuram', description: 'Main city route via Gandhipuram',
    stops: ['KPRIET Campus', 'Saravanampatti', 'Singanallur', 'Gandhipuram', 'Town Hall'],
    distance_km: 18, estimated_duration_min: 45, is_active: true,
  },
  {
    id: 2, route_name: 'Route B – RS Puram', description: 'South city route',
    stops: ['KPRIET Campus', 'Peelamedu', 'Ramanathapuram', 'RS Puram', 'Railway Station'],
    distance_km: 22, estimated_duration_min: 55, is_active: true,
  },
  {
    id: 3, route_name: 'Route C – Ukkadam', description: 'East route via Ukkadam',
    stops: ['KPRIET Campus', 'Kovaipudur', 'Ganapathy', 'Ukkadam', 'Podanur'],
    distance_km: 16, estimated_duration_min: 40, is_active: true,
  },
  {
    id: 4, route_name: 'Route D – Pollachi Road', description: 'West route via Pollachi',
    stops: ['KPRIET Campus', 'Sulur', 'Kinathukadavu', 'Pollachi Road', 'Annur'],
    distance_km: 24, estimated_duration_min: 60, is_active: true,
  },
  {
    id: 5, route_name: 'Route E – Mettupalayam', description: 'North hill route',
    stops: ['KPRIET Campus', 'Kalapatti', 'Thudiyalur', 'Mettupalayam Road', 'Siruvani Rd'],
    distance_km: 20, estimated_duration_min: 50, is_active: true,
  },
];

// ── DRIVERS ──────────────────────────────────────────────────────────────────
export const DRIVERS = [
  { id: 1, user_id: 5, name: 'Kumar Selvam', email: 'driver1@kpriet.ac.in', phone: '9876543210', license_number: 'TN38 20240001', experience_years: 12, is_present: true, is_active: true, assigned_bus_id: 1, assigned_bus_number: 'Bus 1', bus_number: 'Bus 1' },
  { id: 2, user_id: null, name: 'Murugan Rajan', email: 'driver2@kpriet.ac.in', phone: '9876543211', license_number: 'TN38 20240002', experience_years: 8, is_present: true, is_active: true, assigned_bus_id: 2, assigned_bus_number: 'Bus 2', bus_number: 'Bus 2' },
  { id: 3, user_id: null, name: 'Senthil Kumar', email: 'driver3@kpriet.ac.in', phone: '9876543212', license_number: 'TN38 20240003', experience_years: 15, is_present: false, is_active: true, assigned_bus_id: 3, assigned_bus_number: 'Bus 3', bus_number: 'Bus 3' },
  { id: 4, user_id: null, name: 'Arumugam P', email: 'driver4@kpriet.ac.in', phone: '9876543213', license_number: 'TN38 20240004', experience_years: 6, is_present: true, is_active: true, assigned_bus_id: 4, assigned_bus_number: 'Bus 4', bus_number: 'Bus 4' },
  { id: 5, user_id: null, name: 'Velmurugan S', email: 'driver5@kpriet.ac.in', phone: '9876543214', license_number: 'TN38 20240005', experience_years: 10, is_present: true, is_active: true, assigned_bus_id: 5, assigned_bus_number: 'Bus 5', bus_number: 'Bus 5' },
  { id: 6, user_id: null, name: 'Govindasamy R', email: 'driver6@kpriet.ac.in', phone: '9876543215', license_number: 'TN38 20240006', experience_years: 9, is_present: true, is_active: true, assigned_bus_id: 6, assigned_bus_number: 'Bus 6', bus_number: 'Bus 6' },
  { id: 7, user_id: null, name: 'Marimuthu K', email: 'driver7@kpriet.ac.in', phone: '9876543216', license_number: 'TN38 20240007', experience_years: 11, is_present: false, is_active: true, assigned_bus_id: 7, assigned_bus_number: 'Bus 7', bus_number: 'Bus 7' },
  { id: 8, user_id: null, name: 'Sundaram A', email: 'driver8@kpriet.ac.in', phone: '9876543217', license_number: 'TN38 20240008', experience_years: 7, is_present: true, is_active: true, assigned_bus_id: 8, assigned_bus_number: 'Bus 8', bus_number: 'Bus 8' },
];

// ── BUSES ────────────────────────────────────────────────────────────────────
export const BUSES = [
  { id: 1, bus_number: 'Bus 1', vehicle_number: 'TN 38 AB 1001', capacity: 52, status: 'INSIDE', route_id: 1, current_driver_id: 1, is_active: true, route_name: 'Route A – Gandhipuram', driver_name: 'Kumar Selvam', driver_phone: '9876543210', driver_present: true, last_entry_time: fmt(8, 22), last_exit_time: null },
  { id: 2, bus_number: 'Bus 2', vehicle_number: 'TN 38 AB 1002', capacity: 48, status: 'INSIDE', route_id: 2, current_driver_id: 2, is_active: true, route_name: 'Route B – RS Puram', driver_name: 'Murugan Rajan', driver_phone: '9876543211', driver_present: true, last_entry_time: fmt(8, 35), last_exit_time: null },
  { id: 3, bus_number: 'Bus 3', vehicle_number: 'TN 38 AB 1003', capacity: 52, status: 'INSIDE', route_id: 3, current_driver_id: 3, is_active: true, route_name: 'Route C – Ukkadam', driver_name: 'Senthil Kumar', driver_phone: '9876543212', driver_present: false, last_entry_time: fmt(8, 50), last_exit_time: null },
  { id: 4, bus_number: 'Bus 4', vehicle_number: 'TN 38 AB 1004', capacity: 56, status: 'INSIDE', route_id: 4, current_driver_id: 4, is_active: true, route_name: 'Route D – Pollachi Road', driver_name: 'Arumugam P', driver_phone: '9876543213', driver_present: true, last_entry_time: fmt(8, 15), last_exit_time: null },
  { id: 5, bus_number: 'Bus 5', vehicle_number: 'TN 38 AB 1005', capacity: 48, status: 'INSIDE', route_id: 5, current_driver_id: 5, is_active: true, route_name: 'Route E – Mettupalayam', driver_name: 'Velmurugan S', driver_phone: '9876543214', driver_present: true, last_entry_time: fmt(8, 40), last_exit_time: null },
  { id: 6, bus_number: 'Bus 6', vehicle_number: 'TN 38 AB 1006', capacity: 52, status: 'OUTSIDE', route_id: 1, current_driver_id: 6, is_active: true, route_name: 'Route A – Gandhipuram', driver_name: 'Govindasamy R', driver_phone: '9876543215', driver_present: true, last_entry_time: fmt(8, 30, -1), last_exit_time: fmt(17, 10, -1) },
  { id: 7, bus_number: 'Bus 7', vehicle_number: 'TN 38 AB 1007', capacity: 48, status: 'INSIDE', route_id: 2, current_driver_id: 7, is_active: true, route_name: 'Route B – RS Puram', driver_name: 'Marimuthu K', driver_phone: '9876543216', driver_present: false, last_entry_time: fmt(9, 5), last_exit_time: null },
  { id: 8, bus_number: 'Bus 8', vehicle_number: 'TN 38 AB 1008', capacity: 52, status: 'INSIDE', route_id: 3, current_driver_id: 8, is_active: true, route_name: 'Route C – Ukkadam', driver_name: 'Sundaram A', driver_phone: '9876543217', driver_present: true, last_entry_time: fmt(8, 28), last_exit_time: null },
];

// ── ATTENDANCE LOGS ───────────────────────────────────────────────────────────
export const ATTENDANCE_LOGS = [
  { id: 1, bus_id: 4, bus_number: 'Bus 4', event_type: 'ENTRY', plate_detected: 'TN38AB1004', confidence_score: 0.97, timestamp: fmt(8, 15), is_manual: false, driver_id: 4 },
  { id: 2, bus_id: 1, bus_number: 'Bus 1', event_type: 'ENTRY', plate_detected: 'TN38AB1001', confidence_score: 0.95, timestamp: fmt(8, 22), is_manual: false, driver_id: 1 },
  { id: 3, bus_id: 8, bus_number: 'Bus 8', event_type: 'ENTRY', plate_detected: 'TN38AB1008', confidence_score: 0.92, timestamp: fmt(8, 28), is_manual: false, driver_id: 8 },
  { id: 4, bus_id: 6, bus_number: 'Bus 6', event_type: 'ENTRY', plate_detected: 'TN38AB1006', confidence_score: 0.89, timestamp: fmt(8, 30), is_manual: false, driver_id: 6 },
  { id: 5, bus_id: 2, bus_number: 'Bus 2', event_type: 'ENTRY', plate_detected: 'TN38AB1002', confidence_score: 0.91, timestamp: fmt(8, 35), is_manual: false, driver_id: 2 },
  { id: 6, bus_id: 5, bus_number: 'Bus 5', event_type: 'ENTRY', plate_detected: 'TN38AB1005', confidence_score: 0.88, timestamp: fmt(8, 40), is_manual: false, driver_id: 5 },
  { id: 7, bus_id: 3, bus_number: 'Bus 3', event_type: 'ENTRY', plate_detected: 'TN38AB1003', confidence_score: 0.76, timestamp: fmt(8, 50), is_manual: false, driver_id: 3 },
  { id: 8, bus_id: 7, bus_number: 'Bus 7', event_type: 'ENTRY', plate_detected: null, confidence_score: null, timestamp: fmt(9, 5), is_manual: true, driver_id: 7 },
];

// ── RANKINGS ─────────────────────────────────────────────────────────────────
export const RANKINGS = [
  { id: 1, bus_id: 4, bus_number: 'Bus 4', vehicle_number: 'TN 38 AB 1004', route_name: 'Route D – Pollachi Road', driver_name: 'Arumugam P', daily_rank: 1, punctuality_score: 100, date: today.toISOString().split('T')[0], entry_time: fmt(8, 15), on_time: true },
  { id: 2, bus_id: 1, bus_number: 'Bus 1', vehicle_number: 'TN 38 AB 1001', route_name: 'Route A – Gandhipuram', driver_name: 'Kumar Selvam', daily_rank: 2, punctuality_score: 97, date: today.toISOString().split('T')[0], entry_time: fmt(8, 22), on_time: true },
  { id: 3, bus_id: 8, bus_number: 'Bus 8', vehicle_number: 'TN 38 AB 1008', route_name: 'Route C – Ukkadam', driver_name: 'Sundaram A', daily_rank: 3, punctuality_score: 93, date: today.toISOString().split('T')[0], entry_time: fmt(8, 28), on_time: true },
  { id: 4, bus_id: 6, bus_number: 'Bus 6', vehicle_number: 'TN 38 AB 1006', route_name: 'Route A – Gandhipuram', driver_name: 'Govindasamy R', daily_rank: 4, punctuality_score: 91, date: today.toISOString().split('T')[0], entry_time: fmt(8, 30), on_time: true },
  { id: 5, bus_id: 2, bus_number: 'Bus 2', vehicle_number: 'TN 38 AB 1002', route_name: 'Route B – RS Puram', driver_name: 'Murugan Rajan', daily_rank: 5, punctuality_score: 87, date: today.toISOString().split('T')[0], entry_time: fmt(8, 35), on_time: true },
  { id: 6, bus_id: 5, bus_number: 'Bus 5', vehicle_number: 'TN 38 AB 1005', route_name: 'Route E – Mettupalayam', driver_name: 'Velmurugan S', daily_rank: 6, punctuality_score: 84, date: today.toISOString().split('T')[0], entry_time: fmt(8, 40), on_time: true },
  { id: 7, bus_id: 3, bus_number: 'Bus 3', vehicle_number: 'TN 38 AB 1003', route_name: 'Route C – Ukkadam', driver_name: 'Senthil Kumar', daily_rank: 7, punctuality_score: 62, date: today.toISOString().split('T')[0], entry_time: fmt(8, 50), on_time: false },
  { id: 8, bus_id: 7, bus_number: 'Bus 7', vehicle_number: 'TN 38 AB 1007', route_name: 'Route B – RS Puram', driver_name: 'Marimuthu K', daily_rank: 8, punctuality_score: 48, date: today.toISOString().split('T')[0], entry_time: fmt(9, 5), on_time: false },
];

// ── VERIFICATION LOGS (AI) ────────────────────────────────────────────────────
export const VERIFICATION_LOGS = [
  { id: 1, bus_id: 4, bus_number: 'Bus 4', driver_id: 4, driver_name: 'Arumugam P', face_verified: true, drowsiness_detected: false, seatbelt_detected: true, confidence_score: 0.97, timestamp: fmt(8, 16) },
  { id: 2, bus_id: 1, bus_number: 'Bus 1', driver_id: 1, driver_name: 'Kumar Selvam', face_verified: true, drowsiness_detected: false, seatbelt_detected: true, confidence_score: 0.95, timestamp: fmt(8, 23) },
  { id: 3, bus_id: 8, bus_number: 'Bus 8', driver_id: 8, driver_name: 'Sundaram A', face_verified: true, drowsiness_detected: false, seatbelt_detected: true, confidence_score: 0.92, timestamp: fmt(8, 29) },
  { id: 4, bus_id: 6, bus_number: 'Bus 6', driver_id: 6, driver_name: 'Govindasamy R', face_verified: false, drowsiness_detected: false, seatbelt_detected: true, confidence_score: 0.61, timestamp: fmt(8, 31), alert: 'Driver face mismatch!' },
  { id: 5, bus_id: 2, bus_number: 'Bus 2', driver_id: 2, driver_name: 'Murugan Rajan', face_verified: true, drowsiness_detected: true, seatbelt_detected: true, confidence_score: 0.91, timestamp: fmt(8, 36), alert: 'Drowsiness detected!' },
  { id: 6, bus_id: 5, bus_number: 'Bus 5', driver_id: 5, driver_name: 'Velmurugan S', face_verified: true, drowsiness_detected: false, seatbelt_detected: false, confidence_score: 0.88, timestamp: fmt(8, 41), alert: 'Seatbelt not detected!' },
  { id: 7, bus_id: 3, bus_number: 'Bus 3', driver_id: 3, driver_name: 'Senthil Kumar', face_verified: true, drowsiness_detected: false, seatbelt_detected: true, confidence_score: 0.76, timestamp: fmt(8, 51) },
  { id: 8, bus_id: 7, bus_number: 'Bus 7', driver_id: 7, driver_name: 'Marimuthu K', face_verified: true, drowsiness_detected: false, seatbelt_detected: true, confidence_score: 0.83, timestamp: fmt(9, 6) },
];

// ── GATE PASSES ───────────────────────────────────────────────────────────────
export let GATE_PASSES = [
  { id: 1, driver_id: 3, driver_name: 'Senthil Kumar', bus_number: 'Bus 3', request_type: 'FUEL', reason: 'Vehicle fuel refilling at BPCL pump near RS Puram', requested_at: fmt(7, 30), status: 'PENDING', reviewed_by_name: null, approved_at: null, review_notes: null },
  { id: 2, driver_id: 7, driver_name: 'Marimuthu K', bus_number: 'Bus 7', request_type: 'SERVICE', reason: 'Tyre replacement service at authorized workshop', requested_at: fmt(8, 0), status: 'PENDING', reviewed_by_name: null, approved_at: null, review_notes: null },
  { id: 3, driver_id: 1, driver_name: 'Kumar Selvam', bus_number: 'Bus 1', request_type: 'SERVICE', reason: 'Engine oil change – scheduled maintenance', requested_at: fmt(6, 45, -1), status: 'APPROVED', reviewed_by_name: 'Riyash Moorthy', approved_at: fmt(7, 15, -1), review_notes: 'Approved. Return by 10 AM.' },
  { id: 4, driver_id: 5, driver_name: 'Velmurugan S', bus_number: 'Bus 5', request_type: 'OTHER', reason: 'AC repair at authorized service center', requested_at: fmt(9, 0, -2), status: 'REJECTED', reviewed_by_name: 'Riyash Moorthy', approved_at: fmt(9, 30, -2), review_notes: 'Rejected. Schedule during weekend.' },
];

// ── ROUTE CHANGES ─────────────────────────────────────────────────────────────
export let ROUTE_CHANGES = [
  { id: 1, driver_id: 2, driver_name: 'Murugan Rajan', bus_number: 'Bus 2', current_route_name: 'Route B – RS Puram', requested_route_name: 'Route C – Ukkadam', reason: 'Road construction on main route causes 30+ min delay', requested_at: fmt(7, 45), status: 'PENDING', reviewed_by_name: null, approved_at: null },
  { id: 2, driver_id: 4, driver_name: 'Arumugam P', bus_number: 'Bus 4', current_route_name: 'Route D – Pollachi Road', requested_route_name: 'Route E – Mettupalayam', reason: 'Flooding at Sulur underpass – temporary reroute needed', requested_at: fmt(8, 10), status: 'PENDING', reviewed_by_name: null, approved_at: null },
  { id: 3, driver_id: 6, driver_name: 'Govindasamy R', bus_number: 'Bus 6', current_route_name: 'Route A – Gandhipuram', requested_route_name: 'Route B – RS Puram', reason: 'Traffic signal failure near Gandhipuram junction', requested_at: fmt(7, 30, -1), status: 'APPROVED', reviewed_by_name: 'Riyash Moorthy', approved_at: fmt(7, 55, -1) },
];

// ── BUS SUMMARY ───────────────────────────────────────────────────────────────
export const BUS_SUMMARY = {
  totalBuses: 8,
  busesInside: 7,
  busesOutside: 1,
  driversPresent: 6,
  driversAbsent: 2,
  alertsToday: 3,
  pendingApprovals: 4,
};

// ── DRIVER PORTAL DATA ────────────────────────────────────────────────────────
export const DRIVER_DATA = {
  driver: DRIVERS[0],
  bus: BUSES[0],
  pendingRequests: [GATE_PASSES[0]],
};
