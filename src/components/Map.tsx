"use client"

import type { ReactNode } from 'react'
import dynamic from 'next/dynamic'

// Dynamically import map to avoid SSR issues
const MapComponent = dynamic(() => import('./MapView'), {
  ssr: false,
  loading: () => (
    <div className="map-container bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
      <div className="text-center">
        <div className="text-2xl mb-2">🗺️</div>
        <p className="text-gray-600">Loading map...</p>
      </div>
    </div>
  )
})

export default function Map() {
  return <MapComponent />
}