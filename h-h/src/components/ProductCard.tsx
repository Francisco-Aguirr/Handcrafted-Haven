"use client";

import Image from "next/image";
import { useState } from "react";
import { Product } from "@/types/Product";
import { FaHeart, FaPlus, FaShareAlt, FaStar } from "react-icons/fa";

export default function ProductCard({
  product,
  favoriteIds = [],
}: {
  product: Product;
  favoriteIds?: string[];
}) {
  const [isFavorite, setIsFavorite] = useState(
    favoriteIds.includes(product.id)
  );

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

  const stars = Array.from({ length: 5 }, (_, i) => i < product.rating);

  return (
    <div className="product-card">

      <Image
        src={product.image}
        alt={product.name}
        width={300}
        height={250}
        className="product-image"
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

          <button className="icon-btn" onClick={toggleFavorite}>
            <FaHeart className={isFavorite ? "text-red-500" : "text-gray-400"} />
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
