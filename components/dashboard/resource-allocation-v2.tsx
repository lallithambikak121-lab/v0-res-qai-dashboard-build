'use client'

import React, { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useI18n } from '@/lib/i18n/context'
import { Sliders, TrendingUp, AlertCircle } from 'lucide-react'

export interface Resource {
  id: string
  type: string
  icon: string
  available: number
  allocated: number
  maxCapacity: number
  priority: 'low' | 'medium' | 'high' | 'critical'
  location: string
  status: 'available' | 'deployed' | 'overloaded'
}

interface ResourceAllocationV2Props {
  resources?: Resource[]
  onAllocate?: (resourceId: string, amount: number) => void
  onDeploy?: (resourceId: string) => void
}

const DEFAULT_RESOURCES: Resource[] = [
  {
    id: 'boats',
    type: 'Rescue Boats',
    icon: '🚤',
    available: 45,
    allocated: 12,
    maxCapacity: 50,
    priority: 'high',
    location: 'Coastal Division',
    status: 'available',
  },
  {
    id: 'ambulances',
    type: 'Ambulances',
    icon: '🚑',
    available: 120,
    allocated: 45,
    maxCapacity: 150,
    priority: 'critical',
    location: 'Medical Services',
    status: 'deployed',
  },
  {
    id: 'food-kits',
    type: 'Food Kits',
    icon: '📦',
    available: 5000,
    allocated: 1200,
    maxCapacity: 10000,
    priority: 'high',
    location: 'Distribution Centers',
    status: 'available',
  },
  {
    id: 'medical-teams',
    type: 'Medical Teams',
    icon: '⚕️',
    available: 85,
    allocated: 32,
    maxCapacity: 100,
    priority: 'critical',
    location: 'Hospitals & Clinics',
    status: 'deployed',
  },
  {
    id: 'tents',
    type: 'Shelter Tents',
    icon: '⛺',
    available: 300,
    allocated: 150,
    maxCapacity: 500,
    priority: 'high',
    location: 'Shelter Depots',
    status: 'deployed',
  },
  {
    id: 'generators',
    type: 'Power Generators',
    icon: '⚡',
    available: 45,
    allocated: 20,
    maxCapacity: 60,
    priority: 'medium',
    location: 'Power Division',
    status: 'available',
  },
]

