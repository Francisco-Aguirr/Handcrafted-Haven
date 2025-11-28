import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function listArtesians() {

  const data = await sql`
      SELECT artisans.id, CONCAT(users.first_name, ' ', users.last_name) AS name, users.avatar_url AS avatar, bio
      FROM users 
      LEFT JOIN artisans ON artisans.user_id = users.id
      WHERE role = 'artisan' AND artisans.verified = true
  `;
 
  return data;

}