// ── PULSE PLATE Student Portal Mock API ────────────────────────────────────
import MockAdapter from 'axios-mock-adapter';

const today = new Date();
const fmt = (h, m, offset = 0) => {
  const d = new Date(today);
  d.setDate(d.getDate() + offset);
  d.setHours(h, m, 0, 0);
  return d.toISOString();
};

const STUDENTS = {
  'student1@kpriet.ac.in': {
    user: { id: 1, name: 'Priya S', email: 'student1@kpriet.ac.in', role: 'STUDENT', token: 'mock_token_s1' },
    profile: {
      id: 1, name: 'Priya S', email: 'student1@kpriet.ac.in', role: 'STUDENT',
      roll_number: '23EC001', selected_bus_id: 1, bus_number: 'Bus 1', vehicle_number: 'TN 38 AB 1001',
      bus_status: 'INSIDE', route_id: 1, route_name: 'Route A – Gandhipuram',
      boarding_stop: 'Peelamedu', boarding_stop_order: 3,
      driver_name: 'Murugan K', driver_present: true, last_entry_time: fmt(8, 22), last_exit_time: null,
      route_stops: [
        { name: 'KPRIET Campus', estimated_minutes: 0 },
        { name: 'Saravanampatti', estimated_minutes: 10 },
        { name: 'Singanallur', estimated_minutes: 22 },
        { name: 'Gandhipuram', estimated_minutes: 35 },
        { name: 'Town Hall', estimated_minutes: 45 },
      ],
    },
  },
  'student2@kpriet.ac.in': {
    user: { id: 2, name: 'Arun M', email: 'student2@kpriet.ac.in', role: 'STUDENT', token: 'mock_token_s2' },
    profile: {
      id: 2, name: 'Arun M', email: 'student2@kpriet.ac.in', role: 'STUDENT',
      roll_number: '23EC002', selected_bus_id: 2, bus_number: 'Bus 2', vehicle_number: 'TN 38 AB 1002',
      bus_status: 'INSIDE', route_id: 2, route_name: 'Route B – RS Puram',
      boarding_stop: 'Saibaba Colony', boarding_stop_order: 2,
      driver_name: 'Selvam R', driver_present: true, last_entry_time: fmt(8, 35), last_exit_time: null,
      route_stops: [
        { name: 'KPRIET Campus', estimated_minutes: 0 },
        { name: 'Peelamedu', estimated_minutes: 12 },
        { name: 'Ramanathapuram', estimated_minutes: 25 },
        { name: 'RS Puram', estimated_minutes: 38 },
        { name: 'Railway Station', estimated_minutes: 50 },
      ],
    },
  },
  'student3@kpriet.ac.in': {
    user: { id: 3, name: 'Deepa K', email: 'student3@kpriet.ac.in', role: 'STUDENT', token: 'mock_token_s3' },
    profile: {
      id: 3, name: 'Deepa K', email: 'student3@kpriet.ac.in', role: 'STUDENT',
      roll_number: '23EC003', selected_bus_id: 3, bus_number: 'Bus 3', vehicle_number: 'TN 38 AB 1003',
      bus_status: 'INSIDE', route_id: 3, route_name: 'Route C – Ukkadam',
      boarding_stop: 'Singanallur', boarding_stop_order: 1,
      driver_name: 'Rajan P', driver_present: true, last_entry_time: fmt(8, 50), last_exit_time: null,
      route_stops: [
        { name: 'KPRIET Campus', estimated_minutes: 0 },
        { name: 'Kovaipudur', estimated_minutes: 15 },
        { name: 'Ganapathy', estimated_minutes: 26 },
        { name: 'Ukkadam', estimated_minutes: 38 },
      ],
    },
  },
  'student4@kpriet.ac.in': {
    user: { id: 4, name: 'Vijay R', email: 'student4@kpriet.ac.in', role: 'STUDENT', token: 'mock_token_s4' },
    profile: {
      id: 4, name: 'Vijay R', email: 'student4@kpriet.ac.in', role: 'STUDENT',
      roll_number: '23EC004', selected_bus_id: 1, bus_number: 'Bus 1', vehicle_number: 'TN 38 AB 1001',
      bus_status: 'INSIDE', route_id: 1, route_name: 'Route A – Gandhipuram',
      boarding_stop: 'Gandhipuram', boarding_stop_order: 1,
      driver_name: 'Murugan K', driver_present: true, last_entry_time: fmt(8, 22), last_exit_time: null,
      route_stops: [
        { name: 'KPRIET Campus', estimated_minutes: 0 },
        { name: 'Saravanampatti', estimated_minutes: 10 },
        { name: 'Singanallur', estimated_minutes: 22 },
        { name: 'Gandhipuram', estimated_minutes: 35 },
      ],
    },
  },
  'student5@kpriet.ac.in': {
    user: { id: 5, name: 'Kavitha T', email: 'student5@kpriet.ac.in', role: 'STUDENT', token: 'mock_token_s5' },
    profile: {
      id: 5, name: 'Kavitha T', email: 'student5@kpriet.ac.in', role: 'STUDENT',
      roll_number: '23EC005', selected_bus_id: 2, bus_number: 'Bus 2', vehicle_number: 'TN 38 AB 1002',
      bus_status: 'INSIDE', route_id: 2, route_name: 'Route B – RS Puram',
      boarding_stop: 'Ukkadam', boarding_stop_order: 1,
      driver_name: 'Selvam R', driver_present: true, last_entry_time: fmt(8, 35), last_exit_time: null,
      route_stops: [
        { name: 'KPRIET Campus', estimated_minutes: 0 },
        { name: 'Peelamedu', estimated_minutes: 12 },
        { name: 'RS Puram', estimated_minutes: 38 },
      ],
    },
  },
};

