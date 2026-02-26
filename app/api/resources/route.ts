import { NextRequest } from 'next/server'
import { requireAuth, successResponse, errorResponse } from '@/lib/api-utils'

export async function GET(req: NextRequest) {
  try {
    const userId = await requireAuth(req)
    if (userId instanceof Response) return userId

    const { searchParams } = new URL(req.url)
    const resourceType = searchParams.get('type')

    // Mock resources data - in production, fetch from Supabase
    let resources = [
      {
        id: '1',
        name: 'Convention Center Shelter',
        type: 'shelter',
        location: 'New York',
        status: 'available',
        capacity: 5000,
        currentUtilization: 1200,
        contact: {
          person: 'John Smith',
          phone: '555-0101',
        },
        lastUpdated: new Date().toISOString(),
      },
      {
        id: '2',
        name: 'City Hospital',
        type: 'medical',
        location: 'Los Angeles',
        status: 'deployed',
        capacity: 500,
        currentUtilization: 450,
        contact: {
          person: 'Dr. Johnson',
          phone: '555-0102',
        },
        lastUpdated: new Date().toISOString(),
      },
      {
        id: '3',
        name: 'Emergency Response Fleet',
        type: 'vehicle',
        location: 'Chicago',
        status: 'available',
        capacity: 50,
        currentUtilization: 35,
        contact: {
          person: 'Michael Brown',
          phone: '555-0103',
        },
        lastUpdated: new Date().toISOString(),
      },
      {
        id: '4',
        name: 'Supply Distribution Center',
        type: 'supplies',
        location: 'Houston',
        status: 'available',
        capacity: 10000,
        currentUtilization: 7500,
        contact: {
          person: 'Sarah Davis',
          phone: '555-0104',
        },
        lastUpdated: new Date().toISOString(),
      },
      {
        id: '5',
        name: 'Emergency Personnel Team',
        type: 'personnel',
        location: 'Phoenix',
        status: 'deployed',
        capacity: 200,
        currentUtilization: 180,
        contact: {
          person: 'Robert Wilson',
          phone: '555-0105',
        },
        lastUpdated: new Date().toISOString(),
      },
    ]

    // Filter by type if provided
    if (resourceType && resourceType !== 'all') {
      resources = resources.filter((r) => r.type === resourceType)
    }

    return successResponse(resources)
  } catch (error) {
    console.error('Resources API error:', error)
    return errorResponse('Failed to fetch resources', 500)
  }
}

export async function PUT(req: NextRequest) {
  try {
    const userId = await requireAuth(req)
    if (userId instanceof Response) return userId

    const body = await req.json()
    const { resourceId, status, utilization } = body

    if (!resourceId) {
      return errorResponse('Missing resource ID', 400)
    }

    // In production, update resource in Supabase
    const updatedResource = {
      id: resourceId,
      status: status || 'available',
      currentUtilization: utilization || 0,
      lastUpdated: new Date().toISOString(),
    }

    return successResponse(updatedResource)
  } catch (error) {
    console.error('Resource update error:', error)
    return errorResponse('Failed to update resource', 500)
  }
}
