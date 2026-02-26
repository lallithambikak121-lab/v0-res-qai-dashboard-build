# ResQAI Dashboard Implementation Guide

## Overview
This document outlines the complete implementation of authentication, backend APIs, and database integration for the ResQAI disaster response system.

## Completed Setup

### 1. Authentication (Clerk)
- **Middleware** (`middleware.ts`): Protects all `/dashboard/*` routes, redirecting unauthenticated users to `/login`
- **Root Layout** (`app/layout.tsx`): Wrapped with `ClerkProvider` for authentication context
- **Login Page** (`app/login/page.tsx`): Uses Clerk's `SignIn` component with custom styling
- **Top Navigation** (`components/dashboard/top-nav.tsx`): Added `UserButton` component for user sign-out

**How it works:**
1. Unauthenticated users are redirected to `/login`
2. Users sign in through Clerk's authentication UI
3. After successful login, users are redirected to `/dashboard`
4. `UserButton` in the top-nav provides a sign-out option

### 2. Backend API Routes

#### Weather API
**Endpoint:** `GET /api/weather?location={location}`
- Requires authentication
- Returns weather data for a given location
- Mock data with real-world structure ready for Supabase integration

#### Alerts API
**Endpoints:**
- `GET /api/alerts?status={status}&severity={severity}` - Fetch alerts with optional filtering
- `POST /api/alerts` - Create new alert (requires: title, description, severity, location)

- Requires authentication
- Real-time alert data with filtering capabilities
- Status: `active`, `resolved`, `archived`
- Severity: `low`, `medium`, `high`, `critical`

#### Resources API
**Endpoints:**
- `GET /api/resources?type={type}` - Fetch resources with optional type filtering
- `PUT /api/resources` - Update resource status and utilization

- Requires authentication
- Resource types: `shelter`, `medical`, `vehicle`, `supplies`, `personnel`, `equipment`
- Tracks capacity and current utilization

#### Analyze API
**Endpoint:** `POST /api/analyze`
**Input:**
```typescript
{
  area: string
  rainfall: number
  elevation: number
  population: number
  coastalDistance: number
  disasterIntensity: number
}
```

**Output:**
```typescript
{
  area: string
  riskScore: number (0-100)
  riskLevel: 'low' | 'medium' | 'high' | 'critical'
  factors: { /* input parameters */ }
  confidence: number (0-100)
  recommendations: string[]
  analyzedAt: ISO string
}
```

- AI-powered risk analysis with dynamic recommendations
- Risk score calculation based on multiple environmental factors
- Requires authentication

### 3. Frontend Integration with SWR

#### Custom Hooks (`lib/hooks/use-api.ts`)
```typescript
// Fetch weather data
const { weather, isLoading, error, refetch } = useWeather(location)

// Fetch alerts with real-time updates
const { alerts, isLoading, error, refetch } = useAlerts(status?, severity?)

// Fetch resources
const { resources, isLoading, error, refetch } = useResources(type?)

// Analyze risk (mutation hook)
const { analyze } = useAnalyzeRisk()
const result = await analyze({ area, rainfall, ... })

// Create alert (mutation hook)
const { create } = useCreateAlert()
await create({ title, description, severity, location })

// Update resource (mutation hook)
const { update } = useUpdateResource()
await update({ resourceId, status, utilization })
```

**Features:**
- Automatic caching and deduplication
- Real-time updates for alerts (30-second refresh interval)
- Error handling and loading states
- Type-safe API calls

#### Dashboard Integration (`app/dashboard/page.tsx`)
- Alerts automatically synced from API to dashboard context
- Real-time alert display in QuickAlerts component
- Resources data ready for integration
- Fallback to mock data if API is unavailable

### 4. Database Schema (Supabase)

**SQL Scripts Available:**
- `scripts/001_schema.sql` - Creates all tables with RLS policies
- `scripts/002_seed.sql` - Inserts sample data

**Tables:**
1. **profiles** - User metadata (id, email, created_at, updated_at)
2. **weather_data** - Location-based weather records
3. **alerts** - Active and historical alerts
4. **resources** - Emergency response resources
5. **risk_assessments** - Risk analysis records by state
6. **action_plans** - Emergency response action plans

All tables include Row Level Security (RLS) policies for data protection.

## Configuration Required

### Environment Variables
Ensure these are set in your Vercel project:
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
CLERK_SECRET_KEY
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
```

### Clerk Setup
1. Create a Clerk account at https://clerk.com
2. Create a new application
3. Get your publishable key and secret key
4. Add your application URL to Clerk's allowed origins

### Supabase Setup
1. Create a Supabase project
2. Execute the SQL migration scripts (001_schema.sql, 002_seed.sql)
3. Update RLS policies if needed for production use

## Next Steps

### For Production Deployment
1. **Database Migration**: Execute SQL scripts in Supabase to create actual tables
2. **API Enhancement**: Replace mock data with real Supabase queries
3. **Real-time Features**: Use Supabase realtime subscriptions for live updates
4. **Error Handling**: Implement comprehensive error logging
5. **Rate Limiting**: Add API rate limiting for production

### Integration Example
```typescript
// Replace mock data in API routes with Supabase queries
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(url, key)

export async function GET(req: NextRequest) {
  const userId = await requireAuth(req)
  if (userId instanceof Response) return userId

  // Fetch from Supabase instead of mock data
  const { data, error } = await supabase
    .from('alerts')
    .select('*')
    .eq('status', 'active')

  return successResponse(data)
}
```

### Testing the Setup
1. Navigate to `/login` - should see Clerk authentication
2. Sign in with your Clerk credentials
3. Access `/dashboard` - should show real-time data from APIs
4. Check browser console for any authentication errors
5. Monitor network tab to see API calls to `/api/weather`, `/api/alerts`, etc.

## File Structure
```
app/
  api/
    weather/route.ts      ✓ Implemented
    alerts/route.ts       ✓ Implemented
    resources/route.ts    ✓ Implemented
    analyze/route.ts      ✓ Implemented
  dashboard/
    page.tsx              ✓ Updated with API integration
    layout.tsx            ✓ Dashboard context
  login/page.tsx          ✓ Clerk authentication
  layout.tsx              ✓ ClerkProvider added
lib/
  hooks/
    use-api.ts            ✓ SWR data fetching hooks
  api-utils.ts            ✓ Auth and response utilities
middleware.ts             ✓ Route protection
components/
  dashboard/
    top-nav.tsx           ✓ UserButton added
    quick-alerts.tsx      ✓ Ready for API integration
scripts/
  001_schema.sql          ✓ Database schema
  002_seed.sql            ✓ Sample data
```

## Support
For issues or questions:
1. Check Clerk documentation: https://clerk.com/docs
2. Check Supabase documentation: https://supabase.com/docs
3. Review API error logs in browser console
4. Verify environment variables are correctly set
