import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

/**
 * Get user's existing rating for a product
 */
export async function getUserRating(productId: string, userId: string) {
  const rows = await sql`
    SELECT rating FROM reviews
    WHERE product_id = ${productId} AND user_id = ${userId}
    LIMIT 1;
  `;

  if (rows.length === 0) {
    return null;
  }

  return rows[0].rating;
}

/**
 * Submit or update a rating (upsert into reviews table)
 */
export async function submitRating(
  productId: string,
  userId: string,
  rating: number
) {
  // Check if review already exists
  const existing = await sql`
    SELECT id FROM reviews
    WHERE product_id = ${productId} AND user_id = ${userId}
    LIMIT 1;
  `;

  if (existing.length > 0) {
    // Update existing review
    await sql`
      UPDATE reviews
      SET rating = ${rating}
      WHERE product_id = ${productId} AND user_id = ${userId};
    `;
  } else {
    // Insert new review
    await sql`
      INSERT INTO reviews (product_id, user_id, rating, comment)
      VALUES (${productId}, ${userId}, ${rating}, '');
    `;
  }

  // Update the product's average rating
  await updateProductAverageRating(productId);

  return { success: true };
}

/**
 * Recalculate and update the product's average rating
 */
export async function updateProductAverageRating(productId: string) {
  const result = await sql`
    SELECT AVG(rating) as avg_rating
    FROM reviews
    WHERE product_id = ${productId};
  `;

  const avgRating = result[0]?.avg_rating || 0;

  await sql`
    UPDATE products
    SET rating = ${Math.round(avgRating * 10) / 10}
    WHERE id = ${productId};
  `;

  return avgRating;
}
