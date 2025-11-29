import { auth } from "@/auth";
import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

// 👉 POST: crear solicitud
export async function POST() {
  const session = await auth();
  if (!session?.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    // prevenir solicitudes duplicadas
    const exists = await sql`
      SELECT * FROM artisan_requests WHERE user_id = ${userId}
    `;

    if (exists.length > 0) {
      return Response.json(
        { status: exists[0].status },
        { status: 200 }
      );
    }

    // crear solicitud nueva
    await sql`
      INSERT INTO artisan_requests (user_id)
      VALUES (${userId})
    `;

    return Response.json({ status: "pending" }, { status: 201 });
  } catch (err) {
    console.error("Error creating artisan request:", err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}

// 👉 GET: obtener el estado actual
export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return Response.json({ status: "none" }, { status: 200 });
  }

  const userId = session.user.id;

  try {
    const req = await sql`
      SELECT status FROM artisan_requests WHERE user_id = ${userId}
      LIMIT 1
    `;

    if (req.length === 0) {
      return Response.json({ status: "none" });
    }

    return Response.json({ status: req[0].status });
  } catch (err) {
    console.error(err);
    return Response.json({ status: "none" });
  }
}
