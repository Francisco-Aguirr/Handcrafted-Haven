import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function listCategories() {

  const data = await sql`
      SELECT *
      FROM categories;
  `;
 
  return data;

}