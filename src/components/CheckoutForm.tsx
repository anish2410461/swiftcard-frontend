import { useState } from "react";
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export const CheckoutForm = ({ totalAmount, onSuccess }: { totalAmount: number, onSuccess: () => void }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);
    
    // We confirm the payment intent here
    const { error: submitError, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required', // Do not automatically redirect off site, we want to show success screen locally
    });

    if (submitError) {
      console.error(submitError.message);
      setError(submitError.message || "An unexpected error occurred.");
      setLoading(false);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      try {
        // Confirm order with backend
        await api.post('/orders/confirm', { 
           paymentIntentId: paymentIntent.id 
        });
        
        onSuccess();
        navigate('/profile?success=true');
      } catch (err) {
        console.error("Order confirmation failed:", err);
        setError("Payment succeeded but order confirmation failed. Please contact support.");
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      
      {error && (
        <div className="text-red-500 text-xs font-bold uppercase tracking-wider">{error}</div>
      )}

      <button 
        type="submit"
        disabled={loading || !stripe}
        className="w-full relative flex items-center justify-center bg-blue-600 text-white font-black py-7 rounded-[32px] shadow-2xl shadow-blue-200 hover:bg-blue-700 active:scale-[0.98] transition-all uppercase tracking-[0.3em] text-[10px] disabled:opacity-70"
      >
        {loading ? (
          <>
            <Loader2 size={18} className="animate-spin absolute left-10" />
            Processing...
          </>
        ) : (
          `Pay ₹${totalAmount.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`
        )}
      </button>

      <div className="flex items-center justify-center gap-8 mt-10 grayscale opacity-20 px-4 scale-90">
         <img src="https://www.svgrepo.com/show/508401/visa.svg" className="h-4 object-contain" alt="Visa" />
         <img src="https://www.svgrepo.com/show/508701/mastercard.svg" className="h-4 object-contain" alt="Mastercard" />
         <img src="https://www.svgrepo.com/show/508413/apple-pay.svg" className="h-4 object-contain" alt="Apple Pay" />
      </div>
    </form>
  );
};
