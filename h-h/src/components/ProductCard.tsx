"use client";

import Image from "next/image";
import { Product } from "@/types/Product";
import { FaHeart, FaPlus, FaShareAlt, FaStar } from "react-icons/fa";

export default function ProductCard({ product }: { product: Product }) {
  const stars = Array.from({ length: 5 }, (_, i) => i < product.rating);

  return (
    <div className="product-card">
      {/* Imagen principal del producto */}
      <Image
        src={product.image}
        alt={product.name}
        width={300}
        height={250}
        className="product-image"
      />

      {/* Nombre y precio */}
      <h3>{product.name}</h3>
      <p className="price">${product.price.toFixed(2)}</p>

      {/* Descripción */}
      <p className="description">{product.description}</p>

      {/* Estrellas */}
      <div className="rating">
        {stars.map((filled, index) => (
          <FaStar
            key={index}
            className={filled ? "star filled" : "star"}
          />
        ))}
      </div>

      {/* Footer de la Card */}
      <div className="product-footer">
        {/* Artesano */}
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

        {/* Icons: share, fav, add */}
        <div className="footer-actions">
          <button className="icon-btn">
            <FaShareAlt />
          </button>
          <button className="icon-btn">
            <FaHeart />
          </button>
          <button className="icon-btn">
            <FaPlus />
          </button>
        </div>
      </div>

      {/* Botón de agregar al carrito */}
      <button className="btn-cart">Add to Cart</button>
    </div>
  );
}
