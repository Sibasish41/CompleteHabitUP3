const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const http = require('http');
const socketHandler = require('./utils/socketHandler');
const environment = require('./utils/environment');

// Environment configuration is loaded by the environment utility
const config = environment.getConfig();

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const habitRoutes = require('./routes/habit');
const adminRoutes = require('./routes/admin');
const doctorRoutes = require('./routes/doctor');
const subscriptionRoutes = require('./routes/subscription');
const paymentRoutes = require('./routes/payment');
const meetingRoutes = require('./routes/meeting');
const messageRoutes = require('./routes/message');
const feedbackRoutes = require('./routes/feedback');
const dailyThoughtRoutes = require('./routes/dailyThought');
const systemSettingsRoutes = require('./routes/systemSettings');

// Import middleware
const { errorHandler } = require('./middleware/errorHandler');
const { authenticateToken } = require('./middleware/auth');

// Import database
const { testConnection, syncDatabase } = require('./models');
const { seedPermissions } = require('./utils/seedPermissions');
const { initializeMockDatabase } = require('./config/mockDatabase');
const ScheduledTasks = require('./utils/scheduledTasks');

const app = express();
const server = http.createServer(app);
const PORT = config.port;

// Environment-based rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimiting.windowMs,
  max: config.rateLimiting.max,
  message: 'Too many requests from this IP, please try again later.'
});

// Middleware
app.use(helmet());

// Environment-based CORS configuration
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, postman, etc.)
    if (!origin) return callback(null, true);
    
    if (config.cors.origins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      environment.warn(`CORS blocked origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: config.cors.credentials,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(limiter);

// Serve static files
app.use('/uploads', express.static('uploads'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'HabitUP Server is running',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', authenticateToken, userRoutes);
app.use('/api/habit', authenticateToken, habitRoutes);
app.use('/api/admin', authenticateToken, adminRoutes);
app.use('/api/doctor', authenticateToken, doctorRoutes);
app.use('/api/subscription', authenticateToken, subscriptionRoutes);
app.use('/api/payment', authenticateToken, paymentRoutes);
app.use('/api/meeting', authenticateToken, meetingRoutes);
app.use('/api/message', authenticateToken, messageRoutes);
app.use('/api/feedback', authenticateToken, feedbackRoutes);
app.use('/api/daily-thought', authenticateToken, dailyThoughtRoutes);
app.use('/api/system-settings', systemSettingsRoutes);

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Initialize database and start server
const startServer = async () => {
  try {
    // Validate environment variables
    environment.validateRequired();
    
    environment.log('🔧 Configuration loaded:', {
      environment: environment.getEnv(),
      port: PORT,
      database: config.database.name,
      corsOrigins: config.cors.origins,
      rateLimiting: config.rateLimiting
    });
    
    // Test database connection
    await testConnection();
    
    // Initialize mock database if using mock mode
    const useMockDatabase = process.env.NODE_ENV === 'test' || process.env.USE_MOCK_DB === 'true';
    if (useMockDatabase) {
      console.log('🧪 Using mock database for testing');
      await initializeMockDatabase();
    } else {
      // Sync database models
      await syncDatabase();
      
      // Seed default permissions (only if feature is enabled)
      if (environment.isFeatureEnabled('seedData')) {
        await seedPermissions();
      }
    }
    
    // Initialize scheduled tasks
    ScheduledTasks.init();
    
    // Initialize Socket.IO
    socketHandler.initialize(server);
    
    // Start server
    server.listen(PORT, () => {
      console.log(`🚀 HabitUP Server running on port ${PORT}`);
      console.log(`📊 Environment: ${environment.getEnv()}`);
      console.log(`🌐 Health check: http://localhost:${PORT}/health`);
      console.log(`🔌 Socket.IO ready for real-time connections`);
      
      if (environment.isDevelopment()) {
        console.log(`🛠️  Debug features enabled:`);
        console.log(`   - Detailed Logging: ${environment.isFeatureEnabled('detailedLogging')}`);
        console.log(`   - Swagger Docs: ${environment.isFeatureEnabled('swaggerDocs')}`);
        console.log(`   - Debug Endpoints: ${environment.isFeatureEnabled('debugEndpoints')}`);
      }
    });
  } catch (error) {
    environment.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
