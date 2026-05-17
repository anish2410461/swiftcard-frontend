import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, ShoppingBag, CheckCircle, ChevronRight, MapPin, CreditCard, ClipboardList } from "lucide-react";
import { getCartDetails, getCartTotal } from "../services/cartService";
import { placeOrder } from "../services/orderService";
import { useCart } from "../context/CartContext";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { CheckoutForm } from "../components/CheckoutForm";
import api from "../api/axios";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "pk_test_TYooMQauvdEDq54NiTphI7jx");

interface CartItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  mainImage?: string;
  mainImageType?: string;
}

const Checkout = () => {
  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Review
  const [shippingMethod, setShippingMethod] = useState('standard');
  const navigate = useNavigate();
  const { refreshCartCount } = useCart();

  const [items, setItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [done, setDone] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  // Address State
  const [address, setAddress] = useState({
    fullName: "",
    streetAddress: "",
    city: "",
    state: "",
    zipCode: ""
  });
  const [saveAddress, setSaveAddress] = useState(false);

  useEffect(() => {
    Promise.all([getCartDetails(), getCartTotal()])
      .then(([cartData, cartTotal]) => {
        setItems(cartData);
        setTotal(cartTotal);
      })
      .catch(console.error)
      .finally(() => setLoading(false));

    // Fetch existing profile address if any
    api.get("/users/profile")
      .then(res => {
        if (res.data) {
          setAddress({
            fullName: res.data.fullName || "",
            streetAddress: res.data.streetAddress || "",
            city: res.data.city || "",
            state: res.data.state || "",
            zipCode: res.data.zipCode || ""
          });
        }
      })
      .catch(console.error);
  }, []);

  const shippingPrice = shippingMethod === 'standard' ? 0 : shippingMethod === 'express' ? 15 : 25;
  const tax = total * 0.08;
  const finalTotal = total + shippingPrice + tax;

  const handleSuccess = async () => {
    try {
      await placeOrder(); // Fire after Stripe confirms
      await refreshCartCount();
      setDone(true);
      setTimeout(() => navigate("/profile"), 2500);
    } catch (err: any) {
      console.error(err?.response?.data || "Failed to place order ❌");
    }
  };

  const proceedToPayment = async () => {
    if (!address.fullName || !address.streetAddress || !address.city || !address.state || !address.zipCode) {
      console.warn("Please complete all shipping details.");
      return;
    }

    if (saveAddress) {
      try {
        await api.put("/users/profile", address);
      } catch (err) {
        console.error("Failed to save address:", err);
      }
    }

    setLoading(true);
    try {
      const totalInPaise = Math.round(finalTotal * 100);
      const res = await api.post("/payments/create-payment-intent", {
        amount: totalInPaise,
        currency: "inr"
      });
      setClientSecret(res.data.clientSecret);
      setStep(2);
    } catch (err) {
      console.error(err);
      console.error("Failed to initialize payment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Success screen ──────────────────────────────────────────────────────────
  if (done) {
    return (
        <div className="min-h-[calc(100vh-128px)] flex flex-col items-center justify-center gap-4 text-center px-4">
          <CheckCircle size={64} className="text-blue-600" strokeWidth={1.5} />
          <h1 className="text-3xl font-bold text-gray-900 uppercase tracking-tighter">Order Placed!</h1>
          <p className="text-slate-500 font-medium max-w-sm uppercase text-[10px] tracking-widest">
            Thank you for choosing SwiftCart. Redirecting to your Profile dashboard...
          </p>
        </div>
    );
  }

  // ── Loading ─────────────────────────────────────────────────────────────────
  if (loading && step === 1 && items.length === 0) {
    return (
        <div className="flex justify-center items-center h-[calc(100vh-128px)]">
          <Loader2 className="animate-spin text-blue-600" size={32} />
        </div>
    );
  }

  // ── Empty cart guard ─────────────────────────────────────────────────────────
  if (items.length === 0 && !loading) {
    return (
        <div className="flex flex-col items-center justify-center gap-4 h-[calc(100vh-128px)] text-center px-4 bg-slate-50">
          <svg className="w-16 h-16 mx-auto text-slate-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
          <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Your bag is empty</h2>
          <p className="text-slate-500 font-medium">Add some products before checking out.</p>
          <button
            onClick={() => navigate("/")}
            className="mt-6 px-10 py-4 bg-blue-600 text-white font-black rounded-3xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition uppercase tracking-widest text-[10px]"
          >
            Explore SwiftCart
          </button>
        </div>
    );
  }

  return (
      <div className="bg-[#F8F9FB] min-h-screen pb-24 font-sans">
        
        {/* Progress Tracker Header */}
        <div className="bg-white border-b border-slate-100 py-10 mb-12 shadow-sm">
          <div className="container mx-auto max-w-3xl px-6 flex items-center justify-between relative">
            <div className="absolute top-[20px] left-12 right-12 h-[2px] bg-slate-100 z-0"></div>
            
            <div className={`relative z-10 flex flex-col items-center gap-3 transition-all duration-500 ${step >= 1 ? 'scale-110' : ''}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${step >= 1 ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-white text-slate-400 border-2 border-slate-200'}`}>
                {step > 1 ? <CheckCircle size={20} /> : 1}
              </div>
              <span className={`text-[10px] font-black uppercase tracking-widest hidden sm:block ${step >= 1 ? 'text-blue-600' : 'text-slate-400'}`}>Shipping</span>
            </div>

            <div className={`relative z-10 flex flex-col items-center gap-3 transition-all duration-500 ${step >= 2 ? 'scale-110' : ''}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${step >= 2 ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-white text-slate-400 border-2 border-slate-200'}`}>
                {step > 2 ? <CheckCircle size={20} /> : 2}
              </div>
              <span className={`text-[10px] font-black uppercase tracking-widest hidden sm:block ${step >= 2 ? 'text-blue-600' : 'text-slate-400'}`}>Payment</span>
            </div>

            <div className={`relative z-10 flex flex-col items-center gap-3 transition-all duration-500 ${step === 3 ? 'scale-110' : ''}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${step === 3 ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-white text-slate-400 border-2 border-slate-200'}`}>3</div>
              <span className={`text-[10px] font-black uppercase tracking-widest hidden sm:block ${step === 3 ? 'text-blue-600' : 'text-slate-400'}`}>Review</span>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex flex-col lg:flex-row gap-16 items-start">
            
            <div className="flex-1 space-y-12">
              
              {step === 1 && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center gap-4 mb-8">
                     <MapPin className="text-blue-600" />
                     <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Shipping Destination</h2>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Full Name</label>
                      <input 
                        value={address.fullName}
                        onChange={(e) => setAddress({...address, fullName: e.target.value})}
                        type="text" placeholder="Julianne Moore" 
                        className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-50/50 transition-all text-sm font-medium" 
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Street Address</label>
                      <input 
                        value={address.streetAddress}
                        onChange={(e) => setAddress({...address, streetAddress: e.target.value})}
                        type="text" placeholder="124 SwiftCart Blvd, Suite 400" 
                        className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-50/50 transition-all text-sm font-medium" 
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">City</label>
                        <input 
                          value={address.city}
                          onChange={(e) => setAddress({...address, city: e.target.value})}
                          type="text" placeholder="New York" 
                          className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-50/50 transition-all text-sm font-medium" 
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">State</label>
                        <input 
                          value={address.state}
                          onChange={(e) => setAddress({...address, state: e.target.value})}
                          type="text" placeholder="NY" 
                          className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-50/50 transition-all text-sm font-medium" 
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Zip Code</label>
                        <input 
                          value={address.zipCode}
                          onChange={(e) => setAddress({...address, zipCode: e.target.value})}
                          type="text" placeholder="10012" 
                          className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-50/50 transition-all text-sm font-medium" 
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-3 py-4">
                      <input 
                        type="checkbox" 
                        checked={saveAddress}
                        onChange={(e) => setSaveAddress(e.target.checked)}
                        className="w-5 h-5 text-blue-600 border-slate-200 rounded-md focus:ring-blue-500" 
                      />
                      <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest cursor-pointer" onClick={() => setSaveAddress(!saveAddress)}>Save address for future purchases</span>
                    </div>

                    <div className="mt-12">
                      <h3 className="text-xl font-bold mb-6">Delivery Method</h3>
                      <div className="space-y-4">
                        {[
                          { id: 'standard', name: 'Standard Delivery', time: '4-7 business days', price: 'Free', val: 0 },
                          { id: 'express', name: 'Express Delivery', time: '2-3 business days', price: '₹15.00', val: 15 }
                        ].map((method) => (
                          <div 
                            key={method.id}
                            onClick={() => setShippingMethod(method.id)}
                            className={`p-6 border-2 rounded-3xl cursor-pointer transition-all flex justify-between items-center ${shippingMethod === method.id ? 'border-blue-600 bg-blue-50/30 shadow-lg' : 'border-slate-100 bg-white hover:border-slate-200'}`}
                          >
                            <div>
                                <p className="font-bold text-slate-900">{method.name}</p>
                                <p className="text-xs text-slate-500">{method.time}</p>
                            </div>
                            <span className={`font-black text-xs ${method.val === 0 ? 'text-blue-600' : 'text-slate-900'}`}>{method.price}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button 
                      onClick={proceedToPayment}
                      disabled={loading}
                      className="mt-12 w-full py-6 bg-slate-900 text-white rounded-[32px] font-black text-sm uppercase tracking-[0.2em] hover:bg-blue-600 active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-2xl shadow-slate-200"
                    >
                      {loading ? <Loader2 size={18} className="animate-spin" /> : "Continue to Payment"}
                      {!loading && <ChevronRight size={18} />}
                    </button>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/50 animate-in fade-in zoom-in-95 duration-500">
                   <div className="flex items-center gap-4 mb-8">
                      <CreditCard className="text-blue-600" />
                      <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Secure Payment</h3>
                   </div>
                   
                   {clientSecret === "pi_dummy_secret_for_testing" ? (
                     <div className="py-12 flex flex-col items-center justify-center gap-6 text-center">
                        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-2">
                           <CreditCard size={32} />
                        </div>
                        <div>
                          <h4 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Test Mode Active</h4>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2 max-w-xs">Stripe API key is missing or expired. Click below to bypass payment and place order.</p>
                        </div>
                        <button 
                          onClick={handleSuccess}
                          className="px-10 py-4 bg-blue-600 text-white font-black rounded-full shadow-lg shadow-blue-200 hover:bg-blue-700 transition uppercase tracking-widest text-[10px]"
                        >
                          Simulate Successful Payment
                        </button>
                     </div>
                   ) : clientSecret ? (
                     <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'stripe' } }}>
                       <CheckoutForm totalAmount={finalTotal} onSuccess={handleSuccess} />
                     </Elements>
                   ) : (
                     <div className="py-20 flex flex-col items-center justify-center gap-4 text-slate-400">
                        <Loader2 className="animate-spin" size={32} />
                        <p className="text-[10px] font-black uppercase tracking-widest">Initializing Secure Gateway...</p>
                     </div>
                   )}

                   <button 
                    onClick={() => setStep(1)} 
                    className="mt-8 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition flex items-center gap-2"
                   >
                     ← Back to Shipping
                   </button>
                </div>
              )}

            </div>

            <div className="lg:w-[450px]">
              <div className="bg-white rounded-[40px] p-10 shadow-2xl shadow-slate-200/50 sticky top-28 border border-slate-50">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <ClipboardList size={20} className="text-slate-900" />
                    <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Order Summary</h2>
                  </div>
                  <span className="bg-slate-50 text-slate-400 text-[9px] font-black px-4 py-1.5 rounded-full border border-slate-100 uppercase tracking-[0.2em]">{items.length} UNITS</span>
                </div>

                <div className="space-y-6 mb-10 max-h-[300px] overflow-y-auto pr-2 scrollbar-hide">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="w-20 h-24 bg-slate-50 rounded-2xl overflow-hidden flex-shrink-0 flex items-center justify-center border border-slate-50 shadow-inner group">
                        {item.mainImage && item.mainImageType ? (
                          <img
                            src={`data:${item.mainImageType};base64,${item.mainImage}`}
                            alt={item.productName}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <ShoppingBag size={24} className="text-slate-200" />
                        )}
                      </div>
                      <div className="flex flex-col justify-center flex-1 min-w-0">
                        <p className="font-black text-slate-900 text-[11px] uppercase tracking-tight truncate mb-1">{item.productName}</p>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Qty: {item.quantity}</p>
                        <p className="text-sm font-black text-blue-600 mt-2 tracking-tight">₹{item.subtotal.toLocaleString("en-IN")}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-4 border-t border-slate-50 pt-8 mb-8 font-medium">
                  <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    <span>Subtotal</span>
                    <span className="text-slate-900">₹{total.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    <span>Shipping</span>
                    <span className={shippingPrice === 0 ? "text-blue-600" : "text-slate-900"}>
                      {shippingPrice === 0 ? "Free" : `₹${shippingPrice.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    <span>Estimated Tax (8%)</span>
                    <span className="text-slate-900">₹{tax.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</span>
                  </div>
                </div>

                <div className="flex justify-between items-end mb-4 pt-6 border-t border-slate-900/5">
                  <span className="text-lg font-black text-slate-900 uppercase tracking-tighter">Total</span>
                  <div className="text-right">
                    <p className="text-4xl font-black text-blue-600 tracking-tighter">₹{finalTotal.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</p>
                    <p className="text-[8px] text-slate-400 font-black mt-1 uppercase tracking-widest">Inclusive of all duties</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default Checkout;

