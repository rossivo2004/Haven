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
}