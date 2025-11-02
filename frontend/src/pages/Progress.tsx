import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useToast } from '../utils/toast'
import api from '../utils/api'
import LoadingSpinner from '../components/LoadingSpinner'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Line, Bar } from 'react-chartjs-2'
import { TrendingUp } from 'lucide-react'
import { IRiskAssessment } from '../types'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
)

export default function Progress() {
  const [assessments, setAssessments] = useState<IRiskAssessment[]>([])
  const [loading, setLoading] = useState(true)
  const { showToast } = useToast()

  useEffect(() => {
    fetchProgress()
  }, [])

  const fetchProgress = async () => {
    try {
      const response = await api.get('/progress?limit=10')
      setAssessments(response.data.data.reverse()) // Reverse to show oldest first
    } catch (error: any) {
      showToast('Failed to load progress data', 'error')
    } finally {
      setLoading(false)
    }
  }

  const riskData = {
    labels: assessments.map(a => new Date(a.createdAt).toLocaleDateString()),
    datasets: [
      {
        label: 'Risk Score',
        data: assessments.map(a => {
          switch (a.riskScore) {
            case 'Low': return 1
            case 'Medium': return 2
            case 'High': return 3
            default: return 0
          }
        }),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4
      }
    ]
  }

  const bpData = {
    labels: assessments.map(a => new Date(a.createdAt).toLocaleDateString()),
    datasets: [
      {
        label: 'Systolic BP',
        data: assessments.map(a => a.systolicBP),
        backgroundColor: 'rgba(239, 68, 68, 0.5)',
      },
      {
        label: 'Diastolic BP',
        data: assessments.map(a => a.diastolicBP),
        backgroundColor: 'rgba(34, 197, 94, 0.5)',
      }
    ]
  }

  const cholesterolData = {
    labels: assessments.map(a => new Date(a.createdAt).toLocaleDateString()),
    datasets: [
      {
        label: 'Cholesterol (mg/dL)',
        data: assessments.map(a => a.cholesterol),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4
      }
    ]
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen py-12 px-4 flex justify-center items-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (assessments.length === 0) {
    return (
      <div className="min-h-screen py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <TrendingUp className="w-16 h-16 mx-auto mb-4 text-primary-600" />
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Progress Tracking
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            No assessment data available. Complete a risk assessment to see your progress.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <TrendingUp className="w-16 h-16 mx-auto mb-4 text-primary-600" color="red" />
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Your Progress
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track your heart health metrics over time
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
          >
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Risk Level Trend
            </h3>
            <Line data={riskData} options={chartOptions} />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              1=Low, 2=Medium, 3=High
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
          >
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Blood Pressure Trend
            </h3>
            <Bar data={bpData} options={chartOptions} />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
        >
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Cholesterol Trend
          </h3>
          <Line data={cholesterolData} options={chartOptions} />
        </motion.div>
      </div>
    </div>
  )
}

