// src/app/api/favorites/route.ts
import { NextResponse } from "next/server";
import { auth as getAuth } from "@/auth";

import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

// GET — Obtener favoritos del usuario logueado
export async function GET() {
  const session = await getAuth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const rows = await sql`
    SELECT p.*
    FROM favorites f
    JOIN products p ON p.id = f.product_id
    WHERE f.user_id = ${session.user.id};
  `;

  return NextResponse.json(rows);
}

// POST — Añadir favorito
export async function POST(req: Request) {
 const session = await getAuth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { productId } = await req.json();

  await sql`
    INSERT INTO favorites (user_id, product_id)
    VALUES (${session.user.id}, ${productId})
    ON CONFLICT DO NOTHING;
  `;

  return NextResponse.json({ success: true });
}

// DELETE — Eliminar favorito
export async function DELETE(req: Request) {
  const session = await getAuth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const productId = searchParams.get("productId");

  if (!productId) {
    return NextResponse.json({ error: "Missing productId" }, { status: 400 });
  }

  await sql`
    DELETE FROM favorites
    WHERE user_id = ${session.user.id}
    AND product_id = ${productId};
  `;

  return NextResponse.json({ success: true });
}
