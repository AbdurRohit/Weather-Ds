"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { X, Thermometer } from 'lucide-react'

interface DataSourceDialogProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (dataSource: string, name: string) => void
}

export default function DataSourceDialog({ isOpen, onClose, onSelect }: DataSourceDialogProps) {
  const [polygonName, setPolygonName] = useState('')

  if (!isOpen) return null

  const handleSelect = (dataSource: string) => {
    const name = polygonName.trim() || `Polygon ${Date.now()}`
    onSelect(dataSource, name)
    setPolygonName('')
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[2000]">
      <Card className="w-96 max-w-[90vw]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-lg">Configure Polygon</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Polygon Name */}
          <div>
            <label className="text-sm font-medium mb-2 block">Polygon Name (Optional)</label>
            <Input
              value={polygonName}
              onChange={(e) => setPolygonName(e.target.value)}
              placeholder="My Temperature Zone"
              className="w-full"
            />
          </div>

          {/* Data Source Selection */}
          <div>
            <label className="text-sm font-medium mb-2 block">Select Data Source</label>
            <div className="space-y-2">
              {/* Required: Open-Meteo Temperature */}
              <Button
                onClick={() => handleSelect('temperature')}
                variant="outline"
                className="w-full justify-start h-auto p-4"
              >
                <Thermometer className="h-5 w-5 mr-3 text-red-500" />
                <div className="text-left">
                  <div className="font-medium">Temperature (°C)</div>
                  <div className="text-xs text-gray-500">Open-Meteo API - temperature_2m</div>
                </div>
              </Button>

              {/* Bonus: Add more data sources here later */}
              <div className="text-xs text-gray-500 text-center py-2">
                More data sources coming in bonus features...
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}