# ResQAI - Quick Start Guide

## Getting Started in 5 Minutes

### 1. Install & Run
```bash
npm install
npm run dev
```

Visit: http://localhost:3000

### 2. Features Overview

| Feature | Location | Purpose |
|---------|----------|---------|
| **Multilingual UI** | `/lib/i18n/` | EN, TA, HI support |
| **Risk Analysis** | `/lib/risk-engine.ts` | Calculate disaster risk (0-100) |
| **India Heatmap** | `/components/dashboard/india-heatmap-v2.tsx` | Visual risk by state |
| **What-If Simulator** | `/components/dashboard/what-if-simulator-v2.tsx` | Scenario planning |
| **Alerts Panel** | `/components/dashboard/alerts-history-v2.tsx` | Alert management |
| **Resources Tracker** | `/components/dashboard/resource-allocation-v2.tsx` | Equipment allocation |
| **Offline Mode** | `/lib/offline.ts` | Works without internet |
| **Notifications** | `/lib/notifications.ts` | Alert system |

### 3. Common Tasks

#### Use Translations
```tsx
import { useI18n } from '@/lib/i18n/context'

const { t, language, setLanguage } = useI18n()
return <p>{t('riskScore')}</p>
```

#### Calculate Risk
```tsx
import { analyzeRisk } from '@/lib/risk-engine'

const result = analyzeRisk({
  rainfall: 150,
  elevation: 500,
  population: 500000,
  coastalDistance: 50,
  disasterIntensity: 10,
  areaZone: 'Tamil Nadu'
})
// result.riskScore: 0-100
// result.riskLevel: 'safe' | 'medium' | 'high' | 'veryHigh'
```

#### Save Data Offline
```tsx
import { offlineManager } from '@/lib/offline'

offlineManager.saveAnalysis(analysisData)
const saved = offlineManager.getAnalyses()
```

#### Show Notifications
```tsx
import { notificationManager, notificationTemplates } from '@/lib/notifications'

notificationManager.addNotification(
  notificationTemplates.highRiskDetected('Bihar', 85)
)
```

#### Fetch Data from API
```tsx
import { useAlerts, useResources } from '@/lib/hooks/use-api'

const { alerts, isLoading } = useAlerts()
const { resources } = useResources()
```

### 4. Pages & Routes

| Route | Purpose |
|-------|---------|
| `/` | Landing page |
| `/login` | Sign in with Clerk |
| `/dashboard` | Main dashboard (protected) |
| `/api/weather` | Weather data endpoint |
| `/api/analyze` | Risk analysis API |
| `/api/alerts` | Alerts management |
| `/api/resources` | Resource tracking |

### 5. Key Components

#### IndiaHeatmapV2
```tsx
<IndiaHeatmapV2
  stateRisks={{ 'Bihar': 72, 'Tamil Nadu': 68 }}
  selectedState="Bihar"
  onStateSelect={handleSelect}
/>
```

#### WhatIfSimulatorV2
```tsx
<WhatIfSimulatorV2
  baseAnalysis={analysisResult}
  onSimulationChange={handleChange}
/>
```

#### AlertsHistoryV2
```tsx
<AlertsHistoryV2
  analyses={savedAnalyses}
  alerts={alertList}
  onRestoreAnalysis={restore}
  onDeleteAnalysis={delete}
/>
```

#### ResourceAllocationV2
```tsx
<ResourceAllocationV2
  resources={resourceList}
  onAllocate={allocate}
  onDeploy={deploy}
/>
```

### 6. Colors & Design

**Risk Levels**:
- Green: Safe (<30%)
- Yellow: Medium (30-60%)
- Orange: High (60-80%)
- Red: Very High (>80%)

**Priority Levels**:
- Red: Critical
- Orange: High
- Yellow: Medium
- Green: Low

### 7. Environment Setup

```bash
# Create .env.local
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_key
CLERK_SECRET_KEY=your_secret
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
```

### 8. Troubleshooting

**Translation not showing?**
- Ensure I18nProvider wraps the app
- Check key exists in `translations.ts`
- Use `useI18n()` hook from within provider scope

**API not responding?**
- Check route handler exists
- Verify authentication in middleware
- Check browser console for errors

**Offline mode not working?**
- Enable localStorage in browser
- Check DevTools > Application > LocalStorage
- Reload page after going offline

### 9. State Data Structure

Risk factors for each state are built-in (0-1 scale):
- Andhra Pradesh: 0.72
- Bihar: 0.72
- Tamil Nadu: 0.72
- Assam: 0.75
- And 24 more states...

### 10. Next Steps

1. **Connect to Supabase**: Add database tables for persistence
2. **Implement SMS Alerts**: Use Supabase Functions or Twilio
3. **Add Real-time Updates**: WebSocket for live data
4. **Deploy**: Use Vercel with automatic environment setup

---

**Questions?** Check RESQAI_COMPLETE_BUILD.md for detailed documentation.

**Ready to deploy?** Push to GitHub and connect to Vercel for 1-click deployment.
