import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import CartSidebar from "./CartSidebar";

export default function Navbar() {
  const { cartCount, isCartOpen, setCartOpen } = useCart();
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const isFashion = location.pathname.includes('fashion');

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <img src="/logo.png" alt="SwiftCart Logo" className="h-8 w-auto" />
            <h1 className="text-2xl font-black text-slate-900 tracking-tighter">
              SwiftCart<span className={isFashion ? "text-[#D4B996]" : "text-blue-600"}>.</span>
            </h1>
          </Link>

          {/* Collection Toggles (The Bridge) */}
          <div className="hidden md:flex items-center bg-slate-100 p-1 rounded-full">
            <Link 
              to="/" 
              className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
                !isFashion ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              Tech
            </Link>
            <Link 
              to="/fashion" 
              className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
                isFashion ? 'bg-[#D4B996] text-white shadow-sm' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              Fashion
            </Link>
          </div>

          {/* Icons Area */}
          <div className="flex items-center gap-6">
            
            {/* Search Bar - Expanding */}
            <div className="relative flex items-center">
              <form 
                onSubmit={handleSearch}
                className={`flex items-center bg-slate-100 rounded-full transition-all duration-300 overflow-hidden ${
                  isSearchOpen ? 'w-48 md:w-64 px-4' : 'w-10'
                }`}
              >
                <div onClick={() => setIsSearchOpen(!isSearchOpen)} className="cursor-pointer shrink-0 py-2">
                  <svg className="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                {isSearchOpen && (
                  <input 
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                    className="bg-transparent border-none focus:outline-none focus:ring-0 text-[10px] font-black uppercase tracking-widest text-slate-900 w-full ml-1"
                  />
                )}
              </form>
            </div>
            
            {/* Cart button — opens sidebar */}
            <button 
              onClick={() => setCartOpen(true)}
              className="p-2 hover:bg-slate-50 rounded-full transition-colors relative"
              title="Cart"
            >
              <svg className="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartCount > 0 && (
                <span className={`absolute top-0 right-0 w-4 h-4 rounded-full text-[8px] font-bold text-white flex items-center justify-center ${isFashion ? 'bg-[#D4B996]' : 'bg-blue-600'}`}>
                  {cartCount}
                </span>
              )}
            </button>

            {/* Profile / Login */}
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <Link to="/profile" className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 overflow-hidden hover:border-blue-400 transition-colors">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${localStorage.getItem('username') || 'User'}`} alt="User" />
                </Link>
                <button
                  onClick={handleLogout}
                  className="hidden sm:block text-slate-400 hover:text-red-600 transition-colors"
                  title="Logout"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
                  </svg>
                </button>
                {isAdmin && (
                  <Link to="/admin" className="hidden sm:block text-xs font-bold uppercase tracking-widest text-blue-600 hover:text-blue-800">Admin</Link>
                )}
              </div>
            ) : (
              <Link to="/login" className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center hover:bg-slate-200 transition-all" title="Login">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Cart Sidebar */}
      <CartSidebar isOpen={isCartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
