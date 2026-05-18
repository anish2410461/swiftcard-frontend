import { useNavigate } from "react-router-dom";
import { Edit, Trash2 } from "lucide-react";
import api from "../api/axios";
import type { Product } from "../types/product";
import { addToCart } from "../services/cartService";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

interface ProductCardProps {
  product: Product;
  viewMode?: 'tech' | 'fashion';
}

export default function ProductCard({ product, viewMode = 'tech' }: ProductCardProps) {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin } = useAuth();
  const { refreshCartCount, setCartOpen } = useCart();
  const productId = product._id || product.id;

  const isFashion = viewMode === 'fashion';

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!isAuthenticated) {
      console.warn("Please login to add items to your cart.");
      navigate("/login");
      return;
    }

    try {
      await addToCart({ productId: productId!, quantity: 1 });
      await refreshCartCount();
      
      if (isFashion) {
        console.log(`${product.name} added to your Atelier bag.`);
        setCartOpen(true);
      } else {
        console.log("Added to cart ✅");
      }
    } catch (error: any) {
      console.error(error);
      console.error(error.response?.data?.message || error.response?.data || "Error ❌");
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/admin/edit/${productId}`);
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    
    try {
      await api.delete(`/products/${productId}`);
      console.log("Product deleted successfully. Please refresh the page.");
      window.location.reload();
    } catch(err) {
      console.error(err);
      console.error("Failed to delete product.");
    }
  };

  if (isFashion) {
    return (
      <div 
        key={productId} 
        className="group cursor-pointer"
        onClick={() => navigate(`/products/${productId}`)}
      >
        {/* Image Container with Floating Action */}
        <div className="relative rounded-[20px] sm:rounded-[32px] overflow-hidden bg-slate-100 aspect-[3/4] mb-3 sm:mb-6">
          <img 
            src={
              product.mainImage && product.mainImageType
                ? `data:${product.mainImageType};base64,${product.mainImage}`
                : (product.additionalImages && product.additionalImages.length > 0)
                  ? `data:${product.additionalImageTypes![0]};base64,${product.additionalImages[0]}`
                  : `/images/fashion_placeholder.png`
            }
            alt={product.name} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
          />
          
          {/* Subtle Label */}
          <div className="absolute top-3 left-3 sm:top-6 sm:left-6">
            <span className="text-[6px] sm:text-[8px] font-black tracking-[0.2em] bg-white/90 backdrop-blur-sm px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-slate-900 shadow-sm uppercase">
              {product.category || 'NEW ARRIVAL'}
            </span>
          </div>

          {/* Quick Add Button (Appears on Hover) */}
          <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-4 sm:p-8">
            <button 
              onClick={handleAddToCart}
              className="w-full bg-white text-slate-900 py-2 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-[10px] sm:text-xs uppercase tracking-widest shadow-2xl translate-y-4 group-hover:translate-y-0 transition-transform duration-500"
            >
              Quick Add +
            </button>
          </div>

          {/* Admin Controls */}
          {isAdmin && (
            <div className="absolute top-3 right-3 sm:top-6 sm:right-6 flex flex-col gap-1 sm:gap-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={handleEdit}
                className="bg-white/90 backdrop-blur-sm p-1.5 sm:p-2 rounded-full shadow hover:bg-blue-50 text-blue-600 transition"
              >
                <Edit size={12} className="sm:w-3.5 sm:h-3.5" />
              </button>
              <button 
                onClick={handleDelete}
                className="bg-white/90 backdrop-blur-sm p-1.5 sm:p-2 rounded-full shadow hover:bg-red-50 text-red-600 transition"
              >
                <Trash2 size={12} className="sm:w-3.5 sm:h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Text Content */}
        <div className="space-y-0.5 sm:space-y-1 px-1">
          <div className="flex justify-between items-start gap-1">
            <h4 className="text-xs sm:text-lg font-bold text-slate-900 tracking-tight group-hover:text-[#D4B996] transition-colors truncate pr-1">
              {product.name}
            </h4>
            <span className="text-xs sm:text-lg font-semibold text-slate-500 shrink-0">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
          </div>
          <p className="text-[8px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Atelier Collection
          </p>
          
          {/* Fake Color Swatches */}
          <div className="flex gap-1 pt-1.5 sm:pt-3">
             <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-slate-900 border border-slate-200"></div>
             <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-slate-400 border border-slate-200"></div>
             <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-[#D4B996] border border-slate-200"></div>
          </div>
        </div>
      </div>
    );
  }

  // Default Tech Mode
  return (
    <div 
      className="bg-white rounded-xl sm:rounded-2xl p-2 sm:p-3 group cursor-pointer flex flex-col hover:-translate-y-1 transition duration-300 relative border border-gray-100 hover:border-gray-200 hover:shadow-xl hover:shadow-gray-200/50"
      onClick={() => navigate(`/products/${productId}`)}
    >
      <div className="relative overflow-hidden rounded-lg sm:rounded-xl bg-gray-50 aspect-[4/5] flex items-center justify-center shadow-inner">
        <img
          src={
            product.mainImage && product.mainImageType
              ? `data:${product.mainImageType};base64,${product.mainImage}`
              : (product.additionalImages && product.additionalImages.length > 0)
                ? `data:${product.additionalImageTypes![0]};base64,${product.additionalImages[0]}`
                : `/images/tech_placeholder.png`
          }
          className="w-full h-full object-cover group-hover:scale-110 transition duration-700 ease-out"
          alt={product.name}
        />
        
        <span className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-white/90 backdrop-blur-sm text-black text-[8px] sm:text-[10px] font-bold px-1.5 py-0.5 sm:px-2 sm:py-1 rounded shadow-sm uppercase tracking-wider">
          {product.category || 'Tech'}
        </span>

        {/* Admin Controls */}
        {isAdmin && (
          <div className="absolute top-2 right-2 sm:top-3 sm:right-3 flex flex-col gap-1 sm:gap-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              onClick={handleEdit}
              className="bg-white/90 backdrop-blur-sm p-1.5 sm:p-2 rounded-full shadow hover:bg-blue-50 text-blue-600 transition"
            >
              <Edit size={12} className="sm:w-4 sm:h-4" />
            </button>
            <button 
              onClick={handleDelete}
              className="bg-white/90 backdrop-blur-sm p-1.5 sm:p-2 rounded-full shadow hover:bg-red-50 text-red-600 transition"
            >
              <Trash2 size={12} className="sm:w-4 sm:h-4" />
            </button>
          </div>
        )}
        
        {/* Quick Add Button */}
        <button 
          onClick={handleAddToCart}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 w-[90%] bg-white/90 backdrop-blur text-black py-1.5 sm:py-2.5 text-[10px] sm:text-sm font-semibold rounded-lg sm:rounded-xl hover:bg-blue-600 hover:text-white shadow-lg flex items-center justify-center gap-1 sm:gap-2"
        >
          <svg className="w-3 h-3 sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/><path d="M12 9v6"/><path d="M9 12h6"/></svg>
          Quick Add
        </button>
      </div>

      <div className="mt-2 sm:mt-4 flex flex-col flex-1 px-0.5">
        <div className="flex justify-between items-start gap-1">
          <h3 className="font-semibold text-gray-900 leading-tight group-hover:text-blue-600 transition truncate pr-1 uppercase text-[10px] sm:text-xs tracking-tighter">{product.name}</h3>
          <p className="font-bold text-gray-900 shrink-0 text-[10px] sm:text-sm">₹{product.price.toLocaleString('en-IN')}</p>
        </div>
        <p className="text-gray-400 text-[8px] sm:text-[10px] font-bold uppercase tracking-wider mt-0.5 mb-1 sm:mb-2">Certified</p>
      </div>
    </div>
  );
}
