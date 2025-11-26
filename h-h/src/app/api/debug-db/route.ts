// just for debuging purposes
import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

export async function GET() {
  try {
    const rows = await sql`SELECT id, first_name, email FROM users ORDER BY created_at DESC LIMIT 10`;
    return Response.json({ ok: true, rows });
  } catch (err) {
    return Response.json({ ok: false, error: err });
  }
}
