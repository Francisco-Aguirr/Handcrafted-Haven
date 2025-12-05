// src/app/api/artisans/profile/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/auth";
import { uploadImageToBlob } from "@/lib/blob";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json(null);

  const r = await db.query(
    `SELECT a.id, a.bio, a.verified, u.avatar_url
     FROM artisans a
     JOIN users u ON u.id = a.user_id
     WHERE a.user_id = $1 LIMIT 1`,
    [session.user.id]
  );

  if (r.rows.length === 0) return NextResponse.json(null);
  const row = r.rows[0];
  return NextResponse.json({
    id: row.id,
    bio: row.bio,
    verified: row.verified,
    avatar_url: row.avatar_url,
  });
}

export async function PUT(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const formData = await req.formData();
    const bio = formData.get('bio') as string;
    const avatarFile = formData.get('avatar') as File;
    const existingAvatarUrl = formData.get('existingAvatarUrl') as string;

    let avatarUrl = existingAvatarUrl;

    // Si se subió una nueva imagen de perfil
    if (avatarFile && avatarFile.size > 0) {
      try {
        avatarUrl = await uploadImageToBlob(avatarFile, 'avatars');
      } catch (error) {
        console.error("Error uploading avatar:", error);
        // Mantener la imagen anterior si falla
      }
    }

    // Actualizar bio en artisans y avatar en users
    await db.query(
      "UPDATE artisans SET bio = $1 WHERE user_id = $2", 
      [bio || null, session.user.id]
    );
    
    await db.query(
      "UPDATE users SET avatar_url = $1 WHERE id = $2", 
      [avatarUrl || null, session.user.id]
    );

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Error in PUT profile:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
