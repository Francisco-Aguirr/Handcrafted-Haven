"use client";

import Image from "next/image";
import { Product } from "@/types/Product";
import { FaHeart, FaPlus, FaShareAlt, FaStar } from "react-icons/fa";
import { useState } from "react";

export default function ProductCard({ product }: { product: Product }) {
  const stars = Array.from({ length: 5 }, (_, i) => i < product.rating);

  const [isFavorite, setIsFavorite] = useState(false);

  async function toggleFavorite() {
    try {
      if (!isFavorite) {
        await fetch("/api/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId: product.id }),
        });
        setIsFavorite(true);
      } else {
        await fetch(`/api/favorites?productId=${product.id}`, {
          method: "DELETE",
        });
        setIsFavorite(false);
      }
    } catch (err) {
      console.error("Error toggling favorite", err);
    }
  }

  return (
    <div className="product-card">
      <Image
        src={product.image}
        alt={product.name}
        width={300}
        height={250}
        className="product-image cursor-pointer"
        onClick={() => window.location.href = `/products/details/${product.id}`}
      />

      <h3>{product.name}</h3>
      <p className="price">${product.price.toFixed(2)}</p>
      <p className="description">{product.description}</p>

      <div className="rating">
        {stars.map((filled, index) => (
          <FaStar key={index} className={filled ? "star filled" : "star"} />
        ))}
      </div>

      <div className="product-footer">
        <div className="artisan">
          <Image
            src={product.artisan.avatar}
            alt={product.artisan.name}
            width={32}
            height={32}
            className="artisan-avatar"
          />
          <span className="artisan-name">{product.artisan.name}</span>
        </div>

        <div className="footer-actions">
          <button className="icon-btn">
            <FaShareAlt />
          </button>

          {/* FAVORITO */}
          <button className="icon-btn" onClick={toggleFavorite}>
            <FaHeart className={isFavorite ? "text-red-500" : ""} />
          </button>

          <button className="icon-btn">
            <FaPlus />
          </button>
        </div>
      </div>

      <button className="btn-cart">Add to Cart</button>
    </div>
  );
}

