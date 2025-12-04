
"use client";

import Image from "next/image";
import { Product } from "@/types/Product";
import { FaHeart, FaPlus, FaShareAlt, FaStar } from "react-icons/fa";
import { useState } from "react";

export default function ProductDetails(product: Product) {
  const stars = Array.from({ length: 5 }, (_, i) => i < product.rating);
  const favoriteIds = [];

   const [isFavorite, setIsFavorite] = useState(
    favoriteIds.includes(product.id)
  );


  console.log("Product Details Component:", product);
  const toggleFavorite = async () => {
    try {
      const res = await fetch("/api/favorites", {
        method: isFavorite ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId: product.id }),
      });

      if (!res.ok) throw new Error("Failed favorite update");

      setIsFavorite(!isFavorite);
    } catch (err) {
      console.error(err);
    }
  };

  const goToPageartisan = (id: string) => {
    window.location.href = `/artisans/details/${id}`;
  }

  return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative aspect-square">
          <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover rounded-lg"
          />
        </div>
        
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          
          <p className="text-2xl font-semibold text-green-600">
          ${product.price}
          </p>

          <div className="rating">
            {stars.map((filled, index) => (
              <FaStar
                key={index}
                className={filled ? "star filled" : "star"}
              />
            ))}
          </div>

          {/* Artesano */}
          <div className="border-t border-b py-4">
            <div className="artisan cursor-pointer" onClick={() => goToPageartisan(product.artisan.id)}>
              <Image
                src={product.artisan.avatar}
                alt={product.artisan.name}
                width={32}
                height={32}
                className="artisan-avatar"
              />
              <span className="artisan-name">{product.artisan.name}</span>
            </div>
          </div>

          {/* Icons: share, fav, add */}
          <div className="footer-actions">
            <button className="icon-btn">
              <FaShareAlt />
            </button>
            <button className="icon-btn"  onClick={toggleFavorite}>
              <FaHeart className={isFavorite ? "text-red-500" : "text-gray-400"} />
            </button>
            <button className="icon-btn">
              <FaPlus />
            </button>
          </div>
          
          <div>
            <h2 className="text-lg font-semibold mb-2">Description</h2>
              <p className="text-gray-700">
                {product.description}
              </p>
            </div>
        </div>
      </div>
  );
}