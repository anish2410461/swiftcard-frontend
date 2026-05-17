import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getCartDetails,
  getCartTotal,
  removeCartItem,
  updateCartItemQuantity,
} from "../services/cartService";
import { useCart } from "../context/CartContext";

const Cart = () => {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [subtotal, setSubtotal] = useState(0);
  const { refreshCartCount } = useCart();

  const fetchCart = async () => {
    try {
      const items = await getCartDetails();
      const totalVal = await getCartTotal();

      setCartItems(items);
      setSubtotal(totalVal);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleRemove = async (id: string) => {
    try {
      await removeCartItem(id);
      fetchCart();
      refreshCartCount();
    } catch (err) {
      console.error("Failed to delete item:", err);
      console.error("Failed to delete item. Your session might have expired.");
    }
  };

  const handleUpdateQuantity = async (id: string, newQuantity: number) => {
    if (newQuantity < 1) {
      handleRemove(id);
      return;
    }
    try {
      await updateCartItemQuantity(id, newQuantity);
      fetchCart();
      refreshCartCount();
    } catch (err) {
      console.error("Failed to update quantity:", err);
    }
  };

  const shipping = 0; // Free for premium look
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  return (
    <>
      <div className="bg-slate-50 min-h-screen pt-12 pb-24 font-sans">
        <div className="container mx-auto px-6 max-w-7xl">
          
          {/* Header */}
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Your Shopping Bag</h1>
          <p className="text-slate-500 mb-10">Items are reserved for 60 minutes.</p>

          <div className="flex flex-col lg:flex-row gap-12">
            
            {/* LEFT: Item List */}
            <div className="flex-1 space-y-8">
              {cartItems.length === 0 ? (
                <div className="bg-white rounded-3xl p-10 text-center border border-slate-100 shadow-sm">
                  <svg className="w-16 h-16 mx-auto text-slate-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Your bag is empty</h3>
                  <p className="text-slate-500 mb-6">Explore the highest quality products curated just for you.</p>
                  <Link to="/" className="inline-block px-8 py-3 bg-blue-600 text-white font-bold rounded-2xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition">
                    Continue Shopping
                  </Link>
                </div>
              ) : (
                cartItems.map((item) => {
                  const price = item.price || item.unitPrice || item.productPrice || 0;
                  const itemId = item.id || item.cartItemId || item._id;
                  
                  // Use backend image bytes if available, otherwise fallback to premium placeholder
                  let imageSrc = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=500&auto=format&fit=crop";
                  if (item.mainImage && item.mainImageType) {
                    imageSrc = `data:${item.mainImageType};base64,${item.mainImage}`;
                  }

                  return (
                    <div key={itemId} className="flex flex-col sm:flex-row gap-6 pb-8 border-b border-slate-200 group">
                      {/* Product Image */}
                      <div className="w-full sm:w-40 h-48 bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 flex-shrink-0">
                        <img src={imageSrc} alt={item.productName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start mb-1">
                            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">
                              {item.category || "TECH ATELIER"}
                            </span>
                            <span className="text-xl font-bold text-slate-900">₹{price.toFixed(2)}</span>
                          </div>
                          <h3 className="text-2xl font-bold text-slate-800 mb-2">{item.productName}</h3>
                          <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 text-sm text-slate-500">
                            <p>Quantity: <span className="text-slate-900 font-medium">{item.quantity}</span></p>
                            <p>Subtotal: <span className="text-slate-900 font-medium">₹{(price * item.quantity).toFixed(2)}</span></p>
                          </div>
                          <p className="text-xs mt-3 font-semibold text-green-600">
                            ● In Stock & Ready to Ship
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-4 gap-4 sm:gap-0">
                          <div className="flex items-center bg-slate-100 rounded-full px-2 py-1">
                            <button 
                              onClick={() => handleUpdateQuantity(itemId, item.quantity - 1)}
                              className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-blue-600 transition-colors"
                            >
                              -
                            </button>
                            <span className="px-4 text-sm font-bold">{item.quantity}</span>
                            <button 
                              onClick={() => handleUpdateQuantity(itemId, item.quantity + 1)}
                              className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-blue-600 transition-colors"
                            >
                              +
                            </button>
                          </div>
                          <div className="flex flex-wrap gap-4 sm:gap-6">
                            <button className="text-xs font-bold text-slate-400 hover:text-slate-900 uppercase tracking-widest flex items-center gap-2">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                              Save for Later
                            </button>
                            <button onClick={() => handleRemove(itemId)} className="text-xs font-bold text-red-400 hover:text-red-600 uppercase tracking-widest flex items-center gap-2 transition">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* RIGHT: Order Summary */}
            {cartItems.length > 0 && (
              <div className="lg:w-96">
                <div className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 sticky top-8 border border-slate-100">
                  <h2 className="text-2xl font-bold text-slate-900 mb-8">Order Summary</h2>
                  
                  <div className="space-y-4 mb-8">
                    <div className="flex justify-between text-slate-500 font-medium">
                      <span>Subtotal</span>
                      <span className="text-slate-900">₹{subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-slate-500 font-medium">
                      <span>Shipping</span>
                      <span className="text-green-600 font-bold">Free Premium Delivery</span>
                    </div>
                    <div className="flex justify-between text-slate-500 font-medium">
                      <span>Estimated Tax (8%)</span>
                      <span className="text-slate-900">₹{tax.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-slate-100 flex justify-between items-end mb-10">
                    <span className="text-lg font-bold text-slate-900 uppercase tracking-widest">Total</span>
                    <span className="text-4xl font-black text-blue-600">₹{total.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                  </div>

                  <Link to="/checkout" className="block w-full bg-blue-600 text-white text-center font-bold py-5 rounded-2xl shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-[0.98] transition-all mb-6 uppercase tracking-widest">
                    Proceed to Checkout
                  </Link>

                  {/* Promo Code Toggle */}
                  <div className="mt-8">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Promo Code</p>
                    <div className="flex gap-2">
                      <input type="text" placeholder="Enter code" className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-600 text-sm" />
                      <button className="px-6 bg-slate-100 text-slate-900 font-bold rounded-xl text-xs uppercase hover:bg-slate-200 transition-colors">Apply</button>
                    </div>
                  </div>

                  {/* Support Info */}
                  <div className="mt-12 pt-8 border-t border-slate-100 space-y-4">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Need help?</p>
                    <p className="text-slate-600 text-sm font-medium">Our experts are available Mon–Fri, 9am – 6pm EST.</p>
                    <div className="flex flex-col gap-2">
                      <a href="mailto:support@swiftcart.com" className="text-blue-600 font-bold text-sm hover:underline">support@swiftcart.com</a>
                      <a href="tel:+1800SWIFT" className="text-blue-600 font-bold text-sm hover:underline">+1 (800) SWIFT-CART</a>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </>
  );
};

export default Cart;
