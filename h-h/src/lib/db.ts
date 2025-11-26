import { Pool } from "pg";

let pool: Pool;

if (!pool) {
  pool = new Pool({
    connectionString: process.env.POSTGRES_URL,   // ← tu variable de Vercel
    ssl: {
      rejectUnauthorized: false, // necesario para Vercel
    }
  });
}

export const db = {
  query: (text: string, params?: any[]) => pool.query(text, params),
};
