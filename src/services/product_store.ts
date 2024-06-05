import axios from "axios";

const getStoreProducts = async (token: string) => {
  const response = await axios.get(process.env.NEXT_PUBLIC_URL + "/api/store/products", {
    headers: {
      Authorization: "Bearer " + token,
    },
    params: {
      page: 100,
      pageSize: 10,
    },
  });
  return response.data;
};

const getStoreProductById = async (items: { id: string; token: string }) => {
  const response = await axios.get(process.env.NEXT_PUBLIC_URL + `/api/store/products/${items.id}`, {
    headers: {
      Authorization: "Bearer " + items.token,
    },
  });
  return response.data;
};

const addToCart = async (items: { formData: { quantity: number }; token: string; id: string }) => {
  const response = await axios.post(
    process.env.NEXT_PUBLIC_URL + `/api/store/carts/products/${items.id}`,
    items.formData,
    {
      headers: {
        Authorization: "Bearer " + items.token,
      },
    }
  );
  return response.data;
};

const getCarts = async (token: string) => {
  const response = await axios.get(process.env.NEXT_PUBLIC_URL + "/api/store/carts", {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
  return response.data;
};

const updateCartItem = async (items: { formData: { quantity: number }; token: string; id: string }) => {
  const response = await axios.put(
    process.env.NEXT_PUBLIC_URL + `/api/store/carts/products/${items.id}`,
    items.formData,
    {
      headers: {
        Authorization: "Bearer " + items.token,
      },
    }
  );
  return response.data;
};

const deleteCartItem = async (items: { token: string; id: string }) => {
  const response = await axios.delete(process.env.NEXT_PUBLIC_URL + `/api/store/carts/products/${items.id}`, {
    headers: {
      Authorization: "Bearer " + items.token,
    },
  });
  return response.data;
};

export { getStoreProducts, getStoreProductById, addToCart, getCarts, updateCartItem, deleteCartItem };
