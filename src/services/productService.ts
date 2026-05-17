import API from "../api/axios";

// ✅ Get all products (alias: fetchAllProducts)
export const getAllProducts = async () => {
  const res = await API.get("/products");
  return res.data;
};

export const fetchAllProducts = getAllProducts;

// ✅ Get product by ID (alias: fetchProductById)
export const getProductById = async (id: string | undefined) => {
  const res = await API.get(`/products/${id}`);
  return res.data;
};

export const fetchProductById = getProductById;

// ✅ Delete product
export const deleteProduct = async (id: string) => {
  const res = await API.delete(`/products/${id}`);
  return res.data;
};

// ✅ Unified Search: Single service call for both departments
export const searchProducts = async (query: string) => {
  const res = await API.get(`/products/search?q=${query}`);
  return res.data;
};