let currentLoggedInEmail = 'student2@kpriet.ac.in';

// All buses for browsing
const ALL_BUSES = [
  { id: 1, bus_number: 'Bus 1', vehicle_number: 'TN 38 AB 1001', status: 'INSIDE', route_name: 'Route A – Gandhipuram', driver_name: 'Murugan K', capacity: 52, last_entry_time: fmt(8, 22) },
  { id: 2, bus_number: 'Bus 2', vehicle_number: 'TN 38 AB 1002', status: 'INSIDE', route_name: 'Route B – RS Puram', driver_name: 'Selvam R', capacity: 48, last_entry_time: fmt(8, 35) },
  { id: 3, bus_number: 'Bus 3', vehicle_number: 'TN 38 AB 1003', status: 'INSIDE', route_name: 'Route C – Ukkadam', driver_name: 'Rajan P', capacity: 52, last_entry_time: fmt(8, 50) },
  { id: 4, bus_number: 'Bus 4', vehicle_number: 'TN 38 AB 1004', status: 'INSIDE', route_name: 'Route D – Pollachi Road', driver_name: 'Arumugam S', capacity: 56, last_entry_time: fmt(8, 15) },
  { id: 5, bus_number: 'Bus 5', vehicle_number: 'TN 38 AB 1005', status: 'INSIDE', route_name: 'Route E – Mettupalayam', driver_name: 'Karthik V', capacity: 48, last_entry_time: fmt(8, 40) },
];

const NOTIFICATIONS = [
  { id: 1, type: 'BUS_ENTRY', title: 'Bus 2 Arrived', message: 'Your bus (Bus 2) has arrived at KPRIET campus at 8:35 AM', sent_at: fmt(8, 35) },
  { id: 2, type: 'ALERT', title: 'Route Advisory', message: 'Avinashi Road traffic cleared. Route running on regular schedule.', sent_at: fmt(8, 15) },
  { id: 3, type: 'BUS_EXIT', title: 'Evening Departure', message: 'Bus 2 is ready for evening departure at 4:45 PM.', sent_at: fmt(16, 40) },
];

