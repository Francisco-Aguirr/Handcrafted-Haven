// src/app/dashboard/page.tsx
import { getServerSession, type Session } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

// Importar ArtisanDashboard y UserDashboard normalmente
import UserDashboard from "./UserDashboard";
import ArtisanDashboard from "./ArtisanDashboard";

// Importar AdminDashboard dinámicamente con loading
import dynamic from "next/dynamic";

const AdminDashboard = dynamic(() => import("./AdminDashboard"), {
  loading: () => (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header skeleton */}
        <div className="flex justify-between items-center mb-8">
          <div className="h-10 bg-gray-200 rounded w-64 animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
        </div>
        
        {/* Chart skeleton */}
        <div className="h-96 bg-gray-100 rounded-xl mb-8 animate-pulse"></div>
        
        {/* Stats cards skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 bg-gray-100 rounded-xl animate-pulse"></div>
          ))}
        </div>
        
        {/* Requests skeleton */}
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-gray-100 rounded-xl animate-pulse"></div>
          ))}
        </div>
      </div>
    </div>
  ),
});

export default async function DashboardPage() {
  const session = (await getServerSession(authOptions as any)) as Session | null;

  if (!session) redirect("/login");

  const role = session.user.role;

  // Solo AdminDashboard usa streaming y skeleton
  if (role === "admin") {
    return <AdminDashboard />;
  }

  if (role === "artisan") {
    return <ArtisanDashboard user={session.user} />;
  }
  
  return <UserDashboard user={session.user} />;
}