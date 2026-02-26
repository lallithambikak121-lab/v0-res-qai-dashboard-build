export interface RiskInput {
  rainfall: number // mm
  elevation: number // m
  population: number // people
  coastalDistance: number // km
  disasterIntensity: number // 0-30 percentage increase
  areaZone: string
}

export interface RiskOutput {
  riskScore: number // 0-100
  riskLevel: 'safe' | 'medium' | 'high' | 'veryHigh'
  confidence: number // 80-99
  recommendations: string[]
  affectedPopulation: number
  severity: {
    flood: number
    cyclone: number
    drought: number
    earthquake: number
  }
}

// Weights for different factors
const WEIGHTS = {
  rainfall: 0.25,
  elevation: 0.15,
  population: 0.2,
  coastalDistance: 0.15,
  disasterIntensity: 0.25,
}

// State-specific base risk factors
const STATE_RISK_FACTORS: Record<string, number> = {
  'Andhra Pradesh': 0.7,
  'Arunachal Pradesh': 0.65,
  'Assam': 0.75,
  'Bihar': 0.72,
  'Chhattisgarh': 0.65,
  'Goa': 0.6,
  'Gujarat': 0.68,
  'Haryana': 0.55,
  'Himachal Pradesh': 0.6,
  'Jharkhand': 0.65,
  'Karnataka': 0.62,
  'Kerala': 0.7,
  'Madhya Pradesh': 0.62,
  'Maharashtra': 0.65,
  'Manipur': 0.68,
  'Meghalaya': 0.78,
  'Mizoram': 0.72,
  'Nagaland': 0.7,
  'Odisha': 0.75,
  'Punjab': 0.58,
  'Rajasthan': 0.68,
  'Sikkim': 0.65,
  'Tamil Nadu': 0.72,
  'Telangana': 0.68,
  'Tripura': 0.7,
  'Uttar Pradesh': 0.62,
  'Uttarakhand': 0.68,
  'West Bengal': 0.72,
}

function normalizeValue(value: number, min: number, max: number): number {
  return Math.max(0, Math.min(1, (value - min) / (max - min)))
}

function calculateRainfallRisk(rainfall: number): number {
  // Higher rainfall = higher risk
  // 0-50mm: low, 50-200mm: medium, 200-500mm: high, >500mm: very high
  if (rainfall < 50) return 0.2
  if (rainfall < 200) return 0.4
  if (rainfall < 500) return 0.7
  return Math.min(1, 0.7 + (rainfall - 500) / 1000)
}

function calculateElevationRisk(elevation: number): number {
  // Extreme elevation (both very high and very low) increases risk
  if (elevation < 0) return 0.8 // Below sea level - flood risk
  if (elevation < 500) return 0.3 // Low elevation - moderate flood risk
  if (elevation < 2000) return 0.2 // Ideal
  if (elevation < 3000) return 0.4 // Higher - landslide risk
  return 0.7 // Very high - avalanche/landslide risk
}

function calculatePopulationRisk(population: number): number {
  // Higher population = more people at risk = higher score
  if (population < 10000) return 0.1
  if (population < 100000) return 0.3
  if (population < 1000000) return 0.6
  return Math.min(1, 0.6 + (population - 1000000) / 10000000)
}

function calculateCoastalRisk(coastalDistance: number): number {
  // Closer to coast = higher cyclone risk
  if (coastalDistance < 10) return 0.9
  if (coastalDistance < 50) return 0.7
  if (coastalDistance < 100) return 0.5
  if (coastalDistance < 200) return 0.3
  return 0.1 // Inland areas have lower risk
}

function calculateDisasterIntensityRisk(intensity: number): number {
  // 0-30% increase in existing risk
  return intensity / 30
}

