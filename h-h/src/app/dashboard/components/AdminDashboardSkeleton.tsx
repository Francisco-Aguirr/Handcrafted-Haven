// src/app/dashboard/components/AdminDashboardSkeleton.tsx
export default function AdminDashboardSkeleton() {
  return (
    <div className="p-8 space-y-8">
      {/* Header skeleton */}
      <div className="flex justify-between items-center">
        <div className="h-10 bg-gray-200 rounded w-64 animate-pulse"></div>
        <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
      </div>

      {/* Stats section skeleton */}
      <div>
        <div className="h-8 bg-gray-200 rounded w-48 mb-6 animate-pulse"></div>
        
        {/* Chart type selector skeleton */}
        <div className="flex space-x-4 mb-6">
          <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
        </div>

        {/* Chart container skeleton */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 mb-8">
          <div className="h-96 bg-gray-100 rounded animate-pulse"></div>
        </div>

        {/* Stats cards skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-100 p-6 rounded-xl border border-gray-200 animate-pulse">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-gray-200 rounded-lg mr-4"></div>
                <div className="h-6 bg-gray-200 rounded w-32"></div>
              </div>
              <div className="h-12 bg-gray-200 rounded w-24 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-40"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Requests section skeleton */}
      <div>
        <div className="h-8 bg-gray-200 rounded w-48 mb-6 animate-pulse"></div>
        
        {/* Requests list skeleton */}
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white p-6 rounded-xl border border-gray-200 animate-pulse">
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div className="mb-4 md:mb-0 flex items-start space-x-4">
                  <div className="w-14 h-14 bg-gray-200 rounded-full"></div>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <div className="h-6 bg-gray-200 rounded w-32"></div>
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                    </div>
                    <div className="h-6 bg-gray-200 rounded w-48"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-64"></div>
                      <div className="h-4 bg-gray-200 rounded w-48"></div>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <div className="h-10 bg-gray-200 rounded w-24"></div>
                  <div className="h-10 bg-gray-200 rounded w-24"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}