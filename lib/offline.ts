// Offline Mode Support for ResQAI
import React from 'react'

export interface OfflineData {
  analyses: AnalysisRecord[]
  alerts: AlertRecord[]
  resources: ResourceRecord[]
  lastSync: number
}

export interface AnalysisRecord {
  id: string
  timestamp: number
  areaZone: string
  rainfall: number
  elevation: number
  population: number
  coastalDistance: number
  disasterIntensity: number
  riskScore: number
  riskLevel: string
  confidence: number
  recommendations: string[]
}

export interface AlertRecord {
  id: string
  timestamp: number
  type: 'flood' | 'cyclone' | 'drought' | 'earthquake'
  severity: 'low' | 'medium' | 'high' | 'critical'
  location: string
  message: string
  read: boolean
}

export interface ResourceRecord {
  id: string
  type: string
  available: number
  allocated: number
  location: string
  lastUpdated: number
}

const STORAGE_KEY = 'resqai-offline-data'
const SYNC_KEY = 'resqai-last-sync'

class OfflineManager {
  private isOnline: boolean = typeof window !== 'undefined' && navigator.onLine

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        this.isOnline = true
        this.onlineCallback?.()
      })
      window.addEventListener('offline', () => {
        this.isOnline = false
        this.offlineCallback?.()
      })
    }
  }

  onlineCallback?: () => void
  offlineCallback?: () => void

  setOnlineCallback(callback: () => void) {
    this.onlineCallback = callback
  }

  setOfflineCallback(callback: () => void) {
    this.offlineCallback = callback
  }

  isOffline(): boolean {
    return !this.isOnline
  }

  getStatus(): 'online' | 'offline' {
    return this.isOnline ? 'online' : 'offline'
  }

  // Save analysis to local storage
  saveAnalysis(analysis: AnalysisRecord): void {
    try {
      const data = this.getData()
      const existing = data.analyses.findIndex(a => a.id === analysis.id)

      if (existing >= 0) {
        data.analyses[existing] = analysis
      } else {
        data.analyses.unshift(analysis)
      }

      data.analyses = data.analyses.slice(0, 50) // Keep last 50 analyses
      this.setData(data)
    } catch (error) {
      console.error('[v0] Failed to save analysis:', error)
    }
  }

  // Get all analyses
  getAnalyses(): AnalysisRecord[] {
    try {
      const data = this.getData()
      return data.analyses
    } catch {
      return []
    }
  }

  // Save alert to local storage
  saveAlert(alert: AlertRecord): void {
    try {
      const data = this.getData()
      const existing = data.alerts.findIndex(a => a.id === alert.id)

      if (existing >= 0) {
        data.alerts[existing] = alert
      } else {
        data.alerts.unshift(alert)
      }

      data.alerts = data.alerts.slice(0, 100) // Keep last 100 alerts
      this.setData(data)
    } catch (error) {
      console.error('[v0] Failed to save alert:', error)
    }
  }

  // Get all alerts
  getAlerts(): AlertRecord[] {
    try {
      const data = this.getData()
      return data.alerts
    } catch {
      return []
    }
  }

  // Save resources to local storage
  saveResources(resources: ResourceRecord[]): void {
    try {
      const data = this.getData()
      data.resources = resources
      this.setData(data)
    } catch (error) {
      console.error('[v0] Failed to save resources:', error)
    }
  }

  // Get all resources
  getResources(): ResourceRecord[] {
    try {
      const data = this.getData()
      return data.resources
    } catch {
      return []
    }
  }

  // Clear specific analysis
  deleteAnalysis(id: string): void {
    try {
      const data = this.getData()
      data.analyses = data.analyses.filter(a => a.id !== id)
      this.setData(data)
    } catch (error) {
      console.error('[v0] Failed to delete analysis:', error)
    }
  }

  // Restore analysis from history
  restoreAnalysis(id: string): AnalysisRecord | null {
    try {
      const data = this.getData()
      return data.analyses.find(a => a.id === id) || null
    } catch {
      return null
    }
  }

  // Get last sync time
  getLastSyncTime(): number {
    try {
      const data = this.getData()
      return data.lastSync || 0
    } catch {
      return 0
    }
  }

  // Update last sync time
  updateSyncTime(): void {
    try {
      const data = this.getData()
      data.lastSync = Date.now()
      this.setData(data)
    } catch (error) {
      console.error('[v0] Failed to update sync time:', error)
    }
  }

  // Clear all offline data
  clearAllData(): void {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(STORAGE_KEY)
      }
    } catch (error) {
      console.error('[v0] Failed to clear data:', error)
    }
  }

  private getData(): OfflineData {
    try {
      if (typeof window === 'undefined') {
        return { analyses: [], alerts: [], resources: [], lastSync: 0 }
      }

      const stored = localStorage.getItem(STORAGE_KEY)
      if (!stored) {
        return { analyses: [], alerts: [], resources: [], lastSync: 0 }
      }

      return JSON.parse(stored)
    } catch {
      return { analyses: [], alerts: [], resources: [], lastSync: 0 }
    }
  }

  private setData(data: OfflineData): void {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
      }
    } catch (error) {
      console.error('[v0] Failed to set data:', error)
    }
  }
}

export const offlineManager = new OfflineManager()

// Hook for offline status
export function useOfflineStatus() {
  const [isOffline, setIsOffline] = React.useState(false)

  React.useEffect(() => {
    setIsOffline(offlineManager.isOffline())

    offlineManager.setOfflineCallback(() => setIsOffline(true))
    offlineManager.setOnlineCallback(() => setIsOffline(false))

    return () => {
      offlineManager.setOfflineCallback(undefined)
      offlineManager.setOnlineCallback(undefined)
    }
  }, [])

  return isOffline
}
