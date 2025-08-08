// Open-Meteo API integration
export interface WeatherData {
  latitude: number
  longitude: number
  hourly: {
    time: string[]
    temperature_2m: number[]
  }
}

export interface PolygonWeatherData {
  polygonId: string
  averageTemperature: number
  timestamp: string
}

class WeatherApiService {
  private baseUrl = 'https://archive-api.open-meteo.com/v1/archive'
  private cache = new Map<string, WeatherData>()

  async fetchWeatherData(
    latitude: number, 
    longitude: number, 
    startDate: string, 
    endDate: string
  ): Promise<WeatherData | null> {
    const cacheKey = `${latitude},${longitude},${startDate},${endDate}`
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!
    }

    try {
      const url = `${this.baseUrl}?latitude=${latitude}&longitude=${longitude}&start_date=${startDate}&end_date=${endDate}&hourly=temperature_2m`
      
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`)
      }

      const data = await response.json()
      this.cache.set(cacheKey, data)
      return data
    } catch (error) {
      console.error('Failed to fetch weather data:', error)
      return null
    }
  }

  async getPolygonTemperature(
    coordinates: [number, number][],
    selectedTime: Date
  ): Promise<number | null> {
    console.log('WeatherAPI: Getting temperature for coordinates:', coordinates);
    
    // Calculate polygon centroid for API call
    const centroid = this.calculateCentroid(coordinates)
    console.log('WeatherAPI: Calculated centroid:', centroid);
    
    // Format dates for API
    const date = selectedTime.toISOString().split('T')[0]
    const startDate = date
    const endDate = date
    console.log('WeatherAPI: Fetching data for date:', date);

    const data = await this.fetchWeatherData(
      centroid.lat, 
      centroid.lng, 
      startDate, 
      endDate
    )

    if (!data || !data.hourly.temperature_2m.length) {
      return null
    }

    // Find the closest hour to selected time
    const selectedHour = selectedTime.getHours()
    const temperatures = data.hourly.temperature_2m
    
    // If we have hourly data, pick the specific hour
    if (temperatures.length > selectedHour) {
      return temperatures[selectedHour]
    }

    // Otherwise return average of available data
    const validTemps = temperatures.filter(temp => temp !== null && temp !== undefined)
    if (validTemps.length === 0) return null

    return validTemps.reduce((sum, temp) => sum + temp, 0) / validTemps.length
  }

  async getPolygonTemperatureRange(
    coordinates: [number, number][],
    startTime: Date,
    endTime: Date
  ): Promise<number | null> {
    const centroid = this.calculateCentroid(coordinates)
    
    const startDate = startTime.toISOString().split('T')[0]
    const endDate = endTime.toISOString().split('T')[0]

    const data = await this.fetchWeatherData(
      centroid.lat,
      centroid.lng,
      startDate,
      endDate
    )

    if (!data || !data.hourly.temperature_2m.length) {
      return null
    }

    // Calculate average temperature for the time range
    const startHour = startTime.getHours()
    const endHour = endTime.getHours()
    const daysDiff = Math.floor((endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60 * 24))

    let totalTemp = 0
    let count = 0

    for (let day = 0; day <= daysDiff; day++) {
      const dayStartIndex = day * 24
      const currentStartHour = day === 0 ? startHour : 0
      const currentEndHour = day === daysDiff ? endHour : 23

      for (let hour = currentStartHour; hour <= currentEndHour; hour++) {
        const index = dayStartIndex + hour
        if (index < data.hourly.temperature_2m.length) {
          const temp = data.hourly.temperature_2m[index]
          if (temp !== null && temp !== undefined) {
            totalTemp += temp
            count++
          }
        }
      }
    }

    return count > 0 ? totalTemp / count : null
  }

  private calculateCentroid(coordinates: [number, number][]): { lat: number, lng: number } {
    const totalLat = coordinates.reduce((sum, coord) => sum + coord[0], 0)
    const totalLng = coordinates.reduce((sum, coord) => sum + coord[1], 0)
    
    return {
      lat: totalLat / coordinates.length,
      lng: totalLng / coordinates.length
    }
  }
}

export const weatherApi = new WeatherApiService()