
import ProductCard from "@/components/ProductCard";
import { getAllProducts } from "@/lib/db/products";

export const dynamic = "force-dynamic"; // ensure DB fetch always fresh

export default async function ProductsPage() {
  const products = await getAllProducts();

  return (
    <div className="p-12">
      <h1 className="text-3xl font-bold mb-6">All Products</h1>

      {products.length === 0 ? (
        <p>No products available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
