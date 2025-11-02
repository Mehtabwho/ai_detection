import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './utils/theme'
import { ToastProvider } from './utils/toast'
import { AuthProvider } from './utils/auth'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'
import ScrollToTop from './components/ScrollToTop' // 👈 ADD THIS
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Assessment from './pages/Assessment'
import DietPlan from './pages/DietPlan'
import Chat from './pages/Chat'
import Doctors from './pages/Doctors'
import Premium from './pages/Premium'
import Progress from './pages/Progress'

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <Router>
            <ScrollToTop /> {/* 👈 ADD THIS LINE */}
            <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
              <Navbar />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />

                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    }
                  />

                  <Route path="/assessment" element={<Assessment />} />

                  <Route
                    path="/diet"
                    element={
                      <ProtectedRoute>
                        <DietPlan />
                      </ProtectedRoute>
                    }
                  />

                  <Route path="/chat" element={<Chat />} />

                  <Route
                    path="/doctors"
                    element={
                      <ProtectedRoute>
                        <Doctors />
                      </ProtectedRoute>
                    }
                  />

                  <Route path="/premium" element={<Premium />} />

                  <Route
                    path="/progress"
                    element={
                      <ProtectedRoute>
                        <Progress />
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  )
}

export default App
