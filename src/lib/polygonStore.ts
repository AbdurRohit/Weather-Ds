export interface PolygonData {
  id: string
  coordinates: [number, number][]
  dataSource: string
  color: string
  name: string
  currentTemperature?: number
  lastUpdated?: Date
  isLoading?: boolean
}

import { ColorRule, ColorRuleEngine } from './colorRules'
import { weatherApi } from './weatherApi'

class PolygonStore {
  private polygons: PolygonData[] = []
  private listeners: Array<() => void> = []
  private colorRules: ColorRule[] = []

  subscribe(callback: () => void) {
    this.listeners.push(callback)
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback)
    }
  }

  private notify() {
    this.listeners.forEach(callback => callback())
  }

  setColorRules(rules: ColorRule[]) {
    this.colorRules = rules
    // Re-apply colors to all existing polygons
    this.updateAllPolygonColors()
  }

  async addPolygon(polygon: PolygonData) {
    // Add polygon to store with loading state
    const newPolygon = { ...polygon, isLoading: true }
    this.polygons.push(newPolygon)
    this.notify()
    
    console.log("polygonStore: adding polygon @addPolygon:", newPolygon);
  }

  removePolygon(id: string) {
    this.polygons = this.polygons.filter(p => p.id !== id)
    this.notify()
  }

  getPolygons(): PolygonData[] {
    return [...this.polygons]
  }

  updatePolygon(id: string, updates: Partial<PolygonData>) {
    this.polygons = this.polygons.map(p => 
      p.id === id ? { ...p, ...updates } : p
    )
    this.notify()
  }

  // Update polygon weather data and colors
  async updatePolygonWeather(id: string, selectedTime: Date, timeRange?: { start: Date, end: Date }) {
    const polygon = this.polygons.find(p => p.id === id)
    if (!polygon) return

    console.log(`Updating weather for polygon ${id} at time:`, selectedTime);
    
    // Set loading state
    this.updatePolygon(id, { isLoading: true })

    try {
      let temperature: number | null = null

      if (timeRange) {
        console.log(`Fetching temperature range for polygon ${id}:`, timeRange);
        temperature = await weatherApi.getPolygonTemperatureRange(
          polygon.coordinates, 
          timeRange.start, 
          timeRange.end
        )
      } else {
        console.log(`Fetching temperature for polygon ${id} at:`, selectedTime);
        temperature = await weatherApi.getPolygonTemperature(
          polygon.coordinates, 
          selectedTime
        )
      }

      console.log(`Received temperature for polygon ${id}:`, temperature);

      if (temperature !== null) {
        // Calculate color based on temperature and current rules
        const color = ColorRuleEngine.evaluateRules(temperature, this.colorRules)
        console.log(`Updating polygon ${id} with temperature:`, temperature, 'color:', color);
        
        this.updatePolygon(id, {
          currentTemperature: temperature,
          color: color,
          lastUpdated: new Date(),
          isLoading: false
        })
      } else {
        console.log(`No temperature data available for polygon ${id}`);
        // No data available - use default gray color
        this.updatePolygon(id, {
          currentTemperature: undefined,
          color: '#6B7280',
          lastUpdated: new Date(),
          isLoading: false
        })
      }
    } catch (error) {
      console.error(`Failed to update weather for polygon ${id}:`, error)
      this.updatePolygon(id, {
        isLoading: false,
        color: '#6B7280', // Gray for error state
        currentTemperature: undefined
      })
    }
  }

  // Update all polygons with current time selection
  async updateAllPolygonsWeather(selectedTime: Date, timeRange?: { start: Date, end: Date }) {
    const updatePromises = this.polygons.map(polygon => 
      this.updatePolygonWeather(polygon.id, selectedTime, timeRange)
    )
    
    await Promise.all(updatePromises)
  }

  // Re-apply colors when rules change
  private updateAllPolygonColors() {
    this.polygons.forEach(polygon => {
      if (polygon.currentTemperature !== undefined) {
        const newColor = ColorRuleEngine.evaluateRules(polygon.currentTemperature, this.colorRules)
        this.updatePolygon(polygon.id, { color: newColor })
      }
    })
  }
}

export const polygonStore = new PolygonStore()