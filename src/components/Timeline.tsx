"use client"

import { SetStateAction, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { DualRangeSlider } from '@/components/ui/dual-range-slider'
import { Calendar, RotateCcw } from 'lucide-react'
import { get30DayWindow, getHoursDiff, addHours, formatDateTime, formatDateOnly } from '@/lib/dates'

type TimelineProps = {
  onTimeChange?: (newSelectedTime: Date, newTimeRange?: { start: Date, end: Date }) => void;
};

export default function Timeline({ onTimeChange }: TimelineProps) {
  // Use a fixed reference date for initial render to avoid hydration mismatch
  const [referenceDate] = useState(() => {
    const date = new Date();
    date.setMinutes(0, 0, 0); // Reset minutes, seconds, and milliseconds
    return date;
  });

  // Get our 30-day time window based on the reference date
  const timeWindow = get30DayWindow(referenceDate)
  const totalHours = Math.floor(getHoursDiff(timeWindow.start, timeWindow.end))
  
  // Simple state
  const [selectedTime, setSelectedTime] = useState(referenceDate)
  const [timeRange, setTimeRange] = useState([0, 24]) // Default 24 hour range
  const [isRangeMode, setIsRangeMode] = useState(false)

  // Convert hours to actual date
  const hoursToDate = (hours: number) => addHours(timeWindow.start, hours)
  
  // Convert date to hours from start
  const dateToHours = (date: Date) => Math.floor(getHoursDiff(timeWindow.start, date))

  // Handle single time change
  const handleSingleChange = (value: number[]) => {
    const hours = value[0];
    const newDate = hoursToDate(hours);
    setSelectedTime(newDate);
    onTimeChange?.(newDate); // Call the callback with new time
  }

  // Handle range change
  const handleRangeChange = (value: SetStateAction<number[]>) => {
    setTimeRange(value);
    if (Array.isArray(value)) {
      const startDate = hoursToDate(value[0]);
      const endDate = hoursToDate(value[1]);
      onTimeChange?.(startDate, { start: startDate, end: endDate });
    }
  }

  // Reset to current time
  const resetToNow = () => {
    const now = new Date();
    now.setMinutes(0, 0, 0); // Reset minutes, seconds, and milliseconds
    setSelectedTime(now);
    const currentHours = dateToHours(now);
    setTimeRange([Math.max(0, currentHours - 12), Math.min(totalHours, currentHours + 12)]);
  }

  // Create marks for every 24 hours (daily)
  const dailyMarks: Record<number, string> = {}
  for (let h = 0; h <= totalHours; h += 24) {
    dailyMarks[h] = formatDateOnly(hoursToDate(h))
  }

  return (
    <Card className="w-full p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          <h2 className="text-lg font-semibold">Date Time Selector</h2>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm">Range Mode</span>
            <Switch 
              checked={isRangeMode} 
              onCheckedChange={setIsRangeMode}
            />
          </div>
          <Button onClick={resetToNow} variant="outline" size="sm">
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>
      </div>

      {/* Selection Display */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        {isRangeMode ? (
          <div className="space-y-1">
            <p className="font-medium text-sm">Time Range Selected:</p>
            <p className="text-sm">
              <span className="font-mono">{formatDateTime(hoursToDate(timeRange[0]))}</span>
              <span className="mx-2">→</span>
              <span className="font-mono">{formatDateTime(hoursToDate(timeRange[1]))}</span>
            </p>
            <p className="text-xs text-gray-600">
              Duration: {timeRange[1] - timeRange[0]} hours
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            <p className="font-medium text-sm">Selected Time:</p>
            <p className="font-mono text-sm">{formatDateTime(selectedTime)}</p>
          </div>
        )}
      </div>

      {/* Slider */}
      <div className="space-y-4">
        <DualRangeSlider
          value={isRangeMode ? timeRange : [dateToHours(selectedTime)]}
          onValueChange={isRangeMode ? handleRangeChange : (v) => handleSingleChange(v)}
          max={totalHours}
          min={0}
          step={1}
          label={(value) => formatDateTime(hoursToDate(Array.isArray(value) ? value[0] : value || 0))}
          labelPosition="top"
          className="w-full"
        />
        
        {/* Time window info */}
        <div className="text-xs text-gray-500 pt-2 border-t">
          <p>Available window: {formatDateTime(timeWindow.start)} to {formatDateTime(timeWindow.end)}</p>
          <p>Total: {totalHours} hours ({Math.floor(totalHours / 24)} days)</p>
        </div>
      </div>
    </Card>
  )
}