export function analyzeRisk(input: RiskInput): RiskOutput {
  // Calculate individual risk factors (0-1 scale)
  const rainfallRisk = calculateRainfallRisk(input.rainfall)
  const elevationRisk = calculateElevationRisk(input.elevation)
  const populationRisk = calculatePopulationRisk(input.population)
  const coastalRisk = calculateCoastalRisk(input.coastalDistance)
  const disasterIntensityRisk = calculateDisasterIntensityRisk(input.disasterIntensity)

  // Get state base risk factor
  const stateBaseFactor = STATE_RISK_FACTORS[input.areaZone] || 0.5

  // Calculate weighted risk score
  let combinedRisk =
    rainfallRisk * WEIGHTS.rainfall +
    elevationRisk * WEIGHTS.elevation +
    populationRisk * WEIGHTS.population +
    coastalRisk * WEIGHTS.coastalDistance +
    disasterIntensityRisk * WEIGHTS.disasterIntensity

  // Apply state factor
  combinedRisk *= stateBaseFactor

  // Scale to 0-100
  const riskScore = Math.round(combinedRisk * 100)

  // Determine risk level
  let riskLevel: 'safe' | 'medium' | 'high' | 'veryHigh'
  if (riskScore < 30) riskLevel = 'safe'
  else if (riskScore < 60) riskLevel = 'medium'
  else if (riskScore < 80) riskLevel = 'high'
  else riskLevel = 'veryHigh'

  // Calculate confidence (higher confidence for extreme values)
  let confidence = 85 + Math.abs(riskScore - 50) * 0.3
  confidence = Math.min(99, Math.max(80, confidence))

  // Calculate severity for different disaster types
  const severity = {
    flood: Math.round((rainfallRisk * 0.4 + populationRisk * 0.3 + coastalRisk * 0.3) * 100),
    cyclone: Math.round(coastalRisk * 100),
    drought: Math.round(((1 - rainfallRisk) * 0.5 + elevationRisk * 0.3 + populationRisk * 0.2) * 100),
    earthquake: Math.round((elevationRisk * 0.6 + populationRisk * 0.4) * 100),
  }

  // Calculate affected population
  const affectedPopulation = Math.round(input.population * (riskScore / 100) * 0.7)

  // Generate recommendations
  const recommendations: string[] = []

  if (riskScore >= 80) {
    recommendations.push('CRITICAL: Immediately activate emergency response protocols')
    recommendations.push('Evacuate high-risk zones and move population to shelters')
    recommendations.push('Deploy all available rescue teams to affected areas')
  } else if (riskScore >= 60) {
    recommendations.push('HIGH: Increase monitoring and prepare evacuation plans')
    recommendations.push('Pre-position rescue equipment and medical teams')
    recommendations.push('Issue public alerts and prepare emergency shelters')
  } else if (riskScore >= 30) {
    recommendations.push('MEDIUM: Maintain heightened alert status')
    recommendations.push('Conduct drills and ensure communication systems are ready')
    recommendations.push('Monitor weather patterns closely')
  }

  if (rainfallRisk > 0.7) {
    recommendations.push('High rainfall expected - prepare for flooding')
    recommendations.push('Clear drainage systems and maintain pumping stations')
  }

  if (coastalRisk > 0.6) {
    recommendations.push('Cyclone risk detected - issue marine warnings')
    recommendations.push('Prepare coastal evacuation routes')
  }

  if (elevationRisk > 0.6) {
    recommendations.push('Landslide/avalanche risk - monitor hill stations')
    recommendations.push('Ensure rescue equipment availability in mountainous areas')
  }

  if (severity.drought > 60) {
    recommendations.push('Drought risk high - activate water conservation measures')
  }

  return {
    riskScore,
    riskLevel,
    confidence: Math.round(confidence),
    recommendations: recommendations.slice(0, 5), // Limit to 5 recommendations
    affectedPopulation,
    severity,
  }
}

// Calculate what-if scenarios
export function simulateDisasterIntensity(baseAnalysis: RiskOutput, intensityLevel: number): RiskOutput {
  // Increase disaster intensity and recalculate
  const intensityFactor = 1 + intensityLevel / 100

  return {
    ...baseAnalysis,
    riskScore: Math.min(100, Math.round(baseAnalysis.riskScore * intensityFactor)),
    riskLevel:
      baseAnalysis.riskScore * intensityFactor > 80
        ? 'veryHigh'
        : baseAnalysis.riskScore * intensityFactor > 60
          ? 'high'
          : baseAnalysis.riskScore * intensityFactor > 30
            ? 'medium'
            : 'safe',
    affectedPopulation: Math.round(baseAnalysis.affectedPopulation * intensityFactor),
    severity: {
      flood: Math.min(100, baseAnalysis.severity.flood + intensityLevel),
      cyclone: Math.min(100, baseAnalysis.severity.cyclone + intensityLevel),
      drought: Math.min(100, baseAnalysis.severity.drought + intensityLevel),
      earthquake: Math.min(100, baseAnalysis.severity.earthquake + intensityLevel),
    },
  }
}
