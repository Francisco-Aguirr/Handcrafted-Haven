import React from 'react';
import ProductDetail from '@/components/ProductDetails';
import { getProductById } from '@/app/actions/products';

export default async function ProductDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const product = await getProductById(id);

  if (!product || product.length === 0) {
    return <div>Product not found</div>;
  }

  return (
      <div className="container mx-auto px-4 py-8 bg-white rounded-lg shadow-md mt-6" >   
        <ProductDetail {...product[0]} />
      </div>
  );
}