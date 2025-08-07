"use client"

import { MapContainer, TileLayer, useMap, Polygon } from 'react-leaflet'
import { Button } from '@/components/ui/button'
import { Home, Move, Pencil, Square } from 'lucide-react'
import L from 'leaflet'
import { useEffect, useState } from 'react'
import DataSourceDialog from './DataSourceDialog'
import { polygonStore, PolygonData } from '@/lib/polygonStore'
import { temperatureDataSource } from '@/lib/colorRules'
import { useMapEvents } from 'react-leaflet'
import { useRef } from 'react'


// This component will handle click events when drawing is active
function PolygonClickHandler({
  isDrawing,
  addPoint
}: {
  isDrawing: boolean
  addPoint: (point: [number, number]) => void
}) {
  useMapEvents({
    click(e) {
      if (!isDrawing) return
      const newPoint: [number, number] = [e.latlng.lat, e.latlng.lng]
      addPoint(newPoint)
    }
  })
  return null
}

// Fix leaflet default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

// Component to handle polygon drawing and display
export function PolygonManager() {

  const controlsRef = useRef<HTMLDivElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [currentPoints, setCurrentPoints] = useState<[number, number][]>([])
  const [polygons, setPolygons] = useState<PolygonData[]>([])
  const [showDataSourceDialog, setShowDataSourceDialog] = useState(false)
  const [tempPolygonPoints, setTempPolygonPoints] = useState<[number, number][]>([])

  useEffect(() => {
  if (controlsRef.current) {
    // Prevent clicks on this div from bubbling to the map
    L.DomEvent.disableClickPropagation(controlsRef.current)
  }
}, [])

  useEffect(() => {
    polygonStore.setColorRules(temperatureDataSource.defaultRules)
  }, [])

  useEffect(() => {
    const unsubscribe = polygonStore.subscribe(() => {
      setPolygons(polygonStore.getPolygons())
    })
    return unsubscribe
  }, [])

  const addPoint = (newPoint: [number, number]) => {
    setCurrentPoints(prev => {
      const updated = [...prev, newPoint]
      console.log("New Point Added:", newPoint)
      console.log("Updated Polygon Points:", updated)

      if (updated.length >= 12) {
        finishDrawing(updated)
        return []
      }

      return updated
    })
  }

  const startDrawing = () => {
    setIsDrawing(true)
    setCurrentPoints([])
  }

  const finishDrawing = (points?: [number, number][]) => {
    const finalPoints = points || currentPoints
    if (finalPoints.length < 3) {
      alert('Polygon must have at least 3 points!')
      return
    }

    setIsDrawing(false)
    setCurrentPoints([])
    setTempPolygonPoints(finalPoints)
    setShowDataSourceDialog(true)
  }

  const cancelDrawing = () => {
    setIsDrawing(false)
    setCurrentPoints([])
  }

  const handleDataSourceSelect = (dataSource: string, name: string) => {
    const newPolygon: PolygonData = {
      id: `polygon_${Date.now()}`,
      coordinates: tempPolygonPoints,
      dataSource,
      color: '#3B82F6',
      name
    }

    polygonStore.addPolygon(newPolygon)
    setTempPolygonPoints([])
  }

  return (
    <>
      {/* Add map click handler */}
      <PolygonClickHandler isDrawing={isDrawing} addPoint={addPoint} />

      {/* Drawing Controls */}
      <div
  ref={controlsRef}
  className="absolute top-4 left-4 z-[1000] flex flex-col gap-2"
>
  {!isDrawing ? (
    <Button 
      onClick={startDrawing}
      size="sm"
      className="bg-blue-600 hover:bg-blue-700 text-white shadow-md"
    >
      <Pencil className="h-4 w-4 mr-1" />
      Draw Polygon
    </Button>
  ) : (
    <div className="bg-white rounded-lg shadow-md p-3 border">
      <div className="text-sm font-medium mb-2">Drawing Mode Active</div>
      <div className="text-xs text-gray-600 mb-3">
        Points: {currentPoints.length}/12 (min: 3)
      </div>
      <div className="flex gap-2">
        <Button 
          onClick={() => finishDrawing()}
          disabled={currentPoints.length < 3}
          size="sm"
          className="text-xs"
        >
          <Square className="h-3 w-3 mr-1" />
          Finish
        </Button>
        <Button 
          onClick={cancelDrawing}
          variant="outline"
          size="sm"
          className="text-xs"
        >
          Cancel
        </Button>
      </div>
    </div>
  )}
</div>

      {/* Render current drawing polygon */}
      {currentPoints.length > 0 && (
        <Polygon
          positions={currentPoints}
          pathOptions={{
            color: '#EF4444',
            fillColor: '#EF4444',
            fillOpacity: 0.2,
            weight: 2,
            dashArray: '5, 5'
          }}
        />
      )}

      {/* Render saved polygons */}
      {polygons.map((polygon) => (
        <Polygon
          key={polygon.id}
          positions={polygon.coordinates}
          pathOptions={{
            color: polygon.color,
            fillColor: polygon.color,
            fillOpacity: 0.3,
            weight: 3
          }}
        />
      ))}

      {/* Data Source Selection Dialog */}
      <DataSourceDialog
        isOpen={showDataSourceDialog}
        onClose={() => setShowDataSourceDialog(false)}
        onSelect={handleDataSourceSelect}
      />
    </>
  )
}

// Component to handle map controls
function MapControls() {
  const map = useMap()

  const centerMap = () => {
    // Center on Kolkata
    map.setView([22.5726, 88.3639], 13)
  }



  useEffect(() => {
    // Lock zoom level as per requirement (2 sq km resolution)
    map.setMinZoom(8)
    // map.setMaxZoom()
    map.setZoom(13)
  }, [map])

  return (
    <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
      <Button 
        onClick={centerMap}
        size="sm"
        variant="secondary"
        className="bg-white hover:bg-gray-100 shadow-md"
      >
        <Home className="h-4 w-4 mr-1" />
        Center
      </Button>
 
    </div>
  )
}

export default function MapView() {
  const defaultCenter = [22.5726, 88.3639] as [number, number]
  const defaultZoom = 13

  return (
    <div className="w-full h-full min-h-[500px] min-w-[350px]">
      <MapContainer
        center={defaultCenter}
        zoom={defaultZoom}
        style={{ height: '100%', width: '100%', minHeight: 500, minWidth: 350 }}
        zoomControl={false}
        scrollWheelZoom={true}
        dragging={true}
        className="rounded-lg border border-gray-300"
      >
        <PolygonManager />
        <MapControls />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'/>
      </MapContainer>
    </div>
  )
}
