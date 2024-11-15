export interface Category {
    id: string;
    name: string;
    tag: string;
    image: string;
}

export interface Brand {
    id: string;
    name: string;
    tag: string;
    image: string;
}

export interface ProductImage {
    id: number;
    image: string;
    status: number;
    product_id: number;
    created_at: string;
    updated_at: string;
    url: string;
  }
  
export interface Product {
    id: number;
    name: string;
    description: string;
    category_id: number;
    brand_id: number;
    brand: { id: number; name: string; image: string; tag: string };
    category: { id: number; name: string; image: string; tag: string };
    created_at: string;
    updated_at: string;
    ProductVariantCount: number;
    product_images: ProductImage[];
  }

export interface Product1 {
    id: number;
    name: string;
    description: string;
    category_id: number;
    brand_id: number;
    brand: { id: number; name: string; image: string; tag: string };
    category: { id: number; name: string; image: string; tag: string };
    created_at: string;
    updated_at: string;
    ProductVariantCount: number;
    product_images: ProductImage[];
    price: string;
    stock: string;
    discount: string;
    variant_value: string;
  }
  
export interface FlashSale {
    id: number;
    image: string;
    name: string;
    price: string;
}

export interface ProductVa {
  DiscountedPrice: number;
  FlashSalePrice: string;
  StatusStock: string;
  created_at: string;
  discount: string;
  flash_sales: FlashSale[];
  id: number;
  image: string;
  name: string;
  price: string;
  product: Product;
  stock: string;  
  variant_value: string;
  newImage?: File;
}

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  google_id: string | null;
  facebook_id: string | null;
  image: string | null;
  phone: string | null;
  address: string | null;
  status: string;
  point: number;
  created_at: string;
  updated_at: string;
  role_id: number;
  role: {
      id: number;
      name: string;
      created_at: string | null;
      updated_at: string | null;
  };
}

export interface Role {
  id: number;
  name: string;
}

export interface Order {
  id: number;
  invoice_code: string;
  refunded_stock: number;
  full_name: string;
  phone: string;
  email: string;
  total: string;
  status: string;
  province: string;
  district: string;
  ward: string;
  address: string;
  payment_transpot: string;
  payment_method: string;
  payment_status: string;
  user_id: number;
  created_at: string; // Consider using Date type if you will handle dates
  updated_at: string; // Consider using Date type if you will handle dates
}