// src/app/dashboard/components/StatsChart.tsx
"use client";

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

interface StatsChartProps {
  stats: {
    users: number;
    artisans: number;
    products: number;
  };
  chartType: "bar" | "doughnut";
}

export default function StatsChart({ stats, chartType }: StatsChartProps) {
  // Datos para el gráfico de barras
  const barChartData = {
    labels: ["Users", "Artisans", "Products"],
    datasets: [
      {
        label: "Total Count",
        data: [stats.users, stats.artisans, stats.products],
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
        data: [stats.users, stats.artisans, stats.products],
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

  return (
    <div className="h-96">
      {chartType === "bar" ? (
        <Bar data={barChartData} options={barChartOptions} />
      ) : (
        <Doughnut data={doughnutChartData} options={doughnutChartOptions} />
      )}
    </div>
  );
}