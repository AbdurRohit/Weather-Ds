// Color rule system for polygons
export interface ColorRule {
  id: string
  operator: '=' | '<' | '>' | '<=' | '>='
  value: number
  color: string
  label?: string
}

export interface DataSourceConfig {
  id: string
  name: string
  unit: string
  defaultRules: ColorRule[]
}

// Default color rules for temperature
export const temperatureDataSource: DataSourceConfig = {
  id: 'temperature',
  name: 'Temperature',
  unit: '°C',
  defaultRules: [
    { id: 'cold', operator: '<', value: 10, color: '#3B82F6', label: 'Cold' },
    { id: 'moderate', operator: '>=', value: 10, color: '#10B981', label: 'Moderate' },
    { id: 'hot', operator: '>=', value: 25, color: '#EF4444', label: 'Hot' }
  ]
}

export class ColorRuleEngine {
  static evaluateRules(value: number, rules: ColorRule[]): string {
    // Sort rules by value (descending) to check highest thresholds first
    const sortedRules = [...rules].sort((a, b) => b.value - a.value)
    
    for (const rule of sortedRules) {
      if (this.matchesRule(value, rule)) {
        return rule.color
      }
    }
    
    // Default color if no rules match
    return '#6B7280' // Gray
  }

  private static matchesRule(value: number, rule: ColorRule): boolean {
    switch (rule.operator) {
      case '=': return Math.abs(value - rule.value) < 0.1 // Allow small floating point differences
      case '<': return value < rule.value
      case '>': return value > rule.value
      case '<=': return value <= rule.value
      case '>=': return value >= rule.value
      default: return false
    }
  }

  static getColorForTemperature(temperature: number): string {
    return this.evaluateRules(temperature, temperatureDataSource.defaultRules)
  }
}