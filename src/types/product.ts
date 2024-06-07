import { IProfile } from "./auth";

export type IProduct = {
  id: number;
  product_name: string;
  product_description: string;
  price: number;
  ImgURLs: string[] | [];
  minimum_quantity: number;
  distributor_id: number;
  distributor: IProfile;
  stock: number;
};

export type IProductUpdate = {
  product_name: string;
  product_description: string;
  price: number;
  ImgURLs: string[] | [];
  stock: number;
  city: string;
  category: string;
};

export type IProductSell = {
  product: {
    ImgURLs: string[] | null;
    product_name: string;
    stock: number;
    price: number;
  }
  quantity: number;
  order_id: number;
  subRows?: IProductSell[];
  total_price?: number;
  product_id?: string;
};