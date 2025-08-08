"use client"

import dynamic from 'next/dynamic'

// Dynamically import Leaflet only on client side
const LeafletMap = dynamic(
  () => import('./LeafletMapComponent'),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-[500px] min-w-[350px] flex items-center justify-center bg-gray-100 rounded-lg border border-gray-300">
        <div className="text-gray-500">Loading map...</div>
      </div>
    )
  }
)

interface MapViewProps {
  selectedTime?: Date;
  timeRange?: { start: Date; end: Date };
}

export default function MapView({ selectedTime, timeRange }: MapViewProps) {
  return (
    <LeafletMap selectedTime={selectedTime} timeRange={timeRange} />
  )
}