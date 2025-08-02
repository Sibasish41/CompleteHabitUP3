const express = require('express');
const cors = require('cors');
const environment = require('./utils/environment');
const { initializeMockDatabase } = require('./config/mockDatabase');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'HabitUP Test Server is running',
    timestamp: new Date().toISOString(),
    mockDatabase: process.env.USE_MOCK_DB === 'true'
  });
});

// Simple test endpoint
app.get('/api/test', (req, res) => {
  res.json({
    message: 'Test endpoint working',
    environment: process.env.NODE_ENV,
    mockDb: process.env.USE_MOCK_DB
  });
});

// Start server
const startTestServer = async () => {
  try {
    console.log('🔧 Starting test server...');
    
    // Initialize mock database if enabled
    if (process.env.USE_MOCK_DB === 'true') {
      console.log('🧪 Initializing mock database...');
      await initializeMockDatabase();
    }
    
    app.listen(PORT, () => {
      console.log(`🚀 Test Server running on port ${PORT}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV}`);
      console.log(`🌐 Health check: http://localhost:${PORT}/health`);
      console.log(`🧪 Mock database: ${process.env.USE_MOCK_DB}`);
    });
  } catch (error) {
    console.error('❌ Failed to start test server:', error);
    process.exit(1);
  }
};

startTestServer();