export function setupMock(axiosInstance) {
  const mock = new MockAdapter(axiosInstance, { delayResponse: 300 });

  // ── AUTH ────────────────────────────────────────────────────────────────────
  mock.onPost('/auth/login').reply((config) => {
    const { email, password } = JSON.parse(config.data);
    const normalized = email?.toLowerCase().trim();
    if (STUDENTS[normalized] && password === 'Student1') {
      currentLoggedInEmail = normalized;
      return [200, { token: STUDENTS[normalized].user.token, user: STUDENTS[normalized].user }];
    }
    return [401, { error: 'Invalid email or password' }];
  });

  mock.onGet('/auth/me').reply(() => {
    const s = STUDENTS[currentLoggedInEmail] || STUDENTS['student2@kpriet.ac.in'];
    return [200, s.user];
  });

  // ── STUDENT PROFILE ─────────────────────────────────────────────────────────
  mock.onGet('/students/profile').reply(() => {
    const s = STUDENTS[currentLoggedInEmail] || STUDENTS['student2@kpriet.ac.in'];
    return [200, s.profile];
  });

  mock.onPatch('/students/profile').reply((config) => {
    const data = JSON.parse(config.data);
    const s = STUDENTS[currentLoggedInEmail] || STUDENTS['student2@kpriet.ac.in'];
    Object.assign(s.profile, data);
    return [200, s.profile];
  });

  mock.onPatch('/students/select-bus').reply((config) => {
    const data = JSON.parse(config.data);
    const s = STUDENTS[currentLoggedInEmail] || STUDENTS['student2@kpriet.ac.in'];
    const chosenBus = ALL_BUSES.find(b => String(b.id) === String(data.selected_bus_id));
    if (chosenBus) {
      s.profile.selected_bus_id = chosenBus.id;
      s.profile.bus_number = chosenBus.bus_number;
      s.profile.vehicle_number = chosenBus.vehicle_number;
      s.profile.route_name = chosenBus.route_name;
    }
    if (data.boarding_stop) {
      s.profile.boarding_stop = data.boarding_stop;
    }
    return [200, s.profile];
  });

  mock.onGet('/students/notifications').reply(200, NOTIFICATIONS);
  mock.onGet('/students/my-notifications').reply(200, NOTIFICATIONS);
  mock.onPatch('/students/notifications/read').reply(200, { ok: true });

  // ── BUSES ───────────────────────────────────────────────────────────────────
  mock.onGet('/buses').reply(200, ALL_BUSES);

  mock.onGet(/\/buses\/(\d+)$/).reply((config) => {
    const id = parseInt(config.url.split('/').pop());
    const bus = ALL_BUSES.find(b => b.id === id);
    if (!bus) return [404, { error: 'Bus not found' }];
    return [200, {
      ...bus,
      route_stops: [
        { name: 'KPRIET Campus', estimated_minutes: 0 },
        { name: 'Peelamedu', estimated_minutes: 12 },
        { name: 'Singanallur', estimated_minutes: 22 },
        { name: 'Gandhipuram', estimated_minutes: 35 },
      ],
      driver_present: true,
      driver_phone: '9876543210',
    }];
  });

  // ── ROUTES ──────────────────────────────────────────────────────────────────
  mock.onGet(/\/routes\/.*\/eta/).reply(() => {
    const now = new Date();
    const exitTime = new Date(fmt(17, 0));
    return [200, {
      stops: [
        { name: 'KPRIET Campus', eta_formatted: formatTime(exitTime), minutes_from_now: 0 },
        { name: 'Peelamedu', eta_formatted: formatTime(new Date(exitTime.getTime() + 12 * 60000)), minutes_from_now: 12 },
        { name: 'Singanallur', eta_formatted: formatTime(new Date(exitTime.getTime() + 22 * 60000)), minutes_from_now: 22 },
        { name: 'Saibaba Colony', eta_formatted: formatTime(new Date(exitTime.getTime() + 30 * 60000)), minutes_from_now: 30 },
        { name: 'Gandhipuram', eta_formatted: formatTime(new Date(exitTime.getTime() + 35 * 60000)), minutes_from_now: 35 },
      ],
    }];
  });

  console.log('🎭 PULSE PLATE Student Portal Mock API active');
  return mock;
}

function formatTime(date) {
  const h = date.getHours();
  const m = date.getMinutes();
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hh = String(h % 12 || 12).padStart(2, '0');
  const mm = String(m).padStart(2, '0');
  return `${hh}:${mm} ${ampm}`;
}
