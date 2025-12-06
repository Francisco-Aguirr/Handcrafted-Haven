
"use client";

import Image from "next/image";
import { Product } from "@/types/Product";
import { FaHeart, FaPlus, FaShareAlt, FaEdit } from "react-icons/fa";
import { useState } from "react";
import EditProductModal from "./EditProductModal";
import StarRating from "./StarRating";

type ProductDetailsProps = Product & {
  isOwner?: boolean;
};

export default function ProductDetails(props: ProductDetailsProps) {
  const { isOwner, ...product } = props;
  const favoriteIds: string[] = [];

  const [isFavorite, setIsFavorite] = useState(
    favoriteIds.includes(product.id)
  );

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

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
  };

  return (
    <>
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

          {/* Interactive Star Rating */}
          <StarRating
            productId={product.id}
            initialRating={product.rating}
            size="lg"
          />

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
            <button className="icon-btn" onClick={toggleFavorite}>
              <FaHeart className={isFavorite ? "text-red-500" : "text-gray-400"} />
            </button>
            <button className="icon-btn">
              <FaPlus />
            </button>

            {/* Edit button - only visible to product owner */}
            {isOwner && (
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 flex items-center gap-2 transition-colors"
              >
                <FaEdit />
                Edit Product
              </button>
            )}
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">Description</h2>
            <p className="text-gray-700">
              {product.description}
            </p>
          </div>
        </div>
      </div>

      {/* Edit Product Modal */}
      {isOwner && (
        <EditProductModal
          product={{
            id: product.id,
            name: product.name,
            description: product.description,
            price: product.price,
            image: product.image,
          }}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}
    </>
  );
}
