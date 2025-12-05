import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

/**
 * Mapea un producto SQL a tu interfaz Product (frontend)
 */
function mapartisan(row: any) {
  return {
     id: row.id,
    name: row.name,
    surename: row.surename,
    bio: row.bio,
    avatar: row.avatar ?? "/avatar-3.jpg",
  };
}

export async function listArtisans() {

  const data = await sql`
      SELECT artisans.id, CONCAT(users.first_name, ' ', users.last_name) AS name, users.avatar_url AS avatar, bio
      FROM users 
      LEFT JOIN artisans ON artisans.user_id = users.id
      WHERE role = 'artisan' AND artisans.verified = true
  `;
 
  if (data.length === 0) {
    return null;
  }
 
  return data.map(mapartisan);

}

export async function getArtisanById(id: string) {

  const data = await sql`
      SELECT artisans.id, CONCAT(users.first_name, ' ', users.last_name) AS name, users.avatar_url AS avatar, bio
      FROM users 
      LEFT JOIN artisans ON artisans.user_id = users.id
      WHERE artisans.id = ${id} AND role = 'artisan' AND artisans.verified = true
  `;

  if (data.length === 0) {
    return null;
  }
 
  return mapartisan(data[0]);

}