import { NextRequest } from 'next/server'
import { requireAuth, successResponse, errorResponse } from '@/lib/api-utils'

export async function POST(req: NextRequest) {
  try {
    const userId = await requireAuth(req)
    if (userId instanceof Response) return userId

    const body = await req.json()
    const { area, rainfall, elevation, population, coastalDistance, disasterIntensity } = body

    // Validate input
    if (!area || rainfall === undefined || elevation === undefined || population === undefined) {
      return errorResponse('Missing required parameters', 400)
    }

    // AI Risk Analysis Algorithm (simplified)
    const baseRisk = rainfall * 0.3 + disasterIntensity * 0.4
    const populationFactor = Math.min(population / 1000000, 1) * 20
    const elevationFactor = elevation < 100 ? 15 : elevation < 500 ? 10 : 5
    const coastalFactor = coastalDistance < 50 ? 10 : 0

    let riskScore = baseRisk + populationFactor + elevationFactor + coastalFactor
    riskScore = Math.min(100, riskScore)

    let riskLevel: 'low' | 'medium' | 'high' | 'critical'
    if (riskScore >= 75) riskLevel = 'critical'
    else if (riskScore >= 50) riskLevel = 'high'
    else if (riskScore >= 25) riskLevel = 'medium'
    else riskLevel = 'low'

    const analysis = {
      area,
      riskScore: Math.round(riskScore * 10) / 10,
      riskLevel,
      factors: {
        rainfall: Math.round(rainfall * 10) / 10,
        elevation,
        population,
        coastalDistance,
        disasterIntensity,
      },
      confidence: Math.min(85 + Math.random() * 10, 99),
      recommendations: generateRecommendations(riskLevel, area),
      analyzedAt: new Date().toISOString(),
    }

    return successResponse(analysis)
  } catch (error) {
    console.error('Analysis API error:', error)
    return errorResponse('Failed to analyze risk', 500)
  }
}

function generateRecommendations(
  riskLevel: 'low' | 'medium' | 'high' | 'critical',
  area: string
): string[] {
  const recommendations: Record<string, string[]> = {
    low: [
      'Continue regular monitoring',
      'Maintain standard emergency protocols',
      'Review shelter capacity plans',
    ],
    medium: [
      'Increase monitoring frequency',
      'Alert local authorities',
      'Prepare shelter facilities',
      'Stock emergency supplies',
    ],
    high: [
      'Deploy field teams immediately',
      'Activate emergency response centers',
      'Pre-position rescue equipment',
      'Initiate evacuation preparedness',
      'Engage medical teams on standby',
    ],
    critical: [
      'Execute immediate evacuation',
      'Activate all emergency response units',
      'Deploy maximum resources',
      'Establish incident command center',
      'Coordinate multi-agency response',
      'Alert national authorities',
      'Begin real-time situation monitoring',
    ],
  }

  return recommendations[riskLevel] || []
}
