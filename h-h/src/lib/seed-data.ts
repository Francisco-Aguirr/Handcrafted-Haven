// src/lib/seed-data.ts
export const seedUsers = [
  {
    id: "11111111-1111-1111-1111-111111111111",
    first_name: "Alice",
    last_name: "Rivera",
    email: "alice@example.com",
    password: "password123",
  },
  {
    id: "22222222-2222-2222-2222-222222222222",
    first_name: "Brandon",
    last_name: "Lopez",
    email: "brandon@example.com",
    password: "password123",
  },
  {
    id: "33333333-3333-3333-3333-333333333333",
    first_name: "Carla",
    last_name: "Martinez",
    email: "carla@example.com",
    password: "password123",
  },
];

export const seedArtisans = [
  {
    id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
    user_id: "11111111-1111-1111-1111-111111111111",
    bio: "Ceramic artist specializing in handmade bowls and vases.",
    avatar_url: "/placeholder-avatar.jpg",
  },
  {
    id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
    user_id: "22222222-2222-2222-2222-222222222222",
    bio: "Woodworking artisan crafting boards and utensils.",
    avatar_url: "/placeholder-avatar.jpg",
  },
];

export const seedCategories = [
  { id: "c1c1c1c1-c1c1-c1c1-c1c1-c1c1c1c1c1c1", name: "Ceramics" },
  { id: "c2c2c2c2-c2c2-c2c2-c2c2-c2c2c2c2c2c2", name: "Woodwork" },
  { id: "c3c3c3c3-c3c3-c3c3-c3c3-c3c3c3c3c3c3", name: "Textiles" },
  { id: "c4c4c4c4-c4c4-c4c4-c4c4-c4c4c4c4c4c4", name: "Glass" },
  { id: "c5c5c5c5-c5c5-c5c5-c5c5-c5c5c5c5c5c5", name: "Jewelry" },
];

export const seedProducts = [
  {
    id: "p1p1p1p1-p1p1-p1p1-p1p1-p1p1p1p1p1p1",
    artisan_id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
    category_id: "c1c1c1c1-c1c1-c1c1-c1c1-c1c1c1c1c1c1",
    name: "Handcrafted Ceramic Bowl",
    description: "A beautifully handcrafted bowl perfect for daily use.",
    price: 45.99,
    image_url: "/products/bowl.jpg",
  },
  {
    id: "p2p2p2p2-p2p2-p2p2-p2p2-p2p2p2p2p2p2",
    artisan_id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
    category_id: "c4c4c4c4-c4c4-c4c4-c4c4-c4c4c4c4c4c4",
    name: "Hand-blown Glass Vase",
    description: "Elegant glass vase made by hand.",
    price: 60.0,
    image_url: "/products/vase.jpg",
  },
  {
    id: "p3p3p3p3-p3p3-p3p3-p3p3-p3p3p3p3p3p3",
    artisan_id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
    category_id: "c2c2c2c2-c2c2-c2c2-c2c2-c2c2c2c2c2c2",
    name: "Wooden Cutting Board",
    description: "Durable board made from sustainable wood.",
    price: 35.0,
    image_url: "/products/board.jpg",
  },
  {
    id: "p4p4p4p4-p4p4-p4p4-p4p4-p4p4p4p4p4p4",
    artisan_id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
    category_id: "c2c2c2c2-c2c2-c2c2-c2c2-c2c2c2c2c2c2",
    name: "Handcrafted Wooden Spoon",
    description: "Smooth wooden spoon perfect for cooking.",
    price: 12.0,
    image_url: "/products/spoon.jpg",
  },
  {
    id: "p5p5p5p5-p5p5-p5p5-p5p5-p5p5p5p5p5p5",
    artisan_id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
    category_id: "c3c3c3c3-c3c3-c3c3-c3c3-c3c3c3c3c3c3",
    name: "Knitted Wool Scarf",
    description: "Warm and soft scarf knitted by hand.",
    price: 28.0,
    image_url: "/products/scarf.jpg",
  },
];

export const seedReviews = seedProducts.map((product, index) => ({
  id: `r${index + 1}r${index + 1}r${index + 1}r${index + 1}`,
  product_id: product.id,
  user_id: seedUsers[index % seedUsers.length].id,
  rating: 5,
  comment: "Amazing craftsmanship!",
}));

export const seedFavorites = seedUsers.map((user, index) => ({
  id: `f${index + 1}f${index + 1}f${index + 1}f${index + 1}`,
  user_id: user.id,
  product_id: seedProducts[index].id,
}));
