import postgres from 'postgres';
import { SearchFilters } from '@/types/SearchFilters';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function listProducts(filters: SearchFilters = {}) {

  const { 
    category = null, 
    artisan = null, 
    minPrice = 0, 
    maxPrice = 999999, 
    rating = 0,
    searchTerm = ''
  } = filters;

  // Creamos los filtros dinámicamente
  const conditions = [];
  
  if (category || category !== '') {
    conditions.push(`category_id = '${category}'`);
  }
  
  if (artisan || artisan !== '') {
    conditions.push(`artisan_id = '${artisan}'`);
  }
  
  conditions.push(`price >= '${minPrice}'`);
  conditions.push(`price <= '${maxPrice}'`);
  conditions.push(`rating >= '${rating}'`);
  
  if (searchTerm) {
    conditions.push(`(name ILIKE '%${searchTerm}%' OR description ILIKE '%${searchTerm}%')`);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const data = await sql.unsafe(`
    SELECT products.*, CONCAT(users.first_name, ' ', users.last_name) AS artisan_name, users.avatar_url as artisan_avatar
    FROM products
    LEFT JOIN artisans ON products.artisan_id = artisans.id
    LEFT JOIN users ON artisans.user_id = users.id
    ${whereClause}
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

}