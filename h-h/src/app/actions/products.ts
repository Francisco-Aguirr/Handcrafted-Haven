'use server';

import { listProducts } from '@/lib/db/search';
import postgres from 'postgres';



export async function getProducts(filters = {}) {
  try {
    const products = await listProducts(filters);
    return products;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}


export async function getProductById(id: string) {

  const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

  try {
    const data = await sql.unsafe(`
      SELECT products.*, CONCAT(users.first_name, ' ', users.last_name) AS artisan_name, users.avatar_url as artisan_avatar
      FROM products
      LEFT JOIN artisans ON products.artisan_id = artisans.id
      LEFT JOIN users ON artisans.user_id = users.id
      WHERE products.id = '${id}'
      ORDER BY name;
    `);
  
    return data.map(product => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: parseFloat(product.price),
      rating: parseFloat(product.rating),
      category_id: product.category_id,
      artisan: {
        id: product.artisan_id,
        name: product.artisan_name,
        avatar: product.artisan_avatar || '/avatar-3.jpg',
      },
      image: product.image || '/globe.svg'
    }));
    
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    return null;
  }
}