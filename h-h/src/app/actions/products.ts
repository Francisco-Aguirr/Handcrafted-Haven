'use server';

import { listProducts } from '@/lib/db/search';
import { getProductById } from '@/lib/db/products';

export async function getProducts(filters = {}) {
  try {
    const products = await listProducts(filters);
    return products;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export async function getProduct(id: string) {

  try {

    return getProductById(id);

  } catch (error) {
    console.error('Error fetching product by ID:', error);
    return null;
  }
}