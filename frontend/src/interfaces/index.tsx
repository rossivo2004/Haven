export interface ProductProps {
  id: number;
  name: string;
  image: string;
  price: number;
  discount?: number;
  category: string;
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