import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const res1 = await db.query("SELECT COUNT(*)::int AS user_count FROM users");
    const res2 = await db.query("SELECT COUNT(*)::int AS artisan_count FROM artisans");
    const res3 = await db.query("SELECT COUNT(*)::int AS product_count FROM products");

    const user_count = res1.rows[0]?.user_count ?? 0;
    const artisan_count = res2.rows[0]?.artisan_count ?? 0;
    const product_count = res3.rows[0]?.product_count ?? 0;

    return NextResponse.json({
      users: user_count,
      artisans: artisan_count,
      products: product_count,
    });
  } catch (err) {
    console.error("Stats error:", err);
    return NextResponse.json({ error: "Failed stats" }, { status: 500 });
  }
}
