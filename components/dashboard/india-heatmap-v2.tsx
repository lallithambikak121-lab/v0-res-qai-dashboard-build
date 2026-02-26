'use client'

import React, { useState } from 'react'
import { useI18n } from '@/lib/i18n/context'

interface StateRiskData {
  name: string
  risk: number // 0-100
}

interface IndiaHeatmapProps {
  stateRisks: Record<string, number>
  onStateSelect?: (state: string) => void
  selectedState?: string
}

const STATES_DATA: StateRiskData[] = [
  { name: 'Andhra Pradesh', risk: 72 },
  { name: 'Arunachal Pradesh', risk: 65 },
  { name: 'Assam', risk: 75 },
  { name: 'Bihar', risk: 72 },
  { name: 'Chhattisgarh', risk: 65 },
  { name: 'Goa', risk: 60 },
  { name: 'Gujarat', risk: 68 },
  { name: 'Haryana', risk: 55 },
  { name: 'Himachal Pradesh', risk: 60 },
  { name: 'Jharkhand', risk: 65 },
  { name: 'Karnataka', risk: 62 },
  { name: 'Kerala', risk: 70 },
  { name: 'Madhya Pradesh', risk: 62 },
  { name: 'Maharashtra', risk: 65 },
  { name: 'Manipur', risk: 68 },
  { name: 'Meghalaya', risk: 78 },
  { name: 'Mizoram', risk: 72 },
  { name: 'Nagaland', risk: 70 },
  { name: 'Odisha', risk: 75 },
  { name: 'Punjab', risk: 58 },
  { name: 'Rajasthan', risk: 68 },
  { name: 'Sikkim', risk: 65 },
  { name: 'Tamil Nadu', risk: 72 },
  { name: 'Telangana', risk: 68 },
  { name: 'Tripura', risk: 70 },
  { name: 'Uttar Pradesh', risk: 62 },
  { name: 'Uttarakhand', risk: 68 },
  { name: 'West Bengal', risk: 72 },
]

function getRiskColor(risk: number): string {
  if (risk < 30) return '#10b981' // Safe - Green
  if (risk < 60) return '#eab308' // Medium - Yellow
  if (risk < 80) return '#f97316' // High - Orange
  return '#dc2626' // Very High - Red
}

function getRiskLabel(risk: number): string {
  if (risk < 30) return 'Safe'
  if (risk < 60) return 'Medium'
  if (risk < 80) return 'High'
  return 'Very High'
}

export function IndiaHeatmapV2({ stateRisks, onStateSelect, selectedState }: IndiaHeatmapProps) {
  const { t } = useI18n()
  const [hoveredState, setHoveredState] = useState<string | null>(null)

  // Merge provided state risks with default data
  const enrichedStates = STATES_DATA.map(state => ({
    ...state,
    risk: stateRisks[state.name] ?? state.risk,
  }))

  return (
    <div className="space-y-4">
      {/* Legend */}
      <div className="flex flex-wrap gap-4 bg-slate-800/50 p-4 rounded-lg border border-blue-800/30">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-green-500" />
          <span className="text-xs text-blue-200">Safe (&lt;30%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-yellow-400" />
          <span className="text-xs text-blue-200">Medium (30-60%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-orange-500" />
          <span className="text-xs text-blue-200">High (60-80%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-red-600" />
          <span className="text-xs text-blue-200">Very High (&gt;80%)</span>
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
        {enrichedStates.map(state => (
          <button
            key={state.name}
            onClick={() => onStateSelect?.(state.name)}
            onMouseEnter={() => setHoveredState(state.name)}
            onMouseLeave={() => setHoveredState(null)}
            className={`p-3 rounded-lg border-2 transition-all cursor-pointer group ${
              selectedState === state.name
                ? 'border-blue-400 ring-2 ring-blue-400'
                : 'border-slate-700 hover:border-slate-600'
            } ${hoveredState === state.name ? 'scale-105' : ''}`}
            style={{ backgroundColor: getRiskColor(state.risk) + '20' }}
          >
            <div
              className="absolute inset-0 rounded-lg pointer-events-none transition-opacity opacity-0 group-hover:opacity-100"
              style={{ backgroundColor: getRiskColor(state.risk) + '10' }}
            />
            <div className="relative z-10">
              <div className="text-xs font-bold text-white mb-1">{state.name.split(' ')[0]}</div>
              <div className="text-lg font-bold" style={{ color: getRiskColor(state.risk) }}>
                {state.risk}%
              </div>
              <div className="text-[10px] text-blue-200 mt-1">{getRiskLabel(state.risk)}</div>
            </div>
          </button>
        ))}
      </div>

      {/* State Details */}
      {selectedState && (
        <div className="bg-gradient-to-br from-blue-900/40 to-slate-900/40 border border-blue-500/30 rounded-lg p-4">
          <h3 className="font-semibold text-white mb-2">{selectedState}</h3>
          {enrichedStates.find(s => s.name === selectedState) && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-blue-200">Risk Level:</span>
                <span className="text-sm font-semibold" style={{ color: getRiskColor(enrichedStates.find(s => s.name === selectedState)!.risk) }}>
                  {getRiskLabel(enrichedStates.find(s => s.name === selectedState)!.risk)}
                </span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div
                  className="h-2 rounded-full transition-all"
                  style={{
                    width: `${enrichedStates.find(s => s.name === selectedState)!.risk}%`,
                    backgroundColor: getRiskColor(enrichedStates.find(s => s.name === selectedState)!.risk),
                  }}
                />
              </div>
            </div>
          )}
        </div>
      )}

      <p className="text-xs text-blue-300 text-center">{t('selectState')}</p>
    </div>
  )
}
