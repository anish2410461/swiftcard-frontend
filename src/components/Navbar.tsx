import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import CartSidebar from './CartSidebar';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartCount, isCartOpen, setCartOpen } = useCart();
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const isFashion = location.pathname.includes('fashion');

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/login');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  const username = localStorage.getItem('username') || 'Ashwin';

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Left: Brand Logo */}
          <Link to="/" className="flex items-center gap-1.5 shrink-0">
            <img src="/logo.png" alt="SwiftCart Logo" className="h-6 sm:h-7 w-auto" />
            <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tighter">
              SwiftCart<span className={isFashion ? "text-[#D4B996]" : "text-blue-600"}>.</span>
            </h1>
          </Link>

          {/* Center: Department Switcher - Optimized for Mobile & Desktop */}
          <div className="flex items-center bg-slate-100 p-1 rounded-full text-xs font-bold uppercase tracking-wider mx-2">
            <Link 
              to="/" 
              className={`px-3 sm:px-6 py-1.5 rounded-full transition-all duration-300 ${
                !isFashion ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Tech
            </Link>
            <Link 
              to="/fashion" 
              className={`px-3 sm:px-6 py-1.5 rounded-full transition-all duration-300 ${
                isFashion ? 'bg-[#D4B996] text-white shadow-sm' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Fashion
            </Link>
          </div>

          {/* Right: Functional Quick-Links */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            
            {/* Search Bar - Expanding */}
            <div className="relative flex items-center">
              <form 
                onSubmit={handleSearch}
                className={`flex items-center bg-slate-100 rounded-full transition-all duration-300 overflow-hidden ${
                  isSearchOpen ? 'w-36 sm:w-48 md:w-64 px-3' : 'w-9'
                }`}
              >
                <div onClick={() => setIsSearchOpen(!isSearchOpen)} className="cursor-pointer shrink-0 py-1.5 flex items-center justify-center w-6 h-6">
                  <svg className="w-4 h-4 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                {isSearchOpen && (
                  <input 
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                    className="bg-transparent border-none focus:outline-none focus:ring-0 text-[10px] font-bold uppercase tracking-wider text-slate-900 w-full ml-1"
                  />
                )}
              </form>
            </div>

            {/* Cart button — opens sidebar */}
            <button 
              onClick={() => setCartOpen(true)}
              className="p-2 hover:bg-slate-50 rounded-full relative transition-colors"
            >
              <svg className="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartCount > 0 && (
                <span className={`absolute top-0 right-0 w-4 h-4 rounded-full text-[8px] font-bold text-white flex items-center justify-center ${isFashion ? 'bg-[#D4B996]' : 'bg-blue-600'}`}>
                  {cartCount}
                </span>
              )}
            </button>
            
            {isAuthenticated ? (
              <>
                <Link to="/profile" className="w-8 h-8 rounded-full border border-slate-200 overflow-hidden hidden sm:block">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`} alt="User Profile" />
                </Link>
                {isAdmin && (
                  <Link to="/admin" className="hidden sm:block text-xs font-bold uppercase text-blue-600 px-3 py-1.5 hover:bg-blue-50 rounded-xl">Admin</Link>
                )}
              </>
            ) : (
              <Link to="/login" className="text-xs font-bold uppercase text-blue-600 px-3 py-1.5 hover:bg-blue-50 rounded-xl">Login</Link>
            )}

            {/* Mobile Profile/Menu Trigger */}
            {isAuthenticated && (
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="w-8 h-8 rounded-full border border-slate-200 overflow-hidden sm:hidden"
              >
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`} alt="Menu" />
              </button>
            )}
          </div>
        </div>

        {/* Mobile Dropdown Sub-menu Panel */}
        {mobileMenuOpen && isAuthenticated && (
          <div className="sm:hidden bg-white border-b border-slate-100 px-4 py-3 space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
            <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-bold text-slate-700 hover:text-blue-600">👤 Dashboard Profile</Link>
            {isAdmin && (
              <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-bold text-slate-700 hover:text-blue-600">⚙️ Admin Panel</Link>
            )}
            <button onClick={handleLogout} className="w-full text-left py-2 text-sm font-bold text-red-500 hover:text-red-700">🚪 Sign Out Account</button>
          </div>
        )}
      </nav>

      {/* Cart Sidebar */}
      <CartSidebar isOpen={isCartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
};

export default Navbar;
