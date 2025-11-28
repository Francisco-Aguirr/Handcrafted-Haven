// import ProductList from "@/components/ProductList";
import Hero from "../components/Hero";
import ProductCard from "@/components/ProductCard";
import { getRandomProducts } from "@/lib/db/products";




export default async function HomePage() {
  const products = await getRandomProducts(3); // 3 productos aleatorios

  return (
    <>
      <Hero />
      <div className="p-12">
      <h1 className="text-3xl font-bold mb-6">Featured Products</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
      {/* <ProductList /> */}
    </>
  );
}
