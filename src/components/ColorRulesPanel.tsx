"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Trash2, Palette, RefreshCw } from 'lucide-react'
import { ColorRule, temperatureDataSource } from '@/lib/colorRules'

interface ColorRulesSidebarProps {
  onRulesChange: (rules: ColorRule[]) => void
}

export default function ColorRulesSidebar({ onRulesChange }: ColorRulesSidebarProps) {
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
    <footer className="w-full bg-gray-100 border-t border-gray-200 p-6 flex flex-col items-center">
      {/* Header */}
      <div className="flex items-center justify-between w-full max-w-6xl mb-4">
        <div className="flex items-center gap-2">
          <Palette className="h-5 w-5 text-purple-600" />
          <h3 className="font-semibold">Color Rules</h3>
        </div>
        <Button onClick={resetToDefault} variant="outline" size="sm" className="text-xs">
          <RefreshCw className="h-3 w-3 mr-1" />
          Reset
        </Button>
      </div>


      {/* Rules Grid: 3 columns, responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-5xl mb-8 mx-auto">
        {rules.map((rule, index) => (
          <Card key={rule.id} className="border border-gray-200 bg-yellow-50 flex flex-col justify-between min-h-[120px]">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <div className="text-xs text-gray-600">Rule #{index + 1}</div>
              <Button
                onClick={() => removeRule(rule.id)}
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 text-red-600"
                disabled={rules.length <= 1}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </CardHeader>
            <CardContent className="pt-0 flex flex-col gap-2">
              <Input
                value={rule.label || ''}
                onChange={(e) => updateRule(rule.id, { label: e.target.value })}
                placeholder="Rule name"
                className="h-8 text-xs mb-1"
              />
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-600 w-6">If</span>
                <Select 
                  value={rule.operator} 
                  onValueChange={(value) => updateRule(rule.id, { operator: value as ColorRule['operator'] })}
                >
                  <SelectTrigger className="h-8 w-16 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="<">{'<'}</SelectItem>
                    <SelectItem value="<=">{'<='}</SelectItem>
                    <SelectItem value="=">=</SelectItem>
                    <SelectItem value=">=">{'>='}</SelectItem>
                    <SelectItem value=">">{'>'}</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  type="number"
                  value={rule.value ?? ''}
                  onChange={(e) =>
                    updateRule(rule.id, {
                      value: e.target.value === '' ? undefined : parseFloat(e.target.value),
                    })
                  }
                  placeholder="10"
                  className="h-8 w-24 px-2 py-1 text-xs text-center text-black bg-white border border-gray-300"
                />
                <span className="text-xs text-gray-600">°C</span>
                <span className="text-xs text-gray-600 w-6">→</span>
                <input
                  type="color"
                  value={rule.color}
                  onChange={(e) => updateRule(rule.id, { color: e.target.value })}
                  className="w-8 h-8 rounded border cursor-pointer"
                />
                <span className="text-xs text-gray-600 uppercase flex-1">{rule.color}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {/* Add Rule Button */}
      <Button onClick={addRule} variant="outline" size="sm" className="w-48 mx-auto mb-8">
        <Plus className="h-3 w-3 mr-1" />
        Add Rule
      </Button>
      {/* Live Preview Card at the bottom */}
      <div className="w-full max-w-5xl mx-auto">
        <Card className="border border-purple-200 bg-purple-50 flex flex-col justify-between min-h-[120px]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-purple-800">Live Preview</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 flex flex-col gap-2">
            {rules.map((rule) => (
              <div key={rule.id} className="flex items-center gap-2 text-xs">
                <div 
                  className="w-4 h-4 rounded-full border border-purple-300"
                  style={{ backgroundColor: rule.color }}
                />
                <span className="text-purple-700">
                  {rule.operator} {rule.value}°C → {rule.label || 'Unnamed'}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </footer>
  )
}