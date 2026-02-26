import { NextRequest } from 'next/server'
import { requireAuth, successResponse, errorResponse } from '@/lib/api-utils'

export async function GET(req: NextRequest) {
  try {
    const userId = await requireAuth(req)
    if (userId instanceof Response) return userId

    const { searchParams } = new URL(req.url)
    const location = searchParams.get('location') || 'Bihar - Patna'

    // Mock weather data - in production, fetch from Supabase or external weather API
    const weatherData = {
      location,
      temperature: 32,
      humidity: 78,
      rainfall: 45.2,
      windSpeed: 28,
      windDirection: 'NE',
      condition: 'Heavy Rain',
      pressure: 998.5,
      visibility: 5,
      uvIndex: 3,
      feelsLike: 38,
      updatedAt: new Date().toISOString(),
    }

    return successResponse(weatherData)
  } catch (error) {
    console.error('Weather API error:', error)
    return errorResponse('Failed to fetch weather data', 500)
  }
}
