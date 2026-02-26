import { NextRequest } from 'next/server'
import { requireAuth, successResponse, errorResponse } from '@/lib/api-utils'

export async function GET(req: NextRequest) {
  try {
    const userId = await requireAuth(req)
    if (userId instanceof Response) return userId

    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')
    const severity = searchParams.get('severity')

    // Mock alerts data - in production, fetch from Supabase
    let alerts = [
      {
        id: '1',
        type: 'flood',
        title: 'Flood Warning',
        location: 'Bihar',
        description: 'Heavy rainfall expected with risk of flash flooding',
        detail: 'High Risk',
        time: '5 mins ago',
        severity: 'critical' as const,
        status: 'active' as const,
        affectedPopulation: 250000,
        createdAt: new Date(Date.now() - 5 * 60000).toISOString(),
      },
      {
        id: '2',
        type: 'evacuation',
        title: 'Evacuation Suggested',
        location: 'Odisha',
        description: 'Evacuation recommended for low-lying areas',
        detail: 'Zone 3',
        time: '23 mins ago',
        severity: 'high' as const,
        status: 'active' as const,
        affectedPopulation: 180000,
        createdAt: new Date(Date.now() - 23 * 60000).toISOString(),
      },
      {
        id: '3',
        type: 'resource',
        title: 'Resource Shortage',
        location: 'Maharashtra',
        description: 'Medical supplies running low in affected zones',
        detail: '',
        time: '1 hour ago',
        severity: 'medium' as const,
        status: 'active' as const,
        affectedPopulation: 100000,
        createdAt: new Date(Date.now() - 60 * 60000).toISOString(),
      },
      {
        id: '4',
        type: 'cyclone',
        title: 'Cyclone Alert',
        location: 'Tamil Nadu',
        description: 'Cyclone warning issued for coastal areas',
        detail: 'Category 2',
        time: '2 hours ago',
        severity: 'high' as const,
        status: 'resolved' as const,
        affectedPopulation: 500000,
        createdAt: new Date(Date.now() - 120 * 60000).toISOString(),
      },
    ]

    // Filter by status if provided
    if (status && status !== 'all') {
      alerts = alerts.filter((a) => a.status === status)
    }

    // Filter by severity if provided
    if (severity && severity !== 'all') {
      alerts = alerts.filter((a) => a.severity === severity)
    }

    return successResponse(alerts)
  } catch (error) {
    console.error('Alerts API error:', error)
    return errorResponse('Failed to fetch alerts', 500)
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = await requireAuth(req)
    if (userId instanceof Response) return userId

    const body = await req.json()
    const { title, description, severity, location } = body

    if (!title || !severity || !location) {
      return errorResponse('Missing required fields', 400)
    }

    // In production, create alert in Supabase
    const newAlert = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'system',
      title,
      description,
      severity,
      location,
      status: 'active',
      affectedPopulation: 0,
      createdAt: new Date().toISOString(),
    }

    return successResponse(newAlert, 201)
  } catch (error) {
    console.error('Alert creation error:', error)
    return errorResponse('Failed to create alert', 500)
  }
}
