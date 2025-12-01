"use client";

import { useEffect, useState } from "react";
import DashboardContainer from "./components/DashboardContainer";
import SectionTitle from "./components/SectionTitle";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Registra los componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

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

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [requests, setRequests] = useState<ArtisanRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [chartType, setChartType] = useState<"bar" | "doughnut">("bar");

  // Datos para el gráfico de barras
  const barChartData = {
    labels: ["Users", "Artisans", "Products"],
    datasets: [
      {
        label: "Total Count",
        data: stats ? [stats.users, stats.artisans, stats.products] : [0, 0, 0],
        backgroundColor: [
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 99, 132, 0.6)",
          "rgba(75, 192, 192, 0.6)",
        ],
        borderColor: [
          "rgba(54, 162, 235, 1)",
          "rgba(255, 99, 132, 1)",
          "rgba(75, 192, 192, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  // Datos para el gráfico de dona
  const doughnutChartData = {
    labels: ["Users", "Artisans", "Products"],
    datasets: [
      {
        data: stats ? [stats.users, stats.artisans, stats.products] : [0, 0, 0],
        backgroundColor: [
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 99, 132, 0.6)",
          "rgba(75, 192, 192, 0.6)",
        ],
        borderColor: [
          "rgba(54, 162, 235, 1)",
          "rgba(255, 99, 132, 1)",
          "rgba(75, 192, 192, 1)",
        ],
        borderWidth: 1,
        hoverOffset: 15,
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Platform Statistics",
        font: {
          size: 16,
          weight: "bold" as const,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  const doughnutChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right" as const,
      },
      title: {
        display: true,
        text: "Platform Distribution",
        font: {
          size: 16,
          weight: "bold" as const,
        },
      },
    },
    cutout: "70%",
  };

  async function loadData() {
    setLoading(true);

    try {
      const statsRes = await fetch("/api/admin/stats");
      const reqRes = await fetch("/api/admin/artisans/requests");

      const statsJson = await statsRes.json();
      const reqJson = await reqRes.json();

      console.log("🔎 STATS:", statsJson);
      console.log("🔎 REQUESTS:", reqJson);

      setStats(statsJson);
      setRequests(reqJson);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

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

  // Función para formatear fecha
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <DashboardContainer>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-lg">Dashboard Loading...</span>
        </div>
      </DashboardContainer>
    );
  }

  if (!stats) {
    return (
      <DashboardContainer>
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold text-red-600 mb-4">
            Error al cargar los datos
          </h2>
          <button
            onClick={loadData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Try Again
          </button>
        </div>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer>
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

        {/* Contenedor del gráfico */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 mb-8">
          <div className="h-96">
            {chartType === "bar" ? (
              <Bar data={barChartData} options={barChartOptions} />
            ) : (
              <Doughnut data={doughnutChartData} options={doughnutChartOptions} />
            )}
          </div>
        </div>

        {/* Cards con números detallados */}
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

      {requests.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-xl text-gray-600">No pending requests</p>
          <p className="text-gray-500 mt-2">All requests have been processed</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center mb-4">
            <p className="text-gray-600">
              Showing <span className="font-bold">{requests.length}</span> pending requests
            </p>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Quick actions:</span>
              <button
                onClick={() => {
                  if (confirm("Approve all pending requests?")) {
                    requests.forEach(r => approve(r.id));
                }
                }}
                className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200 transition"
              >
                Approve all
              </button>
            </div>
          </div>

          {requests.map((r) => (
            <div
              key={r.id}
              className="bg-white p-6 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all duration-200"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div className="mb-4 md:mb-0 flex items-start space-x-4">
                  {/* Avatar del usuario */}
                  <div className="flex-shrink-0">
                    {r.avatar_url ? (
                      <img
                        src={r.avatar_url}
                        alt={`${r.first_name} ${r.last_name}`}
                        className="w-14 h-14 rounded-full object-cover border-2 border-gray-200"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 border-2 border-gray-200 flex items-center justify-center">
                        <span className="text-xl font-semibold text-blue-800">
                          {r.first_name?.[0] || r.email?.[0] || 'U'}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Información del usuario */}
                  <div>
                    <div className="flex items-center mb-2">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                        Solicitud #{r.id.substring(0, 8)}...
                      </span>
                      <span className="ml-3 text-sm text-gray-500">
                        {formatDate(r.created_at)}
                      </span>
                    </div>
                    
                    <h3 className="font-semibold text-lg text-gray-800">
                      {r.first_name} {r.last_name}
                    </h3>
                    
                    <div className="mt-2 space-y-1">
                      <p className="text-gray-600">
                        <span className="font-medium">Email:</span> {r.email}
                      </p>
                      {r.phone && (
                        <p className="text-gray-600">
                          <span className="font-medium">Phone:</span> {r.phone}
                        </p>
                      )}
                      <p className="text-sm text-gray-500">
                        <span className="font-medium">User ID:</span> {r.user_id}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Botones de acción */}
                <div className="flex space-x-3 mt-4 md:mt-0">
                  <button
                    onClick={() => {
                      if (confirm(`¿Aprobar la solicitud de ${r.first_name} ${r.last_name}?`)) {
                        approve(r.id);
                      }
                    }}
                    className="px-5 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-medium hover:from-green-600 hover:to-green-700 transition-all flex items-center shadow-sm"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Aprobar
                  </button>

                  <button
                    onClick={() => {
                      if (confirm(`¿Rechazar la solicitud de ${r.first_name} ${r.last_name}?`)) {
                        reject(r.id);
                      }
                    }}
                    className="px-5 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-medium hover:from-red-600 hover:to-red-700 transition-all flex items-center shadow-sm"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

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
    </DashboardContainer>
  );
}