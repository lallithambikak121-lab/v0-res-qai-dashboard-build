'use client'

import React, { useState, useEffect } from 'react'
import { Slider } from '@/components/ui/slider'
import { Card } from '@/components/ui/card'
import { useI18n } from '@/lib/i18n/context'
import { simulateDisasterIntensity, type RiskOutput } from '@/lib/risk-engine'
import { TrendingUp, BarChart3 } from 'lucide-react'

interface WhatIfSimulatorV2Props {
  baseAnalysis: RiskOutput | null
  onSimulationChange?: (simulation: RiskOutput) => void
}

export function WhatIfSimulatorV2({ baseAnalysis, onSimulationChange }: WhatIfSimulatorV2Props) {
  const { t } = useI18n()
  const [intensityLevel, setIntensityLevel] = useState(0)
  const [simulatedAnalysis, setSimulatedAnalysis] = useState<RiskOutput | null>(null)

  useEffect(() => {
    if (baseAnalysis) {
      const simulated = simulateDisasterIntensity(baseAnalysis, intensityLevel)
      setSimulatedAnalysis(simulated)
      onSimulationChange?.(simulated)
    }
  }, [intensityLevel, baseAnalysis, onSimulationChange])

  if (!baseAnalysis || !simulatedAnalysis) {
    return (
      <Card className="bg-slate-800/50 border-blue-800/30 p-6">
        <div className="text-center py-8 text-blue-300">
          <BarChart3 className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">{t('loading')}</p>
        </div>
      </Card>
    )
  }

  const riskIncrease = simulatedAnalysis.riskScore - baseAnalysis.riskScore
  const affectedIncrease = simulatedAnalysis.affectedPopulation - baseAnalysis.affectedPopulation

  function getRiskColor(score: number): string {
    if (score < 30) return 'text-green-400'
    if (score < 60) return 'text-yellow-400'
    if (score < 80) return 'text-orange-400'
    return 'text-red-500'
  }

  function getRiskBgColor(score: number): string {
    if (score < 30) return 'bg-green-500/20'
    if (score < 60) return 'bg-yellow-500/20'
    if (score < 80) return 'bg-orange-500/20'
    return 'bg-red-500/20'
  }

  return (
    <Card className="bg-gradient-to-br from-blue-900/40 to-slate-900/40 border border-blue-500/30 p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-bold text-white mb-1">{t('simulator')}</h3>
            <p className="text-sm text-blue-300">Adjust disaster intensity to see risk projections</p>
          </div>
          <TrendingUp className="w-6 h-6 text-emerald-400" />
        </div>

        {/* Slider Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-blue-200">{t('simulationLevel')}</label>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-emerald-400">{intensityLevel}</span>
              <span className="text-sm text-blue-300">%</span>
            </div>
          </div>

          <Slider
            value={[intensityLevel]}
            onValueChange={values => setIntensityLevel(values[0])}
            min={0}
            max={100}
            step={5}
            className="w-full"
          />

          <div className="flex justify-between text-xs text-blue-300">
            <span>Current (+0%)</span>
            <span>+50% Intensity</span>
            <span>Extreme (+100%)</span>
          </div>
        </div>

        {/* Comparison Section */}
        <div className="grid grid-cols-2 gap-4">
          {/* Base Analysis */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-blue-300 uppercase">Current Scenario</h4>
            <div className={`${getRiskBgColor(baseAnalysis.riskScore)} rounded-lg p-3 border border-blue-500/30`}>
              <div className="text-xs text-blue-200 mb-1">Risk Score</div>
              <div className={`text-2xl font-bold ${getRiskColor(baseAnalysis.riskScore)}`}>
                {baseAnalysis.riskScore}%
              </div>
              <div className="text-xs text-blue-300 mt-1">{baseAnalysis.riskLevel}</div>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50">
              <div className="text-xs text-blue-200 mb-1">Affected Population</div>
              <div className="text-lg font-bold text-blue-300">
                {(baseAnalysis.affectedPopulation / 1000).toFixed(0)}K
              </div>
            </div>
          </div>

          {/* Simulated Analysis */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-emerald-300 uppercase">Simulated Scenario</h4>
            <div className={`${getRiskBgColor(simulatedAnalysis.riskScore)} rounded-lg p-3 border border-emerald-500/30`}>
              <div className="text-xs text-blue-200 mb-1">Risk Score</div>
              <div className={`text-2xl font-bold ${getRiskColor(simulatedAnalysis.riskScore)}`}>
                {simulatedAnalysis.riskScore}%
              </div>
              <div className="text-xs text-emerald-300 mt-1">
                {riskIncrease > 0 ? '+' : ''}{riskIncrease}% change
              </div>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50">
              <div className="text-xs text-blue-200 mb-1">Affected Population</div>
              <div className="text-lg font-bold text-blue-300">
                {(simulatedAnalysis.affectedPopulation / 1000).toFixed(0)}K
                <span className="text-xs text-emerald-400 ml-1">+{(affectedIncrease / 1000).toFixed(0)}K</span>
              </div>
            </div>
          </div>
        </div>

        {/* Severity Breakdown */}
        <div className="space-y-2">
          <h4 className="text-xs font-semibold text-blue-300 uppercase">Disaster Type Severity</h4>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'Flood', value: simulatedAnalysis.severity.flood, key: 'flood' },
              { label: 'Cyclone', value: simulatedAnalysis.severity.cyclone, key: 'cyclone' },
              { label: 'Drought', value: simulatedAnalysis.severity.drought, key: 'drought' },
              { label: 'Earthquake', value: simulatedAnalysis.severity.earthquake, key: 'earthquake' },
            ].map(disaster => (
              <div key={disaster.key} className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50">
                <div className="text-xs text-blue-200 mb-1">{disaster.label}</div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        disaster.value < 30
                          ? 'bg-green-500'
                          : disaster.value < 60
                            ? 'bg-yellow-500'
                            : disaster.value < 80
                              ? 'bg-orange-500'
                              : 'bg-red-500'
                      }`}
                      style={{ width: `${disaster.value}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold text-white min-w-12">{disaster.value}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Alert */}
        {intensityLevel > 50 && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3">
            <p className="text-xs text-red-200">
              At {intensityLevel}% intensity increase, risk score reaches {simulatedAnalysis.riskScore}%. 
              Review emergency protocols and ensure all resources are mobilized.
            </p>
          </div>
        )}
      </div>
    </Card>
  )
}
