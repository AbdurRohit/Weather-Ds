"use client"

import { useState } from 'react'
import Timeline from './Timeline'
import MapView from './MapView'
import ColorRulesSidebar from './ColorRulesPanel'
import PolygonSidebar from './PolygonSidebar'
import { ColorRule } from '@/lib/colorRules'
import { polygonStore } from '@/lib/polygonStore'

export default function Dashboard() {
  const [selectedTime, setSelectedTime] = useState(new Date())
  const [timeRange, setTimeRange] = useState<{ start: Date, end: Date } | undefined>()

  const handleTimeChange = (time: Date, range?: { start: Date, end: Date }) => {
    setSelectedTime(time)
    setTimeRange(range)
  }

  const handleColorRulesChange = (rules: ColorRule[]) => {
    polygonStore.setColorRules(rules)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Timeline Section - Top */}
      <div className="p-4 pb-0">
        <div className="max-w-6xl mx-auto">
          <Timeline onTimeChange={handleTimeChange} />
        </div>
      </div>

      {/* Main Content: Map and Sidebar */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="w-full max-w-6xl flex-1 grid grid-cols-12 gap-4 px-4">
          {/* Map Section */}
          <div className="col-span-9 flex flex-col">
            <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col">
              <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="text-xl">🗺️</div>
                  <div>
                    <h2 className="text-lg font-semibold">Weather Analysis Dashboard</h2>
                    <p className="text-sm text-gray-600">
                      Configure rules → Draw polygons → Analyze weather patterns
                    </p>
                  </div>
                </div>
               
              </div>
              <div className="flex-1 p-4 bg-gray-25">
                <MapView selectedTime={selectedTime} timeRange={timeRange} />
              </div>
            </div>
          </div>
          {/* Polygon Sidebar */}
          <div className="col-span-3">
            <PolygonSidebar selectedTime={selectedTime} timeRange={timeRange} />
          </div>
        </div>
        {/* Color Rules Panel at the bottom */}
        <div className="w-full max-w-6xl mt-4">
          <ColorRulesSidebar onRulesChange={handleColorRulesChange} />
        </div>
      </div>
    </div>
  )
}