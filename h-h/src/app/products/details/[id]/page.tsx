import React from 'react';
import ProductDetail from '@/components/ProductDetails';
import { getProduct } from '@/app/actions/products';
import { auth } from '@/auth';
import { getProductWithOwnerInfo } from '@/lib/db/products';

export default async function ProductDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // Get product with owner info
  const product = await getProductWithOwnerInfo(id);
  if (!product) {
    return <div>Product not found</div>;
  }

  // Check if current user is the owner
  const session = await auth();
  const isOwner = session?.user?.id === product.ownerUserId;

  return (
    <div className="container mx-auto px-4 py-8 bg-white rounded-lg shadow-md mt-6" >
      <ProductDetail {...product} isOwner={isOwner} />
    </div>
  );
}
