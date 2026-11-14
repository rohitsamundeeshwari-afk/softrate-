const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
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

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Health check endpoint
app.get('/api/health', (req, res) => {
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
app.use('/api/posts', postRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/auth', authRoutes);
app.get('/api/stats', getStats);

// Static frontend serving if built
const frontendDist = path.join(__dirname, '../frontend/dist');
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  app.get(/^(?!\/api).+/, (req, res) => {
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
}

// 404 Handler for API
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: `Route not found - ${req.originalUrl}` });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// Start Server and initialize DB/Store
async function startServer() {
  await connectDB();
  await initStore();

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

startServer();
