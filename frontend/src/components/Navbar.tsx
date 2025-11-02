import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Heart, LogOut, User } from 'lucide-react'
//import { useTheme } from '../utils/theme'
import { useAuth } from '../utils/auth'

export default function Navbar() {
  //const { theme, toggleTheme } = useTheme()
  const { isAuthenticated, user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const isActive = (path: string) => location.pathname === path

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Heart className="w-8 h-8 text-primary-600" fill="red" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              HridSync
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-4">
            {/* Public Links */}
            <Link
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/')
                  ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              Home
            </Link>

            <Link
              to="/assessment"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/assessment')
                  ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              Assessment
            </Link>

            <Link
              to="/diet"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/diet')
                  ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              Diet Plan
            </Link>

            <Link
              to="/chat"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/chat')
                  ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              Chat
            </Link>

            <Link
              to="/doctors"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/doctors')
                  ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              Doctors
            </Link>

            {/* Auth-related */}
            {isAuthenticated ? (
              <>
                <Link
                  to="/progress"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/progress')
                      ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  Progress
                </Link>

                <div className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300">
                  <User className="w-4 h-4" />
                  <span>{user?.name}</span>
                </div>

                <button
                  onClick={handleLogout}
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-3 py-2 rounded-md text-sm font-medium bg-primary-600 text-white hover:bg-primary-700"
                >
                  Sign Up
                </Link>
              </>
            )}

            {/* Premium is always visible */}
            <Link
              to="/premium"
              className="px-3 py-2 rounded-md text-sm font-medium bg-primary-600 text-white hover:bg-primary-700"
            >
              Premium
            </Link>
          </div>

         
        </div>
      </div>
    </nav>
  )
}
