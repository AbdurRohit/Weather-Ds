"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Trash2, Palette, Thermometer } from 'lucide-react'
import { ColorRule, temperatureDataSource } from '@/lib/colorRules'

interface ColorRulesPanelProps {
  onRulesChange: (rules: ColorRule[]) => void
}

export default function ColorRulesPanel({ onRulesChange }: ColorRulesPanelProps) {
  const [rules, setRules] = useState<ColorRule[]>(temperatureDataSource.defaultRules)

  const updateRules = (newRules: ColorRule[]) => {
    setRules(newRules)
    onRulesChange(newRules)
  }

  const addRule = () => {
    const newRule: ColorRule = {
      id: `rule_${Date.now()}`,
      operator: '>=',
      value: 0,
      color: '#6B7280',
      label: 'New Rule'
    }
    updateRules([...rules, newRule])
  }

  const updateRule = (id: string, updates: Partial<ColorRule>) => {
    const updatedRules = rules.map(rule => 
      rule.id === id ? { ...rule, ...updates } : rule
    )
    updateRules(updatedRules)
  }

  const removeRule = (id: string) => {
    updateRules(rules.filter(rule => rule.id !== id))
  }

  const resetToDefault = () => {
    updateRules(temperatureDataSource.defaultRules)
  }

  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-purple-600" />
            <CardTitle className="text-sm">Color Rules</CardTitle>
          </div>
          <Button onClick={resetToDefault} variant="outline" size="sm" className="text-xs">
            Reset Default
          </Button>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <Thermometer className="h-4 w-4" />
          <span>Temperature (°C) → Color Mapping</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {rules.map((rule) => (
          <div key={rule.id} className="border rounded-lg p-3 bg-gray-50">
            <div className="flex items-center gap-2 mb-2">
              <Input
                value={rule.label || ''}
                onChange={(e) => updateRule(rule.id, { label: e.target.value })}
                placeholder="Rule name"
                className="h-8 text-xs flex-1"
              />
              <Button
                onClick={() => removeRule(rule.id)}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-red-600"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-600 w-8">If</span>
              
              <Select
                defaultValue={rule.operator}
                onValueChange={(value) => updateRule(rule.id, { operator: value as ColorRule['operator'] })}
              >
                <SelectTrigger className="h-8 w-16 text-xs">
                  <SelectValue placeholder={rule.operator} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="<">{'<'}</SelectItem>
                  <SelectItem value="<=">{'\u2264'}</SelectItem>
                  <SelectItem value="=">=</SelectItem>
                  <SelectItem value=">=">{'\u2265'}</SelectItem>
                  <SelectItem value=">">{'>'}</SelectItem>
                </SelectContent>
              </Select>

              <Input
                type="number"
                value={rule.value}
                onChange={(e) => updateRule(rule.id, { value: parseFloat(e.target.value) || 0 })}
                className="h-8 w-20 text-xs text-center"
              />

              <span className="text-xs text-gray-600">→</span>

              <div className="flex items-center gap-1">
                <input
                  type="color"
                  value={rule.color}
                  onChange={(e) => updateRule(rule.id, { color: e.target.value })}
                  className="w-8 h-8 rounded border cursor-pointer"
                />
                <span className="text-xs text-gray-600 uppercase">{rule.color}</span>
              </div>
            </div>
          </div>
        ))}

        <Button onClick={addRule} variant="outline" size="sm" className="w-full h-8 text-xs">
          <Plus className="h-3 w-3 mr-1" />
          Add Rule
        </Button>

        {/* Legend */}
        <div className="bg-blue-50 p-3 rounded-lg">
          <div className="text-xs font-medium text-blue-800 mb-2">Current Rules Preview:</div>
          <div className="space-y-1">
            {rules.map((rule) => (
              <div key={rule.id} className="flex items-center gap-2 text-xs">
                <div 
                  className="w-3 h-3 rounded-full border"
                  style={{ backgroundColor: rule.color }}
                />
                <span className="text-blue-700">
                  {rule.operator} {rule.value}°C → {rule.label || 'Unnamed'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}