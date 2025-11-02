import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, Activity, UtensilsCrossed, MessageCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import api from '../utils/api'

export default function Home() {
  const [backendStatus, setBackendStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking')

  useEffect(() => {
    // Test backend connection
    api.get('/health')
      .then(() => setBackendStatus('connected'))
      .catch(() => setBackendStatus('disconnected'))
  }, [])

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      {backendStatus === 'disconnected' && (
        <div className="bg-red-50 dark:bg-red-900 border-l-4 border-red-500 p-4 mx-4 mt-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700 dark:text-red-300">
                <strong>Warning:</strong> Unable to connect to backend server. Please make sure the backend is running on port 5000.
              </p>
            </div>
          </div>
        </div>
      )}
      <section className="bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-800 dark:to-gray-900 py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Heart className="w-20 h-20 mx-auto mb-6 text-primary-600" fill="red" />
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
              HridSync
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-8">
              AI-Powered Heart Health Assistant
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-12">
              Get personalized heart health assessments, diet plans, and expert guidance
              all in one place. Your heart health journey starts here.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {backendStatus === 'connected' && (
                <>
                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors shadow-lg"
                  >
                    <Activity className="w-5 h-5 mr-2" />
                    Get Started
                  </Link>
                  <Link
                    to="/chat"
                    className="inline-flex items-center justify-center px-8 py-4 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-primary-600 dark:text-primary-400 font-semibold rounded-lg transition-colors shadow-lg border-2 border-primary-600 dark:border-primary-400"
                  >
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Chat Now
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Features
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg hover:shadow-lg transition-shadow"
            >
              <Activity className="w-12 h-12 text-primary-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Risk Assessment
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Get AI-powered analysis of your heart disease risk based on your health metrics.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg hover:shadow-lg transition-shadow"
            >
              <UtensilsCrossed className="w-12 h-12 text-primary-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Diet Plans
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Receive personalized 7-day diet plans tailored to your risk profile.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg hover:shadow-lg transition-shadow"
            >
              <MessageCircle className="w-12 h-12 text-primary-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                AI Chat
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Chat with our AI assistant about heart health questions and concerns.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg hover:shadow-lg transition-shadow"
            >
              <Heart className="w-12 h-12 text-primary-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Progress Tracking
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Monitor your heart health progress over time with detailed charts.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}

