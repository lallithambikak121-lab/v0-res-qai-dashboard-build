import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function useWeather(location: string = 'Bihar - Patna') {
  const { data, error, isLoading, mutate } = useSWR(
    `/api/weather?location=${encodeURIComponent(location)}`,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  )

  return {
    weather: data?.data,
    isLoading,
    error,
    refetch: mutate,
  }
}

export function useAlerts(status?: string, severity?: string) {
  const query = new URLSearchParams()
  if (status) query.append('status', status)
  if (severity) query.append('severity', severity)

  const { data, error, isLoading, mutate } = useSWR(
    `/api/alerts?${query.toString()}`,
    fetcher,
    {
      revalidateOnFocus: false,
      refreshInterval: 30000,
    }
  )

  return {
    alerts: data?.data || [],
    isLoading,
    error,
    refetch: mutate,
  }
}

export function useResources(resourceType?: string) {
  const query = resourceType ? `?type=${resourceType}` : ''

  const { data, error, isLoading, mutate } = useSWR(
    `/api/resources${query}`,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  )

  return {
    resources: data?.data || [],
    isLoading,
    error,
    refetch: mutate,
  }
}

export function useAnalyzeRisk() {
  const analyze = async (params: {
    area: string
    rainfall: number
    elevation: number
    population: number
    coastalDistance: number
    disasterIntensity: number
  }) => {
    const res = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    })

    if (!res.ok) {
      throw new Error('Failed to analyze risk')
    }

    return res.json()
  }

  return { analyze }
}

export function useCreateAlert() {
  const create = async (params: {
    title: string
    description: string
    severity: 'low' | 'medium' | 'high' | 'critical'
    location: string
  }) => {
    const res = await fetch('/api/alerts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    })

    if (!res.ok) {
      throw new Error('Failed to create alert')
    }

    return res.json()
  }

  return { create }
}

export function useUpdateResource() {
  const update = async (params: {
    resourceId: string
    status?: string
    utilization?: number
  }) => {
    const res = await fetch('/api/resources', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    })

    if (!res.ok) {
      throw new Error('Failed to update resource')
    }

    return res.json()
  }

  return { update }
}
