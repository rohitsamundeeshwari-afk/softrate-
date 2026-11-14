const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

dotenv.config();

const { connectDB, getDBStatus } = require('./config/db');
const { initStore } = require('./data/store');
const { getStats } = require('./controllers/postController');

const postRoutes = require('./routes/postRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Trust reverse proxies
app.set('trust proxy', 1);

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Helper to find index.html across root dist or frontend/dist
function getStaticIndexPath() {
  const candidates = [
    path.join(__dirname, '../dist/index.html'),
    path.join(__dirname, '../frontend/dist/index.html'),
    path.join(process.cwd(), 'dist/index.html'),
    path.join(process.cwd(), 'frontend/dist/index.html'),
  ];
  for (const c of candidates) {
    if (fs.existsSync(c)) return c;
  }
  return null;
}

// Serve static assets (JS, CSS, images) from dist
const distDir = path.join(__dirname, '../dist');
const frontendDistDir = path.join(__dirname, '../frontend/dist');
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));
}
if (fs.existsSync(frontendDistDir)) {
  app.use(express.static(frontendDistDir));
}

// API Health Check
app.get(['/api/health', '/health'], (req, res) => {
  const dbStatus = getDBStatus();
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    database: dbStatus,
    version: '1.0.0',
    app: 'TechPulse MERN Blog Platform',
  });
});

// API Routes
app.use(['/api/posts', '/posts'], postRoutes);
app.use(['/api/categories', '/categories'], categoryRoutes);
app.use(['/api/auth', '/auth'], authRoutes);
app.get(['/api/stats', '/stats'], getStats);

// SPA Routing - All client-side pages serve the compiled React index.html
// Using middleware instead of string wildcard to ensure 100% Express 5 compatibility
app.use((req, res, next) => {
  if (req.method !== 'GET') {
    return next();
  }
  if (req.path.startsWith('/api')) {
    return next();
  }
  const indexPath = getStaticIndexPath();
  if (indexPath) {
    return res.sendFile(indexPath);
  }
  return res.json({
    status: 'online',
    app: 'TechPulse MERN Blog Platform',
    message: 'Backend server is active. Build frontend with npm run build to enable UI.',
    endpoints: {
      health: '/api/health',
      posts: '/api/posts',
      categories: '/api/categories',
      stats: '/api/stats',
      login: '/api/auth/login',
    },
  });
});

// 404 Handler for undefined API routes
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route not found - ${req.originalUrl}` });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack || err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// Initialize database & seed store immediately
connectDB();
initStore();

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(`🚀 TechPulse Backend Server running on port \x1b[32m${PORT}\x1b[0m`);
    console.log(`📡 API Health: \x1b[36mhttp://localhost:${PORT}/api/health\x1b[0m`);
    console.log(`📑 Posts Endpoint: \x1b[36mhttp://localhost:${PORT}/api/posts\x1b[0m`);
    console.log(`📂 Categories Endpoint: \x1b[36mhttp://localhost:${PORT}/api/categories\x1b[0m`);
    console.log(`🔐 Admin Credentials: admin@techblog.com / admin123`);
    console.log(`======================================================\n`);
  });
}

module.exports = app;
