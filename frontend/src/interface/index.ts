export interface Variant {
  name: string;
  price: number;
  stock: number;
  variant_value: string;
  discount: number;
  DiscountedPrice?: number; // Added optional discountedPrice field
  FlashSalePrice?: number;
  views?: number;
  flash_sales: {
    ProductFlashSaleCount: number;
    StatusFlashSaleStock: string;
    created_at: string;
    end_time: string;
    id: number;
    pivot: {
      discount_percent: number;
      flash_sale_id: number;
      id: number;
      product_variant_id: number;
      sold: number;
      stock: number;
    };
  }[];
  image: string;
  product_id: string | number;
  id: string | number;
  products: string[];
  product?: { // Updated product structure
    ProductVariantCount: number;
    brand: { id: number; name: string; image: string; tag: string };
    category: { id: number; name: string; image: string; tag: string };
    description: string;
    id: number;
    name: string;
    product_images: { // Updated product_images structure
      id: number;
      image: string;
      status: number;
      product_id: number;
    }[]; // Changed to an array of objects with specific fields
    updated_at: string;
    variant_value: string;

  };
  created_at: string;
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
  id: string | number;
}


export interface ProductProps {
  id: number;
  name: string;
  category: string;
  price: number;
  salePrice?: number;
  quantity?: number;
  discount: number;
  image: string[];
  description?: string; // Added optional description field
  select?: boolean; // Added optional description field
  stock?: number; // Added optional
  DiscountedPrice?: number;
  FlashSalePrice?: number;
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



// export interface ItemCart {
//   product: ProductProps,
//   quantity: number,
//   selected?: boolean,
// }

// export interface IOrders {
//   code?: string,
//   products: ItemCart[],
//   totalPayment: number,
//   status: "Chưa xác nhận" | "Đã xác nhận",
// }

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


export type TypeNotify = { name: string, icon: React.ReactNode }

export interface INotify {
  id: number
  dateReceive: string
  type: TypeNotify
  content: string
  seen: boolean
}

// export interface IUser {
//   id: number,
//   fullName: string,
//   nickname?: string,
//   birthday?: string,
//   gender?: "Nam" | "Nữ" | "Khác",
//   country?: string,
//   phoneNumber?: string,
//   email?: string,
//   username?: string,
//   password?: string,
//   avatar?: string,
//   point?: number
// }



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

// export interface IOrders {
//   code?: string,
//   products: ItemCart[],
//   totalPayment: number,
//   status: "Chưa xác nhận" | "Đã xác nhận",
// }

// export interface IOrders {
//   code?: string,
//   products: ItemCart[],
//   totalPayment: number,
//   status: "Chưa xác nhận" | "Đã xác nhận",
// }

export interface CartItem {
  user_id: number | null;
  product_variant_id: number;
  quantity: number;
  product_variant: {
    name?: string; // Optional name of the product
    image?: string; // Optional image URL of the product
    price?: number; // Optional price of the product
    discount?: number; // Optional discount percentage
    FlashSalePrice?: number; // Optional flash sale price
    DiscountedPrice?: number; // Optional discounted price
    id?: number; // Optional ID of the product
    priceMain?: number; // Optional price of the product
    flash_sales: {
      ProductFlashSaleCount: number;
      StatusFlashSaleStock: string;
      created_at: string;
      end_time: string;
      id: number;
      pivot: {
        discount_percent: number;
        flash_sale_id: number;
        id: number;
        product_variant_id: number;
        sold: number;
        stock: number;
      };
    }[];
  }
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

export interface OrderTracking {
  id: number;
  invoice_code: string;
  refunded_stock: number;
  full_name: string;
  address: string;
  created_at: string;
  district: string;
  email: string;
  phone: string;
  province: string;
  ward: string;
  total: number;
  status: string;
  payment_method: string;
  payment_status: string;
  payment_transport: string;
  user: {
    id: number;
    full_name: string;
    address: string;
    created_at: string;
    email: string;
    phone: string;
    role_id: number;
    status: string;
    image: string | null;
    points: number;
    facebook_id: string | null;
    google_id: string | null;
    ward: string;
    district: string;
    province: string;
    updated_at: string;
  };
  order_details: {
    id: number;
    quantity: number;
    price: number;
    order_id: number;
    product_variant_id: number;
    product_variant: {
      id: number;
      name: string;
      image: string;
    }
  }[];
  updated_at: string;
}


// export interface CartItem {
//   id: number;
//   name: string;
//   price: number;
//   salePrice: number;
//   quantity: number;
//   discount: number;
//   images: string[];
//   description?: string; // Added optional description field
//   select: boolean; // Added optional description field
//   stock: number; // Added optional
// }


// export interface ItemCart {
//   user_id: number | null;
//   product_variant
//   : ProductProps,
//   quantity: number,
//   selected?: boolean,
// }

export interface User {
  id?: number;
  name?: string;
  email?: string;
  password?: string;
  google_id?: string | null;
  facebook_id?: string | null;
  image?: string | null;
  phone?: string ;
  address?: string;
  status?: string;
  point: number;
  created_at?: string;
  updated_at?: string;
  role_id: number;
  role: {
      id: number;
      name: string;
      created_at: string | null;
      updated_at: string | null;
  };
}

export interface FavouriteItem {
  id: number;
  product_id: number;
  image: string;
  name: string;
  DiscountedPrice: number;
  Favored: boolean;
  FlashSalePrice: number;
  QuantityInCart: number;
  StatusStock: string;
  storedCart: boolean;
  created_at: string;
  discount: boolean;
  // flash_sales: FlashSale[];
  // product: Product;
  price: number;
  stock: number;
  updated_at: string;
  variant_value: string;
  view: number;
}