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

  // ----------------------------------------------------
  // FAVORITES
  // ----------------------------------------------------
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loadingFavs, setLoadingFavs] = useState(true);

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

  useEffect(() => {
    loadFavorites();
  }, []);

  async function handleRemoveFavorite(productId: string) {
    try {
      await fetch("/api/favorites", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });

      setFavorites((prev) => prev.filter((f) => f.id !== productId));
    } catch (err) {
      console.error("Error removing favorite", err);
    }
  }

  // ----------------------------------------------------
  // ARTISAN REQUEST
  // ----------------------------------------------------
  const [artisanStatus, setArtisanStatus] =
    useState<"none" | "pending" | "approved" | "rejected">("none");

  // cargar estado actual
  useEffect(() => {
    async function loadStatus() {
      const res = await fetch("/api/artisan-request");
      const data = await res.json();
      setArtisanStatus(data.status);
    }
    loadStatus();
  }, []);

  async function handleArtisanRequest() {
    try {
      const res = await fetch("/api/artisan-request", {
        method: "POST",
      });

      const data = await res.json();
      setArtisanStatus(data.status);

      if (data.status === "pending") {
        alert("Your artisan request was submitted successfully!");
      }
    } catch (err) {
      console.error("Error submitting artisan request", err);
      alert("Error submitting request.");
    }
  }

  // ----------------------------------------------------
  // UI
  // ----------------------------------------------------
  return (
    <DashboardContainer>
      <h1 className="text-3xl font-bold mb-2">Welcome, {user.name}</h1>
      <p className="text-gray-600 mb-6">Role: {user.role}</p>

      {/* FAVORITES --------------------------------------- */}
      <SectionTitle>Your Favorites</SectionTitle>

      {loadingFavs ? (
        <p>Loading...</p>
      ) : favorites.length === 0 ? (
        <p>You don't have any favorites yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {favorites.map((fav) => (
            <Card key={fav.id}>
              <img
                src={fav.image_url}
                alt={fav.name}
                className="w-full h-32 object-cover rounded-md"
              />

              <h3 className="text-lg font-semibold mt-2">{fav.name}</h3>
              <p className="text-gray-700">${Number(fav.price)}</p>

              <p className="text-sm text-gray-500">
                {fav.artisan_name || "Unknown artisan"}
              </p>

              <div className="flex justify-between mt-3">
                <button
                  onClick={() => handleRemoveFavorite(fav.id)}
                  className="text-red-600 hover:text-red-800 transition"
                >
                  Remove
                </button>

                <button
                  onClick={() => router.push("/")}
                  className="text-blue-600 hover:text-blue-800 transition"
                >
                  View Product
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* ARTISAN REQUEST --------------------------------- */}
      <SectionTitle>Become an Artisan</SectionTitle>

      {artisanStatus === "none" && (
        <button
          onClick={handleArtisanRequest}
          className="px-5 py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800"
        >
          I want to sell / Become an artisan
        </button>
      )}

      {artisanStatus === "pending" && (
        <p className="text-yellow-600 font-semibold">
          Your artisan request is pending approval.
        </p>
      )}

      {artisanStatus === "approved" && (
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

      {artisanStatus === "rejected" && (
        <p className="text-red-600 font-semibold">
          Your request was rejected. Contact support for details.
        </p>
      )}
    </DashboardContainer>
  );
}
