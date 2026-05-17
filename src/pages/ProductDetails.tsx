import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchProductById } from '../services/productService'; 
import { addToCart } from '../services/cartService';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { refreshCartCount } = useCart();
  const { isAuthenticated } = useAuth();
  
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState(0);
  const [adding, setAdding] = useState(false);
  const [activeImage, setActiveImage] = useState<string | null>(null);

  useEffect(() => {
    const getProduct = async () => {
      try {
        const data = await fetchProductById(id);
        setProduct(data);
        if (data.mainImage && data.mainImageType) {
           setActiveImage(`data:${data.mainImageType};base64,${data.mainImage}`);
        }
      } catch (error) {
        console.error("Could not find product");
      } finally {
        setLoading(false);
      }
    };
    getProduct();
  }, [id]);

  // Combine main image and additional images into a single gallery array
  const gallery = product ? [
    ...(product.mainImage ? [{ 
      src: `data:${product.mainImageType};base64,${product.mainImage}`,
      type: product.mainImageType 
    }] : []),
    ...(product.additionalImages ? product.additionalImages.map((img: string, i: number) => ({
      src: `data:${product.additionalImageTypes[i]};base64,${img}`,
      type: product.additionalImageTypes[i]
    })) : [])
  ] : [];

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      console.warn("Please login to add items to your cart.");
      navigate("/login");
      return;
    }

    setAdding(true);
    try {
      await addToCart({ productId: id!, quantity: 1 });
      await refreshCartCount();
      console.log("Added to cart! ✅");
    } catch (error: any) {
      console.error(error);
      console.error(error.response?.data?.message || "Failed to add to cart ❌");
    } finally {
      setAdding(false);
    }
  };

  const handleBuyNow = async () => {
     await handleAddToCart();
     navigate("/cart");
  };

  if (loading) return (
     <div className="min-h-screen bg-white">
        <div className="p-20 text-center font-bold text-slate-400 flex flex-col items-center gap-4">
           <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
           <p className="tracking-widest text-[10px] uppercase">Loading SwiftCart Premium Assets...</p>
        </div>
     </div>
  );

  if (!product) return (
    <div className="min-h-screen bg-white">
      <div className="p-20 text-center flex flex-col items-center gap-4">
         <h1 className="text-2xl font-black text-slate-900">Product Not Found</h1>
         <Link to="/" className="text-blue-600 font-bold hover:underline">Return to Storefront</Link>
      </div>
    </div>
  );

  return (
    <div className="bg-white min-h-screen font-sans">
      {/* Breadcrumbs */}
      <div className="container mx-auto px-6 py-6">
        <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
          <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
          <span>/</span>
          <Link to="/" className="hover:text-blue-600 transition-colors">Shop</Link>
          <span>/</span>
          <span className="text-slate-900">{product.category || 'Technology'}</span>
        </nav>
      </div>

      <div className="container mx-auto px-6 pb-24">
        <div className="flex flex-col lg:flex-row gap-20">
          
          {/* LEFT: Massive Product Gallery */}
          <div className="flex-1">
            <div className="sticky top-28">
              <div className="bg-slate-50 rounded-[60px] aspect-square flex items-center justify-center overflow-hidden mb-8 border border-slate-100 group">
                <img 
                  src={activeImage || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=500&auto=format&fit=crop"} 
                  className="w-full h-full object-contain p-20 group-hover:scale-110 transition-transform duration-1000" 
                  alt={product.name}
                />
              </div>
              
              {/* Thumbnail Strip */}
              <div className="flex gap-4 justify-center">
                {gallery.map((img, i) => (
                  <div 
                    key={i} 
                    onClick={() => setActiveImage(img.src)}
                    className={`w-20 h-20 rounded-3xl border-2 transition-all cursor-pointer overflow-hidden ${activeImage === img.src ? 'border-blue-600 opacity-100 shadow-md scale-110' : 'border-slate-100 bg-white opacity-40 hover:opacity-100'}`}
                  >
                    <img src={img.src} className="w-full h-full object-cover" alt={`Gallery ${i}`} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: Buy Box & Specs */}
          <div className="lg:w-[500px] flex flex-col justify-center">
            <div className="mb-10">
              <span className="bg-blue-50 text-blue-600 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em]">
                SwiftCart Certified Premium
              </span>
              <h1 className="text-5xl font-black text-slate-900 tracking-tighter mt-6 mb-4 leading-tight">
                {product.name}
              </h1>
              <div className="flex items-center gap-4 mb-6">
                <div className="text-yellow-400 text-sm flex gap-0.5">★★★★★</div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">4.9 Rating • 1.2k Reviews</span>
              </div>
              <p className="text-4xl font-black text-blue-600 tracking-tight">₹{product.price.toLocaleString()}</p>
            </div>

            <p className="text-slate-500 leading-relaxed mb-10 font-medium">
              {product.description || "Experience the future of performance. This unit is meticulously engineered with premium materials and SwiftCart's signature attention to detail."}
            </p>

            {/* Selection Options */}
            <div className="space-y-8 mb-12">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Select Finish</p>
                <div className="flex gap-3">
                  {['#0F172A', '#475569', '#94A3B8'].map((color, i) => (
                    <button 
                      key={i}
                      onClick={() => setSelectedColor(i)}
                      className={`w-10 h-10 rounded-full border-4 transition-all shadow-sm ${selectedColor === i ? 'border-blue-600 scale-110 shadow-blue-100' : 'border-transparent hover:scale-105'}`}
                      style={{ backgroundColor: color }}
                    ></button>
                  ))}
                </div>
              </div>
              
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 shadow-inner">
                <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> In Stock & Ready to Ship
                </p>
                <p className="text-xs text-slate-500 font-medium tracking-tight">Order in the next 3h 42m for <span className="text-slate-900 font-extrabold uppercase tracking-tighter">Express Delivery</span>.</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-4">
              <button 
                onClick={handleAddToCart}
                disabled={adding}
                className="w-full bg-blue-600 text-white font-black py-6 rounded-3xl shadow-xl shadow-blue-200 hover:bg-blue-700 active:scale-[0.98] transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-3 disabled:opacity-70"
              >
                {adding ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div> : 'Add to Bag'}
                {!adding && <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4"/></svg>}
              </button>
              <button 
                onClick={handleBuyNow}
                className="w-full bg-slate-900 text-white font-black py-6 rounded-3xl hover:bg-black active:scale-[0.98] transition-all uppercase tracking-widest text-xs"
              >
                Buy It Now
              </button>
            </div>

            {/* Micro-Features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-12 pt-12 border-t border-slate-100">
              <div className="flex items-center gap-3">
                 <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-xl">📦</div>
                 <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Shipping</p>
                    <p className="text-[10px] font-bold text-slate-900 uppercase tracking-tight leading-tight">Free Secure <br/>Delivery</p>
                 </div>
              </div>
              <div className="flex items-center gap-3">
                 <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-xl">🛡️</div>
                 <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Protection</p>
                    <p className="text-[10px] font-bold text-slate-900 uppercase tracking-tight leading-tight">2-Year Swift <br/>Warranty</p>
                 </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
