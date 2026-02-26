// Notifications System for ResQAI

export interface Notification {
  id: string
  type: 'info' | 'warning' | 'error' | 'success'
  title: string
  message: string
  timestamp: number
  read: boolean
  actionUrl?: string
}

class NotificationManager {
  private notifications: Notification[] = []
  private callbacks: ((notifications: Notification[]) => void)[] = []

  constructor() {
    this.loadFromStorage()
  }

  // Add a new notification
  addNotification(notification: Omit<Notification, 'id' | 'timestamp' | 'read'>): Notification {
    const newNotification: Notification = {
      ...notification,
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      read: false,
    }

    this.notifications.unshift(newNotification)
    this.notifications = this.notifications.slice(0, 50) // Keep last 50

    this.saveToStorage()
    this.notifySubscribers()

    return newNotification
  }

  // Mark notification as read
  markAsRead(id: string): void {
    const notif = this.notifications.find(n => n.id === id)
    if (notif) {
      notif.read = true
      this.saveToStorage()
      this.notifySubscribers()
    }
  }

  // Mark all as read
  markAllAsRead(): void {
    this.notifications.forEach(n => {
      n.read = true
    })
    this.saveToStorage()
    this.notifySubscribers()
  }

  // Delete notification
  deleteNotification(id: string): void {
    this.notifications = this.notifications.filter(n => n.id !== id)
    this.saveToStorage()
    this.notifySubscribers()
  }

  // Clear all
  clearAll(): void {
    this.notifications = []
    this.saveToStorage()
    this.notifySubscribers()
  }

  // Get all notifications
  getNotifications(): Notification[] {
    return [...this.notifications]
  }

  // Get unread count
  getUnreadCount(): number {
    return this.notifications.filter(n => !n.read).length
  }

  // Subscribe to changes
  subscribe(callback: (notifications: Notification[]) => void): () => void {
    this.callbacks.push(callback)
    return () => {
      this.callbacks = this.callbacks.filter(cb => cb !== callback)
    }
  }

  private notifySubscribers(): void {
    this.callbacks.forEach(cb => cb([...this.notifications]))
  }

  private loadFromStorage(): void {
    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('resqai-notifications')
        if (stored) {
          this.notifications = JSON.parse(stored)
        }
      }
    } catch (error) {
      console.error('[v0] Failed to load notifications:', error)
    }
  }

  private saveToStorage(): void {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('resqai-notifications', JSON.stringify(this.notifications))
      }
    } catch (error) {
      console.error('[v0] Failed to save notifications:', error)
    }
  }
}

export const notificationManager = new NotificationManager()

// Preset notification templates
export const notificationTemplates = {
  highRiskDetected: (zone: string, riskScore: number) => ({
    type: 'error' as const,
    title: 'High Risk Alert',
    message: `Risk score of ${riskScore}% detected in ${zone}. Initiate emergency response.`,
  }),
  shelterOverloaded: (shelterName: string, occupancy: number) => ({
    type: 'warning' as const,
    title: 'Shelter Capacity Alert',
    message: `${shelterName} is ${occupancy}% occupied. Activate alternative shelters.`,
  }),
  resourceUpdate: (resourceType: string, available: number) => ({
    type: 'info' as const,
    title: 'Resource Update',
    message: `${resourceType} updated: ${available} units available for deployment.`,
  }),
  analysisComplete: (areaZone: string, riskLevel: string) => ({
    type: 'success' as const,
    title: 'Analysis Complete',
    message: `Risk analysis for ${areaZone} completed. Risk level: ${riskLevel}`,
  }),
  offlineModeActivated: () => ({
    type: 'warning' as const,
    title: 'Offline Mode',
    message: 'You are offline. Changes will be synced when connection is restored.',
  }),
  syncCompleted: () => ({
    type: 'success' as const,
    title: 'Sync Complete',
    message: 'All offline changes have been synced to the server.',
  }),
}
