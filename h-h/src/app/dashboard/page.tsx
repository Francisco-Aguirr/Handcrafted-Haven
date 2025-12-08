// src/app/dashboard/page.tsx
import { getServerSession, type Session } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import dynamic from "next/dynamic";

// Componente de carga para el dashboard
function DashboardLoading() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header skeleton */}
        <div className="flex justify-between items-center mb-8">
          <div className="h-10 bg-gray-200 rounded w-64 animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
        </div>
        
        {/* Contenido skeleton */}
        <div className="space-y-8">
          <div className="h-96 bg-gray-100 rounded-xl animate-pulse"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 bg-gray-100 rounded-xl animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Importar dashboards dinámicamente para code splitting
const AdminDashboard = dynamic(() => import("./AdminDashboard"), {
  loading: () => <DashboardLoading />,
  ssr: true
});

const ArtisanDashboard = dynamic(() => import("./ArtisanDashboard"), {
  loading: () => <DashboardLoading />,
  ssr: true
});

const UserDashboard = dynamic(() => import("./UserDashboard"), {
  loading: () => <DashboardLoading />,
  ssr: true
});

export default async function DashboardPage() {
  const session = (await getServerSession(authOptions as any)) as Session | null;

  if (!session) redirect("/login");

  const role = session.user.role;

  // Renderizar el dashboard según el rol con Suspense para streaming
  return (
    <Suspense fallback={<DashboardLoading />}>
      {role === "admin" && <AdminDashboard />}
      {role === "artisan" && <ArtisanDashboard user={session.user} />}
      {role === "user" && <UserDashboard user={session.user} />}
      
      {/* Si el rol no está definido, mostrar error */}
      {!["admin", "artisan", "user"].includes(role) && (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Error de rol</h1>
            <p className="text-gray-600">Tu rol de usuario no está configurado correctamente.</p>
            <p className="text-gray-500 mt-2">Contacta al administrador del sistema.</p>
            <button
              onClick={() => window.location.href = "/"}
              className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Volver al inicio
            </button>
          </div>
        </div>
      )}
    </Suspense>
  );
}