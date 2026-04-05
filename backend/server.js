// Load env vars FIRST — before any other require() that might read process.env
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db');
const orderRoutes = require('./src/routes/orderRoutes');
const dishRoutes = require('./src/routes/dishRoutes');
const whatsappRoutes = require('./src/routes/whatsappRoutes');
const simpleWhatsappRoutes = require('./src/routes/simpleWhatsappRoutes');
const broadcastRoutes = require('./src/routes/broadcastRoutes');
const deliveryPartnerRoutes = require('./src/routes/deliveryPartnerRoutes');

const app = express();

// ── CORS — must be before all routes ──────────────────────
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control, Pragma');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Max-Age', '86400');
  if (req.method === 'OPTIONS') return res.status(200).end();
  next();
});

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization', 'Cache-Control', 'Pragma'],
  credentials: true
}));

// ── Body parsing — must be before all routes ──────────────
app.use(express.json());

// ── DB ────────────────────────────────────────────────────
connectDB();

// ── Health check ──────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ status: 'OrderEase API is running' });
});

// ── Static uploads ────────────────────────────────────────
app.use('/uploads', express.static('uploads'));

// ── API routes — ALL defined before any catch-all ─────────
app.use('/api', dishRoutes);
app.use('/api', orderRoutes);
app.use('/api', broadcastRoutes);
app.use('/api', deliveryPartnerRoutes);
app.use('/api/whatsapp', simpleWhatsappRoutes);

// ── Global error handler (Express 5 compatible) ───────────
app.use((err, req, res, next) => {
  console.error('[Server Error]', err.message);
  // Always respond with JSON — never fall through to HTML
  if (res.headersSent) return next(err);
  res.status(err.status || 500).json({ error: err.message || 'Server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});