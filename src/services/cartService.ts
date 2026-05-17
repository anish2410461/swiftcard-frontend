import API from "../api/axios";

export const addToCart = async (data: {
  productId: string;
  quantity: number;
  color?: string;
  size?: string;
}) => {
  const res = await API.post("/cart", data);
  return res.data;
};

export const getCartDetails = async () => {
  const res = await API.get("/cart/detail");
  return res.data;
};

export const getCartTotal = async () => {
  const res = await API.get("/cart/total");
  return res.data;
};

export const removeCartItem = async (id: string) => {
  return API.delete(`/cart/${id}`);
};

export const updateCartItemQuantity = async (id: string, quantity: number) => {
  const res = await API.put(`/cart/${id}?quantity=${quantity}`);
  return res.data;
};