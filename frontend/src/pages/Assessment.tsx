import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useToast } from '../utils/toast'
import api from '../utils/api'
import RiskCard from '../components/RiskCard'
import LoadingSpinner from '../components/LoadingSpinner'

interface AssessmentResult {
  id: string
  riskScore: 'Low' | 'Medium' | 'High'
  summary: string
  createdAt: string
}

export default function Assessment() {
  const [formData, setFormData] = useState({
    age: '',
    gender: 'Male' as 'Male' | 'Female' | 'Other',
    systolicBP: '',
    diastolicBP: '',
    cholesterol: '',
    diabetes: false
  })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<AssessmentResult | null>(null)
  const { showToast } = useToast()

  // Optional: fetch a general assessment on mount for guests
  // This useEffect now includes the logic to only show the toast once.
  useEffect(() => {
    const fetchGeneralAssessment = async () => {
      const token = localStorage.getItem('token')
      const guestNotificationShown = localStorage.getItem('guestAssessmentNotified')

      // Only proceed if user is NOT logged in AND notification hasn't been shown
      if (!token && !guestNotificationShown) {
        try {
          const response = await api.get('/risk/assessment') // GET route
          
          if (response.data.success) {
            showToast('Guest assessment available. Fill the form for full assessment!', 'info')
            
            // Set the flag in localStorage so the toast doesn't show again
            localStorage.setItem('guestAssessmentNotified', 'true')
          }
        } catch (error: any) {
          console.error('Error fetching general assessment:', error)
        }
      }
    }

    fetchGeneralAssessment()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const token = localStorage.getItem('token')

      if (!token) {
        // Guest user: send their input to get a personalized AI summary
        const response = await api.post('/risk/assessment/guest', {
          age: parseInt(formData.age),
          gender: formData.gender,
          systolicBP: parseInt(formData.systolicBP),
          diastolicBP: parseInt(formData.diastolicBP),
          cholesterol: parseFloat(formData.cholesterol),
          diabetes: formData.diabetes
        })
      
        if (response.data.success && response.data.data) {
          setResult({
            id: response.data.data.id,
            riskScore: response.data.data.riskScore,
            summary: response.data.data.summary,
            createdAt: response.data.data.createdAt
          })
          showToast('AI-generated guest assessment based on your input!', 'success')
        }
      
      } else {
        // Logged-in user: POST assessment to save in DB
        const response = await api.post('/risk/assessment', {
          age: parseInt(formData.age),
          gender: formData.gender,
          systolicBP: parseInt(formData.systolicBP),
          diastolicBP: parseInt(formData.diastolicBP),
          cholesterol: parseFloat(formData.cholesterol),
          diabetes: formData.diabetes
        })

        if (response.data.success && response.data.data) {
          setResult(response.data.data)
          showToast('Assessment completed successfully!', 'success')
        } else {
          throw new Error('Invalid response from server')
        }
      }
    } catch (error: any) {
      console.error('Error in assessment:', error)
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.errors?.[0]?.msg ||
        error.message ||
        'Assessment failed. Please check if the backend server is running.'
      showToast(errorMessage, 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Heart Risk Assessment
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Fill in your health metrics to get an AI-powered risk assessment
          </p>
        </motion.div>

        {!result ? (
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSubmit}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 md:p-8"
          >
            <div className="grid md:grid-cols-2 gap-6">
              {/* Age */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Age *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  max="150"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              {/* Gender */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Gender *
                </label>
                <select
                  required
                  value={formData.gender}
                  onChange={(e) =>
                    setFormData({ ...formData, gender: e.target.value as 'Male' | 'Female' | 'Other' })
                  }
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Systolic BP */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Systolic BP (mmHg) *
                </label>
                <input
                  type="number"
                  required
                  min="50"
                  max="250"
                  value={formData.systolicBP}
                  onChange={(e) => setFormData({ ...formData, systolicBP: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              {/* Diastolic BP */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Diastolic BP (mmHg) *
                </label>
                <input
                  type="number"
                  required
                  min="30"
                  max="200"
                  value={formData.diastolicBP}
                  onChange={(e) => setFormData({ ...formData, diastolicBP: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              {/* Cholesterol */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Cholesterol (mg/dL) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.1"
                  value={formData.cholesterol}
                  onChange={(e) => setFormData({ ...formData, cholesterol: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              {/* Diabetes */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="diabetes"
                  checked={formData.diabetes}
                  onChange={(e) => setFormData({ ...formData, diabetes: e.target.checked })}
                  className="w-5 h-5 text-primary-600 rounded border-gray-300"
                />
                <label
                  htmlFor="diabetes"
                  className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  I have diabetes
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <LoadingSpinner size="sm" />
                  <span className="ml-2">Analyzing...</span>
                </span>
              ) : (
                'Assess Risk'
              )}
            </button>
          </motion.form>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <RiskCard
              riskScore={result.riskScore}
              summary={result.summary}
              createdAt={result.createdAt}
            />
            <button
              onClick={() => setResult(null)}
              className="mt-4 px-6 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg transition-colors"
            >
              New Assessment
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}