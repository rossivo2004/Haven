export interface Product {
    id: number;
    name: string;
    price: number;
    description?: string;
    category: string;
    images: string[];
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
  image: string;
  name: string;
  tag: string;
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
  
  // types/voucher.ts
export interface Voucher {
  id: string;
  code: string;
  discount: number; // hoặc kiểu dữ liệu phù hợp khác
}