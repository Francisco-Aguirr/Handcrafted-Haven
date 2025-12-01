// src/app/api/admin/artisans/requests/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const res = await db.query(`
      SELECT 
        ar.id, 
        ar.user_id, 
        ar.status, 
        ar.created_at,
        u.first_name, 
        u.last_name, 
        u.email, 
        u.phone,
        u.avatar_url
      FROM artisan_requests ar
      INNER JOIN users u ON ar.user_id = u.id
      WHERE ar.status = 'pending'
      ORDER BY ar.created_at DESC
    `);

    return NextResponse.json(res.rows);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed requests" }, { status: 500 });
  }
}

