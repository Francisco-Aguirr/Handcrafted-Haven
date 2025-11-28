"use client";

import { useState, useEffect } from "react";
import DashboardContainer from "./components/DashboardContainer";
import SectionTitle from "./components/SectionTitle";
import Card from "./components/Card";
import { useRouter } from "next/navigation";

type Props = {
  user: {
    name?: string | null;
    email?: string | null;
    role: string;
    id?: string;
  };
};


export default function UserDashboard({ user }: Props) {
  const router = useRouter();

  const [favorites, setFavorites] = useState<any[]>([]);
  const [loadingFavs, setLoadingFavs] = useState(true);

  useEffect(() => {
    async function loadFavorites() {
      try {
        const res = await fetch("/api/favorites");
        const data = await res.json();
        setFavorites(data);
      } catch (err) {
        console.error("Error loading favorites", err);
      } finally {
        setLoadingFavs(false);
      }
    }

  loadFavorites();
}, []);


  // Estado simulado de solicitud de artesano
  // Luego vendrá desde la DB
  const [artisanRequestStatus, setArtisanRequestStatus] =
    useState<"none" | "pending" | "approved">("none");

  const handleArtisanRequest = async () => {
    setArtisanRequestStatus("pending");

    // Más adelante:
    // await fetch("/api/artisan-request", { method: "POST" })

    alert("Your artisan request has been submitted!");
  };

  return (
    <DashboardContainer>
      <h1 className="text-3xl font-bold mb-2">Welcome, {user.name}</h1>
      <p className="text-gray-600 mb-6">Role: {user.role}</p>

      <SectionTitle>Your Favorites</SectionTitle>

{loadingFavs ? (
  <p>Loading...</p>
) : favorites.length === 0 ? (
  <p>You don't have any favorites yet.</p>
) : (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {favorites.map((fav) => (
      <Card key={fav.id}>
        <h3 className="text-lg font-semibold">{fav.name}</h3>
        <p className="text-gray-700">${Number(fav.price)}</p>
      </Card>
    ))}
  </div>
)}


      {/* ARTISAN REQUEST */}
      <SectionTitle>Become an Artisan</SectionTitle>

      {artisanRequestStatus === "none" && (
        <button
          onClick={handleArtisanRequest}
          className="px-5 py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800"
        >
          I want to sell / Become an artisan
        </button>
      )}

      {artisanRequestStatus === "pending" && (
        <p className="text-yellow-600 font-semibold">
          Your artisan request is pending approval.
        </p>
      )}

      {artisanRequestStatus === "approved" && (
        <div>
          <p className="text-green-600 font-semibold mb-2">
            You are now an approved artisan!
          </p>
          <button
            onClick={() => router.push("/dashboard")}
            className="px-5 py-3 bg-blue-600 text-white rounded-lg font-semibold"
          >
            Go to Artisan Dashboard
          </button>
        </div>
      )}
    </DashboardContainer>
  );
}
