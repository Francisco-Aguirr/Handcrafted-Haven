// src/app/api/artisans/products/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/auth";
import { uploadImageToBlob } from "@/lib/blob";

export async function GET() {
  const session = await auth();
  console.log('GET products - Session user:', session?.user?.id);
  
  if (!session?.user) {
    console.log('GET products - No session');
    return NextResponse.json([], { status: 200 });
  }

  const r = await db.query("SELECT id FROM artisans WHERE user_id = $1 LIMIT 1", [session.user.id]);
  if (r.rows.length === 0) {
    console.log('GET products - No artisan profile for user:', session.user.id);
    return NextResponse.json([], { status: 200 });
  }

  const artisanId = r.rows[0].id;
  console.log('GET products - Artisan ID:', artisanId);
  
  const res = await db.query("SELECT * FROM products WHERE artisan_id = $1 ORDER BY created_at DESC", [artisanId]);
  console.log('GET products - Found:', res.rows.length, 'products');
  
  return NextResponse.json(res.rows);
}

export async function POST(req: Request) {
  console.log('POST /api/artisans/products called');
  
  const session = await auth();
  console.log('POST - Session user:', session?.user?.id);
  
  if (!session?.user) {
    console.log('POST - Unauthorized: no session');
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    
    console.log('POST - FormData entries:');
    for (const [key, value] of formData.entries()) {
      console.log(key, ':', value instanceof File ? `${value.name} (${value.size} bytes)` : value);
    }
    
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const priceStr = formData.get('price') as string;
    const price = parseFloat(priceStr);
    const imageFile = formData.get('image') as File;
    const category_id = formData.get('category_id') as string;

    console.log('POST - Parsed values:', { name, description, price, hasImage: !!imageFile });

    if (!name || isNaN(price)) {
      console.log('POST - Invalid input:', { name, price });
      return NextResponse.json({ 
        error: "Invalid input",
        details: { name: !!name, price: !isNaN(price) }
      }, { status: 400 });
    }

    // Verificar que el usuario sea artesano
    const r = await db.query("SELECT id FROM artisans WHERE user_id = $1 LIMIT 1", [session.user.id]);
    console.log('POST - Artisan query result:', r.rows);
    
    if (r.rows.length === 0) {
      console.log('POST - No artisan profile for user:', session.user.id);
      return NextResponse.json({ error: "No artisan profile" }, { status: 400 });
    }

    const artisanId = r.rows[0].id;
    let imageUrl = null;

    // Subir imagen si existe
    if (imageFile && imageFile.size > 0) {
      try {
        console.log('POST - Uploading image to blob...');
        console.log('Image file details:', {
          name: imageFile.name,
          size: imageFile.size,
          type: imageFile.type
        });
        
        imageUrl = await uploadImageToBlob(imageFile, 'products');
        console.log('POST - Image uploaded successfully, URL:', imageUrl);
      } catch (error: any) {
        console.error("POST - Error uploading image:", error);
        // Continuar sin imagen
        console.log('POST - Continuing without image due to upload error');
      }
    } else {
      console.log('POST - No image file provided');
    }

    console.log('POST - Inserting product into DB with:', {
      artisanId, name, description, price, imageUrl
    });

    // Insertar producto en la base de datos
    const insert = await db.query(
      `INSERT INTO products (artisan_id, name, description, price, image_url, category_id) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING *`,
      [artisanId, name, description || null, price, imageUrl || null, category_id || null]
    );

    console.log('POST - Product inserted:', insert.rows[0]);
    return NextResponse.json(insert.rows[0], { status: 201 });

  } catch (error: any) {
    console.error("Error in POST products:", error);
    console.error("Error stack:", error.stack);
    
    return NextResponse.json({ 
      error: "Internal server error",
      details: error.message 
    }, { status: 500 });
  }
}