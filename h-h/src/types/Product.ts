export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  rating: number;        // 1–5
  artisan: {
    id: string;
    name: string;
    avatar: string;      // URL
  };
}
