"use client"

import { useState, useCallback, useEffect } from "react"
import { useDashboard } from "./layout"
import { KpiCards } from "@/components/dashboard/kpi-cards"
import { IndiaHeatmap } from "@/components/dashboard/india-heatmap"
import { ResourcePanel } from "@/components/dashboard/resource-panel"
import { ShelterTable } from "@/components/dashboard/shelter-table"
import { QuickAlerts } from "@/components/dashboard/quick-alerts"
import { ActionPlan } from "@/components/dashboard/action-plan"
import { WhatIfSimulation } from "@/components/dashboard/what-if-simulation"
import { useAlerts, useResources } from "@/lib/hooks/use-api"
import {
  initialResources,
  initialShelters,
  initialActionPlan,
  stateRisks,
  simulationData,
} from "@/lib/dashboard-store"
import type { Resource, ActionStep } from "@/lib/dashboard-store"

export default function DashboardPage() {
  const { t, setAlerts } = useDashboard()
  const { alerts: apiAlerts, isLoading: alertsLoading } = useAlerts()
  const { resources: apiResources, isLoading: resourcesLoading } = useResources()

  const [resources, setResources] = useState<Resource[]>(initialResources)
  const [actionSteps, setActionSteps] = useState<ActionStep[]>(initialActionPlan)
  const [simulationPercentage, setSimulationPercentage] = useState(20)
  const [selectedState, setSelectedState] = useState<string | null>("Bihar")
  const [riskScore, setRiskScore] = useState(78)
  const [confidence, setConfidence] = useState(92)

  // Sync API alerts with dashboard context
  useEffect(() => {
    if (apiAlerts && apiAlerts.length > 0) {
      const transformedAlerts = apiAlerts.map((alert: any) => ({
        id: alert.id,
        type: alert.type || 'resource',
        title: alert.title,
        location: alert.location,
        detail: alert.description || alert.detail || '',
        time: new Date(alert.createdAt).toLocaleTimeString(),
        severity: alert.severity,
        read: false,
      }))
      setAlerts(transformedAlerts)
    }
  }, [apiAlerts, setAlerts])

  useEffect(() => {
    const interval = setInterval(() => {
      setRiskScore((prev) => {
        const change = Math.floor(Math.random() * 5) - 2
        return Math.max(0, Math.min(100, prev + change))
      })
      setConfidence((prev) => {
        const change = Math.floor(Math.random() * 3) - 1
        return Math.max(80, Math.min(99, prev + change))
      })
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const handleMarkAlertRead = useCallback((id: string) => {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, read: true } : a)))
  }, [])

  const handleAutoOptimize = useCallback(() => {
    setResources((prev) =>
      prev.map((r) => ({
        ...r,
        current: Math.min(r.total, r.current + Math.floor(Math.random() * 5) + 2),
      }))
    )
  }, [])

  const handleToggleStep = useCallback((id: number) => {
    setActionSteps((prev) =>
      prev.map((s) => (s.id === id ? { ...s, completed: !s.completed } : s))
    )
  }, [])

  const handleExecutePlan = useCallback(() => {
    setActionSteps((prev) => prev.map((s) => ({ ...s, completed: true })))
  }, [])

  const safeZones = stateRisks.filter((s) => s.riskLevel === "low").length
  const highRiskZones = stateRisks.filter(
    (s) => s.riskLevel === "high" || s.riskLevel === "critical"
  ).length
  const totalZones = stateRisks.length

  return (
    <div className="flex gap-4">
      {/* Left + Center Content */}
      <div className="flex-1 min-w-0 space-y-4">
        <KpiCards
          riskScore={riskScore}
          confidence={confidence}
          safeZones={safeZones}
          totalZones={totalZones}
          highRiskZones={highRiskZones}
          t={t}
        />

        <IndiaHeatmap
          states={stateRisks}
          selectedState={selectedState}
          onStateSelect={(state) => setSelectedState((prev) => (prev === state ? null : state))}
          t={t}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ResourcePanel
            resources={resources}
            onAutoOptimize={handleAutoOptimize}
            t={t}
          />
          <ShelterTable shelters={initialShelters} t={t} />
          <ActionPlan
            steps={actionSteps}
            onToggleStep={handleToggleStep}
            onExecutePlan={handleExecutePlan}
            t={t}
          />
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="hidden xl:flex flex-col gap-4 w-[300px] shrink-0">
        <QuickAlerts 
          alerts={apiAlerts && apiAlerts.length > 0 ? apiAlerts.map((alert: any) => ({
            id: alert.id,
            type: alert.type || 'resource',
            title: alert.title,
            location: alert.location,
            detail: alert.description || alert.detail || '',
            time: new Date(alert.createdAt).toLocaleTimeString(),
            severity: alert.severity,
            read: false,
          })) : []} 
          onMarkRead={handleMarkAlertRead} 
          t={t} 
        />
        <ActionPlan
          steps={actionSteps}
          onToggleStep={handleToggleStep}
          onExecutePlan={handleExecutePlan}
          t={t}
        />
        <WhatIfSimulation
          simulationPercentage={simulationPercentage}
          onPercentageChange={setSimulationPercentage}
          data={simulationData}
          t={t}
        />
      </div>

      {/* Mobile: Right sidebar items */}
      <div className="xl:hidden fixed bottom-0 left-0 right-0 hidden">
        {/* Intentionally hidden - shown inline below on smaller screens */}
      </div>
    </div>
  )
}
