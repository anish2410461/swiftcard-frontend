import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCartDetails, getCartTotal, removeCartItem } from "../services/cartService";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

interface CartItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  mainImage?: string;       // Base64 string (auto-serialised by Spring Boot)
  mainImageType?: string;
}

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();
  const { refreshCartCount } = useCart();
  const navigate = useNavigate();

  // Fetch cart whenever the sidebar opens
  useEffect(() => {
    if (isOpen && isAuthenticated) {
      fetchCart();
    }
    if (isOpen && !isAuthenticated) {
      setItems([]);
      setTotal(0);
    }
  }, [isOpen, isAuthenticated]);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const [cartData, cartTotal] = await Promise.all([
        getCartDetails(),
        getCartTotal(),
      ]);
      setItems(cartData);
      setTotal(cartTotal);
    } catch (err) {
      console.error("Failed to load cart:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (itemId: string) => {
    try {
      await removeCartItem(itemId);
      // Optimistically remove from UI, then refresh count
      setItems((prev) => {
        const updated = prev.filter((i) => i.id !== itemId);
        // Recalculate total locally
        setTotal(updated.reduce((sum, i) => sum + i.subtotal, 0));
        return updated;
      });
      refreshCartCount();
    } catch (err) {
      console.error("Failed to remove item:", err);
    }
  };

  const handleCheckout = () => {
    onClose();
    navigate("/checkout");
  };

  return (
    <>
      {/* Dark backdrop */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Sidebar panel */}
      <aside
        className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white z-50 flex flex-col shadow-2xl transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <h2 className="text-xl font-bold tracking-tight text-gray-900">
            Your Cart
            {items.length > 0 && (
              <span className="ml-2 text-sm font-normal text-gray-400">
                ({items.length} {items.length === 1 ? "item" : "items"})
              </span>
            )}
          </h2>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition text-gray-500 hover:text-gray-900"
            aria-label="Close cart"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* ── Body ── */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {!isAuthenticated ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/>
                <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
              </svg>
              <p className="text-gray-500 text-sm">Log in to view your cart</p>
              <button
                onClick={() => { onClose(); navigate("/login"); }}
                className="px-5 py-2.5 bg-black text-white text-sm font-semibold rounded-xl hover:bg-gray-800 transition"
              >
                Log In
              </button>
            </div>
          ) : loading ? (
            <div className="flex flex-col gap-5 mt-2">
              {[1, 2, 3].map((n) => (
                <div key={n} className="flex gap-4 animate-pulse">
                  <div className="w-20 h-20 bg-gray-100 rounded-xl flex-shrink-0" />
                  <div className="flex-1 space-y-2 py-1">
                    <div className="h-3 bg-gray-100 rounded w-3/4" />
                    <div className="h-3 bg-gray-100 rounded w-1/2" />
                    <div className="h-3 bg-gray-100 rounded w-1/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/>
                <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
              </svg>
              <p className="text-gray-500 text-sm">Your cart is empty</p>
            </div>
          ) : (
            <ul className="flex flex-col divide-y divide-gray-100">
              {items.map((item) => (
                <li key={item.id} className="flex gap-4 py-4">
                  {/* Thumbnail */}
                  <div className="w-20 h-20 rounded-xl bg-gray-50 overflow-hidden flex-shrink-0 border border-gray-100">
                    {item.mainImage && item.mainImageType ? (
                      <img
                        src={`data:${item.mainImageType};base64,${item.mainImage}`}
                        alt={item.productName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <p
                      className="font-semibold text-sm text-gray-900 truncate cursor-pointer hover:underline"
                      onClick={() => { onClose(); navigate(`/products/${item.productId}`); }}
                    >
                      {item.productName}
                    </p>
                    <p className="text-gray-400 text-xs mt-0.5">Qty: {item.quantity}</p>
                    <p className="text-gray-900 font-bold text-sm mt-1">
                      ₹{item.subtotal.toLocaleString("en-IN")}
                    </p>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="self-start mt-1 p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition"
                    title="Remove"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/>
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* ── Footer ── */}
        {isAuthenticated && items.length > 0 && (
          <div className="border-t border-gray-100 px-6 py-5 bg-white space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-500 text-sm font-medium">Total</span>
              <span className="text-xl font-bold text-gray-900">
                ₹{total.toLocaleString("en-IN")}
              </span>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full bg-black text-white py-3.5 rounded-xl text-sm font-semibold hover:bg-gray-800 active:scale-[0.99] transition disabled:opacity-60 flex items-center justify-center gap-2"
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
