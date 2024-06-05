import axios from "axios";

const getOrders = async (token: string) => {
  const response = await axios.get(process.env.NEXT_PUBLIC_URL + "/api/distributor/orders", {
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

const getStatistics = async (token: string) => {
  const response = await axios.get(process.env.NEXT_PUBLIC_URL + "/api/distributor/orders/sold", {
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

const updateStatus = async (items: { formData: { stage_status: "success" | "warning" | "error" }; token: string; id: string }) => {
  const response = await axios.put(process.env.NEXT_PUBLIC_URL + `/api/distributor/orders/${items.id}`, items.formData, {
    headers: {
      Authorization: "Bearer " + items.token,
    },
  });
  return response.data;
};

export { getOrders, getStatistics, updateStatus };
