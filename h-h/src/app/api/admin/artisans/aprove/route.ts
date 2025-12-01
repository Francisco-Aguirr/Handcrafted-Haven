import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { requestId } = await req.json();

    const res1 = await db.query(
      "SELECT user_id FROM artisan_requests WHERE id = $1",
      [requestId]
    );
    const rows = res1.rows;
    if (rows.length === 0)
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    const userId = rows[0].user_id;

    // Update role
    await db.query("UPDATE users SET role = 'artisan' WHERE id = $1", [userId]);

    // Create artisan profile
    await db.query(
      "INSERT INTO artisans (user_id, verified) VALUES ($1, true)",
      [userId]
    );

    // Delete request
    await db.query("DELETE FROM artisan_requests WHERE id = $1", [requestId]);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed approval" }, { status: 500 });
  }
}
