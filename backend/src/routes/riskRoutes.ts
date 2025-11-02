import express, { Request, Response } from 'express'
import { body, validationResult } from 'express-validator'
import RiskAssessment from '../models/RiskAssessment'
import { generateRiskSummary } from '../utils/aiService'
import { authenticate, authenticateOptional } from '../middleware/auth'

const router = express.Router()

/**
 * GET /assessment
 * Public route: works for both guests and logged-in users
 * (Default general AI assessment for guests)
 */
router.get('/assessment', authenticateOptional, async (req: Request, res: Response) => {
  try {
    const { userId, userEmail } = req

    const defaultData = {
      age: 40,
      gender: 'Male',
      systolicBP: 130,
      diastolicBP: 85,
      cholesterol: 200,
      diabetes: false
    }

    const { riskScore, summary } = await generateRiskSummary(defaultData)

    return res.json({
      success: true,
      message: userId
        ? `Personalized assessment for ${userEmail}.`
        : 'General AI-generated assessment for guest.',
      data: {
        id: (userId ? 'temp-' : 'guest-') + Date.now(),
        riskScore,
        summary,
        createdAt: new Date().toISOString()
      }
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({
      success: false,
      message: 'Something went wrong while fetching AI assessment.'
    })
  }
})

/**
 * POST /assessment
 * Protected route: only for logged-in users (saved in DB)
 */
router.post(
  '/assessment',
  authenticate,
  [
    body('age').isInt({ min: 1, max: 150 }),
    body('gender').isIn(['Male', 'Female', 'Other']),
    body('systolicBP').isInt({ min: 50, max: 250 }),
    body('diastolicBP').isInt({ min: 30, max: 200 }),
    body('cholesterol').isFloat({ min: 0 }),
    body('diabetes').isBoolean()
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() })
    }

    try {
      const { userId } = req
      if (!userId) {
        return res.status(401).json({ success: false, message: 'Unauthorized' })
      }

      const { age, gender, systolicBP, diastolicBP, cholesterol, diabetes } = req.body

      // Generate AI summary
      const { riskScore, summary } = await generateRiskSummary({
        age,
        gender,
        systolicBP,
        diastolicBP,
        cholesterol,
        diabetes
      })

      // Save to DB
      const newAssessment = await RiskAssessment.create({
        userId,
        age,
        gender,
        systolicBP,
        diastolicBP,
        cholesterol,
        diabetes,
        riskScore,
        aiSummary: summary
      })

      return res.json({
        success: true,
        message: 'Assessment saved successfully.',
        data: {
          id: newAssessment._id,
          riskScore: newAssessment.riskScore,
          summary: newAssessment.aiSummary,
          createdAt: newAssessment.createdAt,
        },
      })
    } catch (err) {
      console.error(err)
      return res.status(500).json({
        success: false,
        message: 'Error generating or saving assessment.'
      })
    }
  }
)

/**
 * POST /assessment/guest
 * Public route: personalized assessment for guest input (not saved in DB)
 */
router.post(
  '/assessment/guest',
  [
    body('age').isInt({ min: 1, max: 150 }),
    body('gender').isIn(['Male', 'Female', 'Other']),
    body('systolicBP').isInt({ min: 50, max: 250 }),
    body('diastolicBP').isInt({ min: 30, max: 200 }),
    body('cholesterol').isFloat({ min: 0 }),
    body('diabetes').isBoolean()
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() })
    }

    try {
      const { age, gender, systolicBP, diastolicBP, cholesterol, diabetes } = req.body

      // Generate AI summary for guest input
      const { riskScore, summary } = await generateRiskSummary({
        age,
        gender,
        systolicBP,
        diastolicBP,
        cholesterol,
        diabetes
      })

      return res.json({
        success: true,
        message: 'Guest AI assessment generated successfully.',
        data: {
          id: 'guest-' + Date.now(),
          riskScore,
          summary,
          createdAt: new Date().toISOString()
        }
      })
    } catch (err) {
      console.error('Error generating guest assessment:', err)
      return res.status(500).json({
        success: false,
        message: 'Failed to generate guest AI assessment.'
      })
    }
  }
)

export default router
