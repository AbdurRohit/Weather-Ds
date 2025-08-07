// Simple state management for polygons
export interface PolygonData {
  id: string
  coordinates: [number, number][]
  dataSource: string
  color: string
  name: string
}

class PolygonStore {
  private polygons: PolygonData[] = []
  private listeners: Array<() => void> = []

  subscribe(callback: () => void) {
    this.listeners.push(callback)
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback)
    }
  }

  private notify() {
    this.listeners.forEach(callback => callback())
  }

  addPolygon(polygon: PolygonData) {
    this.polygons.push(polygon)
    this.notify()
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
}

export const polygonStore = new PolygonStore()