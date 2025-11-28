'use server';

import { listCategories } from '@/lib/db/categories';

export async function getCategories() {
  try {
    const categories = await listCategories();
    return categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}