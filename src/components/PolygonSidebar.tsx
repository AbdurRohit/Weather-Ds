"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Trash2, MapPin, Thermometer } from 'lucide-react'
import { polygonStore, PolygonData } from '@/lib/polygonStore'

export default function PolygonSidebar() {
  const [polygons, setPolygons] = useState<PolygonData[]>([])

  useEffect(() => {
    const unsubscribe = polygonStore.subscribe(() => {
      setPolygons(polygonStore.getPolygons())
    })
    return unsubscribe
  }, [])

  const handleDelete = (id: string) => {
    polygonStore.removePolygon(id)
  }

  const getDataSourceIcon = (dataSource: string) => {
    switch (dataSource) {
      case 'temperature':
        return <Thermometer className="h-4 w-4 text-red-500" />
      default:
        return <MapPin className="h-4 w-4 text-blue-500" />
    }
  }

  if (polygons.length === 0) {
    return (
      <div className="w-80 bg-white border-l border-gray-200 p-4">
        <div className="text-center text-gray-500 mt-8">
          <MapPin className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p className="text-sm">No polygons drawn yet</p>
          <p className="text-xs text-gray-400 mt-1">
            Click "Draw Polygon" to start
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-80 bg-white border-l border-gray-200 p-4 overflow-y-auto">
      <div className="flex items-center gap-2 mb-4">
        <MapPin className="h-5 w-5 text-blue-600" />
        <h3 className="font-semibold">Drawn Polygons</h3>
        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
          {polygons.length}
        </span>
      </div>

      <div className="space-y-3">
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
                    {polygon.dataSource === 'temperature' ? 'Temperature Data' : polygon.dataSource}
                  </span>
                </div>

                {/* Polygon Stats */}
                <div className="text-xs text-gray-500">
                  <div>Points: {polygon.coordinates.length}</div>
                  <div className="flex items-center gap-1 mt-1">
                    <div 
                      className="w-3 h-3 rounded-full border"
                      style={{ backgroundColor: polygon.color }}
                    />
                    <span>Color: {polygon.color}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}