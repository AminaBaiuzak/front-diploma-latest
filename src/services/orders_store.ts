import axios from "axios";

const createOrder = async (items: { formData: any; token: string }) => {
  const response = await axios.post(process.env.NEXT_PUBLIC_URL + `/api/store/orders`, items.formData, {
    headers: {
      Authorization: "Bearer " + items.token,
    },
  });
  return response.data;
};

const getStoreOrders = async (token: string) => {
  const response = await axios.get(process.env.NEXT_PUBLIC_URL + "/api/store/orders", {
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

const getStoreStatistics = async (token: string) => {
  const response = await axios.get(process.env.NEXT_PUBLIC_URL + "/api/store/orders/purchased", {
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

const updateStatusStore = async (items: { token: string; id: string }) => {
  const response = await axios.put(
    process.env.NEXT_PUBLIC_URL + `/api/store/orders/${items.id}`,
    {},
    {
      headers: {
        Authorization: "Bearer " + items.token,
      },
    }
  );
  return response.data;
};

export { createOrder, getStoreOrders, getStoreStatistics, updateStatusStore };
