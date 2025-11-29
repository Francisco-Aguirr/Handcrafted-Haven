"use client";

import ProductCard from "./ProductCard";
import { Product } from "@/types/Product";

export default function ProductList() {
  const products: Product[] = [
    {
      id: "1",
      name: "Handmade Ceramic Vase",
      price: 49.99,
      image: "/products/vase.png",
      description: "A unique vase crafted by local artisans.",
      rating: 4,
      artisan: {
        id: "mock-artisan-1",
        name: "Eli Bark",
        avatar: "/avatar-2.jpg",
      },
    },
    {
      id: "2",
      name: "Woven Artisan Basket",
      price: 29.99,
      image: "/products/basket.png",
      description: "Made with natural fibers and traditional techniques.",
      rating: 5,
      artisan: {
        id: "mock-artisan-2",
        name: "Marco Hernández",
        avatar: "/avatar-1.png",
      },
    },
    {
      id: "3",
      name: "Wooden Sculpture",
      price: 89.99,
      image: "/products/wood.png",
      description: "A stunning wooden piece carved by hand.",
      rating: 4,
      artisan: {
        id: "mock-artisan-3",
        name: "Sara Gómez",
        avatar: "/avatar-3.jpg",
      },
    },
  ];

  return (
    <section className="product-section">
      <h2 className="product-section-title">Our Products</h2>

      <div className="product-grid">
        {products.map((item) => (
          <ProductCard key={item.id} product={item} />
        ))}
      </div>
    </section>
  );
}
