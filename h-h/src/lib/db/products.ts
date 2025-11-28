
import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

/**
 * Mapea un producto SQL a tu interfaz Product (frontend)
 */
function mapProduct(row: any) {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    price: Number(row.price),
    image: row.image_url ?? "/placeholder.png",
    rating: Number(row.rating) || 0,
    artisan: {
      name: row.artisan_name ?? "Unknown",
      avatar: row.artisan_avatar ?? "/avatar-placeholder.png",
    },
  };
}

/**
 * Obtiene N productos aleatorios
 */
export async function getRandomProducts(limit: number) {
  const rows = await sql`
    SELECT 
      p.*,
      u.first_name || ' ' || u.last_name AS artisan_name,
      u.avatar_url AS artisan_avatar
    FROM products p
    JOIN artisans a ON a.id = p.artisan_id
    JOIN users u ON u.id = a.user_id
    ORDER BY RANDOM()
    LIMIT ${limit};
  `;

  return rows.map(mapProduct);
}

/**
 * Obtiene todos los productos
 */
export async function getAllProducts() {
  const rows = await sql`
    SELECT 
      p.*,
      c.name AS category_name,
      u.first_name || ' ' || u.last_name AS artisan_name,
      u.avatar_url AS artisan_avatar
    FROM products p
    LEFT JOIN categories c ON c.id = p.category_id
    JOIN artisans a ON a.id = p.artisan_id
    JOIN users u ON u.id = a.user_id
    ORDER BY p.created_at DESC;
  `;

  return rows.map(mapProduct);
}
