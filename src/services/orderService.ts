import API from "../api/axios";

export const placeOrder = async () => {
  const res = await API.post("/orders");
  return res.data;
};

export const getOrders = async () => {
  const res = await API.get("/orders");
  return res.data;
};

export const fetchAllOrders = async () => {
  const res = await API.get('/orders/all');
  return res.data;
};

export const updateOrderStatus = async (orderId: string, status: string) => {
  const res = await API.put(`/orders/${orderId}/status?status=${status}`);
  return res.data;
};
