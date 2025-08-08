"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Trash2, MapPin, Thermometer } from 'lucide-react'
import { polygonStore, PolygonData } from '@/lib/polygonStore'


type PolygonSidebarProps = {
  selectedTime: Date;
  timeRange?: { start: Date; end: Date };
};

export default function PolygonSidebar({ selectedTime, timeRange }: PolygonSidebarProps) {
  const [polygons, setPolygons] = useState<PolygonData[]>([])

  useEffect(() => {
    const unsubscribe = polygonStore.subscribe(() => {
      setPolygons(polygonStore.getPolygons())
    })
    return unsubscribe
  }, [])

  // Update temperatures when time changes
  useEffect(() => {
    if (selectedTime) {
      polygonStore.updateAllPolygonsWeather(selectedTime, timeRange)
    }
  }, [selectedTime, timeRange])

  const handleDelete = (id: string) => {
    polygonStore.removePolygon(id)
  }

  const formatTemperature = (temp?: number) => {
    if (temp === undefined) return 'No data'
    return `${temp.toFixed(1)}°C`
  }

  const getDataSourceIcon = (dataSource: string) => {
    switch (dataSource) {
      case 'temperature':
        return <Thermometer className="h-4 w-4 text-red-500" />
      default:
        return <MapPin className="h-4 w-4 text-blue-500" />
    }
  }

  return (
    <aside className="h-full w-full bg-white border-l border-gray-200 p-4 flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <MapPin className="h-5 w-5 text-blue-600" />
        <h3 className="font-semibold">Drawn Polygons</h3>
        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
          {polygons.length}
        </span>
      </div>
      {polygons.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
          <p className="text-sm">No polygons drawn yet</p>
          <p className="text-xs text-gray-400 mt-1">Click &quot;Draw Polygon&quot; to start</p>
        </div>
      ) : (
        <div className="flex-1 space-y-3 overflow-y-auto pr-1">
          {polygons.map((polygon) => (
            <Card key={polygon.id} className="border border-gray-200">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium truncate">
                    {polygon.name}
                  </CardTitle>
                  <Button
                    onClick={() => handleDelete(polygon.id)}
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  {/* Data Source */}
                  <div className="flex items-center gap-2 text-xs">
                    {getDataSourceIcon(polygon.dataSource)}
                    <span className="text-gray-600">
                      {polygon.isLoading ? 'Loading...' : `Temperature: ${formatTemperature(polygon.currentTemperature)}`}
                    </span>
                  </div>
                  {/* Polygon Stats */}
                  <div className="text-xs text-gray-500">
                    <div>Points: {polygon.coordinates.length}</div>
                    <div>Last Updated: {polygon.lastUpdated ? new Date(polygon.lastUpdated).toLocaleTimeString() : 'Never'}</div>
                    <div className="flex items-center gap-1 mt-1">
                      <div className="w-3 h-3 rounded-full border" style={{ backgroundColor: polygon.color }} />
                      <span>Color: {polygon.color}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </aside>
  )
}