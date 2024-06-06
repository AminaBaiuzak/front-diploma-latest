export type Order = {
  order_id: number;
  companyName: string;
  phoneNumber: string;
  email: string;
  city: string;
  productName: string;
  totalPrice: number;
  status: string;
  stage: {
    id: number;
    stage: string;
    status: string;
  };
  subRows?: Order[];
};

export type ReviewData = {
  distributor_id: number,
  rating: number,
  text: string,
  product_id: number
}