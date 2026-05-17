export interface Product {
  id: string; // Your frontend uses 'id' instead of Mongo's '_id'
  name: string;
  description: string;
  price: number;
  imageUrl?: string; // We'll map real images here next!
  category?: string;
  stock?: number;
}

// Maps to your Spring Boot CartResponse DTO
export interface CartItemType {
  id: string; // The specific Cart Item ID (used for DELETE)
  productName: string;
  price: number;
  quantity: number;
}

export interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
}

// Maps to your Spring Boot Order Model
export interface Order {
  id: string;
  orderDate: string; // Spring Boot usually sends this as an ISO string
  totalAmount: number;
  status: string; // e.g., "PENDING", "SHIPPED", "DELIVERED"
  items: OrderItem[];
}
