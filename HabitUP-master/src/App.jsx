import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'
import AdminProtectedRoute from './components/AdminProtectedRoute'
import Home from './pages/Home'
import TestHome from './pages/TestHome'
import UserHome from './pages/UserHome'
import About from './pages/About'
import Services from './pages/Services'
import Teams from './pages/Teams'
import Contact from './pages/Contact'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import Blog from './pages/Blog'
import AdminDashboard from './pages/AdminDashboard'
import AdminTest from './pages/AdminTest'
import Doctor from './pages/Doctor'
import Sashi from './pages/Sashi'
import Subscription from './pages/Subscription'
import Terms from './pages/Terms'
import Upcoming from './pages/Upcoming'
import InstructorApplication from './components/InstructorApplication'
import MentorContact from './components/MentorContact'
import MeetingManagement from './components/MeetingManagement'
import CoachApplication from './pages/CoachApplication'
import './App.css'
import getConfig from './utils/config'
import { Environment } from './utils/environment'

// Example usage of the environment utilities
const config = getConfig();
if (Environment.isDevelopment() && config.useRealAPI) {
  console.log('API URL:', config.apiUrl);
  console.log('WebSocket URL:', config.websocketUrl);
}

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Admin routes - no header/footer */}
          <Route path="/admin-dashboard" element={
            <AdminProtectedRoute>
              <AdminDashboard />
            </AdminProtectedRoute>
          } />
          <Route path="/admin/dashboard" element={
            <AdminProtectedRoute>
              <AdminDashboard />
            </AdminProtectedRoute>
          } />
          <Route path="/admin/users" element={
            <AdminProtectedRoute>
              <AdminDashboard />
            </AdminProtectedRoute>
          } />
          <Route path="/admin/subscriptions" element={
            <AdminProtectedRoute>
              <AdminDashboard />
            </AdminProtectedRoute>
          } />
          <Route path="/admin/habits" element={
            <AdminProtectedRoute>
              <AdminDashboard />
            </AdminProtectedRoute>
          } />
          <Route path="/admin/logs" element={
            <AdminProtectedRoute>
              <AdminDashboard />
            </AdminProtectedRoute>
          } />
          <Route path="/admin/error-logs" element={
            <AdminProtectedRoute>
              <AdminDashboard />
            </AdminProtectedRoute>
          } />
          <Route path="/admin/settings" element={
            <AdminProtectedRoute>
              <AdminDashboard />
            </AdminProtectedRoute>
          } />
          <Route path="/admin/health" element={
            <AdminProtectedRoute>
              <AdminDashboard />
            </AdminProtectedRoute>
          } />
          <Route path="/admin/analytics" element={
            <AdminProtectedRoute>
              <AdminDashboard />
            </AdminProtectedRoute>
          } />
          <Route path="/admin/reports" element={
            <AdminProtectedRoute>
              <AdminDashboard />
            </AdminProtectedRoute>
          } />
          <Route path="/admin/test" element={
            <AdminProtectedRoute>
              <AdminTest />
            </AdminProtectedRoute>
          } />
          
          {/* Regular routes with header/footer */}
          <Route path="/*" element={
            <>
              <Header />
              <main className="main">
                <Routes>
                  {/* Public routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/teams" element={<Teams />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/terms" element={<Terms />} />
                  
                  {/* Protected routes - require authentication */}
                  <Route path="/home" element={
                    <ProtectedRoute>
                      <UserHome />
                    </ProtectedRoute>
                  } />
                  <Route path="/user-home" element={
                    <ProtectedRoute>
                      <UserHome />
                    </ProtectedRoute>
                  } />
                  <Route path="/services" element={
                    <ProtectedRoute>
                      <Services />
                    </ProtectedRoute>
                  } />
                  <Route path="/dashboard" element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/profile" element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  } />
                  <Route path="/doctor" element={
                    <ProtectedRoute>
                      <Doctor />
                    </ProtectedRoute>
                  } />
                  <Route path="/sashi" element={
                    <ProtectedRoute>
                      <Sashi />
                    </ProtectedRoute>
                  } />
                  <Route path="/subscription" element={
                    <ProtectedRoute>
                      <Subscription />
                    </ProtectedRoute>
                  } />
                  <Route path="/upcoming" element={
                    <ProtectedRoute>
                      <Upcoming />
                    </ProtectedRoute>
                  } />
                  
                  {/* New component routes */}
                  <Route path="/instructor-application" element={<InstructorApplication />} />
                  <Route path="/coach-application" element={
                    <ProtectedRoute>
                      <CoachApplication />
                    </ProtectedRoute>
                  } />
                  <Route path="/mentor-contact" element={<MentorContact />} />
                  <Route path="/meetings" element={
                    <ProtectedRoute>
                      <MeetingManagement />
                    </ProtectedRoute>
                  } />
                </Routes>
              </main>
              <Footer />
            </>
          } />
        </Routes>
      </div>
    </Router>
  )
}

export default App