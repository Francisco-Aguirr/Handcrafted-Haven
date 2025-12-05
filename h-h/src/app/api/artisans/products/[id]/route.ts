import { NextResponse, NextRequest } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/auth";
import { uploadImageToBlob } from "@/lib/blob";

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  console.log("PUT /api/artisans/products/[id] called");

  const { id } = await context.params;
  console.log("PUT - Product ID:", id);

  const session = await auth();
  console.log("PUT - Session user:", session?.user?.id);

  if (!session?.user) {
    console.log("PUT - Unauthorized: no session");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();

    console.log("PUT - FormData entries:");
    for (const [key, value] of formData.entries()) {
      console.log(
        key,
        ":",
        value instanceof File ? `${value.name} (${value.size} bytes)` : value
      );
    }

    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const priceStr = formData.get("price") as string;
    const price = parseFloat(priceStr);
    const imageFile = formData.get("image") as File;
    const existingImageUrl = formData.get("existingImageUrl") as string;

    console.log("PUT - Parsed values:", {
      name,
      description,
      price,
      hasImage: !!imageFile,
      existingImageUrl,
    });

    // Verificar que es artesano
    const artisanQuery = await db.query(
      "SELECT id FROM artisans WHERE user_id = $1 LIMIT 1",
      [session.user.id]
    );

    console.log("PUT - Artisan query:", artisanQuery.rows);

    if (artisanQuery.rows.length === 0) {
      return NextResponse.json(
        { error: "User is not an artisan" },
        { status: 400 }
      );
    }

    const artisanId = artisanQuery.rows[0].id;

    // Verificar propiedad del producto
    const check = await db.query(
      `SELECT p.id, p.image_url 
       FROM products p 
       WHERE p.id = $1 AND p.artisan_id = $2`,
      [id, artisanId]
    );

    console.log("PUT - Ownership check:", check.rows);

    if (check.rows.length === 0) {
      return NextResponse.json(
        {
          error: "Product not found or you don't have permission to edit it",
        },
        { status: 403 }
      );
    }

    let imageUrl = existingImageUrl || check.rows[0].image_url;

    // Subir nueva imagen si existe
    if (imageFile && imageFile.size > 0) {
      try {
        console.log("PUT - Uploading new image...");
        imageUrl = await uploadImageToBlob(imageFile, "products");
      } catch (err) {
        console.error("PUT - Error uploading image:", err);
      }
    }

    // Actualizar producto
    await db.query(
      `UPDATE products 
       SET name = $1, description = $2, price = $3, image_url = $4 
       WHERE id = $5`,
      [name, description || null, price, imageUrl || null, id]
    );

    const updated = await db.query(
      "SELECT * FROM products WHERE id = $1",
      [id]
    );

    return NextResponse.json(updated.rows[0]);
  } catch (error: any) {
    console.error("Error in PUT product:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
