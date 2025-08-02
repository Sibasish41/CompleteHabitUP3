# HabitUP - Frontend

A modern React-based habit tracking application built with Vite, Redux Toolkit, and Tailwind CSS.

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager
- Git

### Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd HabitUP-master
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment configuration**
   ```bash
   cp .env .env.local
   ```
   
   Edit `.env.local` with your local configuration:
   ```env
   # Backend API Configuration  
   REACT_APP_API_URL=http://localhost:3001/api
   
   # Environment
   NODE_ENV=development
   
   # API Mode - Set to 'true' to use real backend, 'false' for mock data
   REACT_APP_USE_REAL_API=true
   
   # Application Configuration
   REACT_APP_APP_NAME=HabitUP
   REACT_APP_VERSION=1.0.0
   
   # WebSocket Configuration
   REACT_APP_WEBSOCKET_URL=ws://localhost:3001
   
   # API Configuration
   REACT_APP_API_TIMEOUT=30000
   ```

4. **Start development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

   The application will be available at `http://localhost:3000`

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
├── pages/              # Page components
├── store/              # Redux store and slices
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
├── services/           # API service layers
├── styles/             # Global styles and Tailwind config
└── assets/             # Static assets (images, fonts, etc.)
```

## 🛠️ Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint code analysis

## 📦 Environment Configuration

### Development (.env)
```env
REACT_APP_API_URL=http://localhost:3001/api
NODE_ENV=development
REACT_APP_USE_REAL_API=true
REACT_APP_APP_NAME=HabitUP
REACT_APP_VERSION=1.0.0
REACT_APP_WEBSOCKET_URL=ws://localhost:3001
REACT_APP_API_TIMEOUT=30000
```

### Staging (.env.staging)
```env
REACT_APP_API_URL=https://staging-api.yourdomain.com/api
NODE_ENV=development
REACT_APP_USE_REAL_API=true
REACT_APP_APP_NAME=HabitUP (Staging)
REACT_APP_VERSION=1.0.0-staging
REACT_APP_WEBSOCKET_URL=wss://staging-api.yourdomain.com
REACT_APP_API_TIMEOUT=30000
REACT_APP_ENABLE_DEBUG=true
REACT_APP_ENABLE_VERBOSE_LOGGING=true
```

### Production (.env.production)
```env
REACT_APP_API_URL=https://api.yourdomain.com/api
NODE_ENV=production
REACT_APP_USE_REAL_API=true
REACT_APP_APP_NAME=HabitUP
REACT_APP_VERSION=1.0.0
REACT_APP_WEBSOCKET_URL=wss://api.yourdomain.com
REACT_APP_API_TIMEOUT=30000
```

## 🌐 Port and URL Conventions

- **Development**: `http://localhost:3000`
- **Backend API**: `http://localhost:3001/api` (development)
- **WebSocket**: `ws://localhost:3001` (development)
- **Production**: Update URLs in `.env.production` to match your domain

## 🚀 Deployment

### Development Deployment

1. Ensure backend server is running on port 3001
2. Start the frontend development server:
   ```bash
   npm run dev
   ```

### Staging Deployment

1. **Set environment variables**:
   ```bash
   cp .env.staging .env
   ```

2. **Build the application**:
   ```bash
   npm run build
   ```

3. **Deploy** the `dist/` folder to your staging server

### Production Deployment

1. **Set environment variables**:
   ```bash
   cp .env.production .env
   ```

2. **Update production URLs** in `.env.production`:
   - `REACT_APP_API_URL` - Your production API URL
   - `REACT_APP_WEBSOCKET_URL` - Your production WebSocket URL

3. **Build the application**:
   ```bash
   npm run build
   ```

4. **Deploy** the `dist/` folder to your production server

### Using Different Environments

To build with specific environment files:

```bash
# For staging
NODE_ENV=staging npm run build

# For production
NODE_ENV=production npm run build
```

## 🔧 Configuration Details

### API Integration

The frontend communicates with the backend through:
- **REST API**: All CRUD operations and authentication
- **WebSocket**: Real-time features (notifications, live updates)
- **Proxy**: Development proxy configured in `vite.config.js`

### Vite Configuration

```javascript
// vite.config.js
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
```

## 🐛 Troubleshooting

### Common Issues

1. **Cannot connect to backend**
   - Verify backend server is running on port 3001
   - Check `REACT_APP_API_URL` in your `.env` file
   - Ensure CORS is properly configured on backend

2. **WebSocket connection failed**
   - Verify WebSocket URL in `REACT_APP_WEBSOCKET_URL`
   - Check if backend WebSocket server is running
   - Ensure firewall allows WebSocket connections

3. **Build fails**
   - Clear node_modules and reinstall: `rm -rf node_modules && npm install`
   - Check for TypeScript errors: `npm run lint`
   - Verify all environment variables are set

4. **API requests timing out**
   - Increase `REACT_APP_API_TIMEOUT` value
   - Check network connectivity to backend
   - Verify backend server is responding

### Debug Mode

Enable debug mode for detailed logging:

```env
REACT_APP_ENABLE_DEBUG=true
REACT_APP_ENABLE_VERBOSE_LOGGING=true
```

### Mock API Mode

For development without backend:

```env
REACT_APP_USE_REAL_API=false
```

## 🔐 Security Considerations

- Never commit `.env` files with sensitive data
- Use environment variables for all configuration
- Ensure HTTPS in production
- Validate all environment variables on build

## 📋 Environment Variables Reference

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `REACT_APP_API_URL` | Backend API base URL | `http://localhost:3001/api` | Yes |
| `REACT_APP_WEBSOCKET_URL` | WebSocket server URL | `ws://localhost:3001` | Yes |
| `REACT_APP_USE_REAL_API` | Use real API vs mock data | `true` | No |
| `REACT_APP_API_TIMEOUT` | API request timeout (ms) | `30000` | No |
| `REACT_APP_APP_NAME` | Application name | `HabitUP` | No |
| `REACT_APP_VERSION` | Application version | `1.0.0` | No |
| `NODE_ENV` | Environment mode | `development` | Yes |

## 🛠️ Tech Stack

- **React 19** - UI Library
- **Vite** - Build tool and dev server
- **Redux Toolkit** - State management
- **React Router** - Client-side routing
- **Tailwind CSS** - Styling framework
- **Axios** - HTTP client
- **Framer Motion** - Animations
- **Swiper** - Touch slider component

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check the troubleshooting section
- Contact the development team
