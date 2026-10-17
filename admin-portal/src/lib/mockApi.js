// ── PULSE PLATE Mock API ──────────────────────────────────────────────────────
// Intercepts all axios calls and returns realistic demo data.
// Enabled when VITE_MOCK_MODE=true or no backend is available.

import MockAdapter from 'axios-mock-adapter';
import {
  USERS, PASSWORDS, BUSES, DRIVERS, ROUTES,
  ATTENDANCE_LOGS, RANKINGS, VERIFICATION_LOGS,
  GATE_PASSES, ROUTE_CHANGES, BUS_SUMMARY, DRIVER_DATA,
} from './mockData';

const delay = (ms = 350) => new Promise(r => setTimeout(r, ms));

export function setupMock(axiosInstance) {
  const mock = new MockAdapter(axiosInstance, { delayResponse: 350 });

  // ── AUTH ───────────────────────────────────────────────────────────────────
  mock.onPost('/auth/login').reply(async (config) => {
    const { email, password } = JSON.parse(config.data);
    await delay();
    const user = USERS[email?.toLowerCase()];
    if (!user || PASSWORDS[email?.toLowerCase()] !== password) {
      return [401, { error: 'Invalid email or password' }];
    }
    return [200, { token: user.token, user }];
  });

  mock.onGet('/auth/me').reply((config) => {
    const token = config.headers?.Authorization?.replace('Bearer ', '');
    const user = Object.values(USERS).find(u => u.token === token);
    if (!user) return [401, { error: 'Unauthorized' }];
    return [200, user];
  });

  // ── BUSES ──────────────────────────────────────────────────────────────────
  mock.onGet('/buses').reply(200, BUSES);
  mock.onGet('/buses/summary').reply(200, BUS_SUMMARY);
  mock.onGet('/buses/rankings/today').reply(200, RANKINGS);

  mock.onGet(/\/buses\/(\d+)$/).reply((config) => {
    const id = parseInt(config.url.split('/').pop());
    const bus = BUSES.find(b => b.id === id);
    return bus ? [200, bus] : [404, { error: 'Bus not found' }];
  });

  mock.onPatch(/\/buses\/(\d+)\/status/).reply((config) => {
    const id = parseInt(config.url.split('/')[2]);
    const { status } = JSON.parse(config.data);
    const bus = BUSES.find(b => b.id === id);
    if (bus) bus.status = status;
    return [200, bus || {}];
  });

  // ── ATTENDANCE ─────────────────────────────────────────────────────────────
  mock.onGet('/attendance/today').reply(200, ATTENDANCE_LOGS);
  mock.onGet('/attendance').reply(200, ATTENDANCE_LOGS);
  mock.onPost('/attendance').reply((config) => {
    const data = JSON.parse(config.data);
    const newLog = { id: Date.now(), ...data, timestamp: new Date().toISOString() };
    ATTENDANCE_LOGS.unshift(newLog);
    return [201, newLog];
  });

  // ── DRIVERS ────────────────────────────────────────────────────────────────
  mock.onGet('/drivers').reply(200, DRIVERS);
  mock.onGet('/drivers/verification-logs').reply(200, VERIFICATION_LOGS);

  mock.onGet(/\/drivers\/(\d+)$/).reply((config) => {
    const id = parseInt(config.url.split('/').pop());
    const driver = DRIVERS.find(d => d.id === id);
    return driver ? [200, driver] : [404, { error: 'Driver not found' }];
  });

  // Driver portal data (Bus assigned to driver1)
  mock.onGet('/drivers/my-bus').reply(200, {
    bus: BUSES[0],
    gate_pass_requests: GATE_PASSES.filter(gp => gp.driver_id === 1),
    route_change_requests: ROUTE_CHANGES.filter(rc => rc.driver_id === 1),
  });

  mock.onPatch(/\/drivers\/(\d+)\/presence/).reply((config) => {
    const id = parseInt(config.url.split('/')[2]);
    const { is_present } = JSON.parse(config.data);
    const driver = DRIVERS.find(d => d.id === id);
    if (driver) driver.is_present = is_present;
    return [200, driver || {}];
  });

  // ── ROUTES ─────────────────────────────────────────────────────────────────
  mock.onGet('/routes').reply(200, ROUTES);

  mock.onGet(/\/routes\/(\d+)$/).reply((config) => {
    const id = parseInt(config.url.split('/').pop());
    const route = ROUTES.find(r => r.id === id);
    return route ? [200, route] : [404, { error: 'Route not found' }];
  });

  // ── GATE PASSES ────────────────────────────────────────────────────────────
  mock.onGet('/gate-passes').reply(200, GATE_PASSES);

  mock.onPost('/gate-passes').reply((config) => {
    const data = JSON.parse(config.data);
    const newGP = {
      id: Date.now(),
      ...data,
      status: 'PENDING',
      requested_date: new Date().toISOString(),
      approved_by: null,
      approved_at: null,
    };
    GATE_PASSES.unshift(newGP);
    return [201, newGP];
  });

  // Gate pass review (approve or reject) — matches PATCH /gate-passes/:id/review
  mock.onPatch(/\/gate-passes\/(\d+)\/review/).reply((config) => {
    const id = parseInt(config.url.split('/')[2]);
    const { status, review_notes } = JSON.parse(config.data || '{}');
    const gp = GATE_PASSES.find(g => g.id === id);
    if (gp) {
      gp.status = status;
      gp.reviewed_by_name = 'Riyash Moorthy';
      gp.approved_at = new Date().toISOString();
      gp.review_notes = review_notes || null;
      BUS_SUMMARY.pendingApprovals = Math.max(0, BUS_SUMMARY.pendingApprovals - 1);
    }
    return [200, gp || {}];
  });

  // Also handle /approve and /reject variants
  mock.onPatch(/\/gate-passes\/(\d+)\/approve/).reply((config) => {
    const id = parseInt(config.url.split('/')[2]);
    const { review_notes } = JSON.parse(config.data || '{}');
    const gp = GATE_PASSES.find(g => g.id === id);
    if (gp) { gp.status = 'APPROVED'; gp.reviewed_by_name = 'Riyash Moorthy'; gp.approved_at = new Date().toISOString(); gp.review_notes = review_notes || null; BUS_SUMMARY.pendingApprovals = Math.max(0, BUS_SUMMARY.pendingApprovals - 1); }
    return [200, gp || {}];
  });

  mock.onPatch(/\/gate-passes\/(\d+)\/reject/).reply((config) => {
    const id = parseInt(config.url.split('/')[2]);
    const { review_notes } = JSON.parse(config.data || '{}');
    const gp = GATE_PASSES.find(g => g.id === id);
    if (gp) { gp.status = 'REJECTED'; gp.reviewed_by_name = 'Riyash Moorthy'; gp.approved_at = new Date().toISOString(); gp.review_notes = review_notes || null; BUS_SUMMARY.pendingApprovals = Math.max(0, BUS_SUMMARY.pendingApprovals - 1); }
    return [200, gp || {}];
  });

  // ── ROUTE CHANGES ──────────────────────────────────────────────────────────
  mock.onGet('/route-changes').reply(200, ROUTE_CHANGES);

  mock.onPost('/route-changes').reply((config) => {
    const data = JSON.parse(config.data);
    const newRC = {
      id: Date.now(),
      ...data,
      status: 'PENDING',
      requested_at: new Date().toISOString(),
      reviewed_by_name: null,
      approved_at: null,
    };
    ROUTE_CHANGES.unshift(newRC);
    return [201, newRC];
  });

  mock.onPatch(/\/route-changes\/(\d+)\/review/).reply((config) => {
    const id = parseInt(config.url.split('/')[2]);
    const { status, review_notes } = JSON.parse(config.data || '{}');
    const rc = ROUTE_CHANGES.find(r => r.id === id);
    if (rc) {
      rc.status = status;
      rc.reviewed_by_name = 'Riyash Moorthy';
      rc.approved_at = new Date().toISOString();
      rc.review_notes = review_notes || null;
      BUS_SUMMARY.pendingApprovals = Math.max(0, BUS_SUMMARY.pendingApprovals - 1);
    }
    return [200, rc || {}];
  });

  mock.onPatch(/\/route-changes\/(\d+)\/approve/).reply((config) => {
    const id = parseInt(config.url.split('/')[2]);
    const rc = ROUTE_CHANGES.find(r => r.id === id);
    if (rc) { rc.status = 'APPROVED'; rc.reviewed_by_name = 'Riyash Moorthy'; rc.approved_at = new Date().toISOString(); BUS_SUMMARY.pendingApprovals = Math.max(0, BUS_SUMMARY.pendingApprovals - 1); }
    return [200, rc || {}];
  });

  mock.onPatch(/\/route-changes\/(\d+)\/reject/).reply((config) => {
    const id = parseInt(config.url.split('/')[2]);
    const rc = ROUTE_CHANGES.find(r => r.id === id);
    if (rc) { rc.status = 'REJECTED'; rc.reviewed_by_name = 'Riyash Moorthy'; rc.approved_at = new Date().toISOString(); BUS_SUMMARY.pendingApprovals = Math.max(0, BUS_SUMMARY.pendingApprovals - 1); }
    return [200, rc || {}];
  });

  // ── STUDENTS ───────────────────────────────────────────────────────────────
  mock.onGet('/students').reply(200, []);
  mock.onGet('/students/my-notifications').reply(200, []);

  console.log('🎭 PULSE PLATE Mock API active – no backend required');
  return mock;
}
