import bcrypt from 'bcryptjs';
import postgres from 'postgres';

// Conexión (serverless-friendly)
const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

// ---------------------------
// USERS SEED
// ---------------------------
async function seedUsers() {
  const users = [
    {
      first_name: 'Carlos',
      last_name: 'Ramírez',
      email: 'carlos@example.com',
      password: 'password123',
      phone: '600111222',
      role: 'user',
      avatar_url: '/placeholder-avatar.jpg'
    },
    {
      first_name: 'Lucía',
      last_name: 'Gómez',
      email: 'lucia@example.com',
      password: 'password123',
      phone: '611222333',
      role: 'artisan',
      avatar_url: '/placeholder-avatar.jpg'
    },
    {
      first_name: 'Miguel',
      last_name: 'Santos',
      email: 'miguel@example.com',
      password: 'password123',
      phone: '622333444',
      role: 'artisan',
      avatar_url: '/placeholder-avatar.jpg'
    }
  ];

  for (const u of users) {
    const hash = await bcrypt.hash(u.password, 10);

    await sql`
      INSERT INTO users (first_name, last_name, email, password_hash, phone, role, avatar_url)
      VALUES (${u.first_name}, ${u.last_name}, ${u.email}, ${hash}, ${u.phone}, ${u.role}, ${u.avatar_url})
      ON CONFLICT (email) DO NOTHING;
    `;
  }

  console.log('✔️ Users seeded');

  const result = await sql`SELECT id, email, role FROM users`;
  return result;
}

// ---------------------------
// ARTISANS SEED
// ---------------------------
async function seedArtisans(userRows: any[]) {
  const artisanUsers = userRows.filter((u) => u.role === 'artisan');

  for (const user of artisanUsers) {
    await sql`
      INSERT INTO artisans (user_id, bio, verified)
      VALUES (${user.id}, 'Experienced artisan specializing in handcrafted work.', true)
      ON CONFLICT (user_id) DO NOTHING;
    `;
  }

  console.log('✔️ Artisans seeded');

  return await sql`SELECT * FROM artisans`;
}

// ---------------------------
// CATEGORIES: already exist in DB, no need to seed here
// ---------------------------

// ---------------------------
// PRODUCTS SEED
// ---------------------------
async function seedProducts(artisans: any[]) {
  const products = [
    {
      name: 'Handwoven Ceramic Bowl',
      price: 45.99,
      description: 'Beautiful handcrafted ceramic bowl.',
      image_url: '/placeholder-product.jpg',
      category_name: 'Pottery'
    },
    {
      name: 'Wooden Cutting Board',
      price: 32.5,
      description: 'Sustainable bamboo cutting board.',
      image_url: '/placeholder-product.jpg',
      category_name: 'Woodwork'
    },
    {
      name: 'Knitted Wool Scarf',
      price: 28.75,
      description: 'Soft merino wool scarf hand-knitted.',
      image_url: '/placeholder-product.jpg',
      category_name: 'Textiles'
    },
    {
      name: 'Glass Vase Set',
      price: 67,
      description: 'Set of 3 hand-blown glass vases.',
      image_url: '/placeholder-product.jpg',
      category_name: 'Glass'
    },
    {
      name: 'Leather Wallet',
      price: 39.99,
      description: 'Handcrafted premium leather wallet.',
      image_url: '/placeholder-product.jpg',
      category_name: 'Leather'
    }
  ];

  // Get category IDs
  const categories = await sql`SELECT id, name FROM categories`;

  for (let i = 0; i < products.length; i++) {
    const p = products[i];
    const artisan = artisans[i % artisans.length]; // alternate artisans

    const category = categories.find((c: any) => c.name === p.category_name);

    await sql`
      INSERT INTO products (artisan_id, category_id, name, description, price, image_url, rating)
      VALUES (${artisan.id}, ${category.id}, ${p.name}, ${p.description}, ${p.price}, ${p.image_url}, 4)
      ON CONFLICT DO NOTHING;
    `;
  }

  console.log('✔️ Products seeded');

  return await sql`SELECT * FROM products`;
}

// ---------------------------
// REVIEWS SEED
// ---------------------------
async function seedReviews(products: any[], users: any[]) {
  for (const product of products) {
    const randomUser = users[Math.floor(Math.random() * users.length)];

    await sql`
      INSERT INTO reviews (product_id, user_id, rating, comment)
      VALUES (${product.id}, ${randomUser.id}, 5, 'Excellent product!')
      ON CONFLICT DO NOTHING;
    `;
  }

  console.log('✔️ Reviews seeded');
}

// ---------------------------
// FAVORITES SEED
// ---------------------------
async function seedFavorites(products: any[], users: any[]) {
  for (const user of users) {
    const randomProduct = products[Math.floor(Math.random() * products.length)];

    await sql`
      INSERT INTO favorites (user_id, product_id)
      VALUES (${user.id}, ${randomProduct.id})
      ON CONFLICT DO NOTHING;
    `;
  }

  console.log('✔️ Favorites seeded');
}

// ---------------------------
// API ROUTE (GET /api/seed)
// ---------------------------
export async function GET() {
  try {
    const users = await seedUsers();
    const artisans = await seedArtisans(users);
    const products = await seedProducts(artisans);

    await seedReviews(products, users);
    await seedFavorites(products, users);

    return Response.json({ message: '✔️ Database seeded successfully' });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
