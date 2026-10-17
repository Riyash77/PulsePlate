require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();
const server = http.createServer(app);

// ── CORS Setup ──────────────────────────────────────────────
const allowedOrigins = [
  process.env.ADMIN_PORTAL_URL  || 'http://localhost:3001',
  process.env.STUDENT_PORTAL_URL || 'http://localhost:3002',
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:5174',
];

// Dynamically allow ngrok / cloudflare tunnel / Vercel / Render / local-network origins
function isOriginAllowed(origin) {
  if (!origin) return true;                           // same-origin / curl / postman
  if (allowedOrigins.includes(origin)) return true;  // hard-coded list
  // Allow comma-separated custom ALLOWED_ORIGINS from environment variable
  if (process.env.ALLOWED_ORIGINS) {
    const customList = process.env.ALLOWED_ORIGINS.split(',').map((s) => s.trim());
    if (customList.includes(origin)) return true;
  }
  // Allow any Vercel, Render, ngrok or trycloudflare URL
  if (/\.vercel\.app$/.test(origin)) return true;
  if (/\.onrender\.com$/.test(origin)) return true;
  if (/\.ngrok(-free)?\.app$/.test(origin)) return true;
  if (/\.trycloudflare\.com$/.test(origin)) return true;
  // Allow local network (192.168.x.x, 10.x.x.x, 127.0.0.1)
  if (/^https?:\/\/(192\.168\.|10\.|127\.0\.0\.1)/.test(origin)) return true;
  return false;
}

app.use(cors({
  origin: (origin, callback) => {
    if (isOriginAllowed(origin)) callback(null, true);
    else callback(new Error('Not allowed by CORS: ' + origin));
  },
  credentials: true,
}));

// ── Socket.IO ────────────────────────────────────────────────
const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      if (isOriginAllowed(origin)) callback(null, true);
      else callback(new Error('Socket.IO CORS blocked: ' + origin));
    },
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log(`⚡ Socket connected: ${socket.id}`);
  socket.on('disconnect', () => {
    console.log(`❌ Socket disconnected: ${socket.id}`);
  });
});

// Make io accessible in controllers
app.set('io', io);

// ── Middleware ───────────────────────────────────────────────
app.use(helmet({ contentSecurityPolicy: false }));
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images
app.use('/uploads', express.static('uploads'));

// ── Health Check ─────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'PULSE PLATE API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// ── API Routes ───────────────────────────────────────────────
app.use('/api/auth', require('./routes/auth'));
app.use('/api/buses', require('./routes/buses'));
app.use('/api/attendance', require('./routes/attendance'));
app.use('/api/drivers', require('./routes/drivers'));
app.use('/api/gate-passes', require('./routes/gatePasses'));
app.use('/api/route-changes', require('./routes/routeChanges'));
app.use('/api/routes', require('./routes/routes'));
app.use('/api/students', require('./routes/students'));

// ── Error Handler ────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

// 404
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.path} not found` });
});

// ── Start Server ─────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
server.listen(PORT, '0.0.0.0', () => {  // bind to all interfaces for LAN/tunnel access
  console.log('');
  console.log('🚌 ═══════════════════════════════════════════════');
  console.log('   PULSE PLATE – Smart Transport Management API');
  console.log(`   Running on  : http://0.0.0.0:${PORT}`);
  console.log(`   Environment : ${process.env.NODE_ENV || 'development'}`);
  console.log('🚌 ═══════════════════════════════════════════════');
  console.log('');
});

module.exports = { app, server, io };
