'use client'

import React, { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useI18n } from '@/lib/i18n/context'
import { AlertCircle, Clock, Trash2, RotateCcw } from 'lucide-react'
import { type AnalysisRecord, type AlertRecord, offlineManager } from '@/lib/offline'

interface AlertsHistoryV2Props {
  analyses?: AnalysisRecord[]
  alerts?: AlertRecord[]
  onRestoreAnalysis?: (analysis: AnalysisRecord) => void
  onDeleteAnalysis?: (id: string) => void
}

export function AlertsHistoryV2({ 
  analyses = [],
  alerts = [], 
  onRestoreAnalysis,
  onDeleteAnalysis 
}: AlertsHistoryV2Props) {
  const { t } = useI18n()
  const [activeTab, setActiveTab] = useState<'alerts' | 'history'>('alerts')
  
  // Load from offline storage if not provided
  const displayAlerts = alerts.length > 0 ? alerts : offlineManager.getAlerts()
  const displayAnalyses = analyses.length > 0 ? analyses : offlineManager.getAnalyses()

  function getSeverityColor(severity: string) {
    switch (severity) {
      case 'critical':
        return 'bg-red-500/20 text-red-300 border-red-500/50'
      case 'high':
        return 'bg-orange-500/20 text-orange-300 border-orange-500/50'
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50'
      case 'low':
        return 'bg-green-500/20 text-green-300 border-green-500/50'
      default:
        return 'bg-blue-500/20 text-blue-300 border-blue-500/50'
    }
  }

  function formatTime(timestamp: number): string {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 1) return 'just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`

    return date.toLocaleDateString()
  }

  function getRiskLevelColor(level: string) {
    switch (level) {
      case 'veryHigh':
        return 'bg-red-500/20 text-red-300'
      case 'high':
        return 'bg-orange-500/20 text-orange-300'
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-300'
      case 'safe':
        return 'bg-green-500/20 text-green-300'
      default:
        return 'bg-blue-500/20 text-blue-300'
    }
  }

  return (
    <Card className="bg-gradient-to-br from-blue-900/40 to-slate-900/40 border border-blue-500/30 p-6">
      <div className="space-y-4">
        {/* Tabs */}
        <div className="flex gap-2 border-b border-blue-800/30">
          <button
            onClick={() => setActiveTab('alerts')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'alerts'
                ? 'text-blue-300 border-blue-400'
                : 'text-blue-400 border-transparent hover:text-blue-300'
            }`}
          >
            {t('alerts')} {displayAlerts.length > 0 && <span className="ml-2">({displayAlerts.length})</span>}
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'history'
                ? 'text-blue-300 border-blue-400'
                : 'text-blue-400 border-transparent hover:text-blue-300'
            }`}
          >
            {t('history')} {displayAnalyses.length > 0 && <span className="ml-2">({displayAnalyses.length})</span>}
          </button>
        </div>

        {/* Alerts Tab */}
        {activeTab === 'alerts' && (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {displayAlerts.length === 0 ? (
              <div className="text-center py-8 text-blue-300">
                <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">{t('noAlerts')}</p>
              </div>
            ) : (
              displayAlerts.map(alert => (
                <div
                  key={alert.id}
                  className={`rounded-lg p-3 border ${getSeverityColor(alert.severity)} transition-all`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex-1">
                      <h4 className="font-semibold text-white text-sm">{alert.title || alert.type}</h4>
                      <p className="text-xs text-blue-200 mt-1">{alert.message}</p>
                    </div>
                    <Badge variant="outline" className="text-xs whitespace-nowrap">
                      {alert.severity}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-xs text-blue-300">
                    <span>{alert.location}</span>
                    <span>{formatTime(alert.timestamp)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {displayAnalyses.length === 0 ? (
              <div className="text-center py-8 text-blue-300">
                <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">{t('noHistory')}</p>
              </div>
            ) : (
              displayAnalyses.map(analysis => (
                <div
                  key={analysis.id}
                  className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50 hover:border-blue-500/50 transition-all"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-white text-sm">{analysis.areaZone}</h4>
                        <Badge className={`text-xs ${getRiskLevelColor(analysis.riskLevel)}`}>
                          {analysis.riskScore}%
                        </Badge>
                      </div>
                      <p className="text-xs text-blue-200">
                        Rainfall: {analysis.rainfall}mm | Population: {(analysis.population / 1000).toFixed(0)}K
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-blue-300 mb-2">
                    <span>{new Date(analysis.timestamp).toLocaleDateString()}</span>
                    <span>Confidence: {analysis.confidence}%</span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => onRestoreAnalysis?.(analysis)}
                      className="flex-1 flex items-center justify-center gap-1 px-2 py-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded text-xs font-medium transition-colors"
                    >
                      <RotateCcw className="w-3 h-3" />
                      {t('restore')}
                    </button>
                    <button
                      onClick={() => {
                        onDeleteAnalysis?.(analysis.id)
                        offlineManager.deleteAnalysis(analysis.id)
                      }}
                      className="flex items-center justify-center gap-1 px-2 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded text-xs font-medium transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </Card>
  )
}
