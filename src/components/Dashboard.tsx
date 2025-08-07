import Timeline from './Timeline'

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Timeline Section */}
      <div className="max-w-4xl mx-auto mb-6">
        <Timeline />
      </div>
      
      {/* Map Placeholder */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-blue-100 border-2 border-dashed border-blue-300 rounded-lg p-12 text-center">
          <div className="text-blue-600">
            <div className="text-4xl mb-4">🗺️</div>
            <h3 className="text-xl font-semibold mb-2">Map Section</h3>
            <p className="text-sm opacity-75">Interactive map coming in Phase 3!</p>
            <p className="text-xs mt-2 opacity-50">Timeline controls are ready above ↑</p>
          </div>
        </div>
      </div>
    </div>
  )
}