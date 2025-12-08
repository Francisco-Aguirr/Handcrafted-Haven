// src/app/dashboard/components/StatsCards.tsx
interface StatsCardsProps {
  stats: {
    users: number;
    artisans: number;
    products: number;
  };
}

export default function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200 shadow-sm hover:shadow-md transition">
        <div className="flex items-center mb-4">
          <div className="p-3 bg-blue-100 rounded-lg mr-4">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 0c-.281.023-.562.035-.844.035-3.71 0-6.873-2.003-8.272-4.746a4 4 0 117.456.692" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-blue-800">Total Users</h3>
        </div>
        <p className="text-5xl font-bold text-blue-900">{stats.users}</p>
        <p className="text-blue-600 mt-2">Registered on the platform</p>
      </div>

      <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-6 rounded-xl border border-pink-200 shadow-sm hover:shadow-md transition">
        <div className="flex items-center mb-4">
          <div className="p-3 bg-pink-100 rounded-lg mr-4">
            <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-pink-800">Verified Artisans</h3>
        </div>
        <p className="text-5xl font-bold text-pink-900">{stats.artisans}</p>
        <p className="text-pink-600 mt-2">Approved profiles</p>
      </div>

      <div className="bg-gradient-to-br from-teal-50 to-teal-100 p-6 rounded-xl border border-teal-200 shadow-sm hover:shadow-md transition">
        <div className="flex items-center mb-4">
          <div className="p-3 bg-teal-100 rounded-lg mr-4">
            <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-teal-800">Published Products</h3>
        </div>
        <p className="text-5xl font-bold text-teal-900">{stats.products}</p>
        <p className="text-teal-600 mt-2">Available in the catalog</p>
      </div>
    </div>
  );
}