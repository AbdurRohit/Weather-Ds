import Timeline from './Timeline'
import Map from './Map'
import PolygonSidebar from './PolygonSidebar'

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Timeline Section */}
      <div className="p-4 pb-0">
        <div className="max-w-7xl mx-auto">
          <Timeline />
        </div>
      </div>
      
      {/* Map + Sidebar Section */}
      <div className="p-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <div className="text-xl">🗺️</div>
                <h2 className="text-lg font-semibold">Interactive Map & Polygon Drawing</h2>
              </div>
            </div>
            
            <div className="flex">
              {/* Map Area */}
              <div className="flex-1 p-4">
                <Map />
              </div>
              
              {/* Sidebar */}
              <PolygonSidebar />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}