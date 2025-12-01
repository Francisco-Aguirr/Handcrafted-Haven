import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { requestId } = await req.json();

    await db.query("DELETE FROM artisan_requests WHERE id = $1", [requestId]);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed reject" }, { status: 500 });
  }
}
