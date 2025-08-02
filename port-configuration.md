# HabitUP Port Configuration

## Overview
This document defines the final port assignments for the HabitUP application to resolve current conflicts and establish clear development and production configurations.

## Current Issues Resolved
- ❌ Both frontend and backend were configured for port 3000
- ❌ Frontend expecting backend on 3000, but backend expecting frontend on 3001
- ✅ Clear separation of ports with consistent configuration

## Final Port Assignments

### Development Environment

| Service | Port | URL | Configuration File |
|---------|------|-----|-------------------|
| **Frontend (React/Vite)** | **3000** | `http://localhost:3000` | `vite.config.js` |
| **Backend (Express/Node.js)** | **3001** | `http://localhost:3001` | `index.js` + `.env` |
| **API Endpoints** | **3001** | `http://localhost:3001/api/*` | Backend routes |
| **WebSocket/Socket.IO** | **3001** | `ws://localhost:3001` | Same as backend |

### Production Environment

| Service | Port | URL | Notes |
|---------|------|-----|-------|
| **Frontend** | **80/443** | `https://yourdomain.com` | Served by Nginx/Apache |
| **Backend** | **3001** | Internal only | Behind reverse proxy |
| **API Endpoints** | **443** | `https://yourdomain.com/api/*` | Proxied to backend:3001 |
| **WebSocket** | **443** | `wss://yourdomain.com` | Proxied to backend:3001 |

## Required Configuration Changes

### 1. Backend Configuration (.env)
```bash
# Server Configuration
NODE_ENV=development
PORT=3001                                    # Changed from 3000
CLIENT_URL=http://localhost:3000             # Frontend URL

# Production URLs (uncomment for production)
# CLIENT_URL=https://yourdomain.com
# PORT=3001

# WebSocket Configuration
WEBSOCKET_PORT=3001                          # Same as main server
```

### 2. Frontend Configuration (.env)
```bash
# Backend API Configuration  
REACT_APP_API_URL=http://localhost:3001/api     # Changed from 3000
REACT_APP_BACKEND_HOST=localhost
REACT_APP_BACKEND_PORT=3001                     # Changed from 5000
REACT_APP_WEBSOCKET_URL=ws://localhost:3001     # Changed from 5000

# Production URLs (for build)
# REACT_APP_API_URL=https://yourdomain.com/api
# REACT_APP_WEBSOCKET_URL=wss://yourdomain.com

# Environment
NODE_ENV=development
REACT_APP_USE_REAL_API=true
REACT_APP_APP_NAME=HabitUP
REACT_APP_VERSION=1.0.0
```

### 3. Frontend Vite Config (vite.config.js)
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,        // Keep as 3000 for frontend
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',    // Proxy API calls to backend
        changeOrigin: true,
        secure: false,
      }
    }
  },
  preview: {
    port: 3000
  }
})
```

### 4. Backend CORS Configuration (index.js)
Already correctly configured:
```javascript
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',  // Frontend URL
  credentials: true
}));
```

## Development Workflow

### Starting the Application
```bash
# Terminal 1: Start Backend
cd HabitUPMigration247-master
npm run dev
# Backend will start on http://localhost:3001

# Terminal 2: Start Frontend  
cd HabitUP-master/HabitUP-master
npm run dev
# Frontend will start on http://localhost:3000
```

### Verification Steps
1. ✅ Frontend accessible at `http://localhost:3000`
2. ✅ Backend health check at `http://localhost:3001/health`
3. ✅ API calls from frontend to `http://localhost:3001/api/*`
4. ✅ WebSocket connections to `ws://localhost:3001`

## Production Deployment

### Nginx Configuration Example
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    
    # Frontend - Serve React build files
    location / {
        root /var/www/habitup/build;
        try_files $uri $uri/ /index.html;
    }
    
    # API - Proxy to backend
    location /api/ {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    # WebSocket - Proxy to backend
    location /socket.io/ {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Environment Variables for Production
```bash
# Backend (.env)
NODE_ENV=production
PORT=3001
CLIENT_URL=https://yourdomain.com

# Frontend (build environment)
REACT_APP_API_URL=https://yourdomain.com/api
REACT_APP_WEBSOCKET_URL=wss://yourdomain.com
NODE_ENV=production
```

## Port Conflict Prevention

### Reserved Ports
- **3000**: Frontend development server (React/Vite)
- **3001**: Backend server (Express/Node.js + Socket.IO)
- **3306**: MySQL database (default)
- **80/443**: Production web server (Nginx/Apache)

### Common Alternatives (if conflicts arise)
- Frontend alternatives: 3000, 8080, 4000, 5173
- Backend alternatives: 3001, 8000, 5000, 8080
- Database: 3306 (MySQL), 5432 (PostgreSQL), 27017 (MongoDB)

## Troubleshooting

### Port Already in Use
```bash
# Check what's using a port (Windows)
netstat -ano | findstr :3000
netstat -ano | findstr :3001

# Kill process by PID
taskkill /PID <PID> /F

# Check what's using a port (Linux/Mac)
lsof -i :3000
lsof -i :3001

# Kill process
kill -9 <PID>
```

### CORS Issues
- Ensure `CLIENT_URL` in backend `.env` matches frontend URL
- Check browser network tab for blocked requests
- Verify `credentials: true` is set in both frontend requests and backend CORS

### WebSocket Connection Issues
- Ensure WebSocket URL matches backend server URL
- Check for proxy configuration in production
- Verify Socket.IO versions are compatible

## Summary
- ✅ **Frontend Development**: Port 3000
- ✅ **Backend Development**: Port 3001  
- ✅ **Production**: Standard web ports (80/443) with reverse proxy
- ✅ **No Port Conflicts**: Clear separation of services
- ✅ **Consistent Configuration**: All files aligned with port assignments
