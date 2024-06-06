export type RegistrationData = {
  email: string;
  password: string;
  role: "store" | "distributor";
  name: string;
  company_name: string;
  details?: string;
  phone_number: string;
  city: string;
  bin: string;
};

export type LoginData = {
  email: string;
  password: string;
  role: "store" | "admin" | "distributor" | "";
};

export type IProfile = {
  distributor: {
    id: number;
    name: string;
    company_name: string;
    details: string;
    phone_number: string;
    city: string;
    bin: string;
    user_id: number;
    img_url: string;
  };
};

export type IUpdateProfile = {
  name: string;
  company_name: string;
  details: string;
  phone_number: string;
  city: string;
  bin: string;
  img_url: string;
};

export type IUpdatePassword = {
  current_password: string;
  new_password: string;
};

export type IUpdateEmail = {
  password: string;
  email: string;
};

export type IAdminList = {
  id: number;
  company_name: string;
  name: string;
  is_active: boolean;
  role: "store" | "distributor";
  img_url: string;
  subRows?: IAdminList[];
};