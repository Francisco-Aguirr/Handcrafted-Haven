// src/app/dashboard/AdminDashboard.tsx
"use client";

import { Suspense, useState } from "react";
import dynamic from "next/dynamic";
import DashboardContainer from "./components/DashboardContainer";
import SectionTitle from "./components/SectionTitle";
import AdminDashboardSkeleton from "./components/AdminDashboardSkeleton";
import StatsCards from "./components/StatsCards";

// Importar componentes dinámicamente con carga diferida
const StatsChart = dynamic(() => import("./components/StatsChart"), {
  loading: () => <div className="h-96 bg-gray-100 rounded animate-pulse"></div>,
  ssr: false // Chart.js es una biblioteca del lado del cliente
});

const RequestsList = dynamic(() => import("./components/RequestsList"), {
  loading: () => (
    <div className="space-y-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-32 bg-gray-100 rounded animate-pulse"></div>
      ))}
    </div>
  ),
});

// Tipo para las solicitudes
interface ArtisanRequest {
  id: string;
  user_id: string;
  status: string;
  created_at: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  avatar_url?: string;
}

// Componente que carga los datos
function AdminDashboardContent() {
  const [stats, setStats] = useState<any>(null);
  const [requests, setRequests] = useState<ArtisanRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [chartType, setChartType] = useState<"bar" | "doughnut">("bar");
  const [error, setError] = useState<string | null>(null);

  async function loadData() {
    setLoading(true);
    setError(null);

    try {
      const [statsRes, reqRes] = await Promise.all([
        fetch("/api/admin/stats"),
        fetch("/api/admin/artisans/requests"),
      ]);

      if (!statsRes.ok || !reqRes.ok) {
        throw new Error("Failed to fetch data");
      }

      const statsJson = await statsRes.json();
      const reqJson = await reqRes.json();

      setStats(statsJson);
      setRequests(reqJson);
    } catch (error) {
      console.error("Error loading data:", error);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  }

  // Cargar datos inicialmente
  useState(() => {
    loadData();
  });

  async function approve(id: string) {
    try {
      await fetch("/api/admin/artisans/approve", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ requestId: id }),
      });
      loadData();
    } catch (error) {
      console.error("Error approving request:", error);
    }
  }

  async function reject(id: string) {
    try {
      await fetch("/api/admin/artisans/reject", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ requestId: id }),
      });
      loadData();
    } catch (error) {
      console.error("Error rejecting request:", error);
    }
  }

  if (loading && !stats) {
    return <AdminDashboardSkeleton />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-red-600 mb-4">
          {error}
        </h2>
        <button
          onClick={loadData}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <button
          onClick={loadData}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition flex items-center"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          Refresh
        </button>
      </div>

      {/* ------------------- Stats con Gráfico ------------------- */}
      <SectionTitle>Platform Statistics</SectionTitle>

      <div className="mb-10">
        {/* Selector de tipo de gráfico */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setChartType("bar")}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              chartType === "bar"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Bar Chart
          </button>
          <button
            onClick={() => setChartType("doughnut")}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              chartType === "doughnut"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Pie Chart
          </button>
        </div>

        {/* Contenedor del gráfico con Suspense */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 mb-8">
          <Suspense fallback={<div className="h-96 bg-gray-100 rounded animate-pulse"></div>}>
            <StatsChart stats={stats} chartType={chartType} />
          </Suspense>
        </div>

        {/* Cards con números detallados */}
        <StatsCards stats={stats} />

        {/* Resumen numérico */}
        <div className="mt-8 p-6 bg-gray-50 rounded-xl border border-gray-200">
          <h4 className="text-lg font-semibold text-gray-700 mb-4">Statistical Summary</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-white rounded-lg">
              <p className="text-sm text-gray-500">Average per category</p>
              <p className="text-2xl font-bold text-gray-800">
                {Math.round((stats.users + stats.artisans + stats.products) / 3)}
              </p>
            </div>
            <div className="text-center p-4 bg-white rounded-lg">
              <p className="text-sm text-gray-500">Total records</p>
              <p className="text-2xl font-bold text-gray-800">
                {stats.users + stats.artisans + stats.products}
              </p>
            </div>
            <div className="text-center p-4 bg-white rounded-lg">
              <p className="text-sm text-gray-500">Products per artisan</p>
              <p className="text-2xl font-bold text-gray-800">
                {stats.artisans > 0 ? (stats.products / stats.artisans).toFixed(1) : "0"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ------------------- Requests ------------------- */}
      <SectionTitle>Pending Artisan Requests</SectionTitle>

      {/* Lista de solicitudes con Suspense */}
      <Suspense fallback={
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-gray-100 rounded animate-pulse"></div>
          ))}
        </div>
      }>
        <RequestsList 
          requests={requests} 
          onApprove={approve} 
          onReject={reject} 
        />
      </Suspense>

      {/* Pie de página del dashboard */}
      <div className="mt-12 pt-6 border-t border-gray-200 text-center text-gray-500 text-sm">
        <p>
          Dashboard updated on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
        </p>
        <p className="mt-1">
          Total managed items: {stats.users + stats.artisans + stats.products + requests.length}
        </p>
        <p className="mt-1 text-xs">
          Pending requests: {requests.length} | Users: {stats.users} | Artisans: {stats.artisans} | Products: {stats.products}
        </p>
      </div>
    </>
  );
}

// Componente principal con Suspense
export default function AdminDashboard() {
  return (
    <DashboardContainer>
      <Suspense fallback={<AdminDashboardSkeleton />}>
        <AdminDashboardContent />
      </Suspense>
    </DashboardContainer>
  );
}