export function ResourceAllocationV2({ 
  resources = DEFAULT_RESOURCES, 
  onAllocate,
  onDeploy 
}: ResourceAllocationV2Props) {
  const { t } = useI18n()
  const [allocating, setAllocating] = useState<string | null>(null)
  const [allocationAmount, setAllocationAmount] = useState(0)

  function getStatusColor(status: string): string {
    switch (status) {
      case 'available':
        return 'bg-green-500/20 text-green-300 border-green-500/50'
      case 'deployed':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/50'
      case 'overloaded':
        return 'bg-red-500/20 text-red-300 border-red-500/50'
      default:
        return 'bg-slate-500/20 text-slate-300 border-slate-500/50'
    }
  }

  function getUtilizationColor(utilization: number): string {
    if (utilization < 50) return 'bg-green-500'
    if (utilization < 75) return 'bg-yellow-500'
    if (utilization < 90) return 'bg-orange-500'
    return 'bg-red-500'
  }

  function getPriorityColor(priority: string): string {
    switch (priority) {
      case 'critical':
        return 'bg-red-500'
      case 'high':
        return 'bg-orange-500'
      case 'medium':
        return 'bg-yellow-500'
      case 'low':
        return 'bg-green-500'
      default:
        return 'bg-blue-500'
    }
  }

  return (
    <Card className="bg-gradient-to-br from-blue-900/40 to-slate-900/40 border border-blue-500/30 p-6">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Sliders className="w-5 h-5 text-emerald-400" />
              {t('resources')}
            </h3>
            <p className="text-xs text-blue-300 mt-1">Real-time resource allocation and deployment</p>
          </div>
          <div className="flex gap-1">
            {['critical', 'high', 'medium', 'low'].map(priority => (
              <div
                key={priority}
                className={`w-2 h-2 rounded-full ${getPriorityColor(priority)} opacity-70`}
                title={priority}
              />
            ))}
          </div>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-2">
          {resources.map(resource => {
            const utilization = (resource.allocated / resource.maxCapacity) * 100
            const isAllocating = allocating === resource.id

            return (
              <div
                key={resource.id}
                className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-3 hover:border-blue-500/50 transition-all"
              >
                {/* Resource Header */}
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{resource.icon}</span>
                    <div className="flex-1">
                      <h4 className="font-semibold text-white text-sm">{resource.type}</h4>
                      <p className="text-xs text-blue-300">{resource.location}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Badge
                      variant="outline"
                      className={`text-xs ${getStatusColor(resource.status)} border`}
                    >
                      {resource.status}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={`text-xs bg-${getPriorityColor(resource.priority).split('-')[1]}-500/20 text-${getPriorityColor(resource.priority).split('-')[1]}-300 border-${getPriorityColor(resource.priority).split('-')[1]}-500/50`}
                    >
                      {resource.priority}
                    </Badge>
                  </div>
                </div>

                {/* Numbers */}
                <div className="grid grid-cols-3 gap-2 mb-2 text-xs">
                  <div className="bg-blue-500/20 rounded p-2 text-center">
                    <div className="text-blue-300">Available</div>
                    <div className="text-lg font-bold text-blue-100">{resource.available}</div>
                  </div>
                  <div className="bg-yellow-500/20 rounded p-2 text-center">
                    <div className="text-yellow-300">Allocated</div>
                    <div className="text-lg font-bold text-yellow-100">{resource.allocated}</div>
                  </div>
                  <div className="bg-slate-700/50 rounded p-2 text-center">
                    <div className="text-slate-300">Capacity</div>
                    <div className="text-lg font-bold text-slate-100">{resource.maxCapacity}</div>
                  </div>
                </div>

                {/* Utilization Bar */}
                <div className="mb-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-blue-200">Utilization</span>
                    <span className="text-xs font-bold text-white">{Math.round(utilization)}%</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${getUtilizationColor(utilization)}`}
                      style={{ width: `${Math.min(100, utilization)}%` }}
                    />
                  </div>
                </div>

                {/* Allocation Controls */}
                {isAllocating ? (
                  <div className="space-y-2">
                    <input
                      type="number"
                      min="0"
                      max={resource.available}
                      value={allocationAmount}
                      onChange={e => setAllocationAmount(parseInt(e.target.value) || 0)}
                      className="w-full bg-slate-700 border border-blue-500/50 rounded px-2 py-1 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-blue-400"
                      placeholder="Enter amount"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          onAllocate?.(resource.id, allocationAmount)
                          setAllocating(null)
                          setAllocationAmount(0)
                        }}
                        className="flex-1 px-2 py-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded text-xs font-medium transition-colors"
                      >
                        Allocate
                      </button>
                      <button
                        onClick={() => {
                          setAllocating(null)
                          setAllocationAmount(0)
                        }}
                        className="flex-1 px-2 py-1 bg-slate-700/50 hover:bg-slate-700 text-slate-300 rounded text-xs font-medium transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setAllocating(resource.id)}
                    className="w-full px-3 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 rounded text-xs font-medium transition-colors"
                  >
                    {t('allocate')} Resources
                  </button>
                )}

                {/* Warning */}
                {utilization > 85 && (
                  <div className="mt-2 flex items-start gap-2 p-2 bg-red-500/20 border border-red-500/50 rounded">
                    <AlertCircle className="w-3 h-3 text-red-400 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-red-200">Utilization above 85% - consider reallocation</p>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Summary Footer */}
        <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <p className="text-xs text-blue-200 mb-1">Total Available</p>
              <p className="text-lg font-bold text-blue-300">
                {resources.reduce((sum, r) => sum + r.available, 0)}
              </p>
            </div>
            <div>
              <p className="text-xs text-yellow-200 mb-1">Total Allocated</p>
              <p className="text-lg font-bold text-yellow-300">
                {resources.reduce((sum, r) => sum + r.allocated, 0)}
              </p>
            </div>
            <div>
              <p className="text-xs text-emerald-200 mb-1">Ready to Deploy</p>
              <p className="text-lg font-bold text-emerald-300">
                {resources.filter(r => r.status === 'available').length}/{resources.length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
