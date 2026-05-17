import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { getCartDetails } from "../services/cartService";
import { useAuth } from "./AuthContext";

interface CartContextType {
  cartCount: number;
  refreshCartCount: () => Promise<void>;
  clearCartCount: () => void;
  isCartOpen: boolean;
  setCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartCount, setCartCount] = useState<number>(0);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const { isAuthenticated } = useAuth(); // Depend on auth state

  const refreshCartCount = async () => {
    if (!isAuthenticated) {
      setCartCount(0);
      return;
    }
    try {
      const items = await getCartDetails();
      // Calculate total quantity or just unique items. The original cart mapped items so let's use length.
      setCartCount(items.length);
    } catch (err) {
      console.error("Failed to fetch cart count", err);
      setCartCount(0);
    }
  };

  const clearCartCount = () => {
    setCartCount(0);
  };

  // Automatically refresh when authentication changes
  useEffect(() => {
    if (isAuthenticated) {
      refreshCartCount();
    } else {
      clearCartCount();
    }
  }, [isAuthenticated]);

  return (
    <CartContext.Provider value={{ 
      cartCount, 
      refreshCartCount, 
      clearCartCount,
      isCartOpen,
      setCartOpen: setIsCartOpen
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
