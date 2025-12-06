"use client";

import Image from "next/image";
import { useState } from "react";
import { Product } from "@/types/Product";
import { FaHeart, FaPlus, FaShareAlt } from "react-icons/fa";
import StarRating from "./StarRating";

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

  const goToPage = (id: string) => {
    window.location.href = `/products/details/${id}`;
  }

  const goToPageartisan = (id: string) => {
    window.location.href = `/artisans/details/${id}`;
  }

  return (
    <div className="product-card">

      <Image
        src={product.image}
        alt={product.name}
        width={300}
        height={250}
        className="product-image cursor-pointer"
        onClick={() => goToPage(product.id)}
      />

      <h3 onClick={() => goToPage(product.id)} className="cursor-pointer">{product.name}</h3>
      <p className="price cursor-pointer" onClick={() => goToPage(product.id)}>${product.price.toFixed(2)}</p>

      <p className="description cursor-pointer" onClick={() => goToPage(product.id)}>{product.description}</p>

      {/* Star Rating - display only on cards, click to go to product page */}
      <div onClick={() => goToPage(product.id)} className="cursor-pointer">
        <StarRating
          productId={product.id}
          initialRating={product.rating}
          size="sm"
          interactive={false}
        />
      </div>

      <div className="product-footer">
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

        <div className="footer-actions">
          <button className="icon-btn">
            <FaShareAlt />
          </button>

          <button className="icon-btn cursor-pointer" onClick={toggleFavorite}>
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

