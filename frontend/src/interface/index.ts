export interface Variant {
  name: string;
  price: number;
  stock: number;
  variantValue: string;
  discount: number;
  discountedPrice?: number; // Added optional discountedPrice field
  flash_sales: any[]; // Added flash_sales as an array of any type
  image: string;
  product_id: string | number;
  products: string[];
  product?: { // Added optional product field
    ProductVariantCount: number;
    brand: { id: number; name: string; image: string ; tag: string };
    category: { id: number; name: string; image: string ; tag: string };
    description: string;
    id: number;
    name: string;
    product_images: { img: string }[];
    updated_at: string;
    variant_value: string;
  };
}
export interface Product {
  id: string;
  name: string;
  category: string;
  brand: string;
  variants: Variant[];
}

export interface SingleProduct {
  name: string;
  price: string;
  stock: string;
  variantValue: string;
  discount: string;
  image: File[];
  product_id: string | number;
}


export interface ProductProps {
  id: number;
  name: string;
  category: string;
  price: number;
  salePrice?: number;
  quantity?: number;
  discount: number;
  images: string[];
  description?: string; // Added optional description field
  select?: boolean; // Added optional description field
  stock?: number; // Added optional
}

export interface CartItem {
  id: number;
  name: string;
  price: number;
  salePrice: number;
  quantity: number;
  discount: number;
  images: string[];
  description?: string; // Added optional description field
  select: boolean; // Added optional description field
  stock: number; // Added optional
}

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

export interface Blog {
  id: number;
  name: string;
  img: string;
  date_created: string;
  date_edit: string;
  description: string;
  content: {
    title: string;
    content_c: string;
    img: { img_c: string }[];
  }[];
  view: number;
}

export interface IPromotion {
  id: number,
  discount: "10k" | "20k" | "30k" | "50k" | "100k" | "300k"
  forOrderTo: "500k" | "1 triệu" | "2 triệu" | "3 triệu"
  startDate: string,
  endDate: string,
}

export type TypeNotify = { name: string, icon: React.ReactNode }

export interface INotify {
  id: number
  dateReceive: string
  type: TypeNotify
  content: string
  seen: boolean
}

export interface IUser {
  id: number,
  fullName: string,
  nickname?: string,
  birthday?: string,
  gender?: "Nam" | "Nữ" | "Khác",
  country?: string,
  phoneNumber?: string,
  email?: string,
  username?: string,
  password?: string,
  avatar?: string,
  point?: number
}



export interface ItemCart {
  product: ProductProps,
  quantity: number,
  selected?: boolean,
}

export interface IOrders {
  code?: string,
  products: ItemCart[],
  totalPayment: number,
  status: "Chưa xác nhận" | "Đã xác nhận",
}

export interface Params {
  id: string;
}

export interface Store {
  id: number;
  name: string;
  img: string;
  date_created: string;
  date_edit: string;
  description: string;
  content: {
    title: string;
    content_c: string;
    img: { img_c: string }[];
  }[];
  view: number;
}


export interface BoxProps {
  store: Store;
  variant: 'dark' | 'light';
}

export interface IOrders {
  code?: string,
  products: ItemCart[],
  totalPayment: number,
  status: "Chưa xác nhận" | "Đã xác nhận",